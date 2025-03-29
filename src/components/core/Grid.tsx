import type React from "react"
import { View, StyleSheet } from "@react-pdf/renderer"

interface ContainerProps {
  children: React.ReactNode
  style?: any
}

interface RowProps {
  children: React.ReactNode
  style?: any
}

interface ColProps {
  children: React.ReactNode
  style?: any
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -5,
  },
  col: {
    paddingHorizontal: 5,
  },
  col1: { width: "8.33%" },
  col2: { width: "16.66%" },
  col3: { width: "25%" },
  col4: { width: "33.33%" },
  col5: { width: "41.66%" },
  col6: { width: "50%" },
  col7: { width: "58.33%" },
  col8: { width: "66.66%" },
  col9: { width: "75%" },
  col10: { width: "83.33%" },
  col11: { width: "91.66%" },
  col12: { width: "100%" },
})

export const Container: React.FC<ContainerProps> = ({ children, style }) => {
  return <View style={[styles.container, style]}>{children}</View>
}

export const Row: React.FC<RowProps> = ({ children, style }) => {
  return <View style={[styles.row, style]}>{children}</View>
}

export const Col1: React.FC<ColProps> = ({ children, style }) => {
  return <View style={[styles.col, styles.col1, style]}>{children}</View>
}

export const Col2: React.FC<ColProps> = ({ children, style }) => {
  return <View style={[styles.col, styles.col2, style]}>{children}</View>
}

export const Col3: React.FC<ColProps> = ({ children, style }) => {
  return <View style={[styles.col, styles.col3, style]}>{children}</View>
}

export const Col4: React.FC<ColProps> = ({ children, style }) => {
  return <View style={[styles.col, styles.col4, style]}>{children}</View>
}

export const Col5: React.FC<ColProps> = ({ children, style }) => {
  return <View style={[styles.col, styles.col5, style]}>{children}</View>
}

export const Col6: React.FC<ColProps> = ({ children, style }) => {
  return <View style={[styles.col, styles.col6, style]}>{children}</View>
}

export const Col7: React.FC<ColProps> = ({ children, style }) => {
  return <View style={[styles.col, styles.col7, style]}>{children}</View>
}

export const Col8: React.FC<ColProps> = ({ children, style }) => {
  return <View style={[styles.col, styles.col8, style]}>{children}</View>
}

export const Col9: React.FC<ColProps> = ({ children, style }) => {
  return <View style={[styles.col, styles.col9, style]}>{children}</View>
}

export const Col10: React.FC<ColProps> = ({ children, style }) => {
  return <View style={[styles.col, styles.col10, style]}>{children}</View>
}

export const Col11: React.FC<ColProps> = ({ children, style }) => {
  return <View style={[styles.col, styles.col11, style]}>{children}</View>
}

export const Col12: React.FC<ColProps> = ({ children, style }) => {
  return <View style={[styles.col, styles.col12, style]}>{children}</View>
}

