import React from "react"
import { Text, StyleSheet, Link, View } from "@react-pdf/renderer"

type TextBaseProps = React.ComponentProps<typeof Text>
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
  href?: string
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
}

// Cuando hay `href` el botón se renderiza como <Link> (acepta props de Link
// menos las que ya definimos arriba); sin `href` se renderiza como <View>
// (acepta props de View menos las que ya definimos arriba). El spread de
// `...rest` termina siendo válido para cualquiera de los dos casos porque
// solo se le pasan las props que el elemento final entiende.
type ButtonProps = ButtonOwnProps &
  Omit<ViewBaseProps, keyof ButtonOwnProps> &
  Omit<LinkBaseProps, keyof ButtonOwnProps>

const COLORS = {
  primary: { bg: "#4338ca", bgPressed: "#372fa3", text: "#ffffff", border: "#4338ca" },
  secondary: { bg: "#e6e8f0", bgPressed: "#d3d6e3", text: "#1a1a2e", border: "#e6e8f0" },
  success: { bg: "#22C55E", bgPressed: "#1a9d4a", text: "#ffffff", border: "#22C55E" },
  danger: { bg: "#EF4444", bgPressed: "#cc3636", text: "#ffffff", border: "#EF4444" },
  outline: { bg: "transparent", bgPressed: "#f5f6fa", text: "#4338ca", border: "#4338ca" },
}

const SIZES: Record<ButtonSize, { paddingVertical: number; paddingHorizontal: number; fontSize: number; borderRadius: number }> = {
  sm: { paddingVertical: 4, paddingHorizontal: 10, fontSize: 9, borderRadius: 4 },
  md: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 11, borderRadius: 6 },
  lg: { paddingVertical: 12, paddingHorizontal: 22, fontSize: 13, borderRadius: 8 },
}

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

const Button: React.FC<ButtonProps> = ({
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
}) => {
  const palette = COLORS[variant] ?? COLORS.primary
  const dims = SIZES[size] ?? SIZES.md

  const containerStyle = [
    styles.base,
    {
      backgroundColor: disabled ? "#c7c9d6" : palette.bg,
      borderColor: disabled ? "#c7c9d6" : palette.border,
      borderWidth: variant === "outline" ? 1.5 : 0,
      borderStyle: "solid" as const,
      paddingVertical: dims.paddingVertical,
      paddingHorizontal: dims.paddingHorizontal,
      borderRadius: dims.borderRadius,
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

  if (href && !disabled) {
    return (
      <Link src={href} style={containerStyle} {...(rest as LinkBaseProps)}>
        {label}
      </Link>
    )
  }

  return (
    <View style={containerStyle} {...(rest as ViewBaseProps)}>
      {label}
    </View>
  )
}

export default Button
export type { ButtonProps, ButtonVariant, ButtonSize }