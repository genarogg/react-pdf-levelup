import React from "react"
import { Page, Document, StyleSheet, Text, View } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 12,

  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
  }
})

interface LayoutPDFProps {
  children: React.ReactNode
  size?: string
  orientation?: "vertical" | "horizontal"
  backgroundColor?: string
  padding?: number
  style?: any

  styleFooter?: any
  footer?: React.ReactNode
  lines?: number // Number of lines in footer (1, 2, 3, 4...)
}

const LayoutPDF: React.FC<LayoutPDFProps> = ({
  children,
  size = "A4",
  orientation = "vertical",
  backgroundColor = "white",
  padding = 30,
  style = {},
  styleFooter = {},
  footer,
  lines = footer ? 2 : 1,
}) => {
  // Calculate footer height based on number of lines
  // Each line is approximately 20 points (considering font size and line height)
  const LINE_HEIGHT = 20
  const FOOTER_PADDING = 10
  const footerHeight = (lines * LINE_HEIGHT) + FOOTER_PADDING

  // Validar y sanitizar props
  let safeSize = size
  let safeOrientation = orientation
  let safeBackgroundColor = backgroundColor
  let safeLines = Math.max(1, Math.min(lines, 10)) // Limit between 1 and 10 lines

  try {
    // Validar size
    const validSizes = ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "LETTER", "LEGAL", "TABLOID"]
    if (typeof size === "string" && !validSizes.includes(size.toUpperCase())) {
      console.warn(`Invalid page size: ${size}. Using A4 as default.`)
      safeSize = "A4"
    }

    // Validar orientation
    if (orientation !== "vertical" && orientation !== "horizontal") {
      console.warn(`Invalid orientation: ${orientation}. Using vertical as default.`)
      safeOrientation = "vertical"
    }

    // Validar backgroundColor
    if (typeof backgroundColor !== "string") {
      console.warn(`Invalid background color: ${backgroundColor}. Using white as default.`)
      safeBackgroundColor = "white"
    }

    // Validar lines
    if (typeof lines !== "number" || lines < 1) {
      console.warn(`Invalid lines value: ${lines}. Using 1 as default.`)
      safeLines = 1
    }
  } catch (e) {
    console.warn("Error processing props in LayoutPDF:", e)
  }

  // Transform orientation from "vertical"/"horizontal" to "portrait"/"landscape"
  const transformOrientation = (orientation: "vertical" | "horizontal"): "portrait" | "landscape" => {
    switch (orientation) {
      case "vertical":
        return "portrait"
      case "horizontal":
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

  // Calculate footer position based on calculated footer height
  const footerTop = getFooterPosition(safeSize, pdfOrientation, footerHeight)

  const pageStyle = {
    ...styles.page,
    backgroundColor: safeBackgroundColor,
    padding: padding,
    ...style,
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
    color: "grey",
    ...styleFooter
  }

  return (
    <Document>
      <Page size={safeSize as any} orientation={pdfOrientation} style={pageStyle} wrap>
        <View style={{ paddingBottom: footerHeight + 20 }}>
          {children}
        </View>
        <View style={footerStyle} fixed>
          {footer}
          <Text style={{ fontSize: styleFooter.fontSize + 3 }} render={({ pageNumber, totalPages }) => (
            `${pageNumber} / ${totalPages}`
          )} />
        </View>
      </Page>
    </Document >
  )
}

export default LayoutPDF