import React, { useMemo } from "react"
import { Page, Document, StyleSheet, Text, View, Image } from "@react-pdf/renderer"
import { toPdfOrientation } from "./helper/toPdfOrientation"
import { getMargins, type MarginPreset } from "./helper/getMargins"
import { getPageDimensions, type PageSize, type PdfOrientation, PAGE_DIMENSIONS } from "./helper/getPageDimensions"

// ─── Constantes de módulo ──────────────────────────────────────────────────────

const CM_TO_POINTS = 28.3465

const VALID_SIZES = Object.keys(PAGE_DIMENSIONS)
const VALID_ORIENTATIONS = ["vertical", "horizontal", "portrait", "landscape", "h", "v"]
const VALID_MARGINS = ["apa", "normal", "estrecho", "ancho"]

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

type Orientation = "vertical" | "horizontal" | "h" | "v" | "portrait" | "landscape"

// ── Metadatos del documento ───────────────────────────────────────────────────

interface DocumentMeta {
  title?: string
  author?: string
  subject?: string
  keywords?: string
  creator?: string
  producer?: string
  language?: string
  pageMode?: string
  pageLayout?: string
}

const DEFAULT_META: DocumentMeta = {
  creator: "react-pdf-levelup",
  producer: "react-pdf-levelup",
}

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
  meta?: DocumentMeta
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getFooterTop(pageHeight: number, footerHeight: number): number {
  return pageHeight - footerHeight - 10
}

// ─── Constantes de layout ─────────────────────────────────────────────────────

const LINE_HEIGHT = 20
const FOOTER_PADDING = 10

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
  meta = {},
}) => {
  // ── Merge de meta con defaults ────────────────────────────────────────────

  const {
    title,
    author,
    subject,
    keywords,
    creator,
    producer,
    language,
    pageMode,
    pageLayout,
  } = { ...DEFAULT_META, ...meta }

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

  const footerHeight = useMemo(
    () => Math.max(1, footerLines ?? (footer ? 2 : 1)) * LINE_HEIGHT + FOOTER_PADDING,
    [footerLines, footer]
  )

  // ── Cálculos derivados ────────────────────────────────────────────────────

  const pdfOrientation = toPdfOrientation(safeOrientation)

  const margins = useMemo(
    () => getMargins(safeMargin, padding),
    [safeMargin, padding]
  )

  const { width: pageWidth, height: pageHeight } = useMemo(
    () => getPageDimensions(safeSize, pdfOrientation),
    [safeSize, pdfOrientation]
  )

  const footerTop = useMemo(
    () => getFooterTop(pageHeight, footerHeight),
    [pageHeight, footerHeight]
  )

  // ── Regla / cuadrícula ────────────────────────────────────────────────────

  const grid = useMemo(() => {
    if (!rule) return null

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
  }, [rule, pageWidth, pageHeight])

  // ── Estilos finales ───────────────────────────────────────────────────────

  const { padding: _p, paddingTop: _pt, paddingRight: _pr, paddingBottom: _pb, paddingLeft: _pl, ...restStyle } = style ?? {}

  const pageStyle = useMemo(() => {
    const paddingTop = style?.paddingTop ?? style?.padding ?? margins.paddingTop
    const paddingRight = style?.paddingRight ?? style?.padding ?? margins.paddingRight
    const paddingLeft = style?.paddingLeft ?? style?.padding ?? margins.paddingLeft
    const paddingBottom = (style?.paddingBottom ?? style?.padding ?? margins.paddingBottom) + footerHeight

    return {
      ...styles.page,
      backgroundColor: safeBackgroundColor,
      paddingTop,
      paddingRight,
      paddingLeft,
      paddingBottom,
      ...restStyle,
    }
  }, [safeBackgroundColor, footerHeight, margins, style])

  const footerStyle = useMemo(() => ({
    ...styles.footer,
    top: footerTop,
    height: footerHeight,
    display: "flex" as const,
    flexDirection: "column" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    color: "grey",
  }), [footerTop, footerHeight])

  // ── Render ────────────────────────────────────────────────────────────────

  const backgroundImageStyle = useMemo(() => ({
    ...styles.backgroundImage,
    opacity: backgroundImageOpacity,
  }), [backgroundImageOpacity])

  const backgroundImageNode = useMemo(() => {
    if (!backgroundImage) return null
    return <Image src={backgroundImage} style={backgroundImageStyle} fixed />
  }, [backgroundImage, backgroundImageStyle])

  return (
    <Document
      title={title}
      author={author}
      subject={subject}
      keywords={keywords}
      creator={creator}
      producer={producer}
      language={language}
      pageMode={pageMode as any}
      pageLayout={pageLayout as any}
    >
      <Page debug={debug} size={safeSize as any} orientation={pdfOrientation} style={pageStyle} wrap>
        {backgroundImageNode}
        {grid}
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