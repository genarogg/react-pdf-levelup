import React from "react"
import { View, Text, StyleSheet } from "@react-pdf/renderer"

interface ListProps {
  children: React.ReactNode
  style?: any
  start?: number
  type?: "disc" | "circle" | "square" | "decimal" | "lower-alpha" | "upper-alpha" | "lower-roman" | "upper-roman"
}

interface ListItemProps {
  children: React.ReactNode
  style?: any
}

const styles = StyleSheet.create({
  ul: {
    marginBottom: 10,
    paddingLeft: 15,
  },
  ol: {
    marginBottom: 10,
    paddingLeft: 15,
  },
  li: {
    marginBottom: 5,
    flexDirection: "row",
  },
  bulletPoint: {
    width: 15,
    marginRight: 5,
    fontSize: 12,
  },
  itemContent: {
    flex: 1,
  },
})

// Marcadores lista desordenada
const getBulletPoint = (type = "disc") => {
  switch (type) {
    case "circle":
      return "○"
    case "square":
      return "■"
    case "disc":
    default:
      return "•"
  }
}

// Marcadores lista ordenada
const getOrderedMarker = (index: number, type = "decimal", start = 1) => {
  const actualIndex = start + index - 1

  switch (type) {
    case "lower-alpha":
      return String.fromCharCode(97 + ((actualIndex - 1) % 26)) + "."
    case "upper-alpha":
      return String.fromCharCode(65 + ((actualIndex - 1) % 26)) + "."
    case "lower-roman":
      return toRoman(actualIndex).toLowerCase() + "."
    case "upper-roman":
      return toRoman(actualIndex) + "."
    case "decimal":
    default:
      return actualIndex + "."
  }
}

// Conversión a romano
const toRoman = (num: number): string => {
  if (num <= 0 || num > 3999) return String(num)

  const romanNumerals = [
    ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
    ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"],
    ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"],
    ["", "M", "MM", "MMM"],
  ]

  return (
    romanNumerals[3][Math.floor(num / 1000)] +
    romanNumerals[2][Math.floor((num % 1000) / 100)] +
    romanNumerals[1][Math.floor((num % 100) / 10)] +
    romanNumerals[0][num % 10]
  )
}

// UL
export const UL: React.FC<ListProps> = ({ children, style, type = "disc" }) => {
  const childrenWithBullets = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        bulletType: type,
        isOrdered: false,
        index: index + 1,
      })
    }
    return child
  })

  return <View style={[styles.ul, style]}>{childrenWithBullets}</View>
}

// OL
export const OL: React.FC<ListProps> = ({ children, style, type = "decimal", start = 1 }) => {
  const childrenWithNumbers = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        bulletType: type,
        isOrdered: true,
        index: index + 1,
        start,
      })
    }
    return child
  })

  return <View style={[styles.ol, style]}>{childrenWithNumbers}</View>
}

// LI
export const LI: React.FC<
  ListItemProps & {
    bulletType?: string
    isOrdered?: boolean
    index?: number
    start?: number
  }
> = ({ children, style, bulletType = "disc", isOrdered = false, index = 1, start = 1 }) => {
  const marker = isOrdered
    ? getOrderedMarker(index, bulletType, start)
    : getBulletPoint(bulletType)

  return (
    <View style={[styles.li, style]}>
      <Text style={styles.bulletPoint}>{marker}</Text>
      <View style={styles.itemContent}>
        {typeof children === "string" ? <Text>{children}</Text> : children}
      </View>
    </View>
  )
}