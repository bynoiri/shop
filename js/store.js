/* ==========================================================================
   LÓGICA DE LA PÁGINA DE TIENDA (index.html)
   ========================================================================== */

let filtroCategoriaActual = "todas";
let filtroTamanoActual = "todos";

document.addEventListener("DOMContentLoaded", () => {
  construirFiltrosCategoria();
  renderMasVendidos();
  renderBolsos();
  renderAccesorios();
  configurarModal();
  configurarMenuMovil();
});

/* -------------------- Filtros -------------------- */
function construirFiltrosCategoria() {
  const cont = document.getElementById("filtrosCategoria");
  Object.entries(CATEGORIAS_BOLSOS).forEach(([codigo, etiqueta]) => {
    const btn = document.createElement("button");
    btn.className = "chip";
    btn.dataset.categoria = codigo;
    btn.textContent = etiqueta;
    cont.appendChild(btn);
  });

  cont.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-categoria]");
    if (!btn) return;
    filtroCategoriaActual = btn.dataset.categoria;
    [...cont.children].forEach((c) => c.classList.remove("activo"));
    btn.classList.add("activo");
    renderBolsos();
  });

  const contTam = document.getElementById("filtrosTamano");
  contTam.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-tamano]");
    if (!btn) return;
    filtroTamanoActual = btn.dataset.tamano;
    [...contTam.children].forEach((c) => c.classList.remove("activo"));
    btn.classList.add("activo");
    renderBolsos();
  });
}

/* -------------------- Render de secciones -------------------- */
function renderMasVendidos() {
  const destacados = BOLSOS.filter((b) => b.masVendido);
  const cont = document.getElementById("grillaMasVendidos");
  cont.innerHTML = destacados.map(tarjetaBolsoHTML).join("") ||
    `<p style="text-align:center;color:var(--gris);grid-column:1/-1;">Aún no hay productos marcados como "más vendido".</p>`;
}

function renderBolsos() {
  let lista = BOLSOS;
  if (filtroCategoriaActual !== "todas") {
    lista = lista.filter((b) => b.categoria === filtroCategoriaActual);
  }
  if (filtroTamanoActual !== "todos") {
    lista = lista.filter((b) => b.tamano === filtroTamanoActual);
  }
  const cont = document.getElementById("grillaBolsos");
  cont.innerHTML = lista.map(tarjetaBolsoHTML).join("") ||
    `<p style="text-align:center;color:var(--gris);grid-column:1/-1;">No hay bolsos en esta categoría todavía.</p>`;
}

function renderAccesorios() {
  const cont = document.getElementById("grillaAccesorios");
  cont.innerHTML = ACCESORIOS.map(tarjetaAccesorioHTML).join("");
}

/* -------------------- Plantillas de tarjeta -------------------- */
function tarjetaBolsoHTML(b) {
  const frente = rutaFoto(RUTA_IMG_BOLSOS, b.carpeta, "frente.webp");
  const atras = rutaFoto(RUTA_IMG_BOLSOS, b.carpeta, "atras.webp");
  return `
  <article class="tarjeta-producto" data-id="${b.id}" data-tipo="bolso">
    <div class="foto-producto" onclick="abrirModal('${b.id}', 'bolso')">
      ${b.masVendido ? `<span class="etiqueta-vendido">Más vendido</span>` : ""}
      <img class="foto-frente" src="${frente}" alt="${b.nombre} - frente" onerror="onImgError(this)">
      <img class="foto-atras" src="${atras}" alt="${b.nombre} - atrás" onerror="onImgError(this)">
    </div>
    <div class="info-producto">
      <p class="categoria">${CATEGORIAS_BOLSOS[b.categoria]}</p>
      <h3>${b.nombre}</h3>
      <div class="tamano-precio">
        <span class="tamano">Tamaño ${TAMANOS[b.tamano]}</span>
        <span class="precio">${formatoPrecio(b.precio)}</span>
      </div>
      <button class="btn-agregar" onclick="agregarYConfirmar(this,'${b.id}','bolso')">Agregar al carrito</button>
    </div>
  </article>`;
}

