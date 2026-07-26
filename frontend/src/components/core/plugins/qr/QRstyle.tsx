import React from "react"
import { Image, StyleSheet, View } from "@react-pdf/renderer"
import { generateQRstyleAsBase64, type QRstyleOptions } from "./QRstyleGenerator"

type ViewBaseProps = React.ComponentProps<typeof View>

export interface QRstyleProps extends Omit<ViewBaseProps, "style"> {
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
  ...rest
}) => {

  // Ver nota en QR.tsx: el tamaño forzado va DESPUÉS de `style` para que no
  // pueda ser sobreescrito, y flexShrink/alignSelf blindan contra padres flex
  // (Row/Col) que intenten estirar o comprimir el contenedor.
  const squareForce = {
    width: size,
    height: size,
    minWidth: size,
    minHeight: size,
    maxWidth: size,
    maxHeight: size,
    flexShrink: 0,
    flexGrow: 0,
    alignSelf: "center" as const,
  }

  return (
    <View style={[styles.qrContainer, style, squareForce]} {...rest}>
      <Image
        style={{ width: size, height: size }}
        src={generateQRstyleAsBase64({
          url,
          width: size,
          height: size,
          image,
          dotsOptions: dotsOptions ?? (colorDark ? { color: colorDark } : undefined),
          backgroundOptions: backgroundOptions ?? (colorLight ? { color: colorLight } : undefined),
          imageOptions: {
            ...imageOptions,
            margin: imageOptions?.margin !== undefined ? imageOptions.margin : margin,
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