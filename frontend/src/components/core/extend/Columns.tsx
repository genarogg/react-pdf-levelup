import React from "react"
import { View, StyleSheet } from "@react-pdf/renderer"

// ─── Convenciones de página (mismas que Layout.tsx: A4 + padding 30) ────────
// Column es standalone: si no recibe width/height, asume que vive en una
// página A4 con el padding por defecto de esta librería (30pt), igual que
// Layout/Section. Así el comportamiento "de fábrica" queda predecible sin
// que Column necesite conocer el contexto de la página que lo contiene.

const A4_WIDTH = 595.28
const A4_HEIGHT = 841.89
const DEFAULT_PAGE_PADDING = 30
const DEFAULT_FOOTER_RESERVE = 30 // ver FOOTER_PADDING + LINE_HEIGHT en useLayoutResolution.tsx

const DEFAULT_CONTENT_WIDTH = A4_WIDTH - DEFAULT_PAGE_PADDING * 2
const DEFAULT_CONTENT_HEIGHT = A4_HEIGHT - DEFAULT_PAGE_PADDING * 2 - DEFAULT_FOOTER_RESERVE

// ─── Tipos públicos ──────────────────────────────────────────────────────────

export interface ColumnItem {
  /** Lo que se renderiza: <P>, <Img>, <QR>, cualquier componente. */
  content: React.ReactNode
  /**
   * Cantidad de caracteres del contenido — SOLO para texto. Con esto se
   * estima cuántas líneas va a ocupar en el ancho de columna actual, y de
   * ahí su alto.
   */
  chars?: number
  /**
   * Alto explícito en puntos, para contenido de tamaño fijo (Img, QR, firma,
   * etc.) donde no tiene sentido estimar por caracteres.
   */
  height?: number
  /** fontSize usado solo para estimar `chars` → líneas. Default: el `fontSize` del Column. */
  fontSize?: number
  /** Multiplicador de interlineado usado solo para estimar `chars` → líneas. Default: el `lineHeight` del Column. */
  lineHeight?: number
  /** Key estable opcional; si no se pasa se usa el índice. */
  id?: string | number
}

export interface ColumnProps {
  /**
   * Los items a distribuir. Acepta dos formas:
   *
   * 1. **JSX normal** (recomendado para texto): uno o varios elementos,
   *    fragments, o arrays — igual que cualquier otro componente de React.
   *    `Column` extrae el texto de cada hijo automáticamente para estimar
   *    su alto.
   *    ```jsx
   *    <Column>
   *      <P>Primer párrafo…</P>
   *      <P>Segundo párrafo…</P>
   *    </Column>
   *    ```
   * 2. **API avanzada**: un array de `{ content, chars }` | `{ content, height }`,
   *    para cuando necesitás alto explícito (imágenes, QR, firmas) o afinar
   *    `chars`/`fontSize`/`lineHeight` por item a mano.
   *    ```jsx
   *    <Column>
   *      {[{ content: <QR url="…" />, height: 120 }]}
   *    </Column>
   *    ```
   * No mezcles ambas formas dentro del mismo array.
   */
  children: React.ReactNode | ColumnItem[]
  /** Cantidad de columnas. Default: 2. */
  columns?: number
  /** Ancho total del bloque (todas las columnas + gaps), en puntos. Default: ancho A4 con padding 30. */
  width?: number
  /** Alto disponible por tanda de columnas antes de saltar de página, en puntos. Default: alto A4 con padding 30 y reserva de footer. */
  height?: number
  /** Espacio horizontal entre columnas, en puntos. Default: 24. */
  gap?: number
  /** Espacio vertical entre items apilados dentro de una misma columna, en puntos. Default: 8. */
  itemSpacing?: number
  /** fontSize por defecto para estimar la altura de items con `chars`. Default: 10. */
  fontSize?: number
  /** Multiplicador de interlineado por defecto (alto de línea = fontSize × lineHeight). Default: 1.35. */
  lineHeight?: number
  /**
   * Ancho promedio de un carácter, como fracción del fontSize. 0.5 es un
   * promedio razonable para fuentes proporcionales tipo Helvetica/Arial.
   * Bajalo si tu fuente es más angosta, subilo si es más ancha.
   */
  charWidthFactor?: number
  /**
   * Margen de seguridad sobre la altura estimada de items con `chars`
   * (texto). Compensa que la estimación por caracteres nunca puede ser
   * exacta: no conoce el fontSize/lineHeight real del contenido, y
   * charWidthFactor es un promedio, no un valor exacto por string.
   *
   * No aplica a items con `height` explícito (Img, QR, firma) — esos ya
   * son exactos por definición.
   *
   * Default: 1.2 (derivado del caso diagnosticado: un desajuste de 1pt de
   * fontSize generó un desborde real que solo un margen mayor a ~1.16
   * hubiese evitado — 1.2 deja un poco de aire adicional sobre ese mínimo).
   */
  safetyMargin?: number
  /**
   * Si es `false` (default), cada fila de columnas es un bloque atómico
   * (`wrap={false}`): sus columnas quedan garantizadas en la misma página,
   * pero si la estimación falla igual —incluso con `safetyMargin`— el
   * desborde queda invisible hasta que se mira el PDF final.
   *
   * Si es `true`, la fila puede partirse entre páginas cuando no entra
   * completa, igual que cualquier bloque normal de react-pdf. El costo es
   * que las columnas de una misma fila podrían no quedar alineadas en la
   * misma página si el corte cae en medio del contenido.
   *
   * Recomendado en `true` para cualquier Column cuyo contenido de texto no
   * tenga un fontSize/lineHeight 100% controlado y verificado.
   */
  allowRowBreak?: boolean
  /** Dibuja los límites de fila/columna, para calibrar los estimados a simple vista. */
  debug?: boolean
  style?: any
}

