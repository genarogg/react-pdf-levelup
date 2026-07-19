import React from "react"
import { Circle, G, Line, Path, Rect, Svg, Text as SvgText, View, Text as PdfText } from "@react-pdf/renderer"
import type { ChartLayout, GraphSeries, PdfGraphProps } from "./graph.types"
import {
  DEFAULT_COLORS,
  arcPath,
  buildLayout,
  colorFor,
  fmtNum,
  smoothPath,
  truncate,
  xForIndex,
  yForValue,
} from "./graph.utils"
import { styles } from "./graph.styles"

// ---------------------------------------------------------------------------
// NOTA DE LIMITACIÓN (documentar también en el JSDoc del export):
// SVGPresentationAttributes (lo que tipa fill/stroke/textAnchor/etc. en los
// nodos SVG de @react-pdf/renderer) NO incluye fontSize ni fontFamily como
// atributos directos del nodo. El tamaño/tipografía de un <Text> dentro de
// <Svg> se controla exclusivamente vía la prop `style` (el mismo shape de
// Style que usa StyleSheet para texto de bloque) — de ahí el wrapper
// AxisText de acá abajo, que castea a través de `style` en vez de pasar
// fontSize como prop suelta. Si el documento necesita una fuente
// registrada (Font.register) que también se vea dentro del gráfico, se
// pasa fontFamily en ese mismo objeto `style`.
// ---------------------------------------------------------------------------

const AXIS_COLOR = "#999"
const AXIS_TEXT_COLOR = "#666"
const AXIS_FONT_SIZE = 8

interface AxisTextProps {
  x: number
  y: number
  fill: string
  fontSize?: number
  textAnchor?: "start" | "middle" | "end"
  children: React.ReactNode
}

// Wrapper fino sobre <Text> (namespace SVG) que resuelve fontSize/fontFamily
// vía `style`, ya que SVGTextProps no los expone como prop directa.
const AxisText: React.FC<AxisTextProps> = ({ x, y, fill, fontSize = AXIS_FONT_SIZE, textAnchor, children }) => (
  <SvgText x={x} y={y} fill={fill} textAnchor={textAnchor} style={{ fontSize } as any}>
    {children}
  </SvgText>
)

// ---------------------------------------------------------------------------
// Eje Y compartido: línea vertical + ticks horizontales + label numérico.
// Usado por bar, line y area (no por horizontal-bar, que rota el esquema).
// ---------------------------------------------------------------------------

const YAxis: React.FC<{ layout: ChartLayout }> = ({ layout }) => (
  <G>
    <Line
      x1={layout.chartX}
      y1={layout.chartY}
      x2={layout.chartX}
      y2={layout.chartY + layout.chartH}
      stroke={AXIS_COLOR}
      strokeWidth={1}
    />
    {layout.yTicks.map((tick, i) => {
      const y = yForValue(tick, layout)
      return (
        <G key={i}>
          <Line
            x1={layout.chartX - 3}
            y1={y}
            x2={layout.chartX}
            y2={y}
            stroke={AXIS_COLOR}
            strokeWidth={1}
          />
          <AxisText x={layout.chartX - 6} y={y + 3} fill={AXIS_TEXT_COLOR} textAnchor="end">
            {fmtNum(tick)}
          </AxisText>
        </G>
      )
    })}
  </G>
)

const XAxisLabels: React.FC<{ layout: ChartLayout }> = ({ layout }) => (
  <G>
    <Line
      x1={layout.chartX}
      y1={layout.chartY + layout.chartH}
      x2={layout.chartX + layout.chartW}
      y2={layout.chartY + layout.chartH}
      stroke={AXIS_COLOR}
      strokeWidth={1}
    />
    {layout.xLabels.map((label, i) => {
      const x = xForIndex(i, layout.xLabels.length, layout)
      return (
        <AxisText
          key={i}
          x={x}
          y={layout.chartY + layout.chartH + 14}
          fill={AXIS_TEXT_COLOR}
          textAnchor="middle"
        >
          {truncate(label)}
        </AxisText>
      )
    })}
  </G>
)

