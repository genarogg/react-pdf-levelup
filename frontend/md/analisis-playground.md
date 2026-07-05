

### 7. Typo `"playgroud"` en el `context` pasado al `Header`

**Archivo(s) afectado(s):** `index.tsx` (línea 28)

**Problema:**

```tsx
<Header code={code} context="playgroud" />
```

Falta la "n". Si `Header` (componente externo a este módulo, en `@/components/viewer/layout/Header`) hace alguna comparación exacta contra el string `"playground"` en algún punto de su lógica interna, esta condición **nunca se cumplirá**, y cualquier comportamiento pensado para el contexto del playground quedaría silenciosamente deshabilitado. No se pudo confirmar el impacto exacto sin ver `Header.tsx`, pero es el tipo de typo que produce bugs invisibles y difíciles de rastrear.

**Refactor sugerido:** corregir a `context="playground"` y, si es posible, tipar `context` como un union type (`"playground" | "editor" | ...`) en `Header` para que TypeScript detecte este tipo de error en compilación en vez de en runtime.

**Esfuerzo:** 🟢 bajo
**Impacto:** 🟡 medio-alto (condicionado a cómo use `Header` ese valor — vale la pena verificar)

---

### 8. El panel de QuickHelp no se cierra al hacer clic afuera

**Archivo(s) afectado(s):** `QuickHelp.tsx`, comparar con `ColorPicker.tsx` (líneas 67-81)

**Problema:** `ColorPicker` sí implementa un listener de `mousedown` sobre `document` para cerrarse al hacer clic afuera del panel. `QuickHelp`, que abre un panel bastante más grande (900px de ancho), no tiene ese mismo comportamiento — solo se cierra volviendo a pulsar el botón de ayuda. Es una inconsistencia de UX entre dos widgets que viven en la misma barra y se comportan de forma distinta ante la misma interacción esperada.

**Refactor sugerido:** extraer el patrón "cerrar al hacer clic afuera" a un hook reutilizable y aplicarlo en ambos:

```ts
function useClickOutside(ref: React.RefObject<HTMLElement>, onOutside: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside()
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [active, onOutside])
}
```

**Esfuerzo:** 🟢 bajo
**Impacto:** 🟢 bajo-medio — pulido de UX, no bloquea el uso

---

### 9. Snippet de autocompletado `<A>` usa el placeholder `$5` en vez de `$1`

**Archivo(s) afectado(s):** `utils/monacoSnippets.ts` (línea 26)

**Problema:**

```ts
const etiquetaConAtributo = (label: string, atributo?: string) => {
  return {
    label,
    insertText: `<${label} ${atributo ? atributo : ""}>$5</${label}>`,
    kind,
    insertTextRules,
  }
}
```

Todas las demás funciones factory (`etiqueta`, `etiquetaConSalto`, `etiquetaAutoConclusiva`) usan `$1` como placeholder del cursor. Esta usa `$5`, casi seguro un copy-paste de otro snippet. Hoy "funciona" porque es el único placeholder del snippet, pero es una inconsistencia que puede confundir a quien luego quiera agregar un segundo placeholder (por ejemplo, uno para el `href`) y no entienda por qué el orden de tabulación salta de `$1` a `$5`.

**Refactor sugerido:** cambiar `$5` por `$1` para mantener la convención del resto del archivo.

**Esfuerzo:** 🟢 bajo
**Impacto:** 🟢 bajo

---

## Fase 2 — Seguridad

### 10. El código del usuario se ejecuta sin sandbox, en el hilo principal y con acceso total a la sesión

**Archivo(s) afectado(s):** `PDFPreview.tsx` (líneas 82-143), `CodeEditor.tsx` (comentario línea 80-82)

**Problema:** el código escrito en el editor se transforma con Babel y luego se ejecuta con:

```ts
const evalFn = new Function(moduleCode)
CustomComponent = evalFn(React, CoreComponents)
```

