# Cómo afecta el patrón `Promise` en `src` a cada paquete de `plugins.zip`

Este documento parte del hallazgo ya verificado en `por-que-no-falla-promise-src-de-qr.md`: `<Image>` de `@react-pdf/renderer` acepta que `src` sea un string, una función factory, o una `Promise` directa — `resolveSource` hace `await src` (o `await src()`) sin importar cuál de las tres formas llegue. Lo que sigue es un relevamiento paquete por paquete de **cómo usa cada uno ese mecanismo hoy** y **qué pasa cuando el generador subyacente falla**, a partir del código real en `plugins.zip` (no del código citado en la nota anterior, que documentaba un plan de refactor).

## Resumen por paquete

| Paquete | Forma de `src` en el componente | ¿El generador atrapa sus propios errores? | ¿Puede llegar una promesa rechazada a `<Image>`? |
|---|---|---|---|
| `qr/QR.tsx` | Promise cruda (`src={generateQRAsBase64({...})}`) | Sí — `try/catch` interno, devuelve `""` | No — siempre resuelve |
| `qr/QRstyle.tsx` | Promise cruda (`src={generateQRstyleAsBase64({...})}`) | Sí — `try/catch` + fallback en cascada a `generateQRAsBase64` | No — siempre resuelve |
| `charts/ChartJS.tsx` | Factory nombrada (`resolveChartSrc`) | Sí — `try/catch` interno, devuelve `""` | No — siempre resuelve |
| `codeBar/CodeBar.tsx` | Factory nombrada (`resolveCodeBarSrc`), **sin** `try/catch` propio en el componente | No — relanza el error (`throw`) | **Sí** |
| `icono/Icon.tsx` | No aplica — no usa `<Image>` ni `src` | No aplica | No aplica |

## Detalle por paquete

### `qr/QR.tsx` + `QRGenerator.ts`

`QR.tsx` sigue pasando la promesa cruda directo en `src`, sin envolver en una factory nombrada:

```tsx
<Image
  style={{ width: size, height: size }}
  src={generateQRAsBase64({ url, size, colorDark, colorLight, margin, errorCorrectionLevel })}
/>
```

`generateQRAsBase64` tiene su propio `try/catch` y, si `QRCode.toDataURL` falla, devuelve `""` en vez de relanzar. Consecuencia: la promesa que llega a `src` **siempre resuelve**, nunca rechaza. `resolveSource` la trata como string (`typeof source === 'string'` es cierto incluso para `""`) y termina generando `{ uri: "" }`.

Esto es un caso que la nota anterior no probó empíricamente: ahí se verificó qué pasa cuando la factory devuelve `undefined` (react-pdf loguea `"...returned undefined"` y sigue), pero **no** qué pasa cuando resuelve a un string vacío `""`. Es plausible que `resolveImage` intente tratar `""` como una URI a resolver y falle más abajo con un error distinto — no está confirmado en esta sesión, solo señalado como hueco de cobertura.

### `qr/QRstyle.tsx` + `QRstyleGenerator.ts`

Mismo patrón que `QR.tsx`: promesa cruda, sin factory nombrada:

```tsx
<Image
  style={{ width: size, height: size }}
  src={generateQRstyleAsBase64({ url, width: size, height: size, ... })}
/>
```

`generateQRstyleAsBase64` es más robusto que `QRGenerator`: si falla la generación con `qr-code-styling` (rama V2), su `catch` no devuelve `""` directo — cae en cascada a `generateQRAsBase64` (V1). Solo si **ambas** rutas fallan se llega a `""`. Al igual que en `QR.tsx`, la promesa nunca rechaza, así que el mismo hueco de cobertura (`""` sin probar contra `resolveSource`) aplica acá también.

### `charts/ChartJS.tsx` + `ChartJSGenerator.ts`

Este es el único, junto con `CodeBar`, que sí usa la factory nombrada tal como se documentó como decisión adoptada:

```tsx
const resolveChartSrc = async (): Promise<string> => {
  const dataUrl = await generateChartAsBase64(data, { width, height, backgroundColor, devicePixelRatio })
  return dataUrl && dataUrl !== "data:," ? dataUrl : TRANSPARENT_PIXEL
}
<Image src={resolveChartSrc} style={{ width, height }} cache={false} />
```

