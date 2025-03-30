import React from "react"
import { Page, Document, StyleSheet, Text } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 12,
    lineHeight: 1.5,
  },
  pageNumber: {
    position: "absolute",
    fontSize: 10,
    top: 792 - 14,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
})

interface LayoutPDFProps {
  children: React.ReactNode
  size?: string
  orientation?: "portrait" | "landscape"
  backgroundColor?: string
  showPageNumbers?: boolean
  padding?: number
  style?: any
}

const LayoutPDF: React.FC<LayoutPDFProps> = ({
  children,
  size = "A4",
  orientation = "portrait",
  backgroundColor = "white",
  showPageNumbers = true,
  padding = 30,
  style = {},
}) => {
  // Validar y sanitizar props
  let safeSize = size
  let safeOrientation = orientation
  let safeBackgroundColor = backgroundColor
  let safeShowPageNumbers = showPageNumbers

  try {
    // Validar size
    const validSizes = ["A4", "A3", "A5", "LETTER", "LEGAL", "TABLOID"]
    if (typeof size === "string" && !validSizes.includes(size.toUpperCase())) {
      console.warn(`Tamaño de página inválido: ${size}. Usando A4 como valor predeterminado.`)
      safeSize = "A4"
    }

    // Validar orientation
    if (orientation !== "portrait" && orientation !== "landscape") {
      console.warn(`Orientación inválida: ${orientation}. Usando portrait como valor predeterminado.`)
      safeOrientation = "portrait"
    }

    // Validar backgroundColor
    if (typeof backgroundColor !== "string") {
      console.warn(`Color de fondo inválido: ${backgroundColor}. Usando white como valor predeterminado.`)
      safeBackgroundColor = "white"
    }

    // Validar showPageNumbers
    if (typeof showPageNumbers !== "boolean") {
      safeShowPageNumbers = Boolean(showPageNumbers)
    }
  } catch (e) {
    console.warn("Error procesando props en LayoutPDF:", e)
  }

  const pageStyle = {
    ...styles.page,
    backgroundColor: safeBackgroundColor,
    padding: padding,
    ...style,
  }

  return (
    <Document>
      <Page size={safeSize as any} orientation={safeOrientation} style={pageStyle}>
        {children}
        {safeShowPageNumbers && (
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
            fixed
          />
        )}
      </Page>
    </Document>
  )
}

export default LayoutPDF

