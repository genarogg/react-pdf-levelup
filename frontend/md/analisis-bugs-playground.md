# Análisis de Bugs y Mejoras — `viewer/playground` (y subcomponentes)

> Componente raíz analizado: `import Playground from "./components/viewer/playground"`
> Incluye: `index.tsx` (Editor), `CodeEditor.tsx`, `PDFPreview.tsx`, `ErrorDocument.tsx`, `MobileWarning.tsx`, `hooks/useMobileDetection.ts`, `toolbar/ToolBar.tsx`, `toolbar/ColorPicker.tsx`, `toolbar/QuickHelp.tsx`, `toolbar/funciones/dowloadTemplate.ts`, `utils/templateLoader.ts`, y `layout/Header.tsx` + `layout/TemplateSelector.tsx` (usados por `Editor`).

---

## 🔴 Críticos

### 1. `PDFPreview.tsx` — El compilador en vivo rompe SIEMPRE por identificador duplicado

**Archivo:** `PDFPreview.tsx`

```tsx
const componentNames = Object.keys(CoreComponents).filter(
  key => typeof CoreComponents[key] === "function" || typeof CoreComponents[key] === "object"
)

const filteredNames = componentNames.filter(
  name => !["Font", "Document", "Page", "Text", "View", "StyleSheet", "Image", "Link"].includes(name)
)

const moduleCode = `
  'use strict';
  const React = arguments[0];
  const { Document, Page, Text, View, StyleSheet, Image, Link, Font, Svg, Defs, Rect, LinearGradient, Stop, G } = arguments[1];
  const CoreComponents = arguments[2];
  const { ${filteredNames.join(", ")} } = CoreComponents;
  ...
`
```

`src/components/core/index.tsx` (el barrel de la librería) **re-exporta directamente** `Svg, Defs, Rect, LinearGradient, Stop, G` desde `@react-pdf/renderer` (además de `Font, Document, Page, Text, View, StyleSheet, Image, Link`). La lista de exclusión `filteredNames` solo descarta estos 8 últimos, pero **no** descarta `Svg, Defs, Rect, LinearGradient, Stop, G`.

Resultado: el `moduleCode` generado declara `Svg`, `Defs`, `Rect`, `LinearGradient`, `Stop` y `G` **dos veces como `const` en el mismo scope** → `SyntaxError: Identifier 'Svg' has already been declared`. Lo reproduje de forma aislada:

```js
const moduleCode = `
  const { Svg, Defs, Rect, LinearGradient, Stop, G } = arguments[1];
  const { Svg, Defs, Rect, LinearGradient, Stop, G } = arguments[2];
`;
new Function(moduleCode);
// ❌ SyntaxError: Identifier 'Svg' has already been declared
```

Como esto ocurre **en cada intento de compilación**, independientemente del código que escriba el usuario, el `catch` alrededor de `new Function(...)` lo atrapa y siempre termina mostrando `ErrorDocument` con "Error de ejecución: Identifier 'Svg' has already been declared" — **el Playground nunca puede previsualizar un PDF real**.

**Fix sugerido:** ampliar la lista de exclusión con todo lo que también viene de `@react-pdf/renderer` en `arguments[1]`:

```tsx
const REACT_PDF_PRIMITIVES = [
  "Font", "Document", "Page", "Text", "View", "StyleSheet",
  "Image", "Link", "Svg", "Defs", "Rect", "LinearGradient", "Stop", "G",
]
const filteredNames = componentNames.filter(name => !REACT_PDF_PRIMITIVES.includes(name))
```

---

### 2. `funciones/dowloadTemplate.ts` — Typo de casing rompe el import de `QRstyle` en el archivo descargado

```ts
const libraryComponents = {
    core: Object.keys(ReactPdfLevelup).filter(key => /^[A-Z]/.test(key)),
    qr: ['QR', 'QRStyle'],   // ⚠️ el componente real se llama "QRstyle" (minúscula la "s")
    chart: ['ChartJS']
}
```

El componente real (ver `components/core/qr/QRstyle.tsx`, su export en el barrel, y el propio autocompletado de `CodeEditor.tsx`) se llama **`QRstyle`**, no `QRStyle`. Esto provoca dos fallos encadenados:

