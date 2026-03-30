"use client"

import React from "react"
import { Image, StyleSheet, View } from "@react-pdf/renderer"
import { generateQRstyleAsBase64, type QRstyleOptions } from "./QRstyleGenerator"

// Define props
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
  // Fallback/Compatibility props
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

const QRstyle: React.FC<QRstyleProps> = ({
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
  return (
    <View style={[styles.qrContainer, style]}>
      {/* We pass a function that returns the promise/result or use the state if available. 
          Actually, we can pass the promise directly to src! */}
      <Image
        style={{ width: size, height: size }}
        src={generateQRstyleAsBase64({
          url,
          width: size,
          height: size,
          image,
          dotsOptions: dotsOptions || (colorDark ? { color: colorDark } : undefined),
          backgroundOptions: backgroundOptions || (colorLight ? { color: colorLight } : undefined),
          imageOptions: {
            ...imageOptions,
            margin: imageOptions?.margin !== undefined ? imageOptions.margin : margin
          },
          cornersSquareOptions,
          cornersDotOptions,
          fallbackColorDark: colorDark,
          fallbackColorLight: colorLight,
          fallbackMargin: margin,
          fallbackErrorCorrectionLevel: errorCorrectionLevel,
        })}
      />
    </View>
  )
}

export default QRstyle