// ---------------------------------------------------------------------------
// Bar: chartW / nCategories da el ancho de grupo; dentro del grupo se
// reparte entre series con un gap fijo del 25%.
// ---------------------------------------------------------------------------

const renderBarChart = (
  series: GraphSeries[],
  layout: ChartLayout,
  colors: string[],
  showValues: boolean,
): React.ReactNode => {
  const nCategories = layout.xLabels.length
  const nSeries = series.length
  const groupW = layout.chartW / nCategories
  const gap = groupW * 0.25
  const barW = (groupW - gap) / nSeries

  return (
    <G>
      {series.map((serie, sIndex) =>
        serie.data.map((point, i) => {
          if (point.value === null || point.value === undefined) return null

          const groupStart = layout.chartX + i * groupW + gap / 2
          const x = groupStart + sIndex * barW
          const yTop = yForValue(point.value, layout)
          const yBase = yForValue(Math.max(layout.yMin, 0), layout)
          const barH = yBase - yTop

          return (
            <G key={`${sIndex}-${i}`}>
              <Rect
                x={x}
                y={barH >= 0 ? yTop : yBase}
                width={barW}
                height={Math.abs(barH)}
                fill={colorFor(sIndex, point.color ?? serie.color, colors)}
              />
              {showValues && (
                <AxisText x={x + barW / 2} y={yTop - 3} fill={AXIS_TEXT_COLOR} textAnchor="middle">
                  {fmtNum(point.value)}
                </AxisText>
              )}
            </G>
          )
        }),
      )}
    </G>
  )
}

// ---------------------------------------------------------------------------
// Horizontal-bar: mismo esquema rotado — filas en vez de columnas, barra al
// 50% del alto de fila, ancho proporcional al valor.
// ---------------------------------------------------------------------------

const renderHorizontalBarChart = (
  series: GraphSeries[],
  layout: ChartLayout,
  colors: string[],
  showValues: boolean,
): React.ReactNode => {
  const nCategories = layout.xLabels.length
  const nSeries = series.length
  const rowH = layout.chartH / nCategories
  const barH = (rowH * 0.5) / nSeries
  const maxValue = layout.yMax || 1

  return (
    <G>
      <Line
        x1={layout.chartX}
        y1={layout.chartY}
        x2={layout.chartX}
        y2={layout.chartY + layout.chartH}
        stroke={AXIS_COLOR}
        strokeWidth={1}
      />
      {layout.xLabels.map((label, i) => {
        const y = layout.chartY + i * rowH + rowH / 2
        return (
          <AxisText key={`label-${i}`} x={layout.chartX - 6} y={y + 3} fill={AXIS_TEXT_COLOR} textAnchor="end">
            {truncate(label)}
          </AxisText>
        )
      })}
      {series.map((serie, sIndex) =>
        serie.data.map((point, i) => {
          if (point.value === null || point.value === undefined) return null

          const rowStart = layout.chartY + i * rowH + rowH * 0.25
          const y = rowStart + sIndex * barH
          const barW = (point.value / maxValue) * layout.chartW

          return (
            <G key={`${sIndex}-${i}`}>
              <Rect
                x={layout.chartX}
                y={y}
                width={Math.max(0, barW)}
                height={barH}
                fill={colorFor(sIndex, point.color ?? serie.color, colors)}
              />
              {showValues && (
                <AxisText x={layout.chartX + barW + 3} y={y + barH / 2 + 3} fill={AXIS_TEXT_COLOR}>
                  {fmtNum(point.value)}
                </AxisText>
              )}
            </G>
          )
        }),
      )}
    </G>
  )
}

