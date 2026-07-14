/* ==========================================================================
   CONFIGURACIÓN GENERAL DE LA TIENDA
   Edita estos valores cuando quieras cambiar el número de WhatsApp o
   las tarifas de envío. No necesitas tocar nada más.
   ========================================================================== */
const CONFIG = {
  whatsapp: "50371820017",       // número al que llegan los pedidos (sin +, sin espacios)
  monedaSimbolo: "$",
  envio: {
    encomienda: {
      base: 1.00,                // costo por la primera unidad
      extraPorUnidad: 0.50       // se suma por cada unidad adicional
    },
    domicilio: {
      tarifaFija: 4.50
    }
  }
};

/* Carpeta base de imágenes de cada línea de producto */
const RUTA_IMG_BOLSOS = "images/productos/";
const RUTA_IMG_ACCESORIOS = "images/accesorios/";

/* --------------------------------------------------------------------
   Helpers de imagen: si la foto todavía no fue subida, mostramos un
   placeholder en vez de un ícono de imagen rota.
   -------------------------------------------------------------------- */
function rutaFoto(base, carpeta, archivo) {
  return `${base}${carpeta}/${archivo}`;
}

function onImgError(imgEl) {
  imgEl.onerror = null;
  imgEl.src =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='800'>
         <rect width='100%' height='100%' fill='#F4ECE6'/>
         <text x='50%' y='50%' font-family='Georgia, serif' font-size='28'
               fill='#7A7676' text-anchor='middle' dominant-baseline='middle'>noiri</text>
       </svg>`
    );
}

/* --------------------------------------------------------------------
   CARRITO — persistido en localStorage para que sobreviva entre
   la página de tienda y la página de carrito.
   Estructura de cada línea: { id, tipo: 'bolso'|'accesorio', cantidad }
   -------------------------------------------------------------------- */
const CARRITO_KEY = "noiri_carrito";

function leerCarrito() {
  try {
    const raw = localStorage.getItem(CARRITO_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function guardarCarrito(carrito) {
  localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
  actualizarBadgeCarrito();
}

function agregarAlCarrito(id, tipo) {
  const carrito = leerCarrito();
  const linea = carrito.find((l) => l.id === id && l.tipo === tipo);
  if (linea) {
    linea.cantidad += 1;
  } else {
    carrito.push({ id, tipo, cantidad: 1 });
  }
  guardarCarrito(carrito);
}

function cambiarCantidad(id, tipo, nuevaCantidad) {
  let carrito = leerCarrito();
  if (nuevaCantidad <= 0) {
    carrito = carrito.filter((l) => !(l.id === id && l.tipo === tipo));
  } else {
    const linea = carrito.find((l) => l.id === id && l.tipo === tipo);
    if (linea) linea.cantidad = nuevaCantidad;
  }
  guardarCarrito(carrito);
}

function eliminarDelCarrito(id, tipo) {
  const carrito = leerCarrito().filter((l) => !(l.id === id && l.tipo === tipo));
  guardarCarrito(carrito);
}

function totalUnidadesCarrito() {
  return leerCarrito().reduce((sum, l) => sum + l.cantidad, 0);
}

function actualizarBadgeCarrito() {
  const badges = document.querySelectorAll("[data-cart-badge]");
  const total = totalUnidadesCarrito();
  badges.forEach((b) => {
    b.textContent = total;
    b.style.display = total > 0 ? "inline-flex" : "none";
  });
}

function formatoPrecio(valor) {
  return `${CONFIG.monedaSimbolo}${valor.toFixed(2)}`;
}

document.addEventListener("DOMContentLoaded", actualizarBadgeCarrito);
