# Plan de Refactor — `src/components/viewer/playground/`

> Basado en lectura línea por línea de todos los archivos de la carpeta `playground/` (10 archivos, ~1.100 líneas) del `frontend.zip` actual, cruzado con `analisis-proyecto-react-pdf-levelup.md`. Cada punto fue verificado directamente en el código, no solo copiado del informe previo.

## Cómo leer este documento

Cada hallazgo tiene:
- **Archivo(s)** afectado(s)
- **Problema**: qué está mal y por qué importa
- **Refactor sugerido**: el cambio concreto
- **Esfuerzo**: 🟢 bajo (minutos) · 🟡 medio (1-2h) · 🔴 alto (medio día+)
- **Impacto**: qué tan visible es el beneficio para el usuario final o para quien mantiene el código

Están ordenados por prioridad dentro de cada fase.

---

## Fase 1 — Quick wins (bugs de una línea, alto impacto para el usuario)

Estos ya estaban documentados como "bugs" en el análisis previo, pero los agrupo aquí porque son, ante todo, **oportunidades de refactor de nomenclatura**: el problema de fondo es que no hay una única fuente de verdad para los nombres de componentes, así que la documentación y el código real divergieron.

### 1.1 — `QRStyle` vs `QRstyle` (casing)
- **Archivos**: `toolbar/QuickHelp.tsx` (líneas ~500, ~540), `toolbar/funciones/dowloadTemplate.ts` (línea 8)
- **Problema**: el componente real exportado es `QRstyle` (verificado en `core/index.tsx`). La ayuda y el botón "Descargar" usan `QRStyle`. Cualquiera que copie el ejemplo del panel de ayuda obtiene un PDF de error; cualquier descarga que use `QRstyle` genera un import roto (`@react-pdf-levelup/core` en vez de `@react-pdf-levelup/qr`, y sin agregar `QRstyle` al import correcto).
- **Refactor sugerido**: corregir el string a `'QRstyle'` en ambos archivos. Además, considerar derivar `libraryComponents.qr`/`chart` de un único array compartido (ver 2.4) para que este tipo de typo sea imposible de reintroducir.
- **Esfuerzo**: 🟢 · **Impacto**: 🔴 Alto

### 1.2 — Autocompletado genera `<Textarea>` pero el componente real es `TextArea`
- **Archivo**: `CodeEditor.tsx` (línea 199)
- **Problema**: `etiquetaAutoConclusiva("Textarea", ...)` — con minúscula — mientras que `core` exporta `TextArea`. Aceptar el autocompletado (el flujo más común del Playground) produce `ReferenceError: Textarea is not defined`.
- **Refactor sugerido**: cambiar a `etiquetaAutoConclusiva("TextArea", ...)`.
- **Esfuerzo**: 🟢 · **Impacto**: 🔴 Alto (rompe el propio flujo de autocompletar-y-usar)

### 1.3 — `QuickHelp.tsx` documenta un componente `Header` que no existe
- **Archivo**: `toolbar/QuickHelp.tsx` (pestaña "Page", ~línea 559)
- **Problema**: no hay ningún `Header.tsx` en `components/core`. Es coherente con que en `CodeEditor.tsx` las entradas para `Header`/`Main`/`Footer` estén comentadas — parecen componentes planeados y nunca implementados.
- **Refactor sugerido**: quitar la entrada de `componentDocs.page` (o implementar el componente si sigue en el roadmap).
- **Esfuerzo**: 🟢 · **Impacto**: 🟡 Medio

### 1.4 — Prop `lines` documentada en vez de `footerLines`
- **Archivo**: `toolbar/QuickHelp.tsx` (pestaña "Page", ~línea 568)
- **Problema**: la prop real de `Layout` es `footerLines` (confirmado en `core/basic/layout/Layout.tsx`). La propia pestaña "Layout" del mismo archivo sí lo documenta bien — es una inconsistencia interna. Con `lines`, la prop se ignora silenciosamente (Babel no valida tipos en tiempo de ejecución).
- **Refactor sugerido**: cambiar `lines` → `footerLines` en el ejemplo y en la tabla de props de esa entrada.
- **Esfuerzo**: 🟢 · **Impacto**: 🟡 Medio

