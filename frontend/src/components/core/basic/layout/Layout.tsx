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
  },
})

interface LayoutProps {
  children: React.ReactNode
  size?: "A0" | "A1" | "A2" | "A3" | "A4" | "A5" | "A6" | "A7" | "A8" | "A9" | "LETTER" | "LEGAL" | "TABLOID"
  orientation?: "vertical" | "horizontal" | "h" | "v" | "portrait" | "landscape"
  backgroundColor?: string
  padding?: number
  margin?: "apa" | "normal" | "estrecho" | "ancho"
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
  margin = "normal",
  style = {},
  pagination = true,
  footer,
  lines = footer ? 2 : 1,
  rule = false,
}) => {
  // Footer height
  const LINE_HEIGHT = 20
  const FOOTER_PADDING = 10
  const footerHeight = lines * LINE_HEIGHT + FOOTER_PADDING

  const getMargins = (margin: string) => {
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

  const transformOrientation = (
    o: "vertical" | "horizontal" | "h" | "v" | "portrait" | "landscape"
  ): "portrait" | "landscape" => {
    return ["horizontal", "landscape", "h"].includes(o) ? "landscape" : "portrait"
  }

  const getFooterPosition = (
    pageSize: string,
    orientation: "portrait" | "landscape",
    footerHeight: number
  ) => {
    const mmToPoints = 2.834645669
    const sizes: Record<string, { w: number; h: number }> = {
      A4: { w: 210, h: 297 },
      LETTER: { w: 216, h: 279 },
      LEGAL: { w: 216, h: 356 },
      TABLOID: { w: 279, h: 432 },
    }

    const size = sizes[pageSize] || sizes.A4
    const height = orientation === "landscape" ? size.w : size.h

    return height * mmToPoints - footerHeight - 10
  }

  const pdfOrientation = transformOrientation(orientation)
  const margins = getMargins(margin)

  const footerTop = getFooterPosition(size, pdfOrientation, footerHeight)

  const pageStyle = {
    ...styles.page,
    backgroundColor,
    paddingTop: style?.paddingTop ?? margins.paddingTop,
    paddingRight: style?.paddingRight ?? margins.paddingRight,
    paddingLeft: style?.paddingLeft ?? margins.paddingLeft,
    paddingBottom:
      (style?.paddingBottom ?? margins.paddingBottom) + footerHeight,
    ...(() => {
      const { padding, paddingTop, paddingRight, paddingBottom, paddingLeft, ...rest } = style || {}
      return rest
    })(),
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
  }

  return (
    <Document>
      <Page size={size as any} orientation={pdfOrientation} style={pageStyle} wrap>
        {children}

        <View style={footerStyle} fixed>
          {footer}
          {pagination && (
            <Text
              render={({ pageNumber, totalPages }) =>
                `${pageNumber} / ${totalPages}`
              }
            />
          )}
        </View>
      </Page>
    </Document>
  )
}

export default Layout