import React from "react"
import {
  View,
  Svg,
  Defs,
  Rect,
  LinearGradient,
  RadialGradient,
  Stop,
  StyleSheet,
} from "@react-pdf/renderer"

type ViewBaseProps = React.ComponentProps<typeof View>

interface GradiantProps extends Omit<ViewBaseProps, "style"> {
  colors: (string | { color: string; offset?: string | number })[]
  width?: number | string
  height?: number | string
  type?: "linear" | "radial"
  shape?: "square" | "circle"
  angle?: number
  children?: React.ReactNode
  style?: any
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },
  svgLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    position: "relative",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
})

// Convierte un ángulo (grados) en coordenadas x1,y1,x2,y2 (0-1) para LinearGradient
const angleToCoords = (angle: number) => {
  const rad = (angle * Math.PI) / 180
  const x2 = 0.5 + 0.5 * Math.cos(rad)
  const y2 = 0.5 + 0.5 * Math.sin(rad)
  const x1 = 1 - x2
  const y1 = 1 - y2
  return { x1, y1, x2, y2 }
}

const normalizeStops = (
  colors: GradiantProps["colors"]
) =>
  colors.map((c, i) => {
    if (typeof c === "string") {
      const offset =
        colors.length === 1 ? "0%" : `${(i / (colors.length - 1)) * 100}%`
      return { color: c, offset }
    }
    return {
      color: c.color,
      offset: c.offset ?? `${(i / (colors.length - 1)) * 100}%`,
    }
  })

// opacity solo se hereda dentro del árbol de <Svg> como PROP (Svg -> G -> Rect),
// nunca desde el `style` de un View ancestro (resolveInheritance corta la
// herencia en cuanto encuentra un nodo Svg). Por eso hay que extraerlo del
// style que llega (que puede ser objeto plano, array, o incluso undefined)
// y reenviarlo explícitamente como prop del propio <Svg>.
const extractOpacity = (s: any): number | undefined => {
  if (s == null) return undefined
  if (Array.isArray(s)) {
    // Recorremos en orden: el último valor definido gana, igual que
    // pasaría si React Native/StyleSheet mezclara el array por spread.
    return s.reduce<number | undefined>((acc, item) => {
      const o = extractOpacity(item)
      return o === undefined ? acc : o
    }, undefined)
  }
  return s.opacity
}

const Gradiant: React.FC<GradiantProps> = React.memo(
  ({
    colors,
    width = 100,
    height = 100,
    type = "linear",
    shape = "square",
    angle = 90,
    children,
    style,
    ...rest
  }) => {
    const stops = normalizeStops(colors)
    const gradientId = React.useId
      ? `gradiant-${React.useId()}`
      : `gradiant-${Math.random().toString(36).slice(2)}`

    const isCircle = shape === "circle"
    const { x1, y1, x2, y2 } = angleToCoords(angle)

    // opacity extraído del style que llega desde afuera (prop `style` del
    // propio Gradiant), para reenviarlo como prop nativa del <Svg> más abajo.
    const svgOpacity = extractOpacity(style)

    // viewBox proporcional al aspect ratio real del bloque, para que el
    // radial gradient no se deforme en elipse cuando width !== height.
    // Si width/height vienen como string (ej. "100%"), se usa 1:1 por defecto.
    const numW = typeof width === "number" ? width : 100
    const numH = typeof height === "number" ? height : 100
    const viewBoxWidth = numW
    const viewBoxHeight = numH
    // cx/cy/r como números absolutos (no "%"): el motor SVG de
    // @react-pdf/renderer no resuelve los porcentajes en userSpaceOnUse
    // con la fórmula estándar de la diagonal, así que el radio calculado
    // internamente quedaba más chico de lo esperado y el resto del bloque
    // se rellenaba con el último color sólido en vez de difuminarse.
    // Calculando el radio hasta la esquina más lejana aseguramos que el
    // degradado llegue completo (difuminado) hasta los bordes.
    const radialCx = viewBoxWidth / 2
    const radialCy = viewBoxHeight / 2
    // Para "circle" el área visible es un círculo inscrito (recortado con
    // borderRadius), así que el degradado debe llegar exactamente a ese
    // borde (mitad del lado menor). Para "square"/rect el área visible es
    // todo el rectángulo, así que debe llegar a la esquina más lejana.
    // Si el radio se calcula igual en ambos casos, en "circle" el último
    // color nunca se alcanza dentro del área visible (se corta antes).
    const radialR =
      shape === "circle"
        ? Math.min(viewBoxWidth, viewBoxHeight) / 2
        : Math.sqrt(
            Math.pow(viewBoxWidth / 2, 2) + Math.pow(viewBoxHeight / 2, 2)
          )

    const shapeStyle: Record<string, any> = {
      width,
      height,
      overflow: "hidden",
    }
    // borderRadius debe ser un número (no "%"): con width/height numéricos
    // usamos la mitad del lado menor para un círculo exacto; si vienen como
    // string (ej. "100%") no hay forma de calcularlo, así que se usa un
    // número suficientemente grande para que siga redondeando por completo.
    if (isCircle) {
      const numericWidth = typeof width === "number" ? width : undefined
      const numericHeight = typeof height === "number" ? height : undefined
      shapeStyle.borderRadius =
        numericWidth !== undefined && numericHeight !== undefined
          ? Math.min(numericWidth, numericHeight) / 2
          : 9999
    }

    return (
      <View
        style={[styles.wrapper, shapeStyle, style]}
        {...rest}
      >
        <Svg
          style={styles.svgLayer}
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          opacity={svgOpacity}
        >
          <Defs>
            {type === "radial" ? (
              <RadialGradient
                id={gradientId}
                cx={radialCx}
                cy={radialCy}
                r={radialR}
                gradientUnits="userSpaceOnUse"
              >
                {stops.map((s, i) => (
                  <Stop key={i} offset={s.offset} stopColor={s.color} />
                ))}
              </RadialGradient>
            ) : (
              <LinearGradient
                id={gradientId}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
              >
                {stops.map((s, i) => (
                  <Stop key={i} offset={s.offset} stopColor={s.color} />
                ))}
              </LinearGradient>
            )}
          </Defs>
          <Rect
            x="0"
            y="0"
            width={viewBoxWidth}
            height={viewBoxHeight}
            fill={`url(#${gradientId})`}
          />
        </Svg>

        {children ? <View style={styles.content}>{children}</View> : null}
      </View>
    )
  }
)

Gradiant.displayName = "Gradiant"

export default Gradiant