function tarjetaAccesorioHTML(a) {
  const frente = rutaFoto(RUTA_IMG_ACCESORIOS, a.carpeta, "frente.webp");
  const atras = rutaFoto(RUTA_IMG_ACCESORIOS, a.carpeta, "atras.webp");
  return `
  <article class="tarjeta-producto" data-id="${a.id}" data-tipo="accesorio">
    <div class="foto-producto" onclick="abrirModal('${a.id}', 'accesorio')">
      <img class="foto-frente" src="${frente}" alt="${a.nombre} - frente" onerror="onImgError(this)">
      <img class="foto-atras" src="${atras}" alt="${a.nombre} - atrás" onerror="onImgError(this)">
    </div>
    <div class="info-producto">
      <p class="categoria">${TIPOS_ACCESORIOS[a.tipo]}</p>
      <h3>${a.nombre}</h3>
      <div class="tamano-precio">
        <span class="tamano">Accesorio</span>
        <span class="precio">${formatoPrecio(a.precio)}</span>
      </div>
      <button class="btn-agregar" onclick="agregarYConfirmar(this,'${a.id}','accesorio')">Agregar al carrito</button>
    </div>
  </article>`;
}

function agregarYConfirmar(btn, id, tipo) {
  agregarAlCarrito(id, tipo);
  const textoOriginal = btn.textContent;
  btn.textContent = "Agregado ✓";
  btn.classList.add("agregado");
  setTimeout(() => {
    btn.textContent = textoOriginal;
    btn.classList.remove("agregado");
  }, 1200);
}

/* -------------------- Modal de galería (4 fotos) -------------------- */
let productoModalActual = null;

function buscarProducto(id, tipo) {
  return tipo === "bolso" ? BOLSOS.find((b) => b.id === id) : ACCESORIOS.find((a) => a.id === id);
}

function abrirModal(id, tipo) {
  const producto = buscarProducto(id, tipo);
  if (!producto) return;
  productoModalActual = { id, tipo };

  const base = tipo === "bolso" ? RUTA_IMG_BOLSOS : RUTA_IMG_ACCESORIOS;
  const vistas = [
    ["frente.webp", "Frente"],
    ["atras.webp", "Atrás"],
    ["cenital.webp", "Cenital"],
    ["modelo.webp", "Modelo"]
  ];

  document.getElementById("modalTitulo").textContent =
    `${producto.nombre} — ${formatoPrecio(producto.precio)}`;

  document.getElementById("modalFotos").innerHTML = vistas.map(([archivo, etiqueta]) => `
    <figure>
      <img src="${rutaFoto(base, producto.carpeta, archivo)}" alt="${producto.nombre} ${etiqueta}" onerror="onImgError(this)">
      <figcaption>${etiqueta}</figcaption>
    </figure>
  `).join("");

  document.getElementById("modalGaleria").classList.add("abierto");
}

function configurarModal() {
  document.getElementById("cerrarModal").addEventListener("click", cerrarModal);
  document.getElementById("modalGaleria").addEventListener("click", (e) => {
    if (e.target.id === "modalGaleria") cerrarModal();
  });
  document.getElementById("modalBtnAgregar").addEventListener("click", () => {
    if (!productoModalActual) return;
    agregarAlCarrito(productoModalActual.id, productoModalActual.tipo);
    const btn = document.getElementById("modalBtnAgregar");
    btn.textContent = "Agregado ✓";
    setTimeout(() => (btn.textContent = "Agregar al carrito"), 1200);
  });
}

function cerrarModal() {
  document.getElementById("modalGaleria").classList.remove("abierto");
  productoModalActual = null;
}

/* -------------------- Menú móvil -------------------- */
function configurarMenuMovil() {
  const btn = document.getElementById("btnMenuMovil");
  const fila = document.getElementById("encabezadoFila");
  btn.addEventListener("click", () => fila.classList.toggle("menu-abierto"));
}
