# Por qué `<Image src={promesaAsync()} />` no falla en `@react-pdf/renderer`

## El código en cuestión

En `QRstyle.tsx` (versión original), el componente hace esto:

```jsx
<Image
  src={generateQRstyleAsBase64({ url, width: size, height: size, ... })}
/>
```

`generateQRstyleAsBase64` es una función `async`, así que lo que realmente se le pasa a `src` **no es un string**, es una `Promise<string>`. La intuición razonable era que esto debía fallar: `@react-pdf/renderer` "debería" esperar un string, buffer o `{ uri }`, no una promesa pendiente. Pero en la práctica siempre renderiza bien, tanto en servidor (`renderToStream`) como en cliente (`<PDFViewer>` / `pdf().toBlob()`).

## La causa: es un caso soportado explícitamente, no casualidad de timing

Se verificó de forma empírica corriendo `@react-pdf/renderer@4.5.1` en un sandbox local, e inspeccionando el código fuente instalado en `node_modules`. El archivo `@react-pdf/layout/lib/index.js` contiene esto:

```javascript
/**
 * Resolves `src` to `@react-pdf/image` interface.
 *
 * Also it handles factories and async sources.
 *
 * @param src
 * @returns Resolved src
 */
const resolveSource = async (src) => {
    const source = typeof src === 'function' ? await src() : await src;
    return typeof source === 'string' ? { uri: source } : source;
};
```

Esto confirma que `src` en `<Image>` acepta tres formas:

1. Un **string** (URL o data URI) — el caso "normal" documentado públicamente.
2. Una **función factory** — si `src` es una función, la ejecuta y espera su resultado.
3. Una **Promise directa** (o cualquier valor "then-able") — el `await src` la resuelve igual, sea o no una función la que la produjo.

Cuando `src` ya es un string plano, `await string` en JavaScript simplemente devuelve ese string sin cambios (según la especificación, `await` sobre un valor no-thenable lo envuelve y desenvuelve trivialmente). Por eso el mismo código funciona sin importar si `src` es string o Promise: en ambos casos, `resolveSource` termina con el valor ya resuelto.

Esta resolución ocurre dentro de `fetchImage`, que recorre **todos** los nodos `Image`/`ImageBackground` del árbol de forma asíncrona antes de pasar a la fase de layout (Yoga):

```javascript
const fetchImage = async (node, pageWidth) => {
    const { cache } = node.props;
    const src = getSource(node, pageWidth);
    ...
    const source = await resolveSource(src);
    node.image = await resolveImage(source, { cache });
    ...
};
```

Esto coincide con lo que documenta la arquitectura oficial de react-pdf: se resuelven todas las peticiones (fuentes, imágenes) de forma asíncrona, y el renderer no avanza al layout hasta que todas terminan, con éxito o fallo.

## Verificación práctica realizada

Para no quedarnos solo con la lectura del código, se generaron y compararon dos PDFs de prueba con `renderToStream`:

| Prueba | Cómo se pasó `src` | Resultado |
|---|---|---|
| A | `useState` + `useEffect`, esperando la promesa manualmente y solo entonces poniendo el string resuelto en `src` | PDF de 2116 bytes, imagen de 68 bytes incrustada |
| B | La función `async` invocada directo en el JSX, pasando la `Promise` cruda a `src` (patrón real de `QRstyle.tsx`) | PDF de 2101 bytes, imagen de 68 bytes incrustada — **idéntica** |

Ambos casos incrustaron exactamente la misma imagen. No hubo placeholder vacío, no hubo advertencia, no hubo comportamiento distinto entre las dos versiones.

## Lo que sí se descartó en el proceso

También se probó si `@react-pdf/renderer` soporta **componentes de función `async`** (es decir, un componente que en sí mismo es `async () => {...}` y devuelve `Promise<ReactElement>`, al estilo React Server Components):

```javascript
const AsyncImageBlock = async ({ label }) => { ... return <View>...</View> }
```

Esto **sí falla**, con un error explícito del reconciler:

```
An unknown Component is an async Client Component. Only Server Components can be async at the moment.
```

Es un caso distinto al de `src`: aquí es el **componente completo** el que es async, no una prop. El reconciler de react-pdf (basado en el reconciler de React, no en RSC) rechaza esto de forma explícita. Este patrón se descartó como alternativa antes de proponerlo como solución.

## Conclusión

