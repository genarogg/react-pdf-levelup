import React from "react"
import { Page, Document, StyleSheet, Text, View, Image } from "@react-pdf/renderer"

// ─── Constantes de módulo ──────────────────────────────────────────────────────

const MM_TO_POINTS = 2.834645669
const CM_TO_POINTS = 28.3465

const PAGE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  A0:      { width: 841,  height: 1189 },
  A1:      { width: 594,  height: 841  },
  A2:      { width: 420,  height: 594  },
  A3:      { width: 297,  height: 420  },
  A4:      { width: 210,  height: 297  },
  A5:      { width: 148,  height: 210  },
  A6:      { width: 105,  height: 148  },
  A7:      { width: 74,   height: 105  },
  A8:      { width: 52,   height: 74   },
  A9:      { width: 37,   height: 52   },
  LETTER:  { width: 216,  height: 279  },
  LEGAL:   { width: 216,  height: 356  },
  TABLOID: { width: 279,  height: 432  },
}

const VALID_SIZES        = Object.keys(PAGE_DIMENSIONS)
const VALID_ORIENTATIONS = ["vertical", "horizontal", "portrait", "landscape", "h", "v"]
const VALID_MARGINS      = ["apa", "normal", "estrecho", "ancho"]

// ─── Estilos base ──────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    padding: 30,
    fontSize: 10,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
})

// ─── Tipos ─────────────────────────────────────────────────────────────────────

type PageSize       = "A0" | "A1" | "A2" | "A3" | "A4" | "A5" | "A6" | "A7" | "A8" | "A9" | "LETTER" | "LEGAL" | "TABLOID"
type Orientation    = "vertical" | "horizontal" | "h" | "v" | "portrait" | "landscape"
type MarginPreset   = "apa" | "normal" | "estrecho" | "ancho"
type PdfOrientation = "portrait" | "landscape"

