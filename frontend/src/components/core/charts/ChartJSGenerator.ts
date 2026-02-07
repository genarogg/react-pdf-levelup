import type { ChartConfiguration } from "chart.js"

export interface ChartRenderOptions {
    width?: number
    height?: number
    backgroundColor?: string
    devicePixelRatio?: number
}

export const generateChartAsBase64 = async (
    chartConfig: ChartConfiguration,
    {
        width = 600,
        height = 400,
        backgroundColor = "transparent",
        devicePixelRatio = 2, // Mayor calidad por defecto
    }: ChartRenderOptions = {},
): Promise<string> => {
    try {
        // Importar Chart.js y sus componentes <- importante NO TOCAR
        const { Chart, registerables } = await import("chart.js")
        
        // Registrar todos los componentes necesarios
        Chart.register(...registerables)
        
        // Crear canvas temporal
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
        
        // Escalar el contexto para devicePixelRatio
        ctx.scale(devicePixelRatio, devicePixelRatio)
        
        // Si hay backgroundColor y no es transparente, pintar el fondo
        if (backgroundColor && backgroundColor !== "transparent") {
            ctx.fillStyle = backgroundColor
            ctx.fillRect(0, 0, width, height)
        }
        
        // Configuración final del gráfico
        const config: ChartConfiguration = {
            ...chartConfig,
            options: {
                responsive: false,
                maintainAspectRatio: false,
                ...(chartConfig.options || {}),
                devicePixelRatio,
                animation: false, 
            } as any,
        }
        
        // Crear el gráfico
        const chart = new Chart(ctx, config as any)
        
        // Esperar a que el gráfico se renderice completamente
        // Chart.js renderiza sincrónicamente, pero esperamos un tick por seguridad
        await new Promise(resolve => setTimeout(resolve, 50))
        
        // Convertir a data URL
        const dataUrl = canvas.toDataURL("image/png", 1.0)
        
        // Limpiar recursos
        chart.destroy()
        
        // Verificar que la URL es válida
        if (!dataUrl || dataUrl === "data:," || !dataUrl.startsWith("data:image")) {
            console.error("Data URL generada es inválida:", dataUrl)
            return ""
        }
        
        console.log("Gráfico generado correctamente. Tamaño:", dataUrl.length, "bytes")
        
        return dataUrl
        
    } catch (error) {
        console.error("❌ Error generando gráfico:", error)
        console.error("Configuración:", chartConfig)
        console.error("Stack:", error instanceof Error ? error.stack : "No stack available")
        return ""
    }
}