import React from "react"
import { Image, StyleSheet, View } from "@react-pdf/renderer"
import { generateQRAsBase64 } from "./QRGenerator"

type ViewBaseProps = React.ComponentProps<typeof View>

export interface QRProps extends Omit<ViewBaseProps, "style"> {
  url: string
  size?: number
  style?: any
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

const QR: React.FC<QRProps> = ({
  url,
  size = 150,
  style,
  colorDark,
  colorLight,
  margin,
  errorCorrectionLevel,
  ...rest
}) => {

  // El tamaño forzado va DESPUÉS de `style` para que no pueda ser
  // sobreescrito, y flexShrink/alignSelf blindan contra padres flex
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
        src={generateQRAsBase64({
          url,
          size,
          colorDark,
          colorLight,
          margin,
          errorCorrectionLevel,
        })}
      />
    </View>
  )
}

export default QR