`generateChartAsBase64` atrapa sus errores y devuelve `""`. La factory además chequea explícitamente ese caso (`dataUrl && dataUrl !== "data:,"`) y sustituye por un píxel transparente en base64 fijo — así que acá el caso "string vacío" sí está cubierto de forma explícita, a diferencia de QR/QRstyle. La promesa nunca rechaza.

### `codeBar/CodeBar.tsx` + `CodeBarGenerator.ts`

Este es el caso distinto del grupo. `CodeBar.tsx` sí usa factory nombrada, pero **sin `try/catch` propio**:

```tsx
const resolveCodeBarSrc = async (): Promise<string> =>
  generateCodeBarAsBase64({ value, format, ... })
```

Y `generateCodeBarAsBase64`, a diferencia de los otros tres generadores, **no traga sus errores** — los relanza explícitamente (`throw error instanceof Error ? error : new Error(String(error))`), y además valida el checksum EAN/UPC/CODE39 *antes* de su propio `try/catch`, lanzando `CodeBarChecksumError` sin atraparlo internamente.

Efecto práctico: si el valor tiene un checksum inválido, o si `canvas` no está disponible en Node, la promesa que recibe `<Image src={resolveCodeBarSrc}>` **se rechaza de verdad** — es el único paquete de los cuatro donde esto puede pasar. Según lo ya verificado en la nota anterior ("Factory lanza un error sin try/catch interno → el proceso tampoco truena; react-pdf captura el rechazo y continúa el render"), esto no debería romper el documento — el nodo `Image` del código de barras simplemente queda vacío — pero es el único paquete donde ese camino se ejerce en la práctica.

**Inconsistencia encontrada:** el comentario en `CodeBarGenerator.ts` dice *"CodeBar.tsx ya tiene su propio try/catch y muestra error.message"*, pero el `CodeBar.tsx` actual no tiene ningún `try/catch` — ese comentario quedó desactualizado respecto al código real. El único registro del error termina siendo el `console.error("Error generando código de barras:", error)` que ya hace el generador; no hay un mensaje contextual adicional del lado del componente como sí ocurre en el patrón que adoptaron `QR`/`ChartJS` según la nota previa.

### `icono/Icon.tsx`

No usa `<Image>` en absoluto — dibuja los iconos de Lucide con primitivas SVG síncronas de `@react-pdf/renderer` (`Path`, `Circle`, `Rect`, etc.) a partir de datos ya disponibles en memoria. No hay generación asíncrona ni `src` involucrado, así que el problema del `Promise` en `src` **no le aplica**.

## Discrepancias a resolver

1. **`QR.tsx` y `QRstyle.tsx` no siguen el patrón de factory nombrada** que la nota anterior (`por-que-no-falla-promise-src-de-qr.md`) documenta como la solución adoptada para los tres componentes de imágenes generadas (QR, QRstyle, ChartJS). En el código real de `plugins.zip`, solo `ChartJS.tsx` y `CodeBar.tsx` usan la factory; `QR.tsx` y `QRstyle.tsx` siguen pasando la promesa cruda. Funcionalmente ambos caminos son equivalentes para `resolveSource`, pero si la intención era unificar legibilidad (nombre explícito de la función = "esto se resuelve después"), ese refactor quedó pendiente en estos dos archivos.
2. **Comentario desactualizado en `CodeBarGenerator.ts`** que afirma que `CodeBar.tsx` tiene try/catch propio cuando no lo tiene.
3. **Único generador que puede rechazar una promesa hacia `<Image>` es `CodeBarGenerator.ts`** (checksum inválido o canvas no disponible) — vale la pena decidir a propósito si eso es deseado (fail-loud) o si conviene alinearlo con el resto (fail-silent con `""`/fallback), en vez de que sea una diferencia accidental entre paquetes.
4. **El caso `src` resuelto a string vacío `""`** (no `undefined`) no fue parte de la verificación empírica original — aplica a `QR.tsx`, `QRstyle.tsx` y, si fallaran ambas ramas, también a la cascada de `QRstyleGenerator.ts`. `ChartJS.tsx` es el único que lo cubre explícitamente con su propio chequeo y fallback a un píxel transparente.
