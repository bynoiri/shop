/* ==========================================================================
   LÓGICA DE LA PÁGINA DE CARRITO (carrito.html)
   ========================================================================== */

let metodoEnvioActual = "encomienda";
let descuentoAplicado = null; // { codigo, porcentaje }

document.addEventListener("DOMContentLoaded", () => {
  llenarDepartamentos();
  renderCarrito();
  configurarMetodosEnvio();
  configurarDescuento();
  configurarMenuMovil();
  document.getElementById("btnEnviarPedido").addEventListener("click", enviarPedidoPorWhatsapp);
});

function llenarDepartamentos() {
  ["encomiendaDepartamento", "domicilioDepartamento"].forEach((idSelect) => {
    const sel = document.getElementById(idSelect);
    DEPARTAMENTOS_SV.forEach((dep) => {
      const op = document.createElement("option");
      op.value = dep;
      op.textContent = dep;
      sel.appendChild(op);
    });
  });
}

/* -------------------- Buscar producto por id + tipo -------------------- */
function buscarProductoCarrito(id, tipo) {
  return tipo === "bolso" ? BOLSOS.find((b) => b.id === id) : ACCESORIOS.find((a) => a.id === id);
}

/* -------------------- Render de la lista de productos -------------------- */
function renderCarrito() {
  const carrito = leerCarrito();
  const cont = document.getElementById("listaCarrito");

  if (carrito.length === 0) {
    cont.innerHTML = `<div class="carrito-vacio">Tu carrito está vacío.<br><a href="index.html">Ver bolsos y accesorios</a></div>`;
    actualizarResumen();
    return;
  }

  cont.innerHTML = carrito.map((linea) => {
    const p = buscarProductoCarrito(linea.id, linea.tipo);
    if (!p) return "";
    const base = linea.tipo === "bolso" ? RUTA_IMG_BOLSOS : RUTA_IMG_ACCESORIOS;
    const foto = rutaFoto(base, p.carpeta, "frente.webp");
    const etiquetaCategoria = linea.tipo === "bolso" ? CATEGORIAS_BOLSOS[p.categoria] : TIPOS_ACCESORIOS[p.tipo];
    const subtotal = p.precio * linea.cantidad;

    return `
    <div class="linea-carrito" data-id="${p.id}" data-tipo="${linea.tipo}">
      <img src="${foto}" alt="${p.nombre}" onerror="onImgError(this)">
      <div>
        <h4>${p.nombre}</h4>
        <p class="meta">${etiquetaCategoria}</p>
        <p class="precio-unit">${formatoPrecio(p.precio)} c/u</p>
        <div class="stepper">
          <button type="button" onclick="cambiarCantidadUI('${p.id}','${linea.tipo}',${linea.cantidad - 1})">−</button>
          <span>${linea.cantidad}</span>
          <button type="button" onclick="cambiarCantidadUI('${p.id}','${linea.tipo}',${linea.cantidad + 1})">+</button>
        </div>
      </div>
      <div class="col-derecha-carrito">
        <span class="subtotal-linea">${formatoPrecio(subtotal)}</span>
        <button type="button" class="btn-quitar" onclick="quitarUI('${p.id}','${linea.tipo}')">Quitar</button>
      </div>
    </div>`;
  }).join("");

  actualizarResumen();
}

function cambiarCantidadUI(id, tipo, nuevaCantidad) {
  cambiarCantidad(id, tipo, nuevaCantidad);
  renderCarrito();
}

function quitarUI(id, tipo) {
  eliminarDelCarrito(id, tipo);
  renderCarrito();
}

/* -------------------- Cálculo de subtotales -------------------- */
function calcularSubtotales() {
  const carrito = leerCarrito();
  let subtotalBolsos = 0;
  let subtotalAccesorios = 0;
  let unidadesTotales = 0;

  carrito.forEach((linea) => {
    const p = buscarProductoCarrito(linea.id, linea.tipo);
    if (!p) return;
    const monto = p.precio * linea.cantidad;
    if (linea.tipo === "bolso") subtotalBolsos += monto;
    else subtotalAccesorios += monto;
    unidadesTotales += linea.cantidad;
  });

  return { subtotalBolsos, subtotalAccesorios, unidadesTotales };
}