`new Function(...)` compila y ejecuta el código en el **scope global** de la página (no en un scope aislado real), no en un *Web Worker* ni en un `<iframe>` con `sandbox`. Esto tiene dos consecuencias distintas, cada una con su propio disparador:

1. **Fiabilidad, sin necesidad de mala intención:** cualquier error de tipeo que genere un loop infinito o una recursión sin corte (`while(true){}`, un componente que se renderiza a sí mismo, etc.) **congela el hilo principal de toda la pestaña**, no solo el playground. El usuario pierde la sesión de trabajo y probablemente el código no guardado (si el freeze ocurre antes de que el debounce de `localStorage` llegue a ejecutarse).
2. **Seguridad, si hay intención maliciosa:** si este playground convive en el mismo origen que el resto de la aplicación autenticada (así lo sugiere el import de `Header` desde `@/components/viewer/layout/Header`), cualquier código pegado en el editor tiene acceso a `document`, `window`, `localStorage`, cookies no-`httpOnly` y puede hacer `fetch` autenticado contra el backend de la app. Es el mismo vector que los ataques de "self-XSS" (pegar código sugerido por un tercero, disfrazado de "plantilla" o "componente extra"), adaptado a este contexto ("pegá este snippet para desbloquear este diseño").

**Refactor sugerido:** este es un cambio de arquitectura, no un one-liner — la recomendación estándar (la misma que usan CodeSandbox, StackBlitz, JSFiddle) es mover la compilación/ejecución a un `<iframe>` con `sandbox="allow-scripts"` **sin** `allow-same-origin`, comunicándose con `postMessage`, de forma que el código del usuario corra en un origen opaco sin acceso a cookies/localStorage del padre. Como paso intermedio de menor esfuerzo, al menos:
- Envolver la ejecución en un `Promise.race` con un timeout, para evitar que un loop infinito cuelgue la pestaña indefinidamente.
- Evaluar si el resto de la arquitectura del producto justifica priorizar el iframe con sandbox antes que el timeout (el timeout no evita la exfiltración de datos, solo el freeze).

**Esfuerzo:** 🔴 alto (sandboxing real) — 🟡 medio si solo se agrega el timeout como mitigación parcial
**Impacto:** 🔴 alto — congelamiento de sesión de trabajo (garantizado, sin necesidad de ataque) + riesgo de exposición de sesión (condicionado a un actor malicioso)

---

### 11. `loadTemplateFile` acepta URLs absolutas sin validar el origen

**Archivo(s) afectado(s):** `utils/templateLoader.ts` (líneas 9-15)

**Problema:**

```ts
const resolveUrl = (path: string) => {
  if (/^https?:\/\//i.test(path)) return path
  // ...
}
```

Hoy `templatePath` viene de `/templates/index.json`, un archivo estático propio de la app, así que el riesgo inmediato es bajo. Pero esta función no valida el origen: si en el futuro ese índice de plantillas pasa a ser editable (un marketplace de plantillas, un CMS, contenido subido por otro usuario), cualquier entrada con una URL externa sería *fetcheada* y su contenido pasaría directo al pipeline de Babel + `new Function` del hallazgo #10 — combinando ambos problemas en un vector de inyección de código bastante directo.

**Refactor sugerido:** restringir `loadTemplateFile` a rutas relativas del propio origen, o si se necesita soportar URLs externas, validarlas contra un allowlist explícito de dominios de confianza.

**Esfuerzo:** 🟡 medio
**Impacto:** 🟡 medio — bajo riesgo hoy, pero es deuda de seguridad "silenciosa" para el día que este flujo cambie

---

## Fase 3 — Refactor y segmentación en componentes/funciones más pequeñas

### 12. `compileCode` concentra 5 responsabilidades distintas en una sola función no testeable

**Archivo(s) afectado(s):** `PDFPreview.tsx` (líneas 31-162)

