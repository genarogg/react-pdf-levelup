import React, { useEffect, useState } from "react"
import { Image, StyleSheet, View } from "@react-pdf/renderer"
import { generateQRstyleAsBase64, type QRstyleOptions } from "./QRstyleGenerator"

export interface QRstyleProps {
  url: string
  size?: number
  style?: any
  image?: string
  dotsOptions?: QRstyleOptions["dotsOptions"]
  backgroundOptions?: QRstyleOptions["backgroundOptions"]
  imageOptions?: QRstyleOptions["imageOptions"]
  cornersSquareOptions?: QRstyleOptions["cornersSquareOptions"]
  cornersDotOptions?: QRstyleOptions["cornersDotOptions"]
  colorDark?: string
  colorLight?: string
  margin?: number
  errorCorrectionLevel?: "L" | "M" | "Q" | "H"
}

const styles = StyleSheet.create({
  qrContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
})

const QRstyle: React.FC<QRstyleProps> = React.memo(({
  url,
  size = 300,
  style,
  image,
  dotsOptions,
  backgroundOptions,
  imageOptions,
  cornersSquareOptions,
  cornersDotOptions,
  colorDark,
  colorLight,
  margin,
  errorCorrectionLevel,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>("")

  const resolvedDotsOptions = dotsOptions ?? (colorDark ? { color: colorDark } : undefined)
  const resolvedBackgroundOptions = backgroundOptions ?? (colorLight ? { color: colorLight } : undefined)
  const resolvedImageOptions = { ...imageOptions, margin: imageOptions?.margin ?? margin }

  useEffect(() => {
    const generateQR = async () => {
      try {
        const result = await generateQRstyleAsBase64({
          url,
          width: size,
          height: size,
          image,
          dotsOptions: resolvedDotsOptions,
          backgroundOptions: resolvedBackgroundOptions,
          imageOptions: resolvedImageOptions,
          cornersSquareOptions,
          cornersDotOptions,
          fallbackColorDark: colorDark,
          fallbackColorLight: colorLight,
          fallbackMargin: margin,
          fallbackErrorCorrectionLevel: errorCorrectionLevel,
        })
        setQrDataUrl(result)
      } catch (error) {
        console.error("Error generando QRstyle:", error)
      }
    }

    generateQR()
  }, [
    url,
    size,
    image,
    dotsOptions,
    backgroundOptions,
    imageOptions,
    cornersSquareOptions,
    cornersDotOptions,
    colorDark,
    colorLight,
    margin,
    errorCorrectionLevel,
  ])

  if (!qrDataUrl) return null

  return (
    <View style={[styles.qrContainer, style]}>
      <Image style={{ width: size, height: size }} src={qrDataUrl} />
    </View>
  )
})

export default QRstyle