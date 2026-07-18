import React from "react"
import { View, Text, StyleSheet, Svg, Circle, Rect } from "@react-pdf/renderer"

interface ListProps {
  children: React.ReactNode
  style?: any
  start?: number
  type?: "disc" | "circle" | "square" | "decimal" | "lower-alpha" | "upper-alpha" | "lower-roman" | "upper-roman"
  fontSize?: number
  // Color del bullet (marcador de texto o forma SVG). Si no se especifica:
  // - Marcador de texto (disc/decimal/alpha/roman): hereda el color del texto ambiente
  //   (de cualquier View/Text ancestro con `color` en su style), igual que cualquier <Text>.
  // - Forma SVG (circle/square): @react-pdf/renderer NO resuelve herencia de color para
  //   fill/stroke de Svg (probado con currentColor y sin fill: siempre cae a un valor fijo,
  //   nunca al color heredado). Sin bulletColor, se usa negro (#000) como default seguro.
  bulletColor?: string
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

// Marcadores lista desordenada que SÍ existen en WinAnsi (fuentes base tipo Helvetica)
// "circle" y "square" NO se resuelven de forma fiable como glifo de texto: se dibujan aparte (ver ShapeBullet)
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

// Formas dibujadas 100% en SVG vectorial: no dependen de ningún glifo de fuente,
// así que nunca se corrompen (a diferencia de "○" U+25CB, que Helvetica no mapea bien).
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
export const UL: React.FC<ListProps> = ({ children, style, type = "disc", fontSize, bulletColor }) => {
  const childrenWithBullets = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      const childProps = child.props as { fontSize?: number; bulletColor?: string }
      return React.cloneElement(child as React.ReactElement<any>, {
        bulletType: type,
        isOrdered: false,
        index: index + 1,
        // Si el LI ya trae su propio fontSize/bulletColor, ese gana sobre el heredado del UL —
        // de lo contrario cloneElement siempre pisa la prop local con la del padre.
        fontSize: childProps.fontSize ?? fontSize,
        bulletColor: childProps.bulletColor ?? bulletColor,
      })
    }
    return child
  })

  return <View style={[styles.ul, style]}>{childrenWithBullets}</View>
}

// OL
export const OL: React.FC<ListProps> = ({ children, style, type = "decimal", start = 1, fontSize, bulletColor }) => {
  const childrenWithNumbers = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      const childProps = child.props as { fontSize?: number; bulletColor?: string }
      return React.cloneElement(child as React.ReactElement<any>, {
        bulletType: type,
        isOrdered: true,
        index: index + 1,
        start,
        // Si el LI ya trae su propio fontSize/bulletColor, ese gana sobre el heredado del OL —
        // de lo contrario cloneElement siempre pisa la prop local con la del padre.
        fontSize: childProps.fontSize ?? fontSize,
        bulletColor: childProps.bulletColor ?? bulletColor,
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
    fontSize?: number
    bulletColor?: string
  }
> = ({
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

  // Sin fontSize explícito: dejamos que `alignItems: "center"` del row centre el bullet
  // dinámicamente contra la altura real del texto (funciona bien en el caso default,
  // sin lineHeight custom, que es lo más común).
  //
  // Con fontSize explícito: el usuario nos dijo el tamaño real del texto, así que
  // calculamos el offset nosotros mismos y lo forzamos con alignSelf: "flex-start",
  // anulando el auto-centrado del row. Esto es necesario porque un lineHeight > 1
  // en @react-pdf/renderer añade espacio extra DEBAJO de la tinta (no repartido
  // arriba/abajo), así que el auto-centrado por altura de caja se desvía cuanto
  // mayor es el lineHeight — con fontSize conocido evitamos depender de esa caja.
  //
  // Nota: se usa spread condicional (array vacío vs array de un elemento) en vez de
  // `condicion ? {...} : null`, porque el tipado de Style en @react-pdf/renderer no
  // acepta `null` como miembro de un array de estilos.
  const shapeExtraStyles = hasExplicitFontSize
    ? [{ alignSelf: "flex-start" as const, marginTop: (fontSize! - SHAPE_SIZE) / 2 }]
    : []

  // Marcador de TEXTO (disc/decimal/alpha/roman): si no se pasa bulletColor, NO fijamos
  // color explícito — así el <Text> hereda de forma nativa el color de cualquier
  // View/Text ancestro (confirmado: @react-pdf/renderer sí cascada `color` en Text).
  const markerExtraStyles = [
    ...(hasExplicitFontSize ? [{ fontSize: fontSize! }] : []),
    ...(hasExplicitBulletColor ? [{ color: bulletColor! }] : []),
  ]

  return (
    <View style={[styles.li, style]}>
      {isShapeBullet ? (
        <View style={[styles.bulletShapeWrap, ...shapeExtraStyles]}>
          {/* Marcador de FORMA (circle/square, SVG): a diferencia del Text de arriba,
              @react-pdf/renderer NO resuelve herencia de color para fill/stroke de Svg
              (probado con currentColor como atributo, como style, y con fill omitido:
              las 3 vías caen a un valor fijo, nunca al color heredado del ancestro).
              Por eso aquí SÍ hace falta un fallback fijo — ShapeBullet usa "#000" si
              no se pasa bulletColor. */}
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