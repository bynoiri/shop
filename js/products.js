/* ==========================================================================
   PRODUCTOS DE NOIRI
   ==========================================================================
   Aquí editas TODO lo relacionado a tus productos: precio, categoría,
   tamaño, si es "más vendido", y la carpeta de sus fotos.
   No necesitas tocar ningún otro archivo para actualizar precios o mover
   un bolso de categoría.

   CÓMO AGREGAR UN BOLSO NUEVO:
   1. Copia un bloque { ... } de la lista BOLSOS y pégalo antes del ] final.
   2. Cambia "id" (único, sin espacios, ej: "bolso-041").
   3. Cambia "nombre", "categoria", "tamano", "precio" y "masVendido".
   4. Crea la carpeta images/productos/bolso-041/ y sube 4 fotos .webp
      (600x800px) con estos nombres EXACTOS:
        frente.webp
        atras.webp
        cenital.webp
        modelo.webp
   5. Guarda el archivo. Listo, ya aparece en la tienda.

   CATEGORÍAS VÁLIDAS (usa exactamente estos códigos en "categoria"):
     "hombro"          -> Bolsos de Hombro
     "crossbody"       -> Crossbody / Bandoleras
     "dos-en-uno"      -> Bolsos 2 en 1 (Hombro + Crossbody)
     "cartera-grande"  -> Carteras Grandes
     "mini"            -> Mini Bolsos
     "mochila"         -> Mochila

   TAMAÑOS VÁLIDOS (usa exactamente estos códigos en "tamano"):
     "pequeno" | "mediano" | "grande"
   ========================================================================== */

const CATEGORIAS_BOLSOS = {
  "hombro": "Bolsos de Hombro",
  "crossbody": "Crossbody / Bandoleras",
  "dos-en-uno": "Bolsos 2 en 1 (Hombro + Crossbody)",
  "cartera-grande": "Carteras Grandes",
  "mini": "Mini Bolsos",
  "mochila": "Mochila"
};

const TAMANOS = {
  "pequeno": "Pequeño",
  "mediano": "Mediano",
  "grande": "Grande"
};

/* Sube este objeto si más adelante quieres agregar tipos de accesorio nuevos */
const TIPOS_ACCESORIOS = {
  "llavero": "Llaveros",
  "pulsera": "Pulseras"
};

/* ---------------------------------------------------------------------
   BOLSOS
   Esto son EJEMPLOS de estructura (placeholders). Reemplaza nombre,
   precio, categoría y fotos por tus ~40 bolsos reales. El orden en que
   los escribas aquí es el orden en que se muestran en la tienda dentro
   de cada categoría.
   --------------------------------------------------------------------- */
const BOLSOS = [
  { id: "bolso-001", nombre: "Bolso Emma",     categoria: "hombro",         tamano: "mediano", precio: 24.99, masVendido: true,  carpeta: "bolso-001" },
  { id: "bolso-002", nombre: "Bolso Aurora",    categoria: "hombro",         tamano: "grande",  precio: 27.99, masVendido: false, carpeta: "bolso-002" },
  { id: "bolso-003", nombre: "Bolso Vera",      categoria: "hombro",         tamano: "pequeno", precio: 21.99, masVendido: false, carpeta: "bolso-003" },

  { id: "bolso-004", nombre: "Crossbody Nora",  categoria: "crossbody",      tamano: "pequeno", precio: 19.99, masVendido: true,  carpeta: "bolso-004" },
  { id: "bolso-005", nombre: "Crossbody Iris",  categoria: "crossbody",      tamano: "mediano", precio: 22.99, masVendido: false, carpeta: "bolso-005" },
  { id: "bolso-006", nombre: "Crossbody Dalia", categoria: "crossbody",      tamano: "mediano", precio: 22.99, masVendido: false, carpeta: "bolso-006" },

  { id: "bolso-007", nombre: "Bolso Mia 2en1",  categoria: "dos-en-uno",     tamano: "mediano", precio: 26.99, masVendido: true,  carpeta: "bolso-007" },
  { id: "bolso-008", nombre: "Bolso Talia 2en1",categoria: "dos-en-uno",     tamano: "grande",  precio: 29.99, masVendido: false, carpeta: "bolso-008" },

  { id: "bolso-009", nombre: "Cartera Valentina", categoria: "cartera-grande", tamano: "grande", precio: 31.99, masVendido: false, carpeta: "bolso-009" },
  { id: "bolso-010", nombre: "Cartera Renata",     categoria: "cartera-grande", tamano: "grande", precio: 31.99, masVendido: true,  carpeta: "bolso-010" },

  { id: "bolso-011", nombre: "Mini Bolso Luna", categoria: "mini",          tamano: "pequeno", precio: 17.99, masVendido: false, carpeta: "bolso-011" },
  { id: "bolso-012", nombre: "Mini Bolso Coco", categoria: "mini",          tamano: "pequeno", precio: 17.99, masVendido: false, carpeta: "bolso-012" },

  { id: "bolso-013", nombre: "Mochila Elle",    categoria: "mochila",       tamano: "mediano", precio: 28.99, masVendido: false, carpeta: "bolso-013" },
  { id: "bolso-014", nombre: "Mochila Row",     categoria: "mochila",       tamano: "grande",  precio: 32.99, masVendido: false, carpeta: "bolso-014" }
];

/* ---------------------------------------------------------------------
   ACCESORIOS
   Ejemplos de estructura. Reemplaza por tus 16 accesorios reales.
   IMPORTANTE: los accesorios NUNCA reciben el código de descuento,
   eso ya está resuelto automáticamente en el carrito, no lo toques aquí.
   --------------------------------------------------------------------- */
const ACCESORIOS = [
  { id: "acc-001", nombre: "Llavero Nudo",   tipo: "llavero", precio: 4.50, carpeta: "acc-001" },
  { id: "acc-002", nombre: "Llavero Borla",  tipo: "llavero", precio: 4.50, carpeta: "acc-002" },
  { id: "acc-003", nombre: "Llavero Flor",   tipo: "llavero", precio: 5.00, carpeta: "acc-003" },
  { id: "acc-004", nombre: "Pulsera Fina",   tipo: "pulsera", precio: 6.00, carpeta: "acc-004" },
  { id: "acc-005", nombre: "Pulsera Doble",  tipo: "pulsera", precio: 7.00, carpeta: "acc-005" },
  { id: "acc-006", nombre: "Pulsera Charm",  tipo: "pulsera", precio: 7.50, carpeta: "acc-006" }
];

/* ---------------------------------------------------------------------
   CÓDIGOS DE DESCUENTO
   Solo aplican sobre el subtotal de BOLSOS. Nunca sobre accesorios.
   Agrega o quita códigos aquí. El valor es el porcentaje de descuento.
   --------------------------------------------------------------------- */
const CODIGOS_DESCUENTO = {
  "NOIRI10": 10,
  "BIENVENIDA15": 15
};

/* Departamentos de El Salvador, usados en los selects de envío del carrito */
const DEPARTAMENTOS_SV = [
  "Ahuachapán", "Santa Ana", "Sonsonate", "Chalatenango", "La Libertad",
  "San Salvador", "Cuscatlán", "La Paz", "Cabañas", "San Vicente",
  "Usulután", "San Miguel", "Morazán", "La Unión"
];
