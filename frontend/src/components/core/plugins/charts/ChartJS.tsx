import React from "react"
import { Image, StyleSheet, View } from "@react-pdf/renderer"
import type { ChartConfiguration } from "chart.js"
import { generateChartAsBase64, type ChartRenderOptions } from "./ChartJSGenerator"

interface ChartJSProps extends ChartRenderOptions {
  data: ChartConfiguration
  style?: any
}

const TRANSPARENT_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
})

const ChartJS: React.FC<ChartJSProps> = ({
  data,
  width = 600,
  height = 400,
  backgroundColor = "white",
  devicePixelRatio = 2,
  style,
}) => {
  // Se pasa como factory function: `@react-pdf/renderer` acepta que `src` sea
  // una función (la invoca y espera su resultado) o directamente una
  // promesa — ver `resolveSource` en `@react-pdf/layout`. Usar una función
  // nombrada aquí es solo por legibilidad: dice explícitamente "esto se
  // resuelve más tarde" en vez de dejarlo implícito en el tipo de retorno.
  const resolveChartSrc = async (): Promise<string> => {
    const dataUrl = await generateChartAsBase64(data, {
      width,
      height,
      backgroundColor,
      devicePixelRatio,
    })

    return dataUrl && dataUrl !== "data:," ? dataUrl : TRANSPARENT_PIXEL
  }

  return (
    <View style={[styles.container, style]}>
      <Image src={resolveChartSrc} style={{ width, height }} cache={false} />
    </View>
  )
}

export default ChartJS