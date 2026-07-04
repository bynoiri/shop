# noiri — Tienda web

Sitio 100% estático (HTML, CSS y JS puro). No necesita servidor, base de datos
ni pagos por hosting: se publica gratis con **GitHub Pages**.

## 1. Publicar en GitHub Pages (gratis)

1. Crea un repositorio nuevo en GitHub (puede ser público).
2. Sube TODO el contenido de esta carpeta (`index.html`, `carrito.html`, `css/`, `js/`, `images/`) a la raíz del repositorio.
3. En el repositorio: **Settings → Pages**.
4. En "Source" selecciona la rama `main` y la carpeta `/ (root)`. Guarda.
5. Espera 1-2 minutos. GitHub te dará un link tipo:
   `https://tu-usuario.github.io/tu-repositorio/`
6. Ese link ya es tu tienda en línea.

Cada vez que subas un cambio a GitHub (nuevo producto, nueva foto, precio
actualizado), la página se actualiza sola en 1-2 minutos.

## 2. Subir tus fotos de producto

Formato requerido: **.webp, 600x800px**, 4 fotos por producto con estos
nombres EXACTOS (minúsculas, sin tildes):

```
frente.webp
atras.webp
cenital.webp
modelo.webp
```

- Bolsos van en: `images/productos/<carpeta-del-producto>/`
- Accesorios van en: `images/accesorios/<carpeta-del-producto>/`

El nombre de la carpeta es el valor `carpeta` que escribiste en
`js/products.js` para ese producto (ej: `bolso-001`).

Si todavía no subes una foto, no se rompe la página: aparece un
placeholder beige con el nombre "noiri" mientras subes la imagen real.

También puedes subir una foto ancha para el encabezado principal en
`images/hero.webp` (recomendado 1600x1000px o similar, formato panorámico).

## 3. Editar productos, precios y categorías

Todo se edita en **`js/products.js`**. No necesitas tocar HTML ni CSS.

- Para cambiar un precio: busca el producto y cambia el número en `precio`.
- Para moverlo de categoría: cambia el valor de `categoria` (usa exactamente
  los códigos indicados en los comentarios del archivo).
- Para marcarlo como "más vendido": cambia `masVendido` a `true` o `false`.
- Para agregar un producto nuevo: copia un bloque `{ ... }` completo,
  pégalo, y cambia sus datos + su carpeta de fotos.

Actualmente el archivo trae productos de ejemplo. Ve agregando tus ~40
bolsos y 16 accesorios reales siguiendo el mismo patrón.

## 4. Cambiar el número de WhatsApp

En **`js/common.js`**, al inicio, cambia:

```js
whatsapp: "50371820017",
```

## 5. Cambiar tarifas de envío

También en `js/common.js`:

```js
envio: {
  encomienda: {
    base: 1.00,            // costo de la 1ra unidad
    extraPorUnidad: 0.50   // se suma por cada unidad extra
  },
  domicilio: {
    tarifaFija: 4.50
  }
}
```

Con los valores actuales: 1 unidad = $1.00, 2 unidades = $1.50,
3 unidades = $2.00, y así sucesivamente. Domicilio siempre cuesta $4.50
sin importar cuántas unidades se pidan.

## 6. Códigos de descuento

En **`js/products.js`**:

```js
const CODIGOS_DESCUENTO = {
  "NOIRI10": 10,
  "BIENVENIDA15": 15
};
```

El número es el porcentaje de descuento. El descuento se aplica
**solo sobre el subtotal de bolsos**; nunca sobre accesorios (esto ya
está resuelto en el código, no necesitas hacer nada extra).

## 7. Cómo funciona el pedido por WhatsApp

En el carrito, la clienta llena:
- Nombre y teléfono de contacto.
- Método de envío: **Encomienda** (pide departamento y municipio, y tú le
  confirmas después el punto exacto de recolección) o **A domicilio** (pide
  departamento, municipio, dirección exacta, referencia y teléfono de
  entrega).

Al presionar "Enviar pedido por WhatsApp", se abre WhatsApp con un mensaje
ya redactado que incluye: productos, cantidades, precios, subtotales,
descuento aplicado (si hay), método de envío con todos los datos, costo de
envío y total a pagar — listo para que tú confirmes el pedido.

## Estructura del proyecto

```
index.html          → página de la tienda
carrito.html         → página de carrito + envío + botón WhatsApp
css/style.css        → estilos e identidad visual de noiri
js/products.js       → tus productos, precios, categorías, descuentos (EDITAR AQUÍ)
js/common.js         → número de WhatsApp y tarifas de envío (EDITAR AQUÍ)
js/store.js          → lógica de la tienda (no es necesario tocarlo)
js/carrito.js        → lógica del carrito (no es necesario tocarlo)
images/productos/    → fotos de bolsos (4 por producto)
images/accesorios/   → fotos de accesorios (4 por producto)
images/hero.webp     → foto grande del encabezado (opcional)
```
