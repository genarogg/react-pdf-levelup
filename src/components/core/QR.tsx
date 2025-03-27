import type React from "react"
import { Image, StyleSheet, View } from "@react-pdf/renderer"

interface QRProps {
  value: string
  size?: number
  backgroundColor?: string
  foregroundColor?: string
  style?: any
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

const QR: React.FC<QRProps> = ({
  value,
  size = 150,
  backgroundColor = "white",
  foregroundColor = "black",
  style,
  errorCorrectionLevel = "M",
}) => {
  // Encode the QR code parameters in the URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
    value
  )}&size=${size}x${size}&bgcolor=${encodeURIComponent(
    backgroundColor
  )}&color=${encodeURIComponent(foregroundColor)}&ecc=${errorCorrectionLevel}`

  return (
    <View style={[styles.qrContainer, style]}>
      <Image src={qrCodeUrl || "/placeholder.svg"} style={{ width: size, height: size }} />
    </View>
  )
}

export default QR