---

## Fase 2 — Estructura y mantenibilidad (el núcleo del refactor)

### 2.1 — `QuickHelp.tsx`: 723 líneas, de las cuales ~560 son datos estáticos mezclados con el componente
- **Archivo**: `toolbar/QuickHelp.tsx`
- **Problema**: el objeto `componentDocs` (con toda la documentación de props y ejemplos de cada componente, para 8 pestañas) está definido **dentro** del cuerpo del componente React, lo que significa que:
  1. Se reconstruye por completo en cada render (aunque es un literal estático que nunca cambia).
  2. Es imposible de testear o reutilizar de forma aislada.
  3. Usa `any` en varios puntos (`componentDocs[activeTab]` con `@ts-ignore`, `component: any`, `prop: any`), perdiendo cualquier chequeo de tipos que hubiera detectado los bugs de la Fase 1 en tiempo de compilación.
  4. El archivo mezcla "contenido" (textos de documentación) con "UI" (JSX de tabs, tablas, botones de copiar), dificultando que alguien no-técnico edite la documentación sin tocar código de React.
- **Refactor sugerido**:
  ```
  toolbar/quickHelp/
  ├── QuickHelp.tsx           # solo UI: tabs, panel, tabla de props, botón copiar
  ├── componentDocs.ts        # el objeto de datos, tipado explícitamente
  └── types.ts                # ComponentDoc, PropDoc, TabId
  ```
  Con un tipo como:
  ```ts
  export type TabId = "layout" | "text" | "table" | "position" | "lists" | "media" | "page" | "fonts"

  export interface PropDoc {
    name: string
    type: string
    default?: string
    description: string
  }

  export interface ComponentDoc {
    name: string
    description: string
    props: PropDoc[]
    example: string
  }

  export const componentDocs: Record<TabId, ComponentDoc[]> = { ... }
  ```
  Esto elimina el `@ts-ignore` de la línea 604 y hace que TypeScript señale en rojo, por ejemplo, un `example` que use una prop no declarada — exactamente el tipo de bug de la Fase 1.
- **Esfuerzo**: 🟡 · **Impacto**: 🔴 Alto (habilita detectar en compilación los bugs de nomenclatura, no solo corregirlos una vez)

### 2.2 — `PDFPreview.tsx`: `compileCode` hace demasiadas cosas en una sola función
- **Archivo**: `PDFPreview.tsx`
- **Problema**: una única función de ~130 líneas mezcla: limpieza de imports/exports vía regex, detección de 4 variantes de `export default`, transpilación con Babel, construcción de un string de módulo, `new Function` + ejecución, y manejo de 5 tipos de error distintos. Es difícil de testear unitariamente (todo pasa por efectos secundarios de `setState`) y cualquier cambio futuro en una parte (p. ej. mejorar la detección de `export default`) obliga a leer y entender el resto.
- **Refactor sugerido**: extraer funciones puras, testeables de forma aislada, y dejar que `compileCode` solo orqueste:
  ```ts
  // utils/compilePlaygroundCode.ts
  export function stripImportsAndExports(code: string): string { ... }
  export function extractDefaultExportName(code: string): string | null { ... }
  export function transpileToJs(code: string): { code: string } | { error: string } { ... }
  export function buildAndRunComponent(
    transpiledCode: string,
    componentNames: string[],
    coreComponents: Record<string, unknown>
  ): { component: React.ComponentType } | { error: string } { ... }
  ```
  Con esto, `compileCode` en `PDFPreview.tsx` queda como una secuencia legible de pasos, y cada función puede tener sus propios tests con casos límite (código vacío, sin `export default`, con `class`, etc.) sin necesidad de montar el componente React ni Monaco.
- **Esfuerzo**: 🔴 · **Impacto**: 🔴 Alto (la lógica más frágil y crítica de todo el Playground)