// ---------------------------------------------------------------------------
// Line/Area: xFor(i)/yFor(valor) mapean índice y valor a píxeles. Con
// `smooth` arman la curva vía Catmull-Rom -> Bézier; si no, polilínea
// recta. El área es la misma curva cerrando contra la línea base. Puntos
// (`showDots`) son <Circle>. Si un valor es null, se corta el path en vez
// de conectar (equivalente a spanGaps: false).
// ---------------------------------------------------------------------------

const buildLineSegments = (
  serie: GraphSeries,
  layout: ChartLayout,
): Array<Array<{ x: number; y: number }>> => {
  const segments: Array<Array<{ x: number; y: number }>> = []
  let current: Array<{ x: number; y: number }> = []

  serie.data.forEach((point, i) => {
    if (point.value === null || point.value === undefined) {
      if (current.length) segments.push(current)
      current = []
      return
    }
    current.push({ x: xForIndex(i, serie.data.length, layout), y: yForValue(point.value, layout) })
  })

  if (current.length) segments.push(current)
  return segments
}

const renderLineAreaChart = (
  series: GraphSeries[],
  layout: ChartLayout,
  colors: string[],
  smooth: boolean,
  showDots: boolean,
  isArea: boolean,
): React.ReactNode => {
  const baseline = yForValue(Math.max(layout.yMin, 0), layout)

  return (
    <G>
      {series.map((serie, sIndex) => {
        const color = colorFor(sIndex, serie.color, colors)
        const segments = buildLineSegments(serie, layout)

        return (
          <G key={sIndex}>
            {segments.map((seg, segIndex) => {
              const linePath = smooth
                ? smoothPath(seg)
                : seg.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")

              const areaPath = isArea
                ? `${linePath} L ${seg[seg.length - 1].x} ${baseline} L ${seg[0].x} ${baseline} Z`
                : null

              return (
                <G key={segIndex}>
                  {areaPath && <Path d={areaPath} fill={color} fillOpacity={0.15} />}
                  <Path d={linePath} stroke={color} strokeWidth={1.5} fill="none" />
                  {showDots &&
                    seg.map((p, i) => (
                      <Circle key={i} cx={p.x} cy={p.y} r={2.2} fill={color} />
                    ))}
                </G>
              )
            })}
          </G>
        )
      })}
    </G>
  )
}

// ---------------------------------------------------------------------------
// Pie/Donut: itera acumulando ángulo; cada slice llama a arcPath(). Para
// donut, innerR > 0 agrega el segundo arco hacia el radio interno en el
// mismo path (el "agujero" es geometría). Labels a radio 18% mayor, solo
// si el slice supera 15°, con textAnchor según el lado del centro.
// ---------------------------------------------------------------------------

const renderPieDonutChart = (
  series: GraphSeries[],
  layout: ChartLayout,
  colors: string[],
  isDonut: boolean,
  showValues: boolean,
): React.ReactNode => {
  const points = series[0]?.data ?? []
  const total = points.reduce((sum, p) => sum + (p.value ?? 0), 0) || 1

  const cx = layout.chartX + layout.chartW / 2
  const cy = layout.chartY + layout.chartH / 2
  const r = Math.min(layout.chartW, layout.chartH) / 2
  const innerR = isDonut ? r * 0.55 : 0

  let angle = 0

  return (
    <G>
      {points.map((point, i) => {
        const value = point.value ?? 0
        const sliceAngle = (value / total) * 360
        const startAngle = angle
        const endAngle = angle + sliceAngle
        angle = endAngle

        const midAngle = (startAngle + endAngle) / 2
        const labelR = r * 1.18
        const rad = ((midAngle - 90) * Math.PI) / 180
        const lx = cx + labelR * Math.cos(rad)
        const ly = cy + labelR * Math.sin(rad)
        const anchor = Math.cos(rad) > 0.05 ? "start" : Math.cos(rad) < -0.05 ? "end" : "middle"

        return (
          <G key={i}>
            <Path
              d={arcPath(cx, cy, r, startAngle, endAngle, innerR)}
              fill={colorFor(i, point.color, colors)}
            />
            {showValues && sliceAngle > 15 && (
              <AxisText x={lx} y={ly} fill={AXIS_TEXT_COLOR} textAnchor={anchor as "start" | "end" | "middle"}>
                {`${truncate(point.label, 10)} (${fmtNum(value)})`}
              </AxisText>
            )}
          </G>
        )
      })}
    </G>
  )
}

