import type { ChartConfiguration } from "chart.js"

export interface ChartRenderOptions {
  width?: number
  height?: number
  backgroundColor?: string
  devicePixelRatio?: number
}

const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined"

const chartCache = new Map<string, string>()

const buildCacheKey = (
  chartConfig: ChartConfiguration,
  width: number,
  height: number,
  backgroundColor: string,
  devicePixelRatio: number,
): string => JSON.stringify({ chartConfig, width, height, backgroundColor, devicePixelRatio })

const buildChartConfig = (
  chartConfig: ChartConfiguration,
  devicePixelRatio: number,
): ChartConfiguration => ({
  ...chartConfig,
  options: {
    responsive: false,
    maintainAspectRatio: false,
    ...(chartConfig.options ?? {}),
    devicePixelRatio,
    animation: false,
  } as any,
})

// ---------------------------------------------------------------------------
// Rama navegador: canvas real del DOM + chart.js cargado dinámicamente.
// ---------------------------------------------------------------------------

let chartRegisteredBrowser = false

const ensureRegisteredBrowser = async () => {
  if (chartRegisteredBrowser) return
  const { Chart, registerables } = await import("chart.js")
  Chart.register(...registerables)
  chartRegisteredBrowser = true
}

const renderChartBrowser = async (
  chartConfig: ChartConfiguration,
  width: number,
  height: number,
  backgroundColor: string,
  devicePixelRatio: number,
): Promise<string> => {
  await ensureRegisteredBrowser()
  const { Chart } = await import("chart.js")

  const canvas = document.createElement("canvas")
  canvas.width = width * devicePixelRatio
  canvas.height = height * devicePixelRatio
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("No se pudo obtener el contexto 2D del canvas")

  ctx.scale(devicePixelRatio, devicePixelRatio)

  if (backgroundColor && backgroundColor !== "transparent") {
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height)
  }

  const config = buildChartConfig(chartConfig, devicePixelRatio)
  const chart = new Chart(ctx, config as any)
  const dataUrl = canvas.toDataURL("image/png", 1.0)
  chart.destroy()

  if (!dataUrl || dataUrl === "data:," || !dataUrl.startsWith("data:image")) {
    throw new Error(`Data URL generada es inválida: ${dataUrl}`)
  }

  return dataUrl
}

// ---------------------------------------------------------------------------
// Rama Node: chartjs-node-canvas, que resuelve internamente el canvas nativo
// y el registro de Chart.js. No usa `document` en ningún momento.
// ---------------------------------------------------------------------------

let nodeCanvasRendererPromise: Promise<any> | null = null

const getNodeCanvasRenderer = (width: number, height: number, backgroundColor: string) => {
  // Se crea una instancia nueva por tamaño/fondo porque ChartJSNodeCanvas fija
  // width/height/backgroundColour en el constructor; cachear una sola global
  // rompería renders con dimensiones distintas.
  if (!nodeCanvasRendererPromise) {
    nodeCanvasRendererPromise = import("chartjs-node-canvas")
  }
  return nodeCanvasRendererPromise.then(({ ChartJSNodeCanvas }) => {
    return new ChartJSNodeCanvas({
      width,
      height,
      backgroundColour: backgroundColor === "transparent" ? undefined : backgroundColor,
    })
  })
}

const renderChartNode = async (
  chartConfig: ChartConfiguration,
  width: number,
  height: number,
  backgroundColor: string,
  devicePixelRatio: number,
): Promise<string> => {
  const renderer = await getNodeCanvasRenderer(width, height, backgroundColor)
  const config = buildChartConfig(chartConfig, devicePixelRatio)

  const buffer: Buffer = await renderer.renderToBuffer(config as any, "image/png")

  if (!buffer || buffer.length === 0) {
    throw new Error("chartjs-node-canvas devolvió un buffer vacío")
  }

  return `data:image/png;base64,${buffer.toString("base64")}`
}

// ---------------------------------------------------------------------------

export const generateChartAsBase64 = async (
  chartConfig: ChartConfiguration,
  {
    width = 600,
    height = 400,
    backgroundColor = "transparent",
    devicePixelRatio = 2,
  }: ChartRenderOptions = {},
): Promise<string> => {
  const cacheKey = buildCacheKey(chartConfig, width, height, backgroundColor, devicePixelRatio)
  const cached = chartCache.get(cacheKey)
  if (cached) return cached

  try {
    const dataUrl = isBrowser
      ? await renderChartBrowser(chartConfig, width, height, backgroundColor, devicePixelRatio)
      : await renderChartNode(chartConfig, width, height, backgroundColor, devicePixelRatio)

    chartCache.set(cacheKey, dataUrl)
    return dataUrl
  } catch (error) {
    console.error("Error generando gráfico:", error)
    return ""
  }
}