function calcularCostoEnvio(unidadesTotales) {
  if (unidadesTotales === 0) return 0;
  if (metodoEnvioActual === "encomienda") {
    const { base, extraPorUnidad } = CONFIG.envio.encomienda;
    return base + extraPorUnidad * (unidadesTotales - 1);
  }
  return CONFIG.envio.domicilio.tarifaFija;
}

function calcularDescuentoMonto(subtotalBolsos) {
  if (!descuentoAplicado) return 0;
  return subtotalBolsos * (descuentoAplicado.porcentaje / 100);
}

/* -------------------- Actualizar resumen visual -------------------- */
function actualizarResumen() {
  const { subtotalBolsos, subtotalAccesorios, unidadesTotales } = calcularSubtotales();
  const descuentoMonto = calcularDescuentoMonto(subtotalBolsos);
  const costoEnvio = calcularCostoEnvio(unidadesTotales);
  const total = (subtotalBolsos - descuentoMonto) + subtotalAccesorios + costoEnvio;

  document.getElementById("subtotalBolsos").textContent = formatoPrecio(subtotalBolsos);
  document.getElementById("subtotalAccesorios").textContent = formatoPrecio(subtotalAccesorios);
  document.getElementById("costoEnvioResumen").textContent = formatoPrecio(costoEnvio);
  document.getElementById("totalFinal").textContent = formatoPrecio(total);

  const filaDescuento = document.getElementById("filaDescuento");
  if (descuentoAplicado) {
    filaDescuento.style.display = "flex";
    document.getElementById("codigoAplicadoTexto").textContent = `${descuentoAplicado.codigo} -${descuentoAplicado.porcentaje}%`;
    document.getElementById("valorDescuento").textContent = `-${formatoPrecio(descuentoMonto)}`;
  } else {
    filaDescuento.style.display = "none";
  }
}

/* -------------------- Código de descuento -------------------- */
function configurarDescuento() {
  document.getElementById("btnAplicarDescuento").addEventListener("click", () => {
    const input = document.getElementById("inputDescuento");
    const codigo = input.value.trim().toUpperCase();
    const msg = document.getElementById("msgDescuento");

    if (!codigo) {
      msg.textContent = "Escribe un código.";
      msg.className = "msg-descuento error";
      return;
    }
    if (CODIGOS_DESCUENTO[codigo]) {
      descuentoAplicado = { codigo, porcentaje: CODIGOS_DESCUENTO[codigo] };
      msg.textContent = `Código aplicado: -${descuentoAplicado.porcentaje}% sobre bolsos.`;
      msg.className = "msg-descuento ok";
    } else {
      descuentoAplicado = null;
      msg.textContent = "Código no válido.";
      msg.className = "msg-descuento error";
    }
    actualizarResumen();
  });
}

/* -------------------- Método de envío -------------------- */
function configurarMetodosEnvio() {
  const tarjetas = document.querySelectorAll(".metodo-envio");
  tarjetas.forEach((tarjeta) => {
    tarjeta.addEventListener("click", () => {
      tarjetas.forEach((t) => t.classList.remove("activo"));
      tarjeta.classList.add("activo");
      metodoEnvioActual = tarjeta.dataset.metodo;

      document.getElementById("camposEncomienda").classList.toggle("visible", metodoEnvioActual === "encomienda");
      document.getElementById("camposDomicilio").classList.toggle("visible", metodoEnvioActual === "domicilio");

      actualizarResumen();
    });
  });
}