// ---------------------------------------------------------------------------
// Leyenda: swatch de color como <Rect> dentro de un <Svg> chico, texto como
// Text de bloque (no SVG). Título/subtítulo/leyenda son siempre bloque para
// no depender de fuentes SVG donde no hace falta.
// ---------------------------------------------------------------------------

const Legend: React.FC<{ series: GraphSeries[]; colors: string[] }> = ({ series, colors }) => (
  <View style={styles.legendRow}>
    {series.map((serie, i) => (
      <View style={styles.legendItem} key={i}>
        <Svg width={9} height={9} style={styles.legendSwatchWrapper}>
          <Rect x={0} y={0} width={9} height={9} fill={colorFor(i, serie.color, colors)} />
        </Svg>
        <PdfText style={styles.legendText}>{serie.name}</PdfText>
      </View>
    ))}
  </View>
)

// ---------------------------------------------------------------------------
// Componente exportado.
// ---------------------------------------------------------------------------

/**
 * Dibuja un gráfico directamente con primitivas SVG nativas de
 * @react-pdf/renderer (Svg/Path/Rect/Line/Circle/G + Text del namespace
 * SVG). No usa canvas ni Chart.js — el texto de ejes, valores y etiquetas
 * nace como nodo de texto PDF real, buscable y copiable, porque nunca pasa
 * por rasterización.
 *
 * Limitación conocida: el Text dentro de <Svg> usa atributos de fuente SVG,
 * no el StyleSheet de fuentes de @react-pdf/renderer. Si el documento
 * requiere una tipografía registrada vía Font.register() también dentro
 * del propio dibujo, hay que pasar ese fontFamily explícitamente a los
 * SvgText de este archivo.
 */
export const PdfGraph: React.FC<PdfGraphProps> = ({
  variant,
  series,
  width = 500,
  height = 300,
  title,
  subtitle,
  colors,
  showLegend = true,
  showValues = false,
  showDots = true,
  smooth = false,
  yTickCount = 5,
  style,
}) => {
  const layout = buildLayout(variant, series, width, height, yTickCount)
  const resolvedColors = colors ?? DEFAULT_COLORS

  const renderChart = (): React.ReactNode => {
    switch (variant) {
      case "bar":
        return (
          <>
            <YAxis layout={layout} />
            <XAxisLabels layout={layout} />
            {renderBarChart(series, layout, resolvedColors, showValues)}
          </>
        )
      case "horizontal-bar":
        return renderHorizontalBarChart(series, layout, resolvedColors, showValues)
      case "line":
        return (
          <>
            <YAxis layout={layout} />
            <XAxisLabels layout={layout} />
            {renderLineAreaChart(series, layout, resolvedColors, smooth, showDots, false)}
          </>
        )
      case "area":
        return (
          <>
            <YAxis layout={layout} />
            <XAxisLabels layout={layout} />
            {renderLineAreaChart(series, layout, resolvedColors, smooth, showDots, true)}
          </>
        )
      case "pie":
        return renderPieDonutChart(series, layout, resolvedColors, false, showValues)
      case "donut":
        return renderPieDonutChart(series, layout, resolvedColors, true, showValues)
      default:
        return null
    }
  }

  return (
    <View style={[styles.container, style]}>
      {title && <PdfText style={styles.title}>{title}</PdfText>}
      {subtitle && <PdfText style={styles.subtitle}>{subtitle}</PdfText>}
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {renderChart()}
      </Svg>
      {showLegend && series.length > 1 && <Legend series={series} colors={resolvedColors} />}
    </View>
  )
}

export default PdfGraph
