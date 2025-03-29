import type React from "react"
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
}

const styles = StyleSheet.create({
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",

    overflow: "hidden",
    marginBottom: 20,
  },
  thead: {
    backgroundColor: "#f0f0f0",
  },
  tbody: {},
  tr: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  th: {
    paddingTop: 4,
    fontSize: 10,
    fontFamily: "Helvetica",
    fontWeight: "bold",
    borderRight: 1,
    borderColor: "#000",
    textAlign: "center",
  },
  td: {
    paddingTop: 4,
    paddingLeft: 8,
    paddingRight: 8,
    fontSize: 10,
    fontFamily: "Helvetica",
    borderRight: 1,
    borderColor: "#000",
  },
  cellSmall: {
    width: "25%",
  },
  cellMedium: {
    width: "33.33%",
  },
  cellLarge: {
    width: "50%",
  },
})

// Mapeo explícito de cellSize a su estilo correspondiente
const cellSizeMapping = {
  small: styles.cellSmall,
  medium: styles.cellMedium,
  large: styles.cellLarge,
}

const Table: React.FC<TableProps> = ({ children, style }) => {
  return <View style={[styles.table, style]}>{children}</View>
}

const Thead: React.FC<TableProps> = ({ children, style }) => {
  return <View style={[styles.thead, style]}>{children}</View>
}

const Tbody: React.FC<TableProps> = ({ children, style }) => {
  return <View style={[styles.tbody, style]}>{children}</View>
}

const Tr: React.FC<TableProps> = ({ children, style }) => {
  return <View style={[styles.tr, style]}>{children}</View>
}

const Th: React.FC<CellProps> = ({ children, style, cellSize = "medium", width, height, colSpan }) => {
  const spanWidth = colSpan ? `${(100 / 3) * colSpan}%` : undefined
  const sizeStyle = cellSizeMapping[cellSize]

  const customStyle = {
    width: width || spanWidth || sizeStyle?.width,
    ...(height !== undefined && { height }),
  }

  return (
    <View style={[styles.th, customStyle, style]}>
      <Text>{children}</Text>
    </View>
  )
}

const Td: React.FC<CellProps> = ({ children, style, cellSize = "medium", width, height, colSpan }) => {
  const spanWidth = colSpan ? `${(100 / 3) * colSpan}%` : undefined
  const sizeStyle = cellSizeMapping[cellSize]

  const customStyle = {
    width: width || spanWidth || sizeStyle?.width,
    ...(height !== undefined && { height }),
  }

  return (
    <View style={[styles.td, customStyle, style]}>
      <Text>{children}</Text>
    </View>
  )
}

export { Table, Thead, Tbody, Tr, Th, Td }