1. `isComponentUsed('QRStyle', code)` nunca detecta `<QRstyle ...>` en el código (la comparación de string falla por la mayúscula/minúscula), así que `QRstyle` **nunca se agrega a `usedComponents.qr`**.
2. Como `"QRstyle"` (bien escrito) también aparece en `libraryComponents.core` (proviene del barrel completo de `@/components/core`), y la exclusión `!qrAndChartComponents.includes(component)` compara contra `'QRStyle'` (mal escrito) sin encontrar coincidencia, `QRstyle` **termina clasificado como componente de `core`**.

Consecuencia real: si el usuario descarga una plantilla que usa `<QRstyle>` (por ejemplo, la del propio autocompletado o la plantilla `QR.tsx`), el archivo `.tsx` descargado incluye:

```ts
import { 
      QRstyle,
      ...
    } from "@react-pdf-levelup/core";   // ❌ debería ser "@react-pdf-levelup/qr"
```

En un proyecto real con los paquetes de npm instalados, `QRstyle` no existe en `@react-pdf-levelup/core` (vive en el paquete `qr`), así que el archivo descargado **no compila**.

**Fix:** corregir el string a `'QRstyle'` en el arreglo `qr`.

---

## 🟠 Importantes

### 3. `CodeEditor.tsx` — Los proveedores de autocompletado nunca se destruyen (se duplican sugerencias)

```tsx
monaco.languages.registerCompletionItemProvider("javascript", { ... })
monaco.languages.registerCompletionItemProvider("typescript", { ... })
```

`registerCompletionItemProvider` devuelve un `IDisposable` que hay que guardar y llamar `.dispose()` cuando el editor se desmonta. Aquí no se guarda la referencia ni se limpia en el `useEffect` de desmontaje (que sí limpia el modelo y el editor, pero no estos providers).

Como en `viewer/playground/index.tsx` el `<CodeEditor>` se desmonta y remonta cada vez que cambia la plantilla vía URL (por el toggle de `isLoading`), **cada cambio de plantilla registra un nuevo par de providers sin eliminar los anteriores**. Efecto visible: si el usuario visita 3 plantillas distintas, cada etiqueta del autocompletado (`<P>`, `<Layout>`, `<QR>`, etc.) aparecerá **triplicada** en la lista de sugerencias.

**Fix:** guardar los `Disposable` devueltos y llamarlos en el cleanup:

```tsx
const jsProvider = monaco.languages.registerCompletionItemProvider("javascript", { ... })
const tsProvider = monaco.languages.registerCompletionItemProvider("typescript", { ... })
// guardar ambos en un ref y, en el useEffect de cleanup:
jsProvider.dispose()
tsProvider.dispose()
```

---

### 4. `CodeEditor.tsx` — `defaultValue` en vez de `value` (componente no controlado)

```tsx
<Editor
  height="100%"
  defaultLanguage="javascript"
  defaultValue={value}   // ⚠️
  ...
  onChange={handleEditorChange}
  onMount={handleEditorDidMount}
/>
```

`@monaco-editor/react` solo sincroniza el contenido del editor con el prop `value` si se usa el prop controlado `value`; con `defaultValue` el editor queda **no controlado** y solo lee ese valor en el montaje inicial. Hoy esto "funciona" porque `Editor` (el padre) desmonta y remonta `<CodeEditor>` completo cada vez que cambia el código por una carga de plantilla (gracias al toggle de `isLoading`). Pero es frágil: si en el futuro se quita ese gate de carga, o cualquier otra parte de la UI actualiza `code` mientras `CodeEditor` sigue montado, el editor **no reflejará el cambio visualmente** aunque el estado interno de la app sí lo tenga.

**Fix:** usar `value={value}` en vez de `defaultValue={value}`.

---

### 5. `CodeEditor.tsx` — La función de debounce se recrea en cada render

```tsx
const handleEditorChange = debounce((value: string | undefined) => {
  ...
}, 1000)
```

`debounce(...)` se ejecuta dentro del cuerpo del componente, así que en cada render se crea una instancia **nueva**, con su propia variable `timeoutId` aislada. Si `CodeEditor` llega a re-renderizarse mientras el usuario está escribiendo (por ejemplo, por un resize de ventana que dispara `useMobileDetection` y hace re-renderizar a todo `Editor`), el `clearTimeout` de la nueva instancia no cancela el `setTimeout` pendiente de la instancia anterior. Podrían dispararse dos `onChange` casi al mismo tiempo, uno con contenido más viejo, sobrescribiendo momentáneamente el código más reciente en el estado padre.

