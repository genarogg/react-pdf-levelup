import type { ChartLayout, GraphSeries, GraphVariant } from "./graph.types"

// ---------------------------------------------------------------------------
// Paleta por defecto. Sin dependencia de ningún theme — un array fijo que
// una prop `colors?: string[]` puede pisar entero.
// ---------------------------------------------------------------------------

export const DEFAULT_COLORS = [
  "#2563eb",
  "#dc2626",
  "#16a34a",
  "#d97706",
  "#7c3aed",
  "#0891b2",
  "#db2777",
  "#65a30d",
]

export const colorFor = (
  index: number,
  explicit?: string,
  colors: string[] = DEFAULT_COLORS,
): string => explicit ?? colors[index % colors.length]

// ---------------------------------------------------------------------------
// Formato de número consistente para labels dentro del SVG: sin separador
// de miles forzado, máximo 2 decimales si no es entero.
// ---------------------------------------------------------------------------

export const fmtNum = (value: number): string =>
  Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/, "")

export const truncate = (label: string, maxChars = 12): string =>
  label.length > maxChars ? `${label.slice(0, maxChars - 1)}…` : label

// ---------------------------------------------------------------------------
// Dominio Y y ticks. yMin = 0 si todos los valores son >= 0 (caso común de
// bar/line), si no yMin = mínimo real. yMax siempre con 8% de padding para
// que la barra/línea más alta no toque el borde del área de dibujo.
// ---------------------------------------------------------------------------

export const computeYDomain = (series: GraphSeries[]): { yMin: number; yMax: number } => {
  const values = series.flatMap((s) => s.data.map((d) => d.value))
  const min = Math.min(...values, 0)
  const max = Math.max(...values, 0)

  const yMin = min >= 0 ? 0 : min
  const range = max - yMin
  const yMax = max + range * 0.08 || 1

  return { yMin, yMax }
}

export const computeYTicks = (yMin: number, yMax: number, count = 5): number[] => {
  const step = (yMax - yMin) / (count - 1)
  return Array.from({ length: count }, (_, i) => yMin + step * i)
}

// ---------------------------------------------------------------------------
// Layout compartido. Márgenes fijos salvo pie/donut, que no necesitan eje.
// ---------------------------------------------------------------------------

const MARGIN = { left: 40, bottom: 24, top: 10, right: 10 }
const MARGIN_RADIAL = { left: 10, bottom: 10, top: 10, right: 10 }

export const buildLayout = (
  variant: GraphVariant,
  series: GraphSeries[],
  width: number,
  height: number,
  yTickCount = 5,
): ChartLayout => {
  const isRadial = variant === "pie" || variant === "donut"
  const margin = isRadial ? MARGIN_RADIAL : MARGIN

  const chartX = margin.left
  const chartY = margin.top
  const chartW = width - margin.left - margin.right
  const chartH = height - margin.top - margin.bottom

  if (isRadial) {
    return {
      svgW: width,
      svgH: height,
      chartX,
      chartY,
      chartW,
      chartH,
      yMin: 0,
      yMax: 0,
      yTicks: [],
      xLabels: [],
    }
  }

  const { yMin, yMax } = computeYDomain(series)
  const yTicks = computeYTicks(yMin, yMax, yTickCount)
  const xLabels = series[0]?.data.map((d) => d.label) ?? []

  return { svgW: width, svgH: height, chartX, chartY, chartW, chartH, yMin, yMax, yTicks, xLabels }
}

// ---------------------------------------------------------------------------
// Geometría radial: polar -> cartesiano y el path `d` de un slice (con o sin
// radio interno para donut). El "agujero" del donut es geometría dentro del
// mismo path, no una máscara aparte.
// ---------------------------------------------------------------------------

export const polarToCartesian = (
  cx: number,
  cy: number,
  r: number,
  angleDeg: number,
): { x: number; y: number } => {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) }
}

export const arcPath = (
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
  innerR = 0,
): string => {
  const large = endAngle - startAngle > 180 ? 1 : 0

  const outerStart = polarToCartesian(cx, cy, r, endAngle)
  const outerEnd = polarToCartesian(cx, cy, r, startAngle)

  if (innerR <= 0) {
    return [
      `M ${cx} ${cy}`,
      `L ${outerStart.x} ${outerStart.y}`,
      `A ${r} ${r} 0 ${large} 0 ${outerEnd.x} ${outerEnd.y}`,
      "Z",
    ].join(" ")
  }

  const innerStart = polarToCartesian(cx, cy, innerR, startAngle)
  const innerEnd = polarToCartesian(cx, cy, innerR, endAngle)

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${r} ${r} 0 ${large} 0 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerStart.x} ${innerStart.y}`,
    `A ${innerR} ${innerR} 0 ${large} 1 ${innerEnd.x} ${innerEnd.y}`,
    "Z",
  ].join(" ")
}

// ---------------------------------------------------------------------------
// Curva suave: Catmull-Rom -> Bézier cúbica, sin librería. Usada por
// line/area cuando `smooth` está activo. Sin smooth, el caller arma una
// polilínea recta directamente (no necesita esta función).
// ---------------------------------------------------------------------------

export const smoothPath = (points: Array<{ x: number; y: number }>): string => {
  if (points.length < 2) return ""
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`
  }

  let d = `M ${points[0].x} ${points[0].y}`

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2

    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
  }

  return d
}

// ---------------------------------------------------------------------------
// Mapeo índice/valor -> píxel dentro del área de dibujo. Compartido por
// bar, line y area.
// ---------------------------------------------------------------------------

export const xForIndex = (
  index: number,
  count: number,
  layout: ChartLayout,
): number => {
  if (count <= 1) return layout.chartX + layout.chartW / 2
  return layout.chartX + (index / (count - 1)) * layout.chartW
}

export const yForValue = (value: number, layout: ChartLayout): number => {
  const { yMin, yMax, chartY, chartH } = layout
  const range = yMax - yMin || 1
  return chartY + chartH - ((value - yMin) / range) * chartH
}
