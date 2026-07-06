import type { ChartConfiguration } from "chart.js"

export interface ChartRenderOptions {
  width?: number
  height?: number
  backgroundColor?: string
  devicePixelRatio?: number
}

let chartRegistered = false

const chartCache = new Map<string, string>()

const buildCacheKey = (
  chartConfig: ChartConfiguration,
  width: number,
  height: number,
  backgroundColor: string,
  devicePixelRatio: number,
): string => JSON.stringify({ chartConfig, width, height, backgroundColor, devicePixelRatio })

const ensureRegistered = async () => {
  if (chartRegistered) return
  const { Chart, registerables } = await import("chart.js")
  Chart.register(...registerables)
  chartRegistered = true
}

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
  if (chartCache.has(cacheKey)) return chartCache.get(cacheKey)!

  try {
    await ensureRegistered()

    const { Chart } = await import("chart.js")

    const canvas = document.createElement("canvas")
    canvas.width = width * devicePixelRatio
    canvas.height = height * devicePixelRatio
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      console.error("No se pudo obtener el contexto 2D del canvas")
      return ""
    }

    ctx.scale(devicePixelRatio, devicePixelRatio)

    if (backgroundColor && backgroundColor !== "transparent") {
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, width, height)
    }

    const config: ChartConfiguration = {
      ...chartConfig,
      options: {
        responsive: false,
        maintainAspectRatio: false,
        ...(chartConfig.options ?? {}),
        devicePixelRatio,
        animation: false,
      } as any,
    }

    const chart = new Chart(ctx, config as any)
    const dataUrl = canvas.toDataURL("image/png", 1.0)
    chart.destroy()

    if (!dataUrl || dataUrl === "data:," || !dataUrl.startsWith("data:image")) {
      console.error("Data URL generada es inválida:", dataUrl)
      return ""
    }

    chartCache.set(cacheKey, dataUrl)
    return dataUrl
  } catch (error) {
    console.error("Error generando gráfico:", error)
    return ""
  }
}