**Problema:** una sola función de más de 130 líneas hace, en orden: (1) limpiar imports/exports con regex, (2) detectar y normalizar el `export default`, (3) transformar TS/TSX con Babel, (4) armar el string del módulo con los componentes inyectados, (5) evaluarlo y validar el resultado. Al vivir todo dentro de un `useCallback` atado a un componente de React, **no se puede escribir un test unitario** de "dado este string de código, ¿qué componente/error produce?" sin montar todo `PDFPreview` con mocks de `@react-pdf/renderer`.

**Refactor sugerido:** extraer la lógica pura (sin React) a un módulo `utils/compilePlaygroundCode.ts`:

```ts
// utils/compilePlaygroundCode.ts
export function stripImportsAndExports(code: string): string { /* ... */ }
export function normalizeDefaultExport(code: string): { code: string; found: boolean } { /* ... */ }
export function transformWithBabel(code: string): string { /* puede lanzar */ }
export function buildModule(code: string, componentNames: string[]): string { /* ... */ }
export function evaluateModule(moduleCode: string, React: typeof import("react"), CoreComponents: object) { /* ... */ }
```

`PDFPreview.tsx` quedaría enfocado solo en orquestar (debounce, `isCompiling`, manejo de estado de error), delegando el "compilar string a componente" a funciones puras, testeables con Jest/Vitest sin necesidad de renderizar nada.

**Esfuerzo:** 🔴 alto
**Impacto:** 🟡 medio-alto — no cambia nada para el usuario final, pero es la diferencia entre poder testear esta lógica crítica o no poder hacerlo

---

### 13. Registro de completion providers duplicado literalmente para JS y TS

**Archivo(s) afectado(s):** `CodeEditor.tsx` (líneas 96-133)

**Problema:**

```ts
const jsProvider = monaco.languages.registerCompletionItemProvider("javascript", {
  provideCompletionItems: (model, position) => { /* ~15 líneas */ }
})
const tsProvider = monaco.languages.registerCompletionItemProvider("typescript", {
  provideCompletionItems: (model, position) => { /* las mismas ~15 líneas, copiadas */ }
})
```