**Fix:** memoizar el debounce una sola vez con `useRef` o `useMemo(() => debounce(...), [])`, o usar un hook de debounce dedicado.

---

### 6. `hooks/useMobileDetection.ts` — Sin throttle/debounce en `resize`

```ts
window.addEventListener('resize', checkIfMobile)
```

Se reevalúa en cada evento de `resize` (docenas por segundo al arrastrar el borde de la ventana), sin ningún throttle/debounce. Combinado con la condición `window.innerWidth <= 768`, cualquier usuario de escritorio que reduzca el ancho de su ventana (o simplemente abra las DevTools acoplado al costado, reduciendo el viewport) por debajo de ese umbral **activa inmediatamente la pantalla completa `MobileWarning`**, interrumpiendo su sesión de edición sin previo aviso.

**Fix:** agregar debounce al handler de `resize`, y/o usar `matchMedia` con un listener de cambio en vez de recalcular en cada pixel de resize.

---

### 7. `ColorPicker.tsx` — Comportamiento inconsistente entre los 3 modos de selección

**7a. El `<input type="color">` nativo no guarda en "Recent Colors":**

```tsx
const handleColorChange = (e) => {
  const color = e.target.value
  setSelectedColor(color)
  onColorSelect?.(color)
  // ⚠️ falta pushRecentColor(color)
}
```

Comparar con `selectColor` (usada por la paleta, el campo hex y los recientes), que sí llama `pushRecentColor`. Elegir un color con la rueda de color nativa —probablemente la forma más común de elegir un color personalizado— nunca queda registrado como "reciente".

**7b. El campo de texto hex contamina "Recent Colors" con valores incompletos:**

```tsx
<Input
  value={selectedColor}
  onChange={(e: any) => selectColor(e.target.value)}
  ...
/>
```

`selectColor` llama a `pushRecentColor` en **cada pulsación de tecla**, sin validar que sea un hex completo/válido. Al escribir manualmente un color (por ejemplo `#3d65fd`), cada estado intermedio (`#`, `#3`, `#3d`, `#3d6`...) se empuja a la lista de recientes. Como solo se conservan 5 colores (`slice(0, 4)` + el nuevo), esto puede desplazar y perder colores realmente útiles con fragmentos basura de una escritura a medio terminar.

**Fix:** validar con algo como `/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/` antes de llamar `pushRecentColor`, y solo confirmar en `onBlur` o al presionar Enter en vez de en cada `onChange`. Añadir `pushRecentColor(color)` también en `handleColorChange`.

---

## 🟡 Menores / mejoras

### 8. `ToolBar.tsx` — La barra flotante se centra respecto al viewport completo, no al panel del editor

```tsx
<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
```

`ToolBar` vive dentro de la columna izquierda (`w-1/2`, el editor), pero al usar `position: fixed` con `left-1/2 -translate-x-1/2`, Tailwind lo centra respecto al **viewport completo**, no respecto a su contenedor `w-1/2`. Visualmente termina flotando justo sobre la línea divisoria entre el editor y la vista previa del PDF, mitad sobre cada panel, en vez de quedar centrado dentro del panel del editor como parece ser la intención.

**Fix:** posicionar en función del ancho del panel (por ejemplo `left-1/4` ya que el panel ocupa el 50% izquierdo, o envolver en un contenedor `relative` propio del panel en vez de `fixed` respecto a toda la pantalla).

---

### 9. `viewer/playground/index.tsx` — Visitar cualquier plantilla sobrescribe el "último código" guardado

```tsx
useEffect(() => {
  if (!isLoading) {
    localStorage.setItem(STORAGE_KEY, code)
  }
}, [code, isLoading])
```

Este efecto guarda en `localStorage` cualquier valor de `code`, **incluyendo el que proviene de cargar una plantilla por `:templateId`** (no solo el código propio del usuario en `/playground` sin id). Si el usuario tenía código personalizado sin guardar en otra pestaña y visita cualquier `/playground/template/:id` (por ejemplo, desde la home), ese click **sobrescribe silenciosamente** la clave `"react-pdf-levelup-code"` compartida, y la próxima vez que abra `/playground` a secas verá el código de la plantilla en lugar de su propio trabajo.