interface LayoutProps {
  children: React.ReactNode
  size?: PageSize
  orientation?: Orientation
  backgroundColor?: string
  backgroundImage?: string
  backgroundImageOpacity?: number
  padding?: number
  margin?: MarginPreset
  style?: any
  pagination?: boolean
  footer?: React.ReactNode
  footerLines?: number
  rule?: boolean
  debug?: boolean
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function toPdfOrientation(orientation: Orientation): PdfOrientation {
  switch (orientation) {
    case "vertical":
    case "portrait":
    case "v":
      return "portrait"
    case "horizontal":
    case "landscape":
    case "h":
      return "landscape"
    default:
      console.warn(`Orientación no reconocida: ${orientation}. Usando portrait.`)
      return "portrait"
  }
}

function getMargins(margin: MarginPreset, padding: number) {
  switch (margin) {
    case "apa":
      return { paddingTop: 72, paddingRight: 72, paddingBottom: 72, paddingLeft: 72 }
    case "estrecho":
      return { paddingTop: 36, paddingRight: 36, paddingBottom: 36, paddingLeft: 36 }
    case "ancho":
      return { paddingTop: 108, paddingRight: 108, paddingBottom: 108, paddingLeft: 108 }
    case "normal":
    default:
      return { paddingTop: padding, paddingRight: padding, paddingBottom: padding, paddingLeft: padding }
  }
}

function getPageDimensions(pageSize: string, orientation: PdfOrientation) {
  const dims      = PAGE_DIMENSIONS[pageSize.toUpperCase()] ?? PAGE_DIMENSIONS.A4
  const widthPts  = dims.width  * MM_TO_POINTS
  const heightPts = dims.height * MM_TO_POINTS
  return orientation === "landscape"
    ? { width: heightPts, height: widthPts }
    : { width: widthPts,  height: heightPts }
}

// CAMBIO 1: La función ya no recalcula las dimensiones internamente.
// Ahora recibe directamente pageHeight, que el componente ya tiene calculado.
function getFooterTop(pageHeight: number, footerHeight: number): number {
  return pageHeight - footerHeight - 10
}

// ─── Componente ────────────────────────────────────────────────────────────────

const Layout: React.FC<LayoutProps> = ({
  children,
  size = "A4",
  orientation = "vertical",
  backgroundColor = "white",
  backgroundImage,
  backgroundImageOpacity = 1,
  padding = 30,
  margin = "normal",
  style = {},
  pagination = true,
  footer,
  footerLines,
  rule = false,
  debug = false,
}) => {
  const LINE_HEIGHT    = 20
  const FOOTER_PADDING = 10

  // ── Sanitización de props ──────────────────────────────────────────────────

  const safeSize: PageSize = (typeof size === "string" && VALID_SIZES.includes(size.toUpperCase()))
    ? size.toUpperCase() as PageSize
    : (console.warn(`Tamaño inválido: ${size}. Usando A4.`), "A4")

  const safeOrientation: Orientation = (typeof orientation === "string" && VALID_ORIENTATIONS.includes(orientation.toLowerCase()))
    ? orientation
    : (console.warn(`Orientación inválida: ${orientation}. Usando vertical.`), "vertical")

  const safeBackgroundColor: string = (typeof backgroundColor === "string")
    ? backgroundColor
    : (console.warn(`Color de fondo inválido: ${backgroundColor}. Usando white.`), "white")

  const safeMargin: MarginPreset = VALID_MARGINS.includes(margin)
    ? margin
    : (console.warn(`Margen inválido: ${margin}. Usando normal.`), "normal")

  const resolvedFooterLines = Math.max(1, footerLines ?? (footer ? 2 : 1))
  const footerHeight        = resolvedFooterLines * LINE_HEIGHT + FOOTER_PADDING

  // ── Cálculos derivados ────────────────────────────────────────────────────

  const pdfOrientation = toPdfOrientation(safeOrientation)
  const margins        = getMargins(safeMargin, padding)

  // CAMBIO 2: getPageDimensions se llama una sola vez aquí.
  // pageWidth y pageHeight quedan disponibles para todo el componente.
  const { width: pageWidth, height: pageHeight } = getPageDimensions(safeSize, pdfOrientation)

  // CAMBIO 3: getFooterTop recibe pageHeight ya calculado, sin repetir getPageDimensions.
  const footerTop = getFooterTop(pageHeight, footerHeight)

  // ── Regla / cuadrícula ────────────────────────────────────────────────────

  const renderGrid = () => {
    if (!rule) return null

    // CAMBIO 4: se reutilizan pageWidth y pageHeight del scope superior.
    // Ya no se llama a getPageDimensions por tercera vez.
    const horizontalLines = Array.from(
      { length: Math.ceil(pageHeight / CM_TO_POINTS) + 1 },
      (_, i) => (
        <View
          key={`h-${i}`}
          style={{
            position: "absolute",
            top: i * CM_TO_POINTS,
            left: 0,
            right: 0,
            height: i % 5 === 0 ? 1 : 0.5,
            backgroundColor: i % 5 === 0 ? "rgba(255, 0, 0, 0.8)" : "rgba(100, 100, 100, 0.5)",
          }}
        />
      )
    )

    const verticalLines = Array.from(
      { length: Math.ceil(pageWidth / CM_TO_POINTS) + 1 },
      (_, i) => (
        <View
          key={`v-${i}`}
          style={{
            position: "absolute",
            left: i * CM_TO_POINTS,
            top: 0,
            bottom: 0,
            width: i % 5 === 0 ? 1 : 0.5,
            backgroundColor: i % 5 === 0 ? "rgba(255, 0, 0, 0.8)" : "rgba(100, 100, 100, 0.5)",
          }}
        />
      )
    )

    return (
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} fixed>
        {horizontalLines}
        {verticalLines}
      </View>
    )
  }

  // ── Estilos finales ───────────────────────────────────────────────────────

  const paddingTop    = style?.paddingTop    ?? style?.padding ?? margins.paddingTop
  const paddingRight  = style?.paddingRight  ?? style?.padding ?? margins.paddingRight
  const paddingLeft   = style?.paddingLeft   ?? style?.padding ?? margins.paddingLeft
  const paddingBottom = (style?.paddingBottom ?? style?.padding ?? margins.paddingBottom) + footerHeight

  const { padding: _p, paddingTop: _pt, paddingRight: _pr, paddingBottom: _pb, paddingLeft: _pl, ...restStyle } = style ?? {}

  const pageStyle = {
    ...styles.page,
    backgroundColor: safeBackgroundColor,
    paddingTop,
    paddingRight,
    paddingLeft,
    paddingBottom,
    ...restStyle,
  }

  const footerStyle = {
    ...styles.footer,
    top: footerTop,
    height: footerHeight,
    display: "flex" as const,
    flexDirection: "column" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    color: "grey",
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Document>
      <Page debug={debug} size={safeSize as any} orientation={pdfOrientation} style={pageStyle} wrap>
        {backgroundImage && (
          <Image
            src={backgroundImage}
            style={{ ...styles.backgroundImage, opacity: backgroundImageOpacity }}
            fixed
          />
        )}
        {renderGrid()}
        {children}
        <View style={{ paddingBottom: footerHeight }} />

        <View style={footerStyle} fixed>
          {footer}
          {pagination && (
            <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
          )}
        </View>
      </Page>
    </Document>
  )
}

export default Layout