### 2.3 — `CodeEditor.tsx`: funciones de "sanitización" que no hacen nada
- **Archivo**: `CodeEditor.tsx` (líneas 38-42 y 64-67)
- **Problema**:
  ```ts
  const sanitizeAll = (text: string) => {
    let s = text
    return s
  }
  ```
  Esta función (y su gemela `sanitizePastedText`) son identidad pura: reciben `text` y lo devuelven sin tocar. Es casi seguro código residual de una sanitización que existía y se quitó (o se planeó y nunca se implementó), pero deja: (a) una vuelta extra de `editorRef.current.executeEdits(...)` en cada cambio del editor que nunca hace falta, y (b) un `pasteHandler` registrado en el DOM que nunca dispara `preventDefault` porque `sanitized !== text` nunca es `true`.
- **Refactor sugerido**: si no hay sanitización planeada a corto plazo, eliminar ambas funciones y el código que depende de que devuelvan algo distinto (el bloque `if (sanitized !== current)` en `handleEditorChange` y el `pasteHandler` completo), dejando que `onChange` se llame directo. Si sí hay una sanitización pendiente (p. ej. quitar imports peligrosos antes de pegar), dejar un comentario `// TODO` explícito y un test que documente el caso, en vez de una función que simula hacer algo.
- **Esfuerzo**: 🟢 · **Impacto**: 🟡 Medio (simplifica el componente y evita el falso rastro de que "algo se sanitiza")

### 2.4 — `dowloadTemplate.ts`: los nombres de componentes de qr/chart están hardcodeados por segunda vez
- **Archivo**: `toolbar/funciones/dowloadTemplate.ts`
- **Problema**: `libraryComponents.qr = ['QR', 'QRStyle']` y `libraryComponents.chart = ['ChartJS']` son listas hardcodeadas que duplican información que también vive (con otro casing, ver 1.1) en `CodeEditor.tsx` y `QuickHelp.tsx`. Tres fuentes de verdad distintas para "qué componentes existen" es exactamente el motivo por el que el bug de casing pudo colarse sin que nadie lo notara.
- **Refactor sugerido**: crear un único archivo (p. ej. `src/components/core/componentRegistry.ts` o similar) que declare, una sola vez, a qué "paquete" (`core`/`qr`/`chart`) pertenece cada componente exportado, y que tanto `dowloadTemplate.ts` como `QuickHelp.tsx` y `CodeEditor.tsx` importen desde ahí. Esto no solo arregla el bug puntual, sino que hace que un futuro componente nuevo en `qr` o `chart` no se pueda "olvidar" de registrar en un lugar y sí en otro.
- **Esfuerzo**: 🟡 · **Impacto**: 🟡 Medio-Alto (arregla la causa raíz de 1.1, no solo el síntoma)

### 2.5 — Registro de autocompletado duplicado para `javascript` y `typescript`
- **Archivo**: `CodeEditor.tsx` (líneas 290-327)
- **Problema**: `jsProvider` y `tsProvider` son dos bloques de ~15 líneas idénticos, con el mismo `provideCompletionItems`, registrados solo para lenguajes distintos.
- **Refactor sugerido**: extraer una función `createCompletionProvider(customTags)` que devuelva el objeto `{ provideCompletionItems }`, y registrar ambos idiomas con `monaco.languages.registerCompletionItemProvider(lang, createCompletionProvider(customTags))`. Reduce ~15 líneas duplicadas a una sola definición.
- **Esfuerzo**: 🟢 · **Impacto**: 🟢 Bajo (mantenibilidad, no afecta comportamiento)

### 2.6 — Fábricas de snippets (`etiqueta`, `etiquetaConSalto`, etc.) viven dentro de `handleEditorDidMount`
- **Archivo**: `CodeEditor.tsx` (líneas 119-162)
- **Problema**: cinco funciones fábrica puras (no dependen de `editor`/`monaco` más que para leer `kind`/`insertTextRules`) están anidadas dentro del callback de montaje, junto con el array gigante `customTags` (~120 líneas). Esto hace que el archivo completo sea difícil de escanear: hay que leer todo `handleEditorDidMount` para llegar a la config real de Monaco al final.
- **Refactor sugerido**: mover `customTags` (y sus fábricas) a un archivo propio, p. ej. `playground/utils/monacoSnippets.ts`, parametrizado por `kind`/`insertTextRules` que Monaco expone en runtime. `handleEditorDidMount` queda enfocado solo en configurar el editor y registrar los providers.
- **Esfuerzo**: 🟡 · **Impacto**: 🟡 Medio