**Fix:** usar una clave de `localStorage` distinta para "código actual libre" vs "última plantilla vista", o simplemente no persistir cuando la carga provino de un `templateId` explícito en la URL.

---

### 10. Prop `showPageNumbers` inexistente sigue sugerida por el autocompletado

```tsx
{
  label: "Layout",
  insertText: '<Layout size="A4" orientation="v" showPageNumbers={true}>\n\n</Layout>',
  kind,
},
```

Ya documentado en el análisis general del proyecto: el componente real `Layout` no tiene una prop `showPageNumbers` (la prop real es `pagination`). Como esto vive en `CodeEditor.tsx`, cualquier usuario que use el autocompletado de Tab para insertar un `<Layout>` obtiene una prop que **se ignora silenciosamente** (Babel solo transpila, no valida tipos).

**Fix:** cambiar el snippet a `pagination={true}`.

---

### 11. `utils/templateLoader.ts` — Comentario desactualizado / `BASE_URL` nunca usado

```ts
// Use Vite's import.meta.env.BASE_URL to ensure correct path resolution
const response = await fetch(templatePath)
```

El comentario indica una intención (usar `import.meta.env.BASE_URL` para resolver rutas correctamente bajo un base path distinto de `/`) que nunca se implementó — el `fetch` usa la ruta absoluta tal cual. Si el sitio alguna vez se despliega bajo un subpath, la carga de plantillas se rompería.

**Fix:** `fetch(`${import.meta.env.BASE_URL}${templatePath.replace(/^\//, "")}`)` o eliminar el comentario si no aplica.

---

### 12. `funciones/dowloadTemplate.ts` — La heurística de "nombre exportable" puede elegir un subcomponente auxiliar

Cuando el código no tiene `export default` explícito, y ninguno de los `preferredNames` hardcodeados (`Component`, `InvoiceTemplate`, etc.) coincide, se usa:

```ts
const genericConst = templateCode.match(/\bconst\s+([A-Z][A-Za-z0-9_]*)\s*=/);
```

Este `match` (sin `/g`) toma el **primer** `const CapitalCase = ...` que aparece en el archivo. En plantillas con subcomponentes auxiliares declarados antes del componente principal (patrón usado, por ejemplo, en `facturaInvoice.tsx` con `Header`, `Title`, `Menu`, etc.), esto podría exportar por error el primer subcomponente en vez del componente principal.

**Fix:** preferir el *último* `const` con mayúscula, o buscar específicamente el que se usa como elemento raíz de un `return (<Layout>...)`.

---

## Resumen priorizado

| # | Severidad | Archivo | Resumen |
|---|---|---|---|
| 1 | 🔴 Crítico | `PDFPreview.tsx` | `SyntaxError` por identificador duplicado — rompe la previsualización en el 100% de los casos |
| 2 | 🔴 Crítico | `funciones/dowloadTemplate.ts` | Typo `QRStyle`/`QRstyle` rompe el import del archivo descargado |
| 3 | 🟠 Importante | `CodeEditor.tsx` | Providers de autocompletado nunca se destruyen → sugerencias duplicadas |
| 4 | 🟠 Importante | `CodeEditor.tsx` | `defaultValue` en vez de `value` (no controlado) |
| 5 | 🟠 Importante | `CodeEditor.tsx` | Debounce recreado en cada render |
| 6 | 🟠 Importante | `useMobileDetection.ts` | Sin throttle en `resize`, interrumpe a usuarios de escritorio |
| 7 | 🟠 Importante | `ColorPicker.tsx` | Selector nativo no guarda recientes + campo hex contamina recientes con valores incompletos |
| 8 | 🟡 Menor | `ToolBar.tsx` | Barra flotante centrada respecto al viewport, no al panel |
| 9 | 🟡 Menor | `playground/index.tsx` | Visitar una plantilla sobrescribe el código guardado del usuario |
| 10 | 🟡 Menor | `CodeEditor.tsx` | Prop inexistente `showPageNumbers` en el snippet de `Layout` |
| 11 | 🟡 Menor | `templateLoader.ts` | Comentario sobre `BASE_URL` nunca implementado |
| 12 | 🟡 Menor | `dowloadTemplate.ts` | Heurística de nombre exportable puede elegir un subcomponente auxiliar |
