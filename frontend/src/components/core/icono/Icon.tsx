import React from "react"
import {
  View,
  Svg,
  Path,
  G,
  Circle,
  Rect,
  Line,
  Ellipse,
  Polygon,
  Polyline,
} from "@react-pdf/renderer"
import * as Lucide from "lucide"

type IconNode = [string, Record<string, string | number>][]

type LucideIconFull = [string, Record<string, unknown>, IconNode]

const DEFAULT_VIEWBOX = "0 0 24 24"
const DEFAULT_STROKE_WIDTH = 2

function isIconNode(arr: unknown): arr is IconNode {
  return (
    Array.isArray(arr) &&
    arr.length > 0 &&
    arr.every(
      (item) =>
        Array.isArray(item) &&
        item.length >= 2 &&
        typeof item[0] === "string" &&
        typeof item[1] === "object" &&
        item[1] !== null
    )
  )
}

function normalizeIconData(value: unknown): LucideIconFull | null {
  if (!Array.isArray(value) || value.length < 1) return null
  if (value[0] === "svg" && value.length >= 3 && isIconNode(value[2])) {
    return value as LucideIconFull
  }
  if (isIconNode(value)) {
    return [
      "svg",
      {
        viewBox: DEFAULT_VIEWBOX,
        "stroke-width": DEFAULT_STROKE_WIDTH,
      },
      value,
    ]
  }
  return null
}

function pascalToKebab(str: string): string {
  return str
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .replace(/^-/, "")
}

function pascalToCamel(str: string): string {
  if (!str.length) return str
  return str[0].toLowerCase() + str.slice(1)
}

export interface IconProps {
  /** Nombre del icono de Lucide en PascalCase (ej: "Home", "FileText") */
  ico: string
  /** Color del trazo (stroke). Por defecto "currentColor" */
  color?: string
  /** Color de relleno. Por defecto "none" en iconos Lucide */
  fill?: string
  /** Tamaño en puntos. Por defecto 18 */
  size?: number
  /** Estilos del contenedor View */
  style?: any
}

/**
 * Renderiza iconos de Lucide dentro de documentos @react-pdf/renderer.
 * Usa el paquete `lucide` para los datos de los iconos y los dibuja con Svg/Path de react-pdf.
 *
 * @example
 * <Icon ico="Home" />
 * <Icon ico="FileText" size={24} color="#333" />
 * <Icon ico="Heart" fill="red" size={20} style={{ marginRight: 8 }} />
 */
function Icon({
  ico,
  color = "currentColor",
  fill = "none",
  size = 18,
  style,
}: IconProps) {
  const L = Lucide as Record<string, unknown>
  const kebab = pascalToKebab(ico)
  const camel = pascalToCamel(ico)
  const iconsObj = L.icons as Record<string, unknown> | undefined
  const rawIcon =
    iconsObj?.[ico] ??
    iconsObj?.[kebab] ??
    iconsObj?.[camel] ??
    L[ico] ??
    L[kebab] ??
    L[camel]

  const iconData = normalizeIconData(rawIcon)
  if (!iconData) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[Icon] No se encontró el icono "${ico}" en lucide. Prueba con el nombre en PascalCase (ej: FileText, Home) o kebab-case (file-text, home).`
      )
    }
    return <View style={style as any} />
  }

  const [, svgAttrs, iconNode] = iconData
  const viewBox = (svgAttrs.viewBox as string) ?? "0 0 24 24"
  const strokeWidth = (svgAttrs["stroke-width"] ?? svgAttrs.strokeWidth ?? 2) as number

  return (
    <View style={[{ width: size, height: size }, style] as any}>
      <Svg width={size} height={size} viewBox={viewBox}>
        {iconNode.map(([tag, attrs], i) => {
          const { "stroke-width": _sw, key: _k, ...rest } = attrs as Record<string, unknown>
          const props = {
            ...rest,
            stroke: color,
            fill: fill ?? (attrs.fill as string) ?? "none",
            strokeWidth: attrs["stroke-width"] ?? attrs.strokeWidth ?? strokeWidth,
          }

          switch (tag) {
            case "path":
              return <Path key={i} {...(props as React.ComponentProps<typeof Path>)} />
            case "g":
              return <G key={i} {...(props as React.ComponentProps<typeof G>)} />
            case "circle":
              return <Circle key={i} {...(props as React.ComponentProps<typeof Circle>)} />
            case "rect":
              return <Rect key={i} {...(props as React.ComponentProps<typeof Rect>)} />
            case "line":
              return <Line key={i} {...(props as React.ComponentProps<typeof Line>)} />
            case "ellipse":
              return <Ellipse key={i} {...(props as React.ComponentProps<typeof Ellipse>)} />
            case "polygon":
              return <Polygon key={i} {...(props as React.ComponentProps<typeof Polygon>)} />
            case "polyline":
              return <Polyline key={i} {...(props as React.ComponentProps<typeof Polyline>)} />
            default:
              return null
          }
        })}
      </Svg>
    </View>
  )
}

export default Icon