- Pasar una `Promise<string>` (o una función que la devuelva) directamente a `src` en `<Image>` de `@react-pdf/renderer` **es un comportamiento soportado por diseño**, documentado en el propio código fuente aunque no en la documentación pública. No es una casualidad de timing ni un bug tolerado accidentalmente.
- El patrón original de `QRstyle.tsx` y `QRstyleGenerator.ts` (llamar a la función async directo en `src`) ya era válido tal cual estaba — no requería el envoltorio con `useState`/`useEffect` que se había propuesto antes por precaución.
- El problema real que seguía sin resolver era otro, y sigue siendo válido: la falta de separación limpia entre entorno navegador y entorno Node (uso de `document.createElement` en `ChartJSGenerator.ts`, e imports de subruta interna en `QRstyleGenerator.ts`), no la forma en que se pasa `src` al componente `Image`.

## Solución adoptada: factory function explícita

Aunque pasar la Promise cruda ya funcionaba, se decidió **no dejarlo implícito**. En vez de:

```jsx
// Funciona, pero oculta que generateQRAsBase64 es async detrás de la llamada
<Image src={generateQRAsBase64({ url, size })} />
```

se adoptó este patrón en los tres componentes de imágenes generadas (`QR.tsx`, `QRstyle.tsx`, `ChartJS.tsx`):

```jsx
// La función nombrada deja explícito que la resolución es diferida
const resolveQRSrc = async (): Promise<string | undefined> => {
  try {
    const dataUrl = await generateQRAsBase64({ url, size, ... })
    return dataUrl || undefined
  } catch (error) {
    console.error("Error generando QR:", error)
    return undefined
  }
}

<Image src={resolveQRSrc} style={{ width: size, height: size }} />
```

Esto es un cambio de **legibilidad, no de funcionalidad** — ambas formas usan el mismo mecanismo interno de `resolveSource`. La ventaja de la factory nombrada es que el nombre de la función deja explícito en el código que ese valor se resuelve más tarde, en vez de que quien lo lea tenga que darse cuenta por su cuenta de que la llamada es `async`.

Con este cambio se pudo simplificar también el componente: se eliminó el `useState`/`useEffect` que antes gestionaba manualmente los estados `loading`/`success`/`error`, porque `@react-pdf/renderer` ya resuelve ese ciclo internamente antes del layout. El único estado que se conserva a nivel de código es el `try/catch` dentro de la factory, para loguear el error con contexto propio (`"Error generando QR:"`) en vez de depender del mensaje genérico que emite react-pdf cuando `src` devuelve `undefined`.

### Verificación empírica del manejo de errores

Se probó explícitamente qué pasa cuando la factory devuelve `undefined` o lanza una excepción sin capturar, usando `renderToStream`:

| Caso | Resultado |
|---|---|
| Factory devuelve `undefined` | React-pdf loguea `"Image's 'src' or 'source' prop returned undefined"` y genera el PDF igual, sin esa imagen |
| Factory lanza un error sin `try/catch` interno | El proceso tampoco truena; react-pdf captura el rechazo de la promesa y continúa el render |
| Factory con `try/catch` propio (patrón adoptado) | Mismo resultado, pero con un mensaje de error propio y más útil para depurar (incluye qué QR/chart falló y por qué) |

En ningún caso una imagen fallida rompe el documento completo — el nodo `Image` correspondiente simplemente queda vacío. Esto también permitió **eliminar el fallback a un servicio externo** (`api.qrserver.com`) que tenía `QR.tsx`: ya no hace falta un plan B de red para evitar que el PDF se rompa, porque react-pdf ya tolera el fallo de forma segura por sí solo.

### Caso especial: `QRstyleGenerator.ts` y `ChartJSGenerator.ts`

Estos dos generadores sí necesitaban un cambio funcional real, más allá de la factory: no compilaban en Node porque usaban `document.createElement("canvas")`, una API exclusiva del navegador. La solución fue detectar el entorno (`typeof window !== "undefined"`) y usar dos rutas de generación separadas:

- **Navegador**: se mantiene el `canvas` del DOM tal como estaba.
- **Node**: `qr-code-styling` se carga con sus `extraOptions` de `jsdom`/`canvas` (ya lo hacía `QRstyleGenerator.ts` original), y para charts se introdujo `chartjs-node-canvas`, que resuelve el canvas nativo sin depender de `document` en ningún punto. Se verificó generando un PNG real de 800×600 píxeles y confirmando su formato con `PIL`.

## Referencia de versión probada

Verificado contra `@react-pdf/renderer@4.5.1` (la última versión publicada al momento de esta prueba). Si el proyecto usa una versión distinta, vale la pena confirmar que `@react-pdf/layout` de esa versión mantenga el mismo `resolveSource`.