// ─── Detección de API: JSX normal vs array explícito de ColumnItem ──────────
// Un ColumnItem es un objeto plano `{ content, chars|height, ... }` — nunca
// un elemento React válido. Si `children` es un array y CADA elemento
// cumple esa forma, se interpreta como la API avanzada; cualquier otro caso
// (un solo elemento, varios hermanos, fragments, arrays de JSX) se trata
// como children normal de React.

function isColumnItem(value: unknown): value is ColumnItem {
  return (
    value !== null &&
    typeof value === "object" &&
    !React.isValidElement(value) &&
    "content" in (value as Record<string, unknown>)
  )
}

function isColumnItemArray(
  children: React.ReactNode | ColumnItem[]
): children is ColumnItem[] {
  return Array.isArray(children) && children.length > 0 && children.every(isColumnItem)
}

// ─── Extracción de texto plano de un nodo React ─────────────────────────────
// Recorre children recursivamente para sumar la cantidad de caracteres de
// texto real (strings/numbers) que contiene un nodo. Es lo que permite
// estimar `chars` automáticamente cuando Column recibe JSX normal en vez de
// la API avanzada — sin esto no hay forma de saber cuánto texto hay adentro
// de un <P>, <Strong>, etc. sin renderizarlo primero.

function extractTextLength(node: React.ReactNode): number {
  if (node == null || typeof node === "boolean") return 0
  if (typeof node === "string" || typeof node === "number") return String(node).length
  if (Array.isArray(node)) {
    return node.reduce((sum: number, child) => sum + extractTextLength(child), 0)
  }
  if (React.isValidElement(node)) {
    const childProps = node.props as { children?: React.ReactNode } | null | undefined
    return childProps?.children !== undefined ? extractTextLength(childProps.children) : 0
  }
  return 0
}

// Alto por defecto cuando un hijo de JSX normal no tiene texto extraíble
// (una <Img>, <QR>, u otro contenido de tamaño fijo). Sin esto, ese item
// estimaría 1 sola línea de alto y quedaría muy achicado / se superpondría
// con el siguiente item.
const NO_TEXT_FALLBACK_HEIGHT = 100

// ─── Normalización de children a ColumnItem[] ───────────────────────────────

