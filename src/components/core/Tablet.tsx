import React from "react"
import { View, Text, StyleSheet } from "@react-pdf/renderer"

interface TableProps {
  children: React.ReactNode
  style?: any
}

interface CellProps {
  children?: React.ReactNode
  style?: any
  cellSize?: "small" | "medium" | "large"
  width?: string | number
  height?: string | number
  colSpan?: number
  isLast?: boolean       // última columna
  isLastRow?: boolean    // última fila
}

const styles = StyleSheet.create({
  table: {
    width: "100%",
    // marco exterior completo
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 20,
  },
  thead: {
    backgroundColor: "#f0f0f0",
  },
  tr: {
    flexDirection: "row",
  },
  cellSmall: { width: "25%" },
  cellMedium: { width: "33.33%" },
  cellLarge: { width: "50%" },
  textBold: {
    fontSize: 10,
    fontFamily: "Helvetica",
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 4,
  },
  text: {
    fontSize: 10,
    fontFamily: "Helvetica",
    paddingTop: 4,
    paddingLeft: 8,
    paddingRight: 8,
  },
})

const cellSizeMapping = {
  small: styles.cellSmall,
  medium: styles.cellMedium,
  large: styles.cellLarge,
}

const Table: React.FC<TableProps> = ({ children, style }) => (
  <View style={[styles.table, style]}>{children}</View>
)

const Thead: React.FC<TableProps> = ({ children, style }) => (
  <View style={[styles.thead, style]}>{children}</View>
)

const Tbody: React.FC<TableProps> = ({ children, style }) => (
  <View>{children}</View>
)

const Tr: React.FC<TableProps> = ({ children, style }) => (
  <View style={[styles.tr, style]}>{children}</View>
)

const Th: React.FC<CellProps> = ({
  children,
  style,
  cellSize = "medium",
  width,
  height,
  colSpan,
  isLast = false,
  isLastRow = false,
}) => {
  const spanWidth = colSpan ? `${(100 / 3) * colSpan}%` : undefined
  const sizeStyle = cellSizeMapping[cellSize]
  const customSize: any = { width: width || spanWidth || sizeStyle?.width }
  const borders = {
    borderRightWidth: isLast ? 0 : 1,
    borderBottomWidth: isLastRow ? 0 : 1,
    borderColor: "#000",
    ...(height !== undefined && { height }),
  }

  return (
    <View style={[styles.textBold, customSize, borders, style]}>
      <Text>{children}</Text>
    </View>
  )
}

const Td: React.FC<CellProps> = ({
  children,
  style,
  cellSize = "medium",
  width,
  height,
  colSpan,
  isLast = false,
  isLastRow = false,
}) => {
  const spanWidth = colSpan ? `${(100 / 3) * colSpan}%` : undefined
  const sizeStyle = cellSizeMapping[cellSize]
  const customSize: any = { width: width || spanWidth || sizeStyle?.width }
  const borders = {
    borderRightWidth: isLast ? 0 : 1,
    borderBottomWidth: isLastRow ? 0 : 1,
    borderColor: "#000",
    ...(height !== undefined && { height }),
  }

  return (
    <View style={[styles.text, customSize, borders, style]}>
      <Text>{children}</Text>
    </View>
  )
}

export { Table, Thead, Tbody, Tr, Th, Td }
