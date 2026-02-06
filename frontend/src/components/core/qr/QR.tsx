"use client"

import React from "react"
import { Image, StyleSheet, View } from "@react-pdf/renderer"
import { useEffect, useState } from "react"
import { generateQRAsBase64, addLogoToQR } from "./QRGenerator"

// Define the props for the QR component
interface QRProps {
  value: string
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

// Mapa para convertir niveles de corrección numéricos a letras
const errorLevelMap: Record<number, "L" | "M" | "Q" | "H"> = {
  0: "L",
  1: "M",
  2: "Q",
  3: "H",
}

// Este componente funciona con React PDF
const QR: React.FC<QRProps> = ({
  value,
  size = 150,
  style,
  colorDark = "#000000",
  colorLight = "#ffffff",
  margin = 0,
  logo = "",
  logoWidth = 30,
  logoHeight = 30,
  errorCorrectionLevel = logo ? "H" : "M",
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>("")

  // Generar el código QR cuando el componente se monta o cuando cambian las props
  useEffect(() => {
    const generateQR = async () => {
      try {
        // Primero generamos el QR básico
        const baseQrDataUrl = await generateQRAsBase64({
          value,
          size,
          colorDark,
          colorLight,
          margin,
          errorCorrectionLevel:
            typeof errorCorrectionLevel === "number"
              ? errorLevelMap[errorCorrectionLevel] || "M"
              : errorCorrectionLevel,
        })

        // Si hay un logo, lo añadimos al QR
        if (logo && logoWidth && logoHeight) {
          const qrWithLogo = await addLogoToQR(baseQrDataUrl, logo, logoWidth, logoHeight)
          setQrDataUrl(qrWithLogo)
        } else {
          setQrDataUrl(baseQrDataUrl)
        }
      } catch (error) {
        console.error("Error generando QR:", error)
        // En caso de error, generamos un QR básico usando una API externa
        const fallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
          value,
        )}&size=${size}x${size}&color=${encodeURIComponent(colorDark.replace("#", ""))}&bgcolor=${encodeURIComponent(
          colorLight.replace("#", ""),
        )}`
        setQrDataUrl(fallbackUrl)
      }
    }

    generateQR()
  }, [value, size, colorDark, colorLight, margin, logo, logoWidth, logoHeight, errorCorrectionLevel])

  // Mostrar un QR de respaldo mientras se genera el QR personalizado
  const fallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
    value,
  )}&size=${size}x${size}`

  return (
    <View style={[styles.qrContainer, style]}>
      <Image src={qrDataUrl || fallbackUrl} style={{ width: size, height: size }} />
    </View>
  )
}

export default QR