/* -------------------- Validación y envío por WhatsApp -------------------- */
function enviarPedidoPorWhatsapp() {
  const aviso = document.getElementById("avisoForm");
  const carrito = leerCarrito();

  if (carrito.length === 0) {
    aviso.textContent = "Tu carrito está vacío. Agrega al menos un producto.";
    return;
  }

  const nombre = document.getElementById("clienteNombre").value.trim();
  const telefono = document.getElementById("clienteTelefono").value.trim();

  if (!nombre || !telefono) {
    aviso.textContent = "Escribe tu nombre y tu teléfono de contacto.";
    return;
  }

  let datosEnvio = {};
  if (metodoEnvioActual === "encomienda") {
    datosEnvio.departamento = document.getElementById("encomiendaDepartamento").value;
    datosEnvio.municipio = document.getElementById("encomiendaMunicipio").value.trim();
    if (!datosEnvio.departamento || !datosEnvio.municipio) {
      aviso.textContent = "Completa departamento y municipio para la encomienda.";
      return;
    }
  } else {
    datosEnvio.departamento = document.getElementById("domicilioDepartamento").value;
    datosEnvio.municipio = document.getElementById("domicilioMunicipio").value.trim();
    datosEnvio.direccion = document.getElementById("domicilioDireccion").value.trim();
    datosEnvio.referencia = document.getElementById("domicilioReferencia").value.trim();
    datosEnvio.telefonoEntrega = document.getElementById("domicilioTelefono").value.trim();
    if (!datosEnvio.departamento || !datosEnvio.municipio || !datosEnvio.direccion || !datosEnvio.referencia || !datosEnvio.telefonoEntrega) {
      aviso.textContent = "Completa todos los campos de la dirección de domicilio.";
      return;
    }
  }

  aviso.textContent = "";
  const mensaje = construirMensajeWhatsapp(nombre, telefono, datosEnvio);
  const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}

function construirMensajeWhatsapp(nombre, telefono, datosEnvio) {
  const carrito = leerCarrito();
  const { subtotalBolsos, subtotalAccesorios, unidadesTotales } = calcularSubtotales();
  const descuentoMonto = calcularDescuentoMonto(subtotalBolsos);
  const costoEnvio = calcularCostoEnvio(unidadesTotales);
  const total = (subtotalBolsos - descuentoMonto) + subtotalAccesorios + costoEnvio;

  const lineasBolsos = [];
  const lineasAccesorios = [];

  carrito.forEach((linea) => {
    const p = buscarProductoCarrito(linea.id, linea.tipo);
    if (!p) return;
    const texto = `- ${p.nombre} x${linea.cantidad} — ${formatoPrecio(p.precio)} c/u = ${formatoPrecio(p.precio * linea.cantidad)}`;
    if (linea.tipo === "bolso") lineasBolsos.push(texto);
    else lineasAccesorios.push(texto);
  });

  let partes = [];
  partes.push("*Nuevo pedido — noiri*");
  partes.push("");
  partes.push(`*Cliente:* ${nombre}`);
  partes.push(`*Teléfono:* ${telefono}`);
  partes.push("");

  if (lineasBolsos.length) {
    partes.push("*Bolsos:*");
    partes.push(...lineasBolsos);
    partes.push("");
  }
  if (lineasAccesorios.length) {
    partes.push("*Accesorios:*");
    partes.push(...lineasAccesorios);
    partes.push("");
  }

  partes.push(`Subtotal bolsos: ${formatoPrecio(subtotalBolsos)}`);
  if (descuentoAplicado) {
    partes.push(`Descuento (${descuentoAplicado.codigo} -${descuentoAplicado.porcentaje}%): -${formatoPrecio(descuentoMonto)}`);
  }
  partes.push(`Subtotal accesorios: ${formatoPrecio(subtotalAccesorios)}`);
  partes.push("");

  if (metodoEnvioActual === "encomienda") {
    partes.push("*Envío: Encomienda*");
    partes.push(`Departamento: ${datosEnvio.departamento}`);
    partes.push(`Municipio: ${datosEnvio.municipio}`);
  } else {
    partes.push("*Envío: A domicilio*");
    partes.push(`Departamento: ${datosEnvio.departamento}`);
    partes.push(`Municipio: ${datosEnvio.municipio}`);
    partes.push(`Dirección exacta: ${datosEnvio.direccion}`);
    partes.push(`Referencia: ${datosEnvio.referencia}`);
    partes.push(`Teléfono para la entrega: ${datosEnvio.telefonoEntrega}`);
  }
  partes.push(`Costo de envío: ${formatoPrecio(costoEnvio)}`);
  partes.push("");
  partes.push(`*TOTAL A PAGAR: ${formatoPrecio(total)}*`);

  return partes.join("\n");
}

/* -------------------- Menú móvil (mismo comportamiento que la tienda) -------------------- */
function configurarMenuMovil() {
  const btn = document.getElementById("btnMenuMovil");
  const fila = document.getElementById("encabezadoFila");
  btn.addEventListener("click", () => fila.classList.toggle("menu-abierto"));
}
