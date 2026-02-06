import React from "react"
import { Page, Document, StyleSheet, Text, View } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    padding: 30,

    fontSize: 14,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
  }
})

interface LayoutProps {
  children: React.ReactNode
  size?: "A0" | "A1" | "A2" | "A3" | "A4" | "A5" | "A6" | "A7" | "A8" | "A9" | "LETTER" | "LEGAL" | "TABLOID"
  orientation?: "vertical" | "horizontal" | "h" | "v" | "portrait" | "landscape"
  backgroundColor?: string
  padding?: number
  margen?: "apa" | "normal" | "estrecho" | "ancho"
  style?: any
  pagination?: boolean
  footer?: React.ReactNode
  lines?: number
  rule?: boolean
}

const Layout: React.FC<LayoutProps> = ({
  children,
  size = "A4",
  orientation = "vertical",
  backgroundColor = "white",
  padding = 30,
  margen = "normal",
  style = {},
  pagination = true,
  footer,
  lines = footer ? 2 : 1,
  rule = false,
}) => {
  // Calculate footer height based on number of lines
  // Each line is approximately 20 points (considering font size and line height)
  const LINE_HEIGHT = 20
  const FOOTER_PADDING = 10
  const footerHeight = (lines * LINE_HEIGHT) + FOOTER_PADDING

  // Función para obtener márgenes según las normas APA y otros estándares
  const getMargins = (margen: string, pageSize: string) => {
    const normalizedSize = pageSize.toUpperCase()

    switch (margen) {
      case "apa":
        // Normas APA: 1 pulgada en todos los lados (72 puntos)
        if (normalizedSize === "LETTER" || normalizedSize === "LEGAL") {
          return {
            paddingTop: 72,
            paddingRight: 72,
            paddingBottom: 72,
            paddingLeft: 72
          }
        }
        // Para otros tamaños, usar equivalente proporcional
        return {
          paddingTop: 72,
          paddingRight: 72,
          paddingBottom: 72,
          paddingLeft: 72
        }

      case "estrecho":
        return {
          paddingTop: 36,
          paddingRight: 36,
          paddingBottom: 36,
          paddingLeft: 36
        }

      case "ancho":
        return {
          paddingTop: 108,
          paddingRight: 108,
          paddingBottom: 108,
          paddingLeft: 108
        }

      case "normal":
      default:
        return {
          paddingTop: padding,
          paddingRight: padding,
          paddingBottom: padding,
          paddingLeft: padding
        }
    }
  }

  // Validar y sanitizar props
  let safeSize = size
  let safeOrientation = orientation
  let safeBackgroundColor = backgroundColor

  let safeMargen = margen

  try {
    // Validar size
    const validSizes = ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "LETTER", "LEGAL", "TABLOID"]
    if (typeof size === "string" && !validSizes.includes(size.toUpperCase())) {
      console.warn(`Invalid page size: ${size}. Using A4 as default.`)
      safeSize = "A4"
    }

    // Validar orientation
    const validOrientations = ["vertical", "horizontal", "portrait", "landscape", "h", "v"]
    const normalizedOrientation = typeof orientation === "string" ? orientation.toLowerCase() : "vertical"
    if (!validOrientations.includes(normalizedOrientation)) {
      console.warn(`Invalid orientation: ${orientation}. Using vertical as default.`)
      safeOrientation = "vertical"
    } else {
      // Mantener el valor original si es válido, respetando alias
      safeOrientation = orientation
    }

    // Validar backgroundColor
    if (typeof backgroundColor !== "string") {
      console.warn(`Invalid background color: ${backgroundColor}. Using white as default.`)
      safeBackgroundColor = "white"
    }

    // Validar margen
    const validMargins = ["apa", "normal", "estrecho", "ancho"]
    if (!validMargins.includes(margen)) {
      console.warn(`Invalid margin type: ${margen}. Using normal as default.`)
      safeMargen = "normal"
    }

    // Validar lines
    if (typeof lines !== "number" || lines < 1) {
      console.warn(`Invalid lines value: ${lines}. Using 1 as default.`)

    }
  } catch (e) {
    console.warn("Error processing props in Layout:", e)
  }

  // Transform orientation from "vertical"/"horizontal" to "portrait"/"landscape"
  const transformOrientation = (orientation: "vertical" | "horizontal" | "h" | "v" | "portrait" | "landscape"): "portrait" | "landscape" => {
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
        console.warn(`Unrecognized orientation: ${orientation}. Using portrait as default.`)
        return "portrait"
    }
  }

  // Function to calculate footer position based on size and orientation
  const getFooterPosition = (pageSize: string, orientation: "portrait" | "landscape", footerHeight: number) => {
    // Dimensions in millimeters according to ISO 216 standard
    const pageDimensions: Record<string, { width: number; height: number }> = {
      A0: { width: 841, height: 1189 },
      A1: { width: 594, height: 841 },
      A2: { width: 420, height: 594 },
      A3: { width: 297, height: 420 },
      A4: { width: 210, height: 297 },
      A5: { width: 148, height: 210 },
      A6: { width: 105, height: 148 },
      A7: { width: 74, height: 105 },
      A8: { width: 52, height: 74 },
      A9: { width: 37, height: 52 },
      LETTER: { width: 216, height: 279 },
      LEGAL: { width: 216, height: 356 },
      TABLOID: { width: 279, height: 432 },
    }

    // Convert mm to points (1mm = 2.834645669 points)
    const mmToPoints = 2.834645669

    const dimensions = pageDimensions[pageSize.toUpperCase()]
    if (!dimensions) {
      // A4 default in points
      return orientation === "landscape" ? 595 - footerHeight - 10 : 842 - footerHeight - 10
    }

    const heightInPoints = dimensions.height * mmToPoints
    const widthInPoints = dimensions.width * mmToPoints

    // Subtract footer height and additional margin
    return orientation === "landscape"
      ? widthInPoints - footerHeight - 10
      : heightInPoints - footerHeight - 10
  }

  const pdfOrientation = transformOrientation(safeOrientation)

  // Obtener márgenes según el tipo seleccionado
  const margins = getMargins(safeMargen, safeSize)

  // Calculate footer position based on calculated footer height
  const footerTop = getFooterPosition(safeSize, pdfOrientation, footerHeight)

  // Function to render grid (ruler)
  const renderGrid = () => {
    if (!rule) return null

    // 1 cm = 28.3465 points
    const cmToPoints = 28.3465

    // Get page dimensions in points
    const pageDimensions: Record<string, { width: number; height: number }> = {
      A0: { width: 841 * 2.834645669, height: 1189 * 2.834645669 },
      A1: { width: 594 * 2.834645669, height: 841 * 2.834645669 },
      A2: { width: 420 * 2.834645669, height: 594 * 2.834645669 },
      A3: { width: 297 * 2.834645669, height: 420 * 2.834645669 },
      A4: { width: 210 * 2.834645669, height: 297 * 2.834645669 },
      A5: { width: 148 * 2.834645669, height: 210 * 2.834645669 },
      A6: { width: 105 * 2.834645669, height: 148 * 2.834645669 },
      A7: { width: 74 * 2.834645669, height: 105 * 2.834645669 },
      A8: { width: 52 * 2.834645669, height: 74 * 2.834645669 },
      A9: { width: 37 * 2.834645669, height: 52 * 2.834645669 },
      LETTER: { width: 216 * 2.834645669, height: 279 * 2.834645669 },
      LEGAL: { width: 216 * 2.834645669, height: 356 * 2.834645669 },
      TABLOID: { width: 279 * 2.834645669, height: 432 * 2.834645669 },
    }

    const dimensions = pageDimensions[safeSize.toUpperCase()] || pageDimensions.A4
    const pageWidth = pdfOrientation === "landscape" ? dimensions.height : dimensions.width
    const pageHeight = pdfOrientation === "landscape" ? dimensions.width : dimensions.height

    const horizontalLines = []
    const verticalLines = []

    // Generate horizontal lines (every cm)
    for (let i = 0; i <= Math.ceil(pageHeight / cmToPoints); i++) {
      horizontalLines.push(
        <View
          key={`h-${i}`}
          style={{
            position: "absolute",
            top: i * cmToPoints,
            left: 0,
            right: 0,
            height: i % 5 === 0 ? 1 : 0.5,
            backgroundColor: i % 5 === 0 ? "rgba(255, 0, 0, 0.8)" : "rgba(100, 100, 100, 0.5)",
          }}
        />
      )
    }

    // Generate vertical lines (every cm)
    for (let i = 0; i <= Math.ceil(pageWidth / cmToPoints); i++) {
      verticalLines.push(
        <View
          key={`v-${i}`}
          style={{
            position: "absolute",
            left: i * cmToPoints,
            top: 0,
            bottom: 0,
            width: i % 5 === 0 ? 1 : 0.5,
            backgroundColor: i % 5 === 0 ? "rgba(255, 0, 0, 0.8)" : "rgba(100, 100, 100, 0.5)",
          }}
        />
      )
    }

    return (
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} fixed>
        {horizontalLines}
        {verticalLines}
      </View>
    )
  }

  const pageStyle = {
    ...styles.page,
    backgroundColor: safeBackgroundColor,
    paddingTop: (style?.paddingTop ?? style?.padding ?? margins.paddingTop),
    paddingRight: (style?.paddingRight ?? style?.padding ?? margins.paddingRight),
    paddingLeft: (style?.paddingLeft ?? style?.padding ?? margins.paddingLeft),
    paddingBottom: (style?.paddingBottom ?? style?.padding ?? margins.paddingBottom) + footerHeight,
    ...((() => { const { padding, paddingTop, paddingRight, paddingBottom, paddingLeft, ...rest } = style || {}; return rest })()),
  }

  const footerStyle = {
    ...styles.footer,
    top: footerTop,
    height: footerHeight,
    display: "flex" as const,
    flexDirection: "column" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    fontSize: 10,
    color: "grey"
  }

  return (
    <Document>
      <Page size={safeSize as any} orientation={pdfOrientation} style={pageStyle} wrap>
        {renderGrid()}
        <View style={{ paddingBottom: footerHeight }}>
          {children}
        </View>

        <View style={footerStyle} fixed>
          {footer && (footer)}
          {pagination && (
            <Text style={{ fontSize: footerStyle.fontSize }} render={({ pageNumber, totalPages }) => (
              `${pageNumber} / ${totalPages}`
            )} />
          )}
        </View>

      </Page>
    </Document>
  )
}

export default Layout
