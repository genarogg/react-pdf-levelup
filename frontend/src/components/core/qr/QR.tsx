import React from "react"
import { Image, StyleSheet, View } from "@react-pdf/renderer"
import { generateQRAsBase64, addLogoToQR } from "./QRGenerator"

type ViewBaseProps = React.ComponentProps<typeof View>

interface QRProps extends Omit<ViewBaseProps, "style"> {
  url: string
  size?: number
  style?: any
  colorDark?: string
  colorLight?: string
  margin?: number
  logo?: string
  logoWidth?: number
  logoHeight?: number
  errorCorrectionLevel?: "L" | "M" | "Q" | "H"
}

const styles = StyleSheet.create({
  qrContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
})

const errorLevelMap: Record<number, "L" | "M" | "Q" | "H"> = {
  0: "L",
  1: "M",
  2: "Q",
  3: "H",
}

const QR: React.FC<QRProps> = ({
  url,
  size = 150,
  style,
  colorDark = "#000000",
  colorLight = "#ffffff",
  margin = 0,
  logo = "",
  logoWidth = 30,
  logoHeight = 30,
  errorCorrectionLevel,
  ...rest
}) => {
  const resolvedErrorLevel = errorCorrectionLevel ?? (logo ? "H" : "M")

  // Factory function: `@react-pdf/renderer` acepta que `src` sea una función
  // (la invoca y espera su resultado) — ver `resolveSource` en
  // `@react-pdf/layout`. No hay fallback a un servicio externo: si la
  // generación local falla, no hay nada confiable que mostrar, así que se
  // deja sin imagen en vez de depender de la disponibilidad de un tercero.
  const resolveQRSrc = async (): Promise<string | undefined> => {
    try {
      const baseQrDataUrl = await generateQRAsBase64({
        url,
        size,
        colorDark,
        colorLight,
        margin,
        errorCorrectionLevel:
          typeof resolvedErrorLevel === "number"
            ? errorLevelMap[resolvedErrorLevel] ?? "M"
            : resolvedErrorLevel,
      })

      if (!baseQrDataUrl) return undefined

      return logo && logoWidth && logoHeight
        ? await addLogoToQR(baseQrDataUrl, logo, logoWidth, logoHeight)
        : baseQrDataUrl
    } catch (error) {
      console.error("Error generando QR:", error)
      return undefined
    }
  }

  return (
    <View style={[styles.qrContainer, style]} {...rest}>
      <Image src={resolveQRSrc} style={{ width: size, height: size }} />
    </View>
  )
}

export default QR