import React, { useEffect, useMemo, useState } from "react"
import { Image, StyleSheet, View, Text } from "@react-pdf/renderer"
import {
  generateCodeBarAsBase64,
  type CodeBarFormat,
  type CodeBarOptions,
} from "./CodeBarGenerator"

type ViewBaseProps = React.ComponentProps<typeof View>

interface CodeBarProps extends Omit<ViewBaseProps, "style">, Omit<CodeBarOptions, "value"> {
  value: string
  width?: number // ancho renderizado del <Image> en el PDF
  height?: number // alto renderizado del <Image> en el PDF
  style?: any
  format?: CodeBarFormat
}

type CodeBarState =
  | { status: "loading" }
  | { status: "success"; url: string }
  | { status: "error"; message: string }

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  errorText: {
    color: "red",
    fontSize: 10,
    padding: 6,
  },
  loadingText: {
    color: "#666",
    fontSize: 10,
    padding: 6,
  },
})

const CodeBar: React.FC<CodeBarProps> = React.memo(
  ({
    value,
    format = "CODE128",
    width = 200,
    height = 80,
    style,
    displayValue = true,
    text,
    fontOptions,
    fontSize,
    textMargin,
    textAlign,
    textPosition,
    background = "#ffffff",
    lineColor = "#000000",
    margin,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    autoFixChecksum = false,
    ...rest
  }) => {
    const [state, setState] = useState<CodeBarState>({ status: "loading" })

    // Barra de opciones que generan el código, para no re-generar en cada render
    // sin necesidad (mismo enfoque que ChartJS con stableData).
    const barcodeOptions = useMemo(
      () => ({
        value,
        format,
        // width/height acá controlan el módulo/alto internos de JsBarcode,
        // no el tamaño final del <Image>. Se calculan a partir del tamaño
        // deseado en el PDF para que el resultado no se vea pixelado.
        width: 2,
        height: 100,
        displayValue,
        text,
        fontOptions,
        fontSize,
        textMargin,
        textAlign,
        textPosition,
        background,
        lineColor,
        margin,
        marginTop,
        marginBottom,
        marginLeft,
        marginRight,
        autoFixChecksum,
      }),
      [
        value,
        format,
        displayValue,
        text,
        fontOptions,
        fontSize,
        textMargin,
        textAlign,
        textPosition,
        background,
        lineColor,
        margin,
        marginTop,
        marginBottom,
        marginLeft,
        marginRight,
        autoFixChecksum,
      ],
    )

    useEffect(() => {
      let cancelled = false

      setState({ status: "loading" })

      const generate = async () => {
        try {
          const url = await generateCodeBarAsBase64(barcodeOptions)

          if (cancelled) return

          if (!url) {
            setState({ status: "error", message: "No se pudo generar el código de barras." })
          } else {
            setState({ status: "success", url })
          }
        } catch (error) {
          if (cancelled) return
          setState({
            status: "error",
            message: error instanceof Error ? error.message : "Error desconocido",
          })
        }
      }

      generate()

      return () => {
        cancelled = true
      }
    }, [barcodeOptions])

    if (state.status === "error") {
      if (process.env.NODE_ENV === "development") {
        return (
          <View style={[styles.container, style, { width, height }]}>
            <Text style={styles.errorText}>Error: {state.message}</Text>
          </View>
        )
      }
      return <View style={[styles.container, style, { width, height }]} {...rest} />
    }

    if (state.status === "loading") {
      return (
        <View style={[styles.container, style, { width, height, backgroundColor: "#f0f0f0" }]} {...rest}>
          <Text style={styles.loadingText}>Generando código...</Text>
        </View>
      )
    }

    return (
      <View style={[styles.container, style]} {...rest}>
        <Image src={state.url} style={{ width, height }} cache={false} />
      </View>
    )
  },
)

export default CodeBar