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

// FIX: si `colors` llega como array vacío (explícito), colors[index % 0] da
// NaN -> undefined. Cae a DEFAULT_COLORS en vez de romper.
export const colorFor = (
  index: number,
  explicit?: string,
  colors: string[] = DEFAULT_COLORS,
): string => {
  const palette = colors.length ? colors : DEFAULT_COLORS
  return explicit ?? palette[index % palette.length]
}

// ---------------------------------------------------------------------------
// Formato de número consistente para labels dentro del SVG: sin separador
// de miles forzado, máximo 2 decimales si no es entero.
// ---------------------------------------------------------------------------

// FIX (bug 9): para valores negativos que redondean a cero (ej. -0.001),
// toFixed(2) da "-0.00" y el replace de ceros finales deja "-0" — el signo
// sobrevive aunque el número mostrado sea cero. Se normaliza ese caso puntual
// a "0" sin tocar el resto del formato.
export const fmtNum = (value: number): string => {
  if (Number.isInteger(value)) return String(value)
  const formatted = value.toFixed(2).replace(/\.?0+$/, "")
  return formatted === "-0" ? "0" : formatted
}

export const truncate = (label: string, maxChars = 12): string =>
  label.length > maxChars ? `${label.slice(0, maxChars - 1)}…` : label

// ---------------------------------------------------------------------------
// Dominio Y y ticks. yMin = 0 si todos los valores son >= 0 (caso común de
// bar/line), si no yMin = mínimo real con el mismo padding del 8% que yMax
// (antes solo se aplicaba arriba, dejando el punto más bajo pegado al borde).
// ---------------------------------------------------------------------------

// FIX (bug 6): antes `min` siempre se comparaba contra 0 (`Math.min(...values, 0)`),
// así que con datasets 100% positivos `yMinBase` quedaba fijo en 0 sin excepción —
// invariante correcto para bar/horizontal-bar (una barra necesita partir de 0 para no
// mentir visualmente) pero incorrecto para line/area, donde forzar el 0 comprime todo
// el detalle arriba del chart cuando los valores están lejos de cero (ej. [100,105,110]).
// `forceZero` (true por defecto, para no romper a los callers existentes) decide si el
// dominio se ancla en 0 o se ajusta al rango real de los datos con el mismo padding.
export const computeYDomain = (
  series: GraphSeries[],
  forceZero = true,
): { yMin: number; yMax: number } => {
  // FIX (bug 13): antes se usaban los `value` crudos (incluyendo gaps null/
  // undefined). Math.min/Math.max coaccionan `null` a 0, así que un hueco
  // intencional contaminaba el dominio como si fuera un dato real en 0 —
  // mucho más grave ahora que forceZero=false permite zoomear, porque el
  // gap arrastraba el dominio de vuelta hacia 0 y anulaba el zoom.
  const values = series
    .flatMap((s) => s.data.map((d) => d.value))
    .filter((v): v is number => v !== null && v !== undefined)

  // FIX (bug 12, regresión del fix del bug 6): con forceZero=false y CERO
  // valores válidos (serie vacía o solo gaps), Math.min(...[]) da Infinity
  // y Math.max(...[]) da -Infinity. Con forceZero=true esto no pasaba
  // porque el 0 forzado siempre entraba en el spread; al separar el camino
  // para permitir el zoom quedó expuesto este caso.
  if (values.length === 0) return { yMin: 0, yMax: 1 }

  const min = forceZero ? Math.min(...values, 0) : Math.min(...values)
  const max = forceZero ? Math.max(...values, 0) : Math.max(...values)

  const yMinBase = min >= 0 ? (forceZero ? 0 : min) : min
  const range = max - yMinBase
  const yMax = max + range * 0.08 || 1
  // mismo padding proporcional para el mínimo cuando es negativo o no se fuerza el 0.
  const yMin = yMinBase === 0 ? 0 : yMinBase - range * 0.08

  return { yMin, yMax }
}

