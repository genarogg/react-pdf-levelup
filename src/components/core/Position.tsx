import type React from "react"
import { View, StyleSheet } from "@react-pdf/renderer"

interface PositionProps {
  children: React.ReactNode
  style?: any
}

const styles = StyleSheet.create({
  left: {
    textAlign: "left",
  },
  right: {
    textAlign: "right",
  },
  center: {
    textAlign: "center",
  },
})

const Left: React.FC<PositionProps> = ({ children, style }) => {
  return <View style={[styles.left, style]}>{children}</View>
}

const Right: React.FC<PositionProps> = ({ children, style }) => {
  return <View style={[styles.right, style]}>{children}</View>
}

const Center: React.FC<PositionProps> = ({ children, style }) => {
  return <View style={[styles.center, style]}>{children}</View>
}

export { Left, Right, Center }