### 2.7 — `index.tsx` (`Editor`): un componente que hace de todo
- **Archivo**: `playground/index.tsx`
- **Problema**: el componente `Editor` combina: fetch de `templates/index.json`, resolución de qué código cargar (URL → localStorage → default), persistencia en localStorage, detección mobile, y el layout visual. Son 4-5 responsabilidades distintas en ~90 líneas de lógica antes del `return`.
- **Refactor sugerido**: extraer dos hooks propios:
  ```ts
  // hooks/usePlaygroundTemplates.ts
  function usePlaygroundTemplates(): { templates: TemplateMeta[]; loaded: boolean }

  // hooks/usePlaygroundCode.ts
  function usePlaygroundCode(templateId: string | undefined, templates: TemplateMeta[], loaded: boolean): {
    code: string
    setCode: (c: string) => void
    isLoading: boolean
  }
  ```
  `Editor` queda como un componente casi puramente de layout, y cada hook se puede testear (o al menos razonar) por separado. El comentario detallado que ya existe en el código sobre por qué no se persiste cuando hay `:templateId` es valioso — debería moverse junto con la lógica al hook, no perderse.
- **Esfuerzo**: 🟡 · **Impacto**: 🟡 Medio

---

## Fase 3 — CSS / layout (bugs visuales, bajo riesgo de tocar)

### 3.1 — `ToolBar.tsx` usa `fixed` + `left-1/2` pensado para toda la ventana, no para su panel
- **Archivo**: `toolbar/ToolBar.tsx` (línea 13), `index.tsx` (contenedor `div.w-1/2`)
- **Problema**: `fixed bottom-6 left-1/2 -translate-x-1/2` centra respecto al **viewport completo**, pero el `ToolBar` vive dentro de la mitad izquierda de la pantalla (`w-1/2`, junto al editor). El resultado: la barra flotante aparece centrada sobre el límite editor/preview, no bajo el editor.
- **Refactor sugerido**: hacer `relative` el contenedor `<div className="w-1/2 border-r ...">` en `index.tsx` y cambiar `ToolBar` a `absolute bottom-6 left-1/2 -translate-x-1/2` (posicionamiento relativo a su propio panel, no al viewport).
- **Esfuerzo**: 🟢 · **Impacto**: 🟡 Medio (visual, pero notorio en pantallas anchas)

### 3.2 — `CompilingIndicator` mal posicionado por falta de `position: relative` en el contenedor
- **Archivo**: `components/CompilingIndicator.tsx`, `PDFPreview.tsx` (línea 184)
- **Problema**: mismo patrón que 3.1 — `position: absolute` sin un ancestro `relative` cercano cae en el ancestro posicionado más próximo (o el viewport).
- **Refactor sugerido**: agregar `position: "relative"` al `<div style={{ width: "100%", height: "100%" }}>` de `PDFPreview.tsx`.
- **Esfuerzo**: 🟢 · **Impacto**: 🟢 Bajo-Medio

### 3.3 — `ErrorBoundary.tsx` renderiza HTML normal (`div`/`h3`/`p`) dentro del árbol de `<PDFViewer>`
- **Archivo**: `components/ErrorBoundary.tsx`, usado en `PDFPreview.tsx` envolviendo `<Component />` dentro de `<PDFViewer>`
- **Problema**: `PDFViewer` (de `@react-pdf/renderer`) espera que sus hijos sean primitivos del renderer de PDF (`Document`, `Page`, `View`, `Text`...), no elementos DOM reales — es un renderer de React distinto (no usa el DOM). El fallback de error de `ErrorBoundary` usa `<div>`/`<h3>`/`<p>` normales, que es justo el patrón que sí siguen correctamente `ErrorDocument.tsx` y `DefaultDocument.tsx` (ambos con `<Document><Page>...`). Vale la pena confirmar visualmente si esto llega a producir algo visible o simplemente queda en blanco/rompe silenciosamente, ya que técnicamente solo se dispara si el **render** de un documento de usuario lanza (no cubre errores de compilación, que ya tienen su propio camino vía `ErrorDocument`).
- **Refactor sugerido**: cambiar el `render()` de `ErrorBoundary` para que devuelva un `<Document><Page>...<Text>{...}</Text></Page></Document>` (reutilizando el estilo de `ErrorDocument.tsx`) en vez de HTML plano.
- **Esfuerzo**: 🟢 · **Impacto**: 🔴 Alto si en efecto no se renderiza nada visible hoy (bug funcional, no solo estético) — recomiendo verificarlo primero en el navegador antes de tocarlo, para confirmar el efecto real.

---

## Fase 4 — Detalles menores / limpieza

| # | Archivo | Detalle | Esfuerzo |
|---|---|---|---|
| 4.1 | `index.tsx` | Prop `code` pasada a `<Header code={code} context="playgroud" />` pero `Header.tsx` no la usa (solo desestructura `context`). Código muerto — o eliminar la prop, o implementar lo que se planeaba (¿compartir código desde el header?). | 🟢 |
| 4.2 | `index.tsx`, `Header.tsx` | Typo consistente `"playgroud"` como valor de `context` (aparece igual en ambos lados, así que no rompe nada funcionalmente, pero conviene corregirlo antes de que se replique a un tercer lugar). | 🟢 |
| 4.3 | `toolbar/funciones/dowloadTemplate.ts` | El archivo y la carpeta (`funciones/`) mezclan español con el resto del código en inglés (`components/`, `hooks/`, `utils/`). Nombre de archivo con typo: `dowloadTemplate` → `downloadTemplate`. Conviene unificar convención de idioma en nombres de carpetas/archivos del proyecto (no solo de este). | 🟢 |
| 4.4 | `PDFPreview.tsx` | El filtro `typeof ... === "function" || typeof ... === "object"` para incluir componentes envueltos en `React.memo()` (`Img`, `Icon`) funciona pero es implícito y frágil: cualquier otro valor exportado como objeto desde `core` (no solo componentes `memo`) se colaría también. Vale la pena un comentario explícito (ya existe uno parcial) o una lista explícita de excepciones conocidas. | 🟢 |
| 4.5 | `ColorPicker.tsx` | Estado compartido a nivel de módulo (`sharedRecentColors` + `Set` de listeners) es una forma casera de estado global. Funciona, pero si en el futuro se necesita compartir más estado entre herramientas del toolbar (ver observación #10 del informe: "persistencia inconsistente entre herramientas"), conviene evaluar un Context de React o Zustand en vez de seguir sumando variables de módulo con su propio patrón pub/sub a mano. | 🟡 (evaluar, no urgente) |

---

## Resumen priorizado (para ejecutar en orden)

1. **Fase 1 completa** (1.1 a 1.4): son 4 cambios de una línea cada uno, alto impacto, cero riesgo. ~20 minutos en total.
2. **3.3** (ErrorBoundary): verificar primero en el navegador si de verdad no se ve nada; si es así, sube de prioridad a nivel de Fase 1.
3. **2.4** (registro único de componentes qr/chart): resuelve la causa raíz de 1.1 y evita que reaparezca.
4. **2.1** (extraer `componentDocs` con tipos): el cambio de mayor apalancamiento a mediano plazo — convierte los bugs de la Fase 1 en errores de compilación futuros.
5. **2.2** (dividir `compileCode`): el más costoso pero el que más reduce el riesgo de la pieza más crítica del Playground.
6. Resto de Fase 2 y 3.1/3.2: mejoras de mantenibilidad y visuales, sin apuro.
7. Fase 4: limpieza oportunista, ideal para hacer "de paso" mientras se toca cada archivo por otro motivo.

---

## Qué NO se tocó en este análisis

Por pedido explícito, este documento se centró solo en `src/components/viewer/playground/`. No se revisó `src/components/core/` (la librería en sí) más allá de lo necesario para verificar los nombres exportados, ni `src/components/viewer/home/` ni `src/components/ui/`. Si querés, puedo hacer una pasada equivalente sobre alguna de esas carpetas.