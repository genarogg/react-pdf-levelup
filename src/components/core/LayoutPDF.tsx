import  React from "react"
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
    bottom: 30,
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
  style?: any
}

const LayoutPDF: React.FC<LayoutPDFProps> = ({
  children,
  size = "A4",
  orientation = "portrait",
  backgroundColor = "white",
  showPageNumbers = true,
  style = {},
}) => {
  const pageStyle = {
    ...styles.page,
    backgroundColor,
    ...style,
  }

  return (
    <Document>
      <Page size={size as any} orientation={orientation} style={pageStyle}>
        {children}
        {showPageNumbers && (
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

