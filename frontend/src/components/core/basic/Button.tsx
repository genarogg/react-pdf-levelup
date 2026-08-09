import React from "react"
import { Text, StyleSheet, Link, View } from "@react-pdf/renderer"

type ViewBaseProps = React.ComponentProps<typeof View>
type LinkBaseProps = React.ComponentProps<typeof Link>

type ButtonVariant = "primary" | "secondary" | "success" | "danger" | "outline"
type ButtonSize = "sm" | "md" | "lg"

interface ButtonOwnProps {
  children?: React.ReactNode
  style?: any
  textStyle?: any
  width?: number | string
  height?: number | string
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
}

// Discriminated union on `href`:
// - with `href` → extra props must be valid `Link` props (e.g. `hitSlop`).
// - without `href` → extra props must be valid `View` props.
// This stops Link-only props from being accepted without `href` (and vice versa),
// which the previous single-intersection type let through silently.
type ButtonLinkProps = ButtonOwnProps &
  Omit<LinkBaseProps, keyof ButtonOwnProps | "href"> & { href: string }

type ButtonViewProps = ButtonOwnProps &
  Omit<ViewBaseProps, keyof ButtonOwnProps | "href"> & { href?: undefined }

type ButtonProps = ButtonLinkProps | ButtonViewProps

const COLORS = {
  primary: { bg: "#4338ca", text: "#ffffff", border: "#4338ca" },
  secondary: { bg: "#e6e8f0", text: "#1a1a2e", border: "#e6e8f0" },
  success: { bg: "#22C55E", text: "#ffffff", border: "#22C55E" },
  danger: { bg: "#EF4444", text: "#ffffff", border: "#EF4444" },
  outline: { bg: "transparent", text: "#4338ca", border: "#4338ca" },
}

const SIZES: Record<ButtonSize, { paddingVertical: number; paddingHorizontal: number; fontSize: number; borderRadius: number }> = {
  sm: { paddingVertical: 4, paddingHorizontal: 10, fontSize: 9, borderRadius: 4 },
  md: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 11, borderRadius: 6 },
  lg: { paddingVertical: 12, paddingHorizontal: 22, fontSize: 13, borderRadius: 8 },
}

// Grosor del "anillo" que simula el borde en variant="outline".
// No se usa borderWidth real para evitar issue #395 de @react-pdf/renderer
// (stroke + borderRadius distorsiona las curvas de las esquinas).
const OUTLINE_RING_WIDTH = 1.5

// Color de fondo asumido detrás del botón (página/contenedor).
// Se necesita porque la simulación por fill requiere pintar el interior
// con un color opaco conocido en vez de dejarlo transparente.
const ASSUMED_BACKGROUND = "#ffffff"

const styles = StyleSheet.create({
  base: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
  },
  text: {
    fontWeight: "bold",
    textAlign: "center",
  },
})

const Button: React.FC<ButtonProps> = (props) => {
  const {
    children,
    style,
    textStyle,
    width,
    height,
    href,
    variant = "primary",
    size = "md",
    disabled = false,
    ...rest
  } = props

  const palette = COLORS[variant] ?? COLORS.primary
  const dims = SIZES[size] ?? SIZES.md
  const isOutline = variant === "outline"
  const ringColor = disabled ? "#c7c9d6" : palette.border

  const containerStyle = [
    styles.base,
    {
      backgroundColor: isOutline ? ringColor : disabled ? "#c7c9d6" : palette.bg,
      borderRadius: dims.borderRadius,
      ...(isOutline
        ? { padding: OUTLINE_RING_WIDTH }
        : { paddingVertical: dims.paddingVertical, paddingHorizontal: dims.paddingHorizontal }),
      ...(width !== undefined ? { width } : {}),
      ...(height !== undefined ? { height } : {}),
    },
    style,
  ]

  const label = (
    <Text style={[styles.text, { fontSize: dims.fontSize, color: disabled ? "#8a8d9e" : palette.text }, textStyle]}>
      {children}
    </Text>
  )

  const content = isOutline ? (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: ASSUMED_BACKGROUND,
        borderRadius: Math.max(dims.borderRadius - OUTLINE_RING_WIDTH, 0),
        paddingVertical: Math.max(dims.paddingVertical - OUTLINE_RING_WIDTH, 0),
        paddingHorizontal: Math.max(dims.paddingHorizontal - OUTLINE_RING_WIDTH, 0),
      }}
    >
      {label}
    </View>
  ) : (
    label
  )

  if (href && !disabled) {
    // `rest` está tipado como Omit<LinkBaseProps, ...> gracias al discriminated
    // union de arriba; el `as` solo resuelve que TS no reduce `rest` a un tipo
    // único tras desestructurar de una unión, no relaja el contrato con quien
    // consume el componente.
    return (
      <Link {...(rest as Omit<LinkBaseProps, keyof ButtonOwnProps | "href">)} src={href} style={containerStyle}>
        {content}
      </Link>
    )
  }

  return (
    <View style={containerStyle} {...(rest as Omit<ViewBaseProps, keyof ButtonOwnProps | "href">)}>
      {content}
    </View>
  )
}

export default Button
export type { ButtonProps, ButtonVariant, ButtonSize }