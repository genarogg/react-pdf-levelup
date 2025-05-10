"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Image, StyleSheet } from "@react-pdf/renderer"
import QRCodeStyling from "qr-code-styling"

interface QRCustomProps {
  value: string
  size?: number
  colorDark?: string
  colorLight?: string
  margin?: number
  errorCorrectionLevel?: "L" | "M" | "Q" | "H"
  logo?: string
  logoWidth?: number
  logoHeight?: number
  style?: any
  // Opciones de personalización adicionales
  dotType?: "rounded" | "dots" | "classy" | "classy-rounded" | "square" | "extra-rounded"
  cornerSquareType?: "square" | "dot" | "extra-rounded"
  cornerDotType?: "square" | "dot"
  cornerSquareColor?: string
  cornerDotColor?: string
  backgroundImage?: string
  backgroundDimming?: string
}

const styles = StyleSheet.create({
  qrCode: {
    marginBottom: 14,
  },
})

const QRCustom: React.FC<QRCustomProps> = ({
  value,
  size = 150,
  colorDark = "#000000",
  colorLight = "#ffffff",
  margin = 0,
  errorCorrectionLevel = "H", // Usamos H por defecto para mejor compatibilidad con logos
  logo,
  logoWidth = 30,
  logoHeight = 30,
  style,
  // Opciones de personalización con valores por defecto
  dotType = "square",
  cornerSquareType = "square",
  cornerDotType = "square",
  cornerSquareColor,
  cornerDotColor,
  backgroundImage,
  backgroundDimming = "0.8",
}) => {
  const [qrDataURL, setQrDataURL] = useState<string | null>(null)

  useEffect(() => {
    // Solo ejecutar en entorno de navegador
    if (typeof window === "undefined") return

    try {
      // Crear instancia de QR code con opciones personalizadas
      const qrCode = new QRCodeStyling({
        width: size,
        height: size,
        type: "canvas",
        data: value,
        dotsOptions: {
          color: colorDark,
          type: dotType,
        },
        cornersSquareOptions: {
          color: cornerSquareColor || colorDark,
          type: cornerSquareType,
        },
        cornersDotOptions: {
          color: cornerDotColor || colorDark,
          type: cornerDotType,
        },
        backgroundOptions: {
          color: colorLight,
          ...(backgroundImage && {
            image: backgroundImage,
            dimming: backgroundDimming,
          }),
        },
        qrOptions: {
          errorCorrectionLevel: errorCorrectionLevel,
          margin: margin,
        },
        ...(logo && {
          image: logo,
          imageOptions: {
            crossOrigin: "anonymous",
            hideBackgroundDots: true,
            imageSize: 0.3,
            margin: 5,
            width: logoWidth,
            height: logoHeight,
          },
        }),
      })

      // Crear un elemento canvas temporal
      const canvas = document.createElement("canvas")
      canvas.width = size
      canvas.height = size

      // Crear un contenedor para el código QR
      const container = document.createElement("div")
      container.style.position = "absolute"
      container.style.top = "-9999px"
      container.style.left = "-9999px"
      document.body.appendChild(container)

      // Renderizar el código QR en el contenedor
      qrCode.append(container)

      // Usar setTimeout para permitir que el código QR se renderice
      setTimeout(() => {
        try {
          // Obtener el canvas del contenedor
          const qrCanvas = container.querySelector("canvas")
          if (qrCanvas) {
            // Dibujar el canvas del código QR en nuestro canvas temporal
            const ctx = canvas.getContext("2d")
            ctx?.drawImage(qrCanvas, 0, 0)

            // Convertir canvas a URL de datos
            const dataURL = canvas.toDataURL("image/png")
            setQrDataURL(dataURL)
          }

          // Limpiar
          document.body.removeChild(container)
        } catch (error) {
          console.error("Error al capturar el código QR:", error)
        }
      }, 100)
    } catch (error) {
      console.error("Error al inicializar el código QR:", error)
    }
  }, [
    value,
    size,
    colorDark,
    colorLight,
    margin,
    errorCorrectionLevel,
    logo,
    logoWidth,
    logoHeight,
    dotType,
    cornerSquareType,
    cornerDotType,
    cornerSquareColor,
    cornerDotColor,
    backgroundImage,
    backgroundDimming,
  ])

  // Si estamos en un entorno de servidor o el código QR aún no se ha generado, devolver null
  if (!qrDataURL) {
    return null
  }

  return <Image src={qrDataURL || "/placeholder.svg"} style={[styles.qrCode, style]} />
}

export default QRCustom
