import React from "react"
import { Text, StyleSheet, Link, View } from "@react-pdf/renderer"

interface TextProps {
  children: React.ReactNode
  style?: any
  href?: string
}

const styles = StyleSheet.create({
  p: {
    fontSize: 12,
    marginBottom: 5,
    lineHeight: 1.2,
  },
  h1: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  h2: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  h3: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  h4: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  h5: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  h6: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 0,
  },
  strong: {
    fontWeight: "bold",
  },
  em: {
    fontStyle: "italic",
  },
  u: {
    textDecoration: "underline",
  },
  small: {
    fontSize: 10,
  },
  blockquote: {
    marginLeft: 20,
    marginRight: 20,
    fontStyle: "italic",
    borderLeft: "4px solid #ccc",
    paddingLeft: 10,
  },
  mark: {
    backgroundColor: "yellow",
  },
  A: {
    color: "#3d65fd",
    textDecoration: "none",
  },
  br: {
    width: "100%",
    height: 1,
    marginTop: 7,
    marginBottom: 7,
  },
  header: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 10,
    color: "#666",
    paddingHorizontal: 40,
  }
})

const P: React.FC<TextProps> = ({ children, style }) => {
  return <Text style={[styles.p, style]}>{children}</Text>
}

const H1: React.FC<TextProps> = ({ children, style }) => {
  return <Text style={[styles.h1, style]}>{children}</Text>
}

const H2: React.FC<TextProps> = ({ children, style }) => {
  return <Text style={[styles.h2, style]}>{children}</Text>
}

const H3: React.FC<TextProps> = ({ children, style }) => {
  return <Text style={[styles.h3, style]}>{children}</Text>
}

const H4: React.FC<TextProps> = ({ children, style }) => {
  return <Text style={[styles.h4, style]}>{children}</Text>
}

const H5: React.FC<TextProps> = ({ children, style }) => {
  return <Text style={[styles.h5, style]}>{children}</Text>
}

const H6: React.FC<TextProps> = ({ children, style }) => {
  return <Text style={[styles.h6, style]}>{children}</Text>
}

const Strong: React.FC<TextProps> = ({ children, style }) => {
  return <Text style={[styles.strong, style]}>{children}</Text>
}

const Em: React.FC<TextProps> = ({ children, style }) => {
  return <Text style={[styles.em, style]}>{children}</Text>
}

const U: React.FC<TextProps> = ({ children, style }) => {
  return <Text style={[styles.u, style]}>{children}</Text>
}

const Small: React.FC<TextProps> = ({ children, style }) => {
  return <Text style={[styles.small, style]}>{children}</Text>
}

const Blockquote: React.FC<TextProps> = ({ children, style }) => {
  return <Text style={[styles.blockquote, style]}>{children}</Text>
}

const Mark: React.FC<TextProps> = ({ children, style }) => {
  return <Text style={[styles.mark, style]}>{children}</Text>
}

const A: React.FC<TextProps> = ({ children, style, href }) => {
  return (
    <Link src={href} style={[styles.A, style]}>
      {children}
    </Link>
  )
}

const BR: React.FC<{ style?: any }> = ({ style }) => {
  return <Text style={[styles.br, style]}>{"\n"}</Text>
}

const Span: React.FC<TextProps> = ({ children, style }) => {
  return <Text style={[style]}>{children}</Text>
}

interface HeaderProps {
  children: React.ReactNode
  style?: any
  fixed?: boolean
}

const Header: React.FC<HeaderProps> = ({ children, style, fixed = false }) => {
  return (
    <View style={[styles.header, style]} fixed={fixed}>
      {typeof children === "string" ? <Text>{children}</Text> : children}
    </View>
  )
}

export { P, A, H1, H2, H3, H4, H5, H6, Strong, Em, U, Small, Blockquote, Mark, Span, BR, Header }

