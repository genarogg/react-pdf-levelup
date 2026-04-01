import React, { useEffect, useState } from "react"
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

const buildFallbackUrl = (url: string, size: number) =>
  `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(url)}&size=${size}x${size}`

const QR: React.FC<QRProps> = React.memo(({
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
  const [qrDataUrl, setQrDataUrl] = useState<string>("")

  const resolvedErrorLevel = errorCorrectionLevel ?? (logo ? "H" : "M")

  useEffect(() => {
    const generateQR = async () => {

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

        if (logo && logoWidth && logoHeight) {
          const qrWithLogo = await addLogoToQR(baseQrDataUrl, logo, logoWidth, logoHeight)
          setQrDataUrl(qrWithLogo)
        } else {
          setQrDataUrl(baseQrDataUrl)
        }
      } catch (error) {
        console.error("Error generando QR:", error)
        setQrDataUrl(buildFallbackUrl(url, size))
      }
    }

    generateQR()
  }, [url, size, colorDark, colorLight, margin, logo, logoWidth, logoHeight, resolvedErrorLevel])

  return (
    <View style={[styles.qrContainer, style]} {...rest}>
      <Image src={qrDataUrl || buildFallbackUrl(url, size)} style={{ width: size, height: size }} />
    </View>
  )
})

export default QR