// FIX: count=1 hacía (count-1)=0 -> step=Infinity -> Infinity*0=NaN.
export const computeYTicks = (yMin: number, yMax: number, count = 5): number[] => {
  if (count <= 1) return [yMin]
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

  const forceZero = variant === "bar" || variant === "horizontal-bar"
  const { yMin, yMax } = computeYDomain(series, forceZero)
  const yTicks = computeYTicks(yMin, yMax, yTickCount)

  // FIX (bug 2): antes xLabels salía siempre de series[0]. Si esa serie
  // llegaba vacía mientras otra sí tenía datos, nCategories (=
  // xLabels.length, consumido en renderBarChart/renderHorizontalBarChart
  // como chartW/nCategories o chartH/nCategories) daba 0 -> división por
  // cero -> Infinity propagado a las coordenadas del <Rect> (PDF
  // inválido). Si otra serie tenía MÁS puntos que series[0], esos índices
  // extra caían fuera del área calculada. Ahora xLabels sale de la serie
  // con más puntos, así que nCategories siempre alcanza para cubrir a
  // todas las series (asumiendo que comparten orden de categorías, que ya
  // es un requisito documentado del componente).
  const longestSeries = series.reduce<GraphSeries | undefined>(
    (longest, s) => (!longest || s.data.length > longest.data.length ? s : longest),
    undefined,
  )
  const xLabels = longestSeries?.data.map((d) => d.label) ?? []

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

// FIX (bug 1): cuando el barrido es un círculo completo (una sola porción
// con valor > 0, o todas las demás en 0), startAngle y endAngle difieren
// en 360° exactos. polarToCartesian(0°) y polarToCartesian(360°) devuelven
// el mismo punto (coseno/seno tienen período 360°), así que outerStart ===
// outerEnd: el comando `A` queda con inicio y fin coincidentes, la spec de
// SVG lo trata como longitud cero, y el renderer lo omite. El path termina
// siendo un triángulo/cuña degenerada de superficie cero — la porción no
// se ve. Partimos el barrido en dos mitades de 180° (arco válido en ambos
// casos), que juntas cubren el círculo completo.
const FULL_CIRCLE_EPSILON = 0.001

export const arcPath = (
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
  innerR = 0,
): string => {
  const sweep = endAngle - startAngle

  if (sweep >= 360 - FULL_CIRCLE_EPSILON) {
    const midAngle = startAngle + 180
    const firstHalf = arcPath(cx, cy, r, startAngle, midAngle, innerR)
    const secondHalf = arcPath(cx, cy, r, midAngle, endAngle, innerR)
    return `${firstHalf} ${secondHalf}`
  }

  const large = sweep > 180 ? 1 : 0

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

// FIX: separado el caso de 1 punto del de "menos de 2" — antes ambos
// devolvían "" y, en un área con un punto aislado (gap a los dos lados),
// el path final terminaba arrancando con "L" en vez de "M" (inválido).
export const smoothPath = (points: Array<{ x: number; y: number }>): string => {
  if (points.length === 0) return ""
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`
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

// Escala "point": reparte N posiciones de punta a punta del área (la primera
// pegada al borde izquierdo, la última al derecho). Correcta para line/area,
// donde cada dato es un punto puntual sobre el eje.
export const xForIndex = (
  index: number,
  count: number,
  layout: ChartLayout,
): number => {
  if (count <= 1) return layout.chartX + layout.chartW / 2
  return layout.chartX + (index / (count - 1)) * layout.chartW
}

// NUEVO (fix bug 1): escala "banda": cada categoría ocupa un slot de ancho
// chartW/count, centrado. Es exactamente el centro de grupo que ya usa
// renderBarChart (chartX + i*groupW + groupW/2), así que labels y barras
// quedan alineadas.
export const xForBand = (
  index: number,
  count: number,
  layout: ChartLayout,
): number => {
  const bandW = layout.chartW / count
  return layout.chartX + (index + 0.5) * bandW
}

export const yForValue = (value: number, layout: ChartLayout): number => {
  const { yMin, yMax, chartY, chartH } = layout
  const range = yMax - yMin || 1
  return chartY + chartH - ((value - yMin) / range) * chartH
}

// NUEVO (fix bug 3): equivalente a yForValue pero para el eje horizontal,
// usado por horizontal-bar. A diferencia del cálculo anterior
// (value/maxValue), este sí contempla yMin negativo, así que el cero no
// queda fijo en chartX cuando hay valores negativos en el dataset.
export const xForValue = (value: number, layout: ChartLayout): number => {
  const { yMin, yMax, chartX, chartW } = layout
  const range = yMax - yMin || 1
  return chartX + ((value - yMin) / range) * chartW
}