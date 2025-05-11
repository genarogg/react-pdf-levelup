"use client"

import React from "react"
import { useEffect, useState } from "react"
import { Image, StyleSheet, View } from "@react-pdf/renderer"
import QRCodeStyling from "qr-code-styling"

// Modificar la interfaz QRCustomProps para añadir propiedades de contenedor
interface QRCustomProps {
  url: string

  size?: number
  containerWidth?: number
  containerHeight?: number
  
  colorData?: string
  colorDataBG?: string

  logo?: string
  logoWidth?: number
  logoHeight?: number

  margin?: number
  errorCorrectionLevel?: "L" | "M" | "Q" | "H"
  
  style?: any

  // Opciones de personalización adicionales
  dotType?: "rounded" | "dots" | "classy" | "classy-rounded" | "square" | "extra-rounded"
  cornerSquareType?: "square" | "dot" | "extra-rounded"
  cornerDotType?: "square" | "dot"
  
  cornerSquareColor?: string
  cornerDotColor?: string

  backgroundImage?: string
  backgroundDimming?: string
  
  // Nuevas propiedades para texto central
  logoText?: string
  textColor?: string
  fontSize?: number
  fontFamily?: string
  textBackgroundColor?: string
  textPadding?: number
  textBold?: boolean
 
}

const styles = StyleSheet.create({
  qrCode: {
    marginBottom: 14,
  },
})

// Modificar el componente QRCustom para incluir el View contenedor
const QRCustom: React.FC<QRCustomProps> = ({
  url,
  
  // TAMAÑO DEL CÓDIGO QR
  size = 200,
  containerWidth = size,
  containerHeight = size,

  // LOGO
  logo,
  logoWidth = 30,
  logoHeight = logoWidth,

  colorData = "#000000",
  colorDataBG = "#ffffff",
  margin = 0,
  errorCorrectionLevel = "H", 
  
  style,
  // Opciones de personalización con valores por defecto
  dotType = "square",
  cornerSquareType = "square",
  cornerDotType = "square",
  cornerSquareColor,
  cornerDotColor,
  backgroundImage,
  backgroundDimming = "0.8",
  // Nuevos props para texto central
  logoText,
  textColor = colorData,
  fontSize = 18,
  fontFamily = "Arial, sans-serif",
  textBackgroundColor = colorDataBG,
  textPadding = 0,
  textBold = true,
  // Nuevos props para el contenedor
  
}) => {
  const [qrDataURL, setQrDataURL] = useState<string | null>(null)

  // Función para crear una imagen a partir de texto
  const createTextImage = (text: string): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      // Configurar la fuente
      const fontWeight = textBold ? "bold" : "normal"
      ctx!.font = `${fontWeight} ${fontSize}px ${fontFamily}`

      // Medir el texto para determinar el tamaño del canvas
      const textMetrics = ctx!.measureText(text)
      const textWidth = textMetrics.width
      const textHeight = fontSize

      // Establecer el tamaño del canvas con padding
      const canvasWidth = textWidth + textPadding 
      const canvasHeight = textHeight + textPadding * 2
      canvas.width = canvasWidth
      canvas.height = canvasHeight

      // Dibujar el fondo
      ctx!.fillStyle = textBackgroundColor
      ctx!.fillRect(0, 0, canvasWidth, canvasHeight)

      // Dibujar el texto
      ctx!.fillStyle = textColor
      ctx!.font = `${fontWeight} ${fontSize}px ${fontFamily}`
      ctx!.textAlign = "center"
      ctx!.textBaseline = "middle"
      ctx!.fillText(text, canvasWidth / 2, canvasHeight / 2)

      // Convertir a data URL
      resolve(canvas.toDataURL("image/png"))
    })
  }

  useEffect(() => {
    // Solo ejecutar en entorno de navegador
    if (typeof window === "undefined") return

    const initQRCode = async () => {
      try {
        // Determinar qué imagen usar: logo o texto generado
        let imageSource = logo

        // Si hay texto central pero no hay logo, crear una imagen con el texto
        if (logoText && !logo) {
          imageSource = await createTextImage(logoText)
        }

        // Crear instancia de QR code con opciones personalizadas
        const qrCode = new QRCodeStyling({
          width: size,
          height: size,
          type: "canvas",
          data: url,
          dotsOptions: {
            color: colorData,
            type: dotType,
          },
          cornersSquareOptions: {
            color: cornerSquareColor || colorData,
            type: cornerSquareType,
          },
          cornersDotOptions: {
            color: cornerDotColor || colorData,
            type: cornerDotType,
          },
          backgroundOptions: {
            color: colorDataBG,
            ...(backgroundImage && {
              image: backgroundImage,
              dimming: backgroundDimming,
            }),
          },
          qrOptions: {
            errorCorrectionLevel: errorCorrectionLevel,
            // La propiedad margin no va dentro de qrOptions
          },
          // Mover margin fuera de qrOptions, como propiedad directa
          margin: margin,
          ...(imageSource && {
            image: imageSource,
            imageOptions: {
              crossOrigin: "anonymous",
              hideBackgroundDots: true,
              imageSize: 0.3,
              margin: 5,
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
    }

    initQRCode()
  }, [
    url,
    size,
    colorData,
    colorDataBG,
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
    logoText,
    textColor,
    fontSize,
    fontFamily,
    textBackgroundColor,
    textPadding,
    textBold,
    containerWidth,
    containerHeight,
  ])

  // Si estamos en un entorno de servidor o el código QR aún no se ha generado, devolver null
  if (!qrDataURL) {
    return null
  }
  
  // Envolver la imagen en un View con tamaño controlado
  return (
    <View style={{ width: containerWidth, height: containerHeight, alignItems: "center", justifyContent: "center" }}>
      <Image
        src={qrDataURL || "/placeholder.svg"}
        style={[styles.qrCode, { maxWidth: "100%", maxHeight: "100%" }, style]}
      />
    </View>
  )
}

export default QRCustom
