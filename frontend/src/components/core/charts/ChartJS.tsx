import React, { useEffect, useMemo, useRef, useState } from "react"
import { Image, StyleSheet, View, Text } from "@react-pdf/renderer"
import type { ChartConfiguration } from "chart.js"
import { generateChartAsBase64, type ChartRenderOptions } from "./ChartJSGenerator"

interface ChartJSProps extends ChartRenderOptions {
  data: ChartConfiguration
  style?: any
}

type ChartState =
  | { status: "loading" }
  | { status: "success"; url: string }
  | { status: "error"; message: string }

const TRANSPARENT_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="

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

const ChartJS: React.FC<ChartJSProps> = React.memo(({
  data,
  width = 600,
  height = 400,
  backgroundColor = "white",
  devicePixelRatio = 2,
  style,
}) => {
  const [state, setState] = useState<ChartState>({ status: "loading" })
  const isMounted = useRef(true)

  const stableData = useMemo(() => data, [JSON.stringify(data)])

  useEffect(() => {
    isMounted.current = true

    const render = async () => {
      setState({ status: "loading" })

      try {
        const url = await generateChartAsBase64(stableData, {
          width,
          height,
          backgroundColor,
          devicePixelRatio,
        })

        if (!isMounted.current) return

        if (!url || url === "data:,") {
          setState({ status: "error", message: "No se pudo generar el gráfico. Data URL vacía." })
        } else {
          setState({ status: "success", url })
        }
      } catch (err) {
        if (!isMounted.current) return
        setState({
          status: "error",
          message: err instanceof Error ? err.message : "Error desconocido",
        })
      }
    }

    render()

    return () => {
      isMounted.current = false
    }
  }, [stableData, width, height, backgroundColor, devicePixelRatio])

  if (state.status === "error") {
    if (process.env.NODE_ENV === "development") {
      return (
        <View style={[styles.container, style, { width, height }]}>
          <Text style={styles.errorText}>Error: {state.message}</Text>
        </View>
      )
    }
    return (
      <View style={[styles.container, style]}>
        <Image src={TRANSPARENT_PIXEL} style={{ width, height }} />
      </View>
    )
  }

  if (state.status === "loading") {
    return (
      <View style={[styles.container, style, { width, height, backgroundColor: "#f0f0f0" }]}>
        <Text style={styles.loadingText}>Generando gráfico...</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, style]}>
      <Image src={state.url} style={{ width, height }} cache={false} />
    </View>
  )
})

export default ChartJS