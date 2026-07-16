import React from "react"
import { Text, StyleSheet, View } from "@react-pdf/renderer"

type ViewProps = React.ComponentProps<typeof View>

interface BadgeProps extends Omit<ViewProps, "style"> {
  children?: React.ReactNode
  variant?: "default" | "active" | "pending" | "cancelled" | "success" | "warning" | "error" | "info"
  size?: "sm" | "md" | "lg"
  style?: any
}

const styles = StyleSheet.create({
  badge: {
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  
  // Tamaños
  sm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  md: {
    paddingHorizontal: 8,
    paddingVertical: 4,

  },
  lg: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  
  // Variantes - Default
  defaultBg: {
    backgroundColor: "#f3f4f6",
  },
  defaultText: {
    color: "#1f2937",
    fontWeight: "600",
  },
  
  // Variantes - Active
  activeBg: {
    backgroundColor: "#d1fae5",
  },
  activeText: {
    color: "#065f46",
    fontWeight: "600",
  },
  
  // Variantes - Pending
  pendingBg: {
    backgroundColor: "#fef3c7",
  },
  pendingText: {
    color: "#92400e",
    fontWeight: "600",
  },
  
  // Variantes - Cancelled
  cancelledBg: {
    backgroundColor: "#fee2e2",
  },
  cancelledText: {
    color: "#991b1b",
    fontWeight: "600",
  },
  
  // Variantes - Success
  successBg: {
    backgroundColor: "#dcfce7",
  },
  successText: {
    color: "#166534",
    fontWeight: "600",
  },
  
  // Variantes - Warning
  warningBg: {
    backgroundColor: "#fcd34d",
  },
  warningText: {
    color: "#78350f",
    fontWeight: "600",
  },
  
  // Variantes - Error
  errorBg: {
    backgroundColor: "#fca5a5",
  },
  errorText: {
    color: "#7c2d12",
    fontWeight: "600",
  },
  
  // Variantes - Info
  infoBg: {
    backgroundColor: "#bfdbfe",
  },
  infoText: {
    color: "#1e40af",
    fontWeight: "600",
  },

  badgeText: {
    fontWeight: "600",
  },
})

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  style,
  ...rest
}) => {
  // Obtener estilos de fondo según variante
  const getBackgroundStyle = () => {
    switch (variant) {
      case "active":
        return styles.activeBg
      case "pending":
        return styles.pendingBg
      case "cancelled":
        return styles.cancelledBg
      case "success":
        return styles.successBg
      case "warning":
        return styles.warningBg
      case "error":
        return styles.errorBg
      case "info":
        return styles.infoBg
      default:
        return styles.defaultBg
    }
  }

  // Obtener estilos de texto según variante
  const getTextStyle = () => {
    switch (variant) {
      case "active":
        return styles.activeText
      case "pending":
        return styles.pendingText
      case "cancelled":
        return styles.cancelledText
      case "success":
        return styles.successText
      case "warning":
        return styles.warningText
      case "error":
        return styles.errorText
      case "info":
        return styles.infoText
      default:
        return styles.defaultText
    }
  }

  // Obtener estilos de tamaño
  const getSizeStyle = () => {
    switch (size) {
      case "sm":
        return styles.sm
      case "lg":
        return styles.lg
      default:
        return styles.md
    }
  }

  return (
    <View
      style={[
        styles.badge,
        getBackgroundStyle(),
        getSizeStyle(),
        style,
      ]}
      {...rest}
    >
      <Text style={[styles.badgeText, getTextStyle()]}>
        {children}
      </Text>
    </View>
  )
}

export default Badge
