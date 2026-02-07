import React, { useEffect, useState } from "react"
import { Image, StyleSheet, View, Text } from "@react-pdf/renderer"
import type { ChartConfiguration } from "chart.js"
import { generateChartAsBase64, type ChartRenderOptions } from "./ChartJSGenerator"

interface ChartJSProps extends ChartRenderOptions {
  data: ChartConfiguration
  style?: any
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    padding: 10,
  },
  loadingText: {
    color: "#666",
    fontSize: 10,
    padding: 10,
  },
})

const ChartJS: React.FC<ChartJSProps> = ({
  data,
  width = 600,
  height = 400,
  backgroundColor = "white", // Cambiar a blanco por defecto para mejor visualización
  devicePixelRatio = 2, // Mayor calidad por defecto
  style,
}) => {
  const [chartDataUrl, setChartDataUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")

  // Pixel transparente como placeholder
  const transparentPixel =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="

  useEffect(() => {
    let isMounted = true

    const render = async () => {
      try {
        setIsLoading(true)
        setError("")
        
        console.log("🔄 Generando gráfico con configuración:", data.type)
        
        const url = await generateChartAsBase64(data, {
          width,
          height,
          backgroundColor,
          devicePixelRatio,
        })
        
        if (!isMounted) return
        
        if (!url || url === "data:,") {
          const errorMsg = "No se pudo generar el gráfico. Data URL vacía."
          console.error("❌", errorMsg)
          setError(errorMsg)
          setChartDataUrl(transparentPixel)
        } else {
          console.log("✅ Gráfico generado. Tamaño:", url.length, "bytes")
          setChartDataUrl(url)
        }
        
      } catch (err) {
        if (!isMounted) return
        
        const errorMsg = err instanceof Error ? err.message : "Error desconocido"
        console.error("❌ Error en Chart.tsx:", errorMsg)
        setError(errorMsg)
        setChartDataUrl(transparentPixel)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    render()

    return () => {
      isMounted = false
    }
  }, [JSON.stringify(data), width, height, backgroundColor, devicePixelRatio])

  // Para debugging
  useEffect(() => {
    if (chartDataUrl && chartDataUrl !== transparentPixel) {
      console.log("📊 Chart.tsx - URL actualizada:", chartDataUrl.substring(0, 50) + "...")
    }
  }, [chartDataUrl])

  // Si hay error, mostrar mensaje (solo en desarrollo, en producción mostrar placeholder)
  if (error && process.env.NODE_ENV === 'development') {
    return (
      <View style={[styles.container, style, { width, height }]}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, style]}>
      {chartDataUrl && chartDataUrl !== transparentPixel ? (
        <Image 
          src={chartDataUrl} 
          style={{ width, height }}
          cache={false} // Evitar cache de imágenes
        />
      ) : (
        <View style={{ width, height, backgroundColor: '#f0f0f0' }}>
          {isLoading && (
            <Text style={styles.loadingText}>Generando gráfico...</Text>
          )}
        </View>
      )}
    </View>
  )
}

export default ChartJS