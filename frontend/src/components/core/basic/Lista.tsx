import React from "react"
import { View, Text, StyleSheet, Svg, Circle, Rect } from "@react-pdf/renderer"

interface ListProps {
  children: React.ReactNode
  style?: any
  start?: number
  type?: "disc" | "circle" | "square" | "none" | "decimal" | "lower-alpha" | "upper-alpha" | "lower-roman" | "upper-roman"
  fontSize?: number
  bulletColor?: string
}

interface ListItemProps {
  children: React.ReactNode
  style?: any
}

interface LIProps extends ListItemProps {
  bulletType?: string
  isOrdered?: boolean
  index?: number
  start?: number
  fontSize?: number
  bulletColor?: string
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
    alignItems: "center",
  },
  bulletPoint: {
    width: 15,
    marginRight: 5,
  },
  bulletShapeWrap: {
    width: 15,
    marginRight: 5,
    alignItems: "center",
  },
  itemContent: {
    flex: 1,
  },
})

const getBulletPoint = (type: string) => {
  switch (type) {
    case "disc":
      return "•"
    case "none":
      return ""
    default:
      return "•"
  }
}

const SHAPE_SIZE = 6

const ShapeBullet: React.FC<{ type: "circle" | "square"; color?: string }> = ({
  type,
  color = "#000",
}) => {
  return (
    <Svg width={SHAPE_SIZE} height={SHAPE_SIZE} viewBox={`0 0 ${SHAPE_SIZE} ${SHAPE_SIZE}`}>
      {type === "circle" ? (
        <Circle
          cx={SHAPE_SIZE / 2}
          cy={SHAPE_SIZE / 2}
          r={SHAPE_SIZE / 2 - 0.5}
          stroke={color}
          strokeWidth={1}
          fill="none"
        />
      ) : (
        <Rect x={0} y={0} width={SHAPE_SIZE} height={SHAPE_SIZE} fill={color} />
      )}
    </Svg>
  )
}

const getOrderedMarker = (index: number, type = "decimal", start = 1) => {
  const actualIndex = start + index - 1

  switch (type) {
    case "none":
      return ""
    case "lower-alpha":
      return String.fromCharCode(97 + (((actualIndex - 1) % 26) + 26) % 26) + "."
    case "upper-alpha":
      return String.fromCharCode(65 + (((actualIndex - 1) % 26) + 26) % 26) + "."
    case "lower-roman":
      return toRoman(actualIndex).toLowerCase() + "."
    case "upper-roman":
      return toRoman(actualIndex) + "."
    case "decimal":
    default:
      return actualIndex + "."
  }
}

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
export const UL: React.FC<ListProps> = ({ children, style, type = "disc", fontSize, bulletColor }) => {
  const validChildren = React.Children.toArray(children).filter(
    React.isValidElement
  ) as React.ReactElement<any>[]

  const childrenWithBullets = validChildren.map((child, index) => {
    const childProps = child.props as { fontSize?: number; bulletColor?: string }
    return React.cloneElement(child, {
      bulletType: type,
      isOrdered: false,
      index: index + 1,
      fontSize: childProps.fontSize ?? fontSize,
      bulletColor: childProps.bulletColor ?? bulletColor,
    })
  })

  return <View style={[styles.ul, style]}>{childrenWithBullets}</View>
}

// OL
export const OL: React.FC<ListProps> = ({ children, style, type = "decimal", start = 1, fontSize, bulletColor }) => {
  const validChildren = React.Children.toArray(children).filter(
    React.isValidElement
  ) as React.ReactElement<any>[]

  const childrenWithNumbers = validChildren.map((child, index) => {
    const childProps = child.props as { fontSize?: number; bulletColor?: string }
    return React.cloneElement(child, {
      bulletType: type,
      isOrdered: true,
      index: index + 1,
      start,
      fontSize: childProps.fontSize ?? fontSize,
      bulletColor: childProps.bulletColor ?? bulletColor,
    })
  })

  return <View style={[styles.ol, style]}>{childrenWithNumbers}</View>
}

// LI
export const LI: React.FC<LIProps> = ({
  children,
  style,
  bulletType = "disc",
  isOrdered = false,
  index = 1,
  start = 1,
  fontSize,
  bulletColor,
}) => {
  const isShapeBullet = !isOrdered && (bulletType === "circle" || bulletType === "square")
  const hasExplicitFontSize = fontSize !== undefined
  const hasExplicitBulletColor = bulletColor !== undefined

  const marker = isOrdered
    ? getOrderedMarker(index, bulletType, start)
    : getBulletPoint(bulletType)

  const shapeExtraStyles = hasExplicitFontSize
    ? [{ alignSelf: "flex-start" as const, marginTop: (fontSize! - SHAPE_SIZE) / 2 }]
    : []

  const markerExtraStyles = [
    ...(hasExplicitFontSize ? [{ fontSize: fontSize! }] : []),
    ...(hasExplicitBulletColor ? [{ color: bulletColor! }] : []),
  ]

  return (
    <View style={[styles.li, style]}>
      {isShapeBullet ? (
        <View style={[styles.bulletShapeWrap, ...shapeExtraStyles]}>
          <ShapeBullet type={bulletType as "circle" | "square"} color={bulletColor} />
        </View>
      ) : (
        <Text style={[styles.bulletPoint, ...markerExtraStyles]}>{marker}</Text>
      )}
      <View style={styles.itemContent}>
        {typeof children === "string" ? (
          <Text style={hasExplicitFontSize ? { fontSize } : undefined}>{children}</Text>
        ) : (
          children
        )}
      </View>
    </View>
  )
}