function normalizeChildren(children: React.ReactNode | ColumnItem[]): ColumnItem[] {
  if (isColumnItemArray(children)) return children

  // React.Children.toArray aplana fragments/arrays anidados, descarta
  // null/undefined/boolean, y asigna keys estables — exactamente lo que
  // necesitamos para tratar "uno o varios hijos JSX" de forma uniforme.
  return React.Children.toArray(children).map((child, index) => {
    const chars = extractTextLength(child)

    if (chars > 0) {
      return { id: index, content: child, chars }
    }

    console.warn(
      `Column: el hijo #${index + 1} no tiene texto extraíble (¿una imagen, QR u otro contenido de ancho fijo?). Se usó un alto por defecto de ${NO_TEXT_FALLBACK_HEIGHT}pt — para un resultado preciso, pasá la API avanzada: <Column>{[{ content: <Tu/>, height: 120 }]}</Column>.`
    )
    return { id: index, content: child, height: NO_TEXT_FALLBACK_HEIGHT }
  })
}

// ─── Estimación de alto ──────────────────────────────────────────────────────
// react-pdf no expone una medición real de texto antes de renderizar, así que
// esto es una aproximación: líneas estimadas × alto de línea. Funciona bien
// para párrafos de largo normal. Para calibrar fino en tu fuente real, usá
// `debug` y ajustá `charWidthFactor`/`lineHeight`.
//
// `safetyMargin` se aplica solo acá, sobre el cálculo por `chars`: el
// contenido con `height` explícito (Img, QR, firma) ya es exacto por
// definición y no necesita margen de seguridad.

function estimateItemHeight(
  item: ColumnItem,
  columnWidth: number,
  defaults: {
    fontSize: number
    lineHeight: number
    charWidthFactor: number
    safetyMargin: number
  }
): number {
  if (typeof item.height === "number") return item.height

  if (typeof item.chars === "number") {
    const fontSize = item.fontSize ?? defaults.fontSize
    const lineHeightMult = item.lineHeight ?? defaults.lineHeight
    const avgCharWidth = fontSize * defaults.charWidthFactor
    const charsPerLine = Math.max(1, Math.floor(columnWidth / avgCharWidth))
    const lines = Math.max(1, Math.ceil(item.chars / charsPerLine))
    return lines * fontSize * lineHeightMult * defaults.safetyMargin
  }

  console.warn(
    "Column: un item no trae `chars` ni `height`; se asume el alto de una sola línea. Agregá uno de los dos para una distribución precisa."
  )
  return defaults.fontSize * defaults.lineHeight * defaults.safetyMargin
}

// ─── Distribución en columnas y páginas ─────────────────────────────────────
// Llenado secuencial tipo Word: se llena la columna 1 hasta que no entra el
// próximo item, se pasa a la columna 2, y cuando ninguna columna de la tanda
// actual tiene lugar, arranca una tanda nueva (próxima página). No hay
// "balanceo" de columnas — si lo necesitás, se puede sumar como opción.

type Distributed = ColumnItem[][][] // [pagina][columna] -> items

function distributeItems(
  items: ColumnItem[],
  options: {
    columns: number
    columnWidth: number
    columnHeight: number
    itemSpacing: number
    fontSize: number
    lineHeight: number
    charWidthFactor: number
    safetyMargin: number
  }
): Distributed {
  const { columns, columnWidth, columnHeight, itemSpacing, ...estimateDefaults } = options

  const pages: ColumnItem[][][] = []
  let currentPage: ColumnItem[][] = Array.from({ length: columns }, () => [])
  let used: number[] = Array(columns).fill(0)
  let colIndex = 0

  const startNewPage = (): void => {
    pages.push(currentPage)
    currentPage = Array.from({ length: columns }, () => [])
    used = Array(columns).fill(0)
    colIndex = 0
  }

  for (const item of items) {
    const itemHeight = estimateItemHeight(item, columnWidth, estimateDefaults)

    if (itemHeight > columnHeight) {
      console.warn(
        "Column: un item mide más que el alto disponible por columna; no se puede partir automáticamente y va a desbordar visualmente."
      )
    }

    let placed = false
    while (colIndex < columns) {
      const spacing = used[colIndex] > 0 ? itemSpacing : 0
      const fits = used[colIndex] + spacing + itemHeight <= columnHeight

      if (fits || used[colIndex] === 0) {
        currentPage[colIndex].push(item)
        used[colIndex] += spacing + itemHeight
        placed = true

        // Alerta temprana (solo dev): si incluso con safetyMargin una
        // columna quedó al límite del alto disponible, es una señal de que
        // la estimación puede estar más desalineada de lo normal con el
        // contenido real. No sustituye a safetyMargin/allowRowBreak — es
        // observabilidad adicional para detectar casos límite antes de que
        // se conviertan en un desborde real.
        if (process.env.NODE_ENV !== "production" && used[colIndex] > columnHeight * 0.9) {
          console.warn(
            `Column: la columna ${colIndex} usa más del 90% del alto disponible incluso con safetyMargin. Verificá con <Column debug> si el fontSize real coincide con el asumido.`
          )
        }

        break
      }

      colIndex += 1
    }

    if (!placed) {
      startNewPage()
      currentPage[0].push(item)
      used[0] += itemHeight
    }
  }

  pages.push(currentPage)
  return pages
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  column: {
    flexShrink: 0,
  },
  debugRow: {
    borderWidth: 1,
    borderColor: "#3d65fd",
    borderStyle: "dashed",
  },
  debugColumn: {
    borderWidth: 1,
    borderColor: "#e11d48",
    borderStyle: "dashed",
  },
})

// ─── Componente ──────────────────────────────────────────────────────────────

const Column: React.FC<ColumnProps> = React.memo(
  ({
    children,
    columns = 2,
    width = DEFAULT_CONTENT_WIDTH,
    height = DEFAULT_CONTENT_HEIGHT,
    gap = 24,
    itemSpacing = 8,
    fontSize = 10,
    lineHeight = 1.35,
    charWidthFactor = 0.5,
    safetyMargin = 1.2,
    allowRowBreak = false,
    debug = false,
    style,
  }) => {
    const safeColumns = Math.max(1, Math.floor(columns))

    if (safeColumns !== columns) {
      console.warn(`Column: \`columns\` inválido (${columns}). Usando ${safeColumns}.`)
    }

    if (safetyMargin < 1) {
      console.warn(
        `Column: \`safetyMargin\` (${safetyMargin}) es menor a 1 — esto reduce la estimación en vez de darle margen. ¿Es intencional?`
      )
    }

    const items = React.useMemo(() => normalizeChildren(children), [children])
    const columnWidth = (width - gap * (safeColumns - 1)) / safeColumns

    const pages = React.useMemo(
      () =>
        distributeItems(items, {
          columns: safeColumns,
          columnWidth,
          columnHeight: height,
          itemSpacing,
          fontSize,
          lineHeight,
          charWidthFactor,
          safetyMargin,
        }),
      [items, safeColumns, columnWidth, height, itemSpacing, fontSize, lineHeight, charWidthFactor, safetyMargin]
    )

    return (
      <>
        {pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {pageIndex > 0 && <View break />}
            <View
              style={[
                styles.row,
                { width },
                ...(debug ? [styles.debugRow] : []),
                ...(style ? [style] : []),
              ]}
              wrap={!allowRowBreak}
            >
              {page.map((columnItems, colIndex) => (
                <View
                  key={colIndex}
                  style={[
                    styles.column,
                    { width: columnWidth, marginLeft: colIndex > 0 ? gap : 0 },
                    ...(debug ? [styles.debugColumn] : []),
                  ]}
                >
                  {columnItems.map((item, itemIndex) => (
                    <View
                      key={item.id ?? itemIndex}
                      style={itemIndex > 0 ? { marginTop: itemSpacing } : undefined}
                    >
                      {item.content}
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </React.Fragment>
        ))}
      </>
    )
  }
)

Column.displayName = "Column"

export default Column
export type { Distributed as ColumnDistributed }