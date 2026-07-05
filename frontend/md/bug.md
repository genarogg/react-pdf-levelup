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




---

## Fase 2 — Estructura y mantenibilidad (el núcleo del refactor)


### 2.4 — `dowloadTemplate.ts`: los nombres de componentes de qr/chart están hardcodeados por segunda vez
- **Archivo**: `toolbar/funciones/dowloadTemplate.ts`
- **Problema**: `libraryComponents.qr = ['QR', 'QRStyle']` y `libraryComponents.chart = ['ChartJS']` son listas hardcodeadas que duplican información que también vive (con otro casing, ver 1.1) en `CodeEditor.tsx` y `QuickHelp.tsx`. Tres fuentes de verdad distintas para "qué componentes existen" es exactamente el motivo por el que el bug de casing pudo colarse sin que nadie lo notara.
- **Refactor sugerido**: crear un único archivo (p. ej. `src/components/core/componentRegistry.ts` o similar) que declare, una sola vez, a qué "paquete" (`core`/`qr`/`chart`) pertenece cada componente exportado, y que tanto `dowloadTemplate.ts` como `QuickHelp.tsx` y `CodeEditor.tsx` importen desde ahí. Esto no solo arregla el bug puntual, sino que hace que un futuro componente nuevo en `qr` o `chart` no se pueda "olvidar" de registrar en un lugar y sí en otro.
- **Esfuerzo**: 🟡 · **Impacto**: 🟡 Medio-Alto (arregla la causa raíz de 1.1, no solo el síntoma)


---

## Fase 3 — CSS / layout (bugs visuales, bajo riesgo de tocar)


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