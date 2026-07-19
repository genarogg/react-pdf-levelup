// ---------------------------------------------------------------------------
// Tipos base para PdfGraph: gráficos dibujados a mano con primitivas SVG de
// @react-pdf/renderer (Svg, Path, Rect, Line, Circle, G, Text-en-namespace-svg).
// No hay canvas ni Chart.js en ningún punto de este archivo ni de los que
// dependen de él — el texto que se ve en el gráfico nace como nodo de texto
// PDF real porque nunca pasa por rasterización.
// ---------------------------------------------------------------------------

export type GraphVariant =
  | "bar"
  | "horizontal-bar"
  | "line"
  | "area"
  | "pie"
  | "donut"

export interface GraphDataPoint {
  label: string
  value: number
  color?: string
}

export interface GraphSeries {
  name: string
  data: GraphDataPoint[]
  color?: string
}

// Entrada genérica de leyenda. Para bar/line/area sale de `series` (una
// entrada por serie); para pie/donut sale de `series[0].data` (una entrada
// por porción), porque ahí no hay múltiples series sino múltiples puntos.
export interface LegendEntry {
  label: string
  color: string
}

// ---------------------------------------------------------------------------
// Layout: todo lo que buildLayout() calcula una sola vez y que los distintos
// render*Chart consumen. Coordenadas ya resueltas en unidades del <Svg>
// (viewBox = svgW x svgH), no porcentajes ni unidades de StyleSheet.
// ---------------------------------------------------------------------------

export interface ChartLayout {
  svgW: number
  svgH: number
  chartX: number
  chartY: number
  chartW: number
  chartH: number
  yMin: number
  yMax: number
  yTicks: number[]
  xLabels: string[]
}

export interface PdfGraphProps {
  variant: GraphVariant
  series: GraphSeries[]
  width?: number
  height?: number
  title?: string
  subtitle?: string
  colors?: string[]
  showLegend?: boolean
  showValues?: boolean
  showDots?: boolean
  smooth?: boolean
  yTickCount?: number
  style?: any
}
