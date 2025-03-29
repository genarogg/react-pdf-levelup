import type React from "react"
import { Text, View, StyleSheet } from "@react-pdf/renderer"

interface PageElementProps {
  children: React.ReactNode
  style?: any
  fixed?: boolean
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 10,
    color: "#666",
    paddingHorizontal: 40,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 10,
    color: "#666",
    paddingHorizontal: 40,
  },
})

const Header: React.FC<PageElementProps> = ({ children, style, fixed = false }) => {
  return (
    <View style={[styles.header, style]} fixed={fixed}>
      {typeof children === "string" ? <Text>{children}</Text> : children}
    </View>
  )
}

const Footer: React.FC<PageElementProps> = ({ children, style, fixed = false }) => {
  return (
    <View style={[styles.footer, style]} fixed={fixed}>
      {typeof children === "string" ? <Text>{children}</Text> : children}
    </View>
  )
}

export { Header, Footer }