El cuerpo de `provideCompletionItems` está copiado literalmente. Cualquier cambio futuro a esa lógica obliga a recordar tocar los dos bloques — y ya se ve el patrón de que eso se olvida (ver el `$5` del hallazgo #9, un síntoma del mismo tipo de deuda por duplicación).

**Refactor sugerido:**

```ts
const provideCompletionItems = (model: any, position: any) => {
  const word = model.getWordUntilPosition(position)
  const range = {
    startLineNumber: position.lineNumber,
    endLineNumber: position.lineNumber,
    startColumn: word.startColumn,
    endColumn: word.endColumn,
  }
  return { suggestions: customTags.map((tag) => ({ ...tag, range })) }
}

completionProvidersRef.current = ["javascript", "typescript"].map((lang) =>
  monaco.languages.registerCompletionItemProvider(lang, { provideCompletionItems })
)
```

**Esfuerzo:** 🟢 bajo
**Impacto:** 🟡 medio — mantenibilidad, evita que la lógica de sugerencias diverja entre lenguajes sin querer

---

### 14. `downloadTemplate` mezcla detección, construcción de imports y descarga en una función de 127 líneas

**Archivo(s) afectado(s):** `toolbar/funciones/dowloadTemplate.ts`

**Problema:** una única función hace: detectar componentes usados por librería (core/qr/chart), detectar componentes declarados localmente para excluirlos, armar el texto de los imports, y finalmente disparar la descarga del archivo vía Blob. Es lógica de negocio (qué componentes se usan) mezclada con un efecto de navegador (crear un link, clickearlo, revocar la URL).

**Refactor sugerido:** separar en funciones puras + una función de efecto:

```ts
function detectUsedComponents(code: string, libraryComponents: LibraryComponents): UsedComponents { /* ... */ }
function buildImportsSection(usedComponents: UsedComponents): string { /* ... */ }
function downloadTextFile(filename: string, content: string, mimeType = "text/plain") {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
```

`downloadTextFile` queda como un util genérico reutilizable para cualquier otra función de "descargar archivo" que aparezca en el futuro en la app, y `detectUsedComponents`/`buildImportsSection` quedan testeables con strings de entrada/salida simples.

**Esfuerzo:** 🟡 medio
**Impacto:** 🟡 medio — mantenibilidad y reutilización

---

### 15. Lógica de "copiar al portapapeles" duplicada (con distinta calidad) entre ColorPicker y QuickHelp

**Archivo(s) afectado(s):** `ColorPicker.tsx` (líneas 96-100), `QuickHelp.tsx` (líneas 83-101)

**Problema:** dos implementaciones distintas de la misma acción (copiar texto al portapapeles), una completa (con fallback y manejo de errores) y otra incompleta (ver hallazgo #4). Es exactamente el tipo de duplicación que hace que un fix aplicado en un lugar se olvide en el otro.

**Refactor sugerido:** extraer un hook compartido:

```ts
// hooks/useClipboard.ts
export function useClipboard(timeout = 1500) {
  const [copiedKey, setCopiedKey] = useState<string | number | null>(null)

  const copy = async (text: string, key: string | number) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      try { document.execCommand("copy") } finally { document.body.removeChild(textarea) }
    }
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), timeout)
  }

  return { copiedKey, copy }
}
```

Usado igual en ambos componentes, resuelve de una vez el bug #4 y elimina la duplicación.

**Esfuerzo:** 🟢 bajo
**Impacto:** 🟡 medio — arregla un bug y reduce deuda técnica en el mismo cambio

---

### 16. La tarjeta de documentación de cada componente podría extraerse de `QuickHelp`

**Archivo(s) afectado(s):** `QuickHelp.tsx` (líneas 157-222)

**Problema:** dentro del `.map()` sobre `activeDocs`, hay ~65 líneas de JSX (título, descripción, tabla de props, bloque de ejemplo con su botón de copiar) inline en el componente principal. `QuickHelp.tsx` ya tiene 233 líneas mezclando estado de tabs/idioma, el panel flotante y el renderizado de cada tarjeta.

**Refactor sugerido:** extraer a `ComponentDocCard.tsx`, recibiendo `component: ComponentDoc`, `labels` de i18n y el callback de copiado:

```tsx
function ComponentDocCard({ component, labels, onCopyExample, isCopied }: ComponentDocCardProps) {
  // el JSX de la tarjeta individual
}
```

`QuickHelp.tsx` queda enfocado en tabs/idioma/panel, delegando el detalle visual de cada componente.

**Esfuerzo:** 🟡 medio
**Impacto:** 🟢 bajo — mejora de legibilidad, sin cambio de comportamiento

---

## Fase 4 — Código muerto y limpieza

### 17. La rama `!inline` de `QuickHelp` nunca se ejecuta

**Archivo(s) afectado(s):** `QuickHelp.tsx` (línea 108), `ToolBar.tsx` (línea 15)

**Problema:** `QuickHelp` soporta un prop `inline` que cambia entre posicionamiento `fixed` o `relative`, pero el único lugar donde se usa el componente en toda la app es `<QuickHelp inline />` — la rama `"fixed bottom-6 left-1/2 -translate-x-1/2 z-50"` es código muerto.

**Refactor sugerido:** si no hay planes de usar `QuickHelp` fuera de la barra de herramientas, eliminar el prop `inline` y dejar fijo el `className` a la variante `relative`. Si sí hay planes de reutilizarlo standalone, al menos dejarlo documentado con un comentario.

**Esfuerzo:** 🟢 bajo
**Impacto:** 🟢 bajo

---

### 18. El prop `onColorSelect` de `ColorPicker` nunca se conecta

**Archivo(s) afectado(s):** `ColorPicker.tsx` (línea 6), `ToolBar.tsx` (línea 16)

**Problema:** `ColorPicker` acepta un callback `onColorSelect?: (color: string) => void` pensado, aparentemente, para insertar el color elegido en algún lado (lo más natural: en el cursor del editor de código). Se renderiza como `<ColorPicker />`, sin pasar ese callback desde ningún punto de la app. Hoy el widget solo sirve para elegir un color y copiarlo manualmente al portapapeles — una funcionalidad válida por sí sola, pero el prop sin usar sugiere una integración incompleta.

**Refactor sugerido:** dos caminos válidos, a decidir según la intención original del feature:
- **Conectarlo de verdad:** pasar un callback desde `ToolBar`/`index.tsx` que inserte el color (ej. `"#3366cc"`) en la posición actual del cursor del `CodeEditor`, agregando mucho más valor al widget (hoy el usuario tiene que copiar y pegar manualmente).
- **Eliminarlo:** si el picker es intencionalmente solo una referencia visual de colores para copiar, quitar el prop `onColorSelect` no usado para no sugerir una integración que no existe.

**Esfuerzo:** 🟡 medio (conectarlo) / 🟢 bajo (eliminarlo)
**Impacto:** 🟡 medio — es una funcionalidad "a medio camino" bastante visible en la UI

---

### 19. Líneas comentadas sin explicación en `monacoSnippets.ts`

**Archivo(s) afectado(s):** `utils/monacoSnippets.ts` (líneas 83, 104-106)

**Problema:**

```ts
// etiquetaConSalto("Container"),
// ...
//etiquetaConSalto("Header"),
//etiquetaConSalto("Main"),
//etiquetaConSalto("Footer"),
```

Código comentado sin ningún comentario explicando por qué esos tags específicos están deshabilitados mientras el resto de las ~50 etiquetas sí están activas. Si es intencional (por ejemplo, porque colisionan con algo, o porque esos componentes no están disponibles todavía), vale la pena decirlo explícitamente; si no, es basura que quedó de una iteración anterior.

**Refactor sugerido:** si son etiquetas descartadas a propósito, agregar un comentario explicando el motivo; si no, eliminarlas.

**Esfuerzo:** 🟢 bajo
**Impacto:** 🟢 bajo

---

### 20. Debounce interno de 300ms en `PDFPreview` probablemente redundante

**Archivo(s) afectado(s):** `PDFPreview.tsx` (líneas 164-181), `CodeEditor.tsx` (línea 40)

**Problema:** `CodeEditor` ya debounce el `onChange` 1000ms antes de propagar el nuevo `code` hacia arriba. `PDFPreview` recibe ese `code` ya debounceado y le aplica **otro** debounce interno de 300ms antes de compilar. El resultado es una demora total de ~1.3s entre que el usuario deja de escribir y ve el PDF actualizado, sin que el segundo debounce aporte gran cosa (dado que `code` ya solo cambia, como mucho, una vez por segundo).

También se descubrió, revisando esta misma zona, que la bandera `isFirstRenderRef` — pensada para saltarse el debounce en el primer render — **nunca cumple su propósito real**: `PDFPreview` se monta con `code=""` (la plantilla real llega después, de forma asíncrona), así que la única vez que la bandera está en `true` el `code` está vacío y no hay nada que compilar; para cuando llega el contenido real, la bandera ya se consumió y el compilado pasa igual por el debounce de 300ms.

**Refactor sugerido:** evaluar si el debounce interno de 300ms sigue aportando valor real (por ejemplo, si en el futuro `code` puede cambiar sin pasar por el debounce de `CodeEditor`, como al cargar una plantilla). Si no, simplificar removiéndolo, o al menos remover la lógica de `isFirstRenderRef` ya que no genera ningún efecto observable hoy.

**Esfuerzo:** 🟢 bajo
**Impacto:** 🟢 bajo — no es incorrecto, es complejidad sin beneficio medible

---

### 21. Nombre de archivo con typo: `dowloadTemplate.ts`

**Archivo(s) afectado(s):** `toolbar/funciones/dowloadTemplate.ts`

**Problema:** falta la "n" en "download". El export sí se llama correctamente `downloadTemplate`, pero el nombre del archivo no, lo que dificulta encontrarlo al buscar "download" en el proyecto.

**Refactor sugerido:** renombrar a `downloadTemplate.ts` y actualizar el único import en `ToolBar.tsx`.

**Esfuerzo:** 🟢 bajo
**Impacto:** 🟢 bajo

---

## Fase 5 — Mejoras generales (type-safety, robustez, mantenibilidad)

### 22. Uso de `any` y `as any` en puntos clave del editor

**Archivo(s) afectado(s):** `CodeEditor.tsx` (líneas 13, 45, 53, 63, 97, 117, 169), `index.tsx` (línea 41)

**Problema:** `editor`, `monaco`, `model`, `position` y los eventos del editor están tipados como `any` en varios puntos, y hay tres casts explícitos `as any` (paste listener x2, y `onChange={setCode as any}` en `index.tsx`). Este último caso en particular es evitable: la interfaz de `CodeEditor` declara `onChange: (value: string | undefined) => void`, pero internamente el propio componente ya filtra el `undefined` antes de invocar el callback (`if (value === undefined) return`) — es decir, el consumidor real nunca recibe `undefined`, pero el tipo público sí lo permite, obligando al cast en `index.tsx` para poder pasarle `setCode` (que espera solo `string`) directamente.

**Refactor sugerido:**
- Tipar `editor` como `editor.IStandaloneCodeEditor` y `monaco` como `Monaco` (ambos exportados por `@monaco-editor/react`), eliminando la mayoría de los `any`.
- Ajustar la interfaz pública a lo que realmente se emite:

```ts
interface CodeEditorProps {
  value: string
  onChange: (value: string) => void // ya no undefined: se filtra internamente
}
```

  Esto permite pasar `onChange={setCode}` sin cast en `index.tsx`.

**Esfuerzo:** 🟡 medio
**Impacto:** 🟡 medio — recupera las garantías de TypeScript que hoy se están evitando activamente con los casts

---

### 23. `URL.revokeObjectURL` inmediatamente después del click de descarga

**Archivo(s) afectado(s):** `toolbar/funciones/dowloadTemplate.ts` (líneas 112-124)

**Problema:** se revoca la URL del Blob en el mismo tick que se dispara `a.click()`. En la mayoría de los navegadores modernos esto funciona porque la descarga se inicia de forma síncrona, pero es un patrón frágil documentado como propenso a fallar en algunos casos (particularmente en Firefox con archivos grandes).

**Refactor sugerido:** dar un margen mínimo antes de revocar:

```ts
a.click()
document.body.removeChild(a)
setTimeout(() => URL.revokeObjectURL(url), 0)
```

**Esfuerzo:** 🟢 bajo
**Impacto:** 🟢 bajo — hardening preventivo, no hay evidencia de que esté fallando hoy

---

### 24. Documentación ES/EN duplicada línea por línea

**Archivo(s) afectado(s):** `toolbar/quickHelp/componentDocs_es.ts`, `toolbar/quickHelp/componentDocs_en.ts` (558 líneas cada uno)

**Problema:** ambos archivos están hoy correctamente sincronizados (se verificó que documentan exactamente los mismos 34 componentes), pero la estructura obliga a mantener dos archivos casi idénticos en paralelo — agregar o modificar un componente significa editar dos archivos grandes reflejando exactamente los mismos cambios de estructura. No es un bug hoy, pero es un punto de fricción/riesgo de "drift" a futuro a medida que la librería crezca.

**Refactor sugerido (no urgente):** separar lo que es estructura (nombres de props, tipos, defaults — técnicamente iguales en ambos idiomas) de lo que es contenido traducible (descripciones, ejemplos con texto visible). Por ejemplo, una única fuente con claves de traducción:

```ts
// un solo archivo con la estructura + claves i18n
// y un diccionario separado { es: {...}, en: {...} } solo para los textos
```

Esto es más una mejora de arquitectura de datos a mediano plazo que un problema urgente.

**Esfuerzo:** 🔴 alto (si se hace bien, requiere replantear el formato de datos)
**Impacto:** 🟢 bajo — mejora de mantenibilidad a futuro, cero impacto visible hoy
