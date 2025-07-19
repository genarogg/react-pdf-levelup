import React from "react"
import { View, Text, StyleSheet } from "@react-pdf/renderer"

interface TableProps {
  children: React.ReactNode
  style?: any
}

interface CellProps {
  children?: React.ReactNode
  style?: any
  width?: string | number
  height?: string | number
  colSpan?: number
  isLast?: boolean
  isLastRow?: boolean
  isOdd?: boolean
}

const styles = StyleSheet.create({
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 20,
  },
  thead: {
    backgroundColor: "#ccc",
  },
  tr: {
    flexDirection: "row",
  },
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
    paddingTop: 8,
    paddingLeft: 8,
    paddingRight: 8,
  },
  zebraOdd: {
    backgroundColor: "#eeeeee",
  },
})

const Table: React.FC<TableProps> = ({ children, style }) => (
  <View style={[styles.table, style]}>{children}</View>
)

const Thead: React.FC<TableProps> = ({ children, style }) => (
  <View style={[styles.thead, style]}>{children}</View>
)

const Tbody: React.FC<TableProps> = ({ children, style }) => {
  const rows = React.Children.toArray(children) as React.ReactElement<any>[]
  const count = rows.length
  return (
    <>
      {rows.map((row, idx) =>
        React.cloneElement(row, {
          isLastRow: idx === count - 1,
          isOdd: idx % 2 === 1,
        })
      )}
    </>
  )
}

const Tr: React.FC<TableProps & { isLastRow?: boolean; isOdd?: boolean }> = ({
  children,
  style,
  isLastRow = false,
  isOdd = false,
}) => {
  const elements = React.Children.toArray(children) as React.ReactElement<CellProps>[]
  const count = elements.length
  return (
    <View style={[styles.tr, style]}>
      {elements.map((child, idx) => {
        const isLast = idx === count - 1
        const width = `${(100 / count).toFixed(2)}%`
        return React.cloneElement(child, { width, isLast, isLastRow, isOdd })
      })}
    </View>
  )
}

const Th: React.FC<CellProps> = ({
  children,
  style,
  width,
  height,
  colSpan,
  isLast = false,
  isLastRow = false,
}) => {
  const baseWidth = typeof width === 'string' && colSpan
    ? `${(parseFloat(width) * colSpan).toFixed(2)}%`
    : width

  const borders = {
    borderRightWidth: isLast ? 0 : 1,
    borderBottomWidth: isLastRow ? 0 : 1,
    borderColor: "#000",
    ...(height !== undefined && { height }),
  }

  return (
    <View style={[styles.textBold, { width: baseWidth }, borders, style]}>
      <Text>{children}</Text>
    </View>
  )
}

const Td: React.FC<CellProps> = ({
  children,
  style,
  width,
  height,
  colSpan,
  isLast = false,
  isLastRow = false,
  isOdd = false,
}) => {
  const baseWidth = typeof width === 'string' && colSpan
    ? `${(parseFloat(width) * colSpan).toFixed(2)}%`
    : width

  const borders = {
    borderRightWidth: isLast ? 0 : 1,
    borderBottomWidth: isLastRow ? 0 : 1,
    borderColor: "#000",
    ...(height !== undefined && { height }),
  }

  return (
    <View style={[
      styles.text,
      isOdd && styles.zebraOdd,
      { width: baseWidth },
      borders,
      style,
    ]}>
      <Text>{children}</Text>
    </View>
  )
}

export { Table, Thead, Tbody, Tr, Th, Td }
