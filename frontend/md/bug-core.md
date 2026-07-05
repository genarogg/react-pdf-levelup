## Análisis — Sección 1: `src/components/core/` (la librería react-pdf-levelup)

Terminé de revisar toda esta carpeta (Etiquetas, Grid, Position, Lista, Img, ImgBg, Form, Tablet, Layout, LayoutMultiPage, NextPage, helpers, QR, QRstyle, ChartJS, Icon). Esto es independiente de los 8 bugs que ya tenía identificados el análisis previo (esos son todos de `playground/`).

### 🔴 Bugs críticos

**1.1 — Página en blanco extra en documentos multipágina.** `LayoutMultiPage.tsx` reserva espacio para el footer **dos veces**: una vez vía `paddingBottom` de la página, y otra vez con un `<View style={{paddingBottom: footerHeight}} />` extra justo antes del footer. Lo interesante: en `Layout.tsx` (la versión de una sola página) esa misma línea está **comentada**, con una nota del propio desarrollador diciendo textualmente que "tiene un bug que renderiza una pagina de mas". O sea, ya lo habían detectado y arreglado en un archivo, pero el bug sigue vivo en el archivo hermano.

**1.2 — `colSpan` rompe el ancho de las tablas.** `Tr` (en `Tablet.tsx`) calcula el ancho de cada celda como `100 / (número de celdas en esa fila)`, sin conocer el total real de columnas de la tabla. Si una fila fusiona celdas con `colSpan` (reduciendo su conteo de `<Td>`), la base de cálculo ya está inflada, y al multiplicarla por `colSpan` la fila puede sumar más del 100% de ancho (overflow). Afecta directamente casos como las plantillas de factura del proyecto.

**1.3 — `QRstyle` probablemente nunca renderiza el QR real.** Le pasa directamente una `Promise` (sin resolver, sin `await`, sin envolver en función) al `src` de `<Image>`. El componente hermano `QR.tsx` sí resuelve su promesa con `useState`+`useEffect` antes de pasarla — `QRstyle.tsx` no tiene ningún hook, solo asigna la promesa "pelada".

### 🟡 Importantes

- **1.4** — El shorthand `style={{padding: 40}}` desactiva silenciosamente la reserva de espacio del footer (pero `paddingTop` solo, no) → posible solapamiento visual contenido/footer.
- **1.5** — `QR.tsx` cae por defecto a una API externa (`api.qrserver.com`) en el primer render, antes de que la generación local termine — dependencia de red y posible filtración de datos a un tercero incluso cuando todo funciona bien localmente.
- **1.6** — Patrón inconsistente entre los 3 componentes async (`ChartJS.tsx` tiene el manejo más robusto; `QR`/`QRstyle` deberían replicarlo).
- **1.7** — `Left`/`Right`/`Center` no reenvían `...rest`, a diferencia de todo el resto de la librería — props extra se descartan en silencio.

### 🟢 Mejoras / refactor

- **1.8** — Duplicación masiva de boilerplate en `Etiquetas.tsx`/`Grid.tsx` (mismo patrón repetido ~20 veces) → factory function.
- **1.9** — `style?: any` en todos lados en vez del tipo `Style` real → se pierde el chequeo de tipos.
- **1.10** — Redondeo de anchos en el grid (`Col5`+`Col7` = 99.99%, no 100%).
- **1.11** — `UL`/`OL` inyectan props a cualquier hijo directo aunque no sea `<LI>`, causando marcadores/índices incorrectos en silencio si hay envoltorios de por medio.

### 💡 A verificar en build real (sin confirmar 100%)
- **1.12** — `renderToStream` (API de Node) reexportado desde el core que también alimenta el bundle de navegador.
- **1.13** — Uso de `process.env.NODE_ENV` sin `define` explícito en `vite.config.ts`.

