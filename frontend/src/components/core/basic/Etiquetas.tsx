import React from "react"
import { Text, StyleSheet, Link, View } from "@react-pdf/renderer"

type TextBaseProps = React.ComponentProps<typeof Text>
type ViewBaseProps = React.ComponentProps<typeof View>
type LinkBaseProps = React.ComponentProps<typeof Link>

interface TextProps extends Omit<TextBaseProps, "style"> {
  children?: React.ReactNode
  style?: any
  href?: string
}

interface DivProps extends Omit<ViewBaseProps, "style"> {
  children?: React.ReactNode
  style?: any
}

interface LinkProps extends Omit<LinkBaseProps, "style"> {
  children?: React.ReactNode
  style?: any
  href?: string
}

const styles = StyleSheet.create({
  p: {
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
    fontSize: 9,
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
    marginTop: 6,
    marginBottom: 6,
  },
  hr: {
    width: "100%",
    borderTop: "1px solid #000",
    marginTop: 6,
    marginBottom: 6,
  },
})

const P: React.FC<TextProps> = ({ children, style, ...rest }) => (
  <Text style={[styles.p, style]} {...rest}>{children}</Text>
)

const H1: React.FC<TextProps> = ({ children, style, ...rest }) => (
  <Text style={[styles.h1, style]} {...rest}>{children}</Text>
)

const H2: React.FC<TextProps> = ({ children, style, ...rest }) => (
  <Text style={[styles.h2, style]} {...rest}>{children}</Text>
)

const H3: React.FC<TextProps> = ({ children, style, ...rest }) => (
  <Text style={[styles.h3, style]} {...rest}>{children}</Text>
)

const H4: React.FC<TextProps> = ({ children, style, ...rest }) => (
  <Text style={[styles.h4, style]} {...rest}>{children}</Text>
)

const H5: React.FC<TextProps> = ({ children, style, ...rest }) => (
  <Text style={[styles.h5, style]} {...rest}>{children}</Text>
)

const H6: React.FC<TextProps> = ({ children, style, ...rest }) => (
  <Text style={[styles.h6, style]} {...rest}>{children}</Text>
)

const Strong: React.FC<TextProps> = ({ children, style, ...rest }) => (
  <Text style={[styles.strong, style]} {...rest}>{children}</Text>
)

const Em: React.FC<TextProps> = ({ children, style, ...rest }) => (
  <Text style={[styles.em, style]} {...rest}>{children}</Text>
)

const U: React.FC<TextProps> = ({ children, style, ...rest }) => (
  <Text style={[styles.u, style]} {...rest}>{children}</Text>
)

const Small: React.FC<TextProps> = ({ children, style, ...rest }) => (
  <Text style={[styles.small, style]} {...rest}>{children}</Text>
)

const Blockquote: React.FC<TextProps> = ({ children, style, ...rest }) => (
  <Text style={[styles.blockquote, style]} {...rest}>{children}</Text>
)

const Mark: React.FC<TextProps> = ({ children, style, ...rest }) => (
  <Text style={[styles.mark, style]} {...rest}>{children}</Text>
)

const A: React.FC<LinkProps> = ({ children, style, href, ...rest }) => (
  <Link src={href} style={[styles.A, style]} {...rest}>{children}</Link>
)

const BR: React.FC<TextProps> = ({ style, ...rest }) => (
  <Text style={[styles.br, style]} {...rest}>{"\n"}</Text>
)

const HR: React.FC<DivProps> = ({ style, ...rest }) => (
  <View style={[styles.hr, style]} {...rest} />
)

const Span: React.FC<TextProps> = ({ children, style, ...rest }) => (
  <Text style={style} {...rest}>{children}</Text>
)

const Div: React.FC<DivProps> = ({ children, style, ...rest }) => (
  <View style={style} {...rest}>{children}</View>
)

export { P, A, H1, H2, H3, H4, H5, H6, Strong, Em, U, Small, Blockquote, Mark, Span, BR, HR, Div }