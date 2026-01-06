"use client"

import React from "react"
import { Image, StyleSheet, View } from "@react-pdf/renderer"
import { generateQRV2AsBase64, type QRV2Options } from "./QRGeneratorV2"

// Define props
export interface QRV2Props {
  value: string
  size?: number
  style?: any
  image?: string
  dotsOptions?: QRV2Options["dotsOptions"]
  backgroundOptions?: QRV2Options["backgroundOptions"]
  imageOptions?: QRV2Options["imageOptions"]
  cornersSquareOptions?: QRV2Options["cornersSquareOptions"]
  cornersDotOptions?: QRV2Options["cornersDotOptions"]
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

const QRV2: React.FC<QRV2Props> = ({
  value,
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
        src={generateQRV2AsBase64({
          value,
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

export default QRV2
