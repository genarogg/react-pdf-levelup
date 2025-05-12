import  React from "react"
import { useEffect, useState } from "react"
import { Image, View, Text } from "@react-pdf/renderer"
import QRCodeStyling from "qr-code-styling"

interface QRCustomProps {
  url: string
  size?: number
  colorData?: string
  colorDataBG?: string
  logo?: string
  logoWidth?: number
  logoHeight?: number
  margin?: number
  errorCorrectionLevel?: "L" | "M" | "Q" | "H"
  style?: any
  dotType?: "rounded" | "dots" | "classy" | "classy-rounded" | "square" | "extra-rounded"
  cornerSquareType?: "square" | "dot" | "extra-rounded"
  cornerDotType?: "square" | "dot"
  cornerSquareColor?: string
  cornerDotColor?: string
 
  logoBG?: string
  logoText?: string
  moveText?: number
  textColor?: string
  fontSize?: number
  fontFamily?: string
  textBackgroundColor?: string
  textPadding?: number
  textBold?: boolean
}

const QR: React.FC<QRCustomProps> = ({
  url,
  size = 200,
  colorData = "#000000",
  colorDataBG = "#ffffff",
  logo,
  logoWidth = 30,
  logoHeight,
  margin = 0,
  errorCorrectionLevel = "H",
  style,
  dotType = "square",
  cornerSquareType = "square",
  cornerDotType = "square",
  cornerSquareColor,
  cornerDotColor,
logoBG=colorDataBG,
  logoText,
  moveText = 0,
  textColor = colorData,
  fontSize = 12,
  fontFamily = "Helvetica",
  textBackgroundColor = colorDataBG,
  textPadding = 1,
  textBold = true,
}) => {
  const [qrDataURL, setQrDataURL] = useState<string | null>(null)

  // Calculate actual logo dimensions
  const actualLogoWidth = logoWidth || Math.floor(size * 0.2)
  const actualLogoHeight = logoHeight || actualLogoWidth

  useEffect(() => {
    if (typeof window === "undefined") return

    const generateQRCode = async () => {
      try {
        // Create QR code without logo
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
          },
          qrOptions: {
            errorCorrectionLevel: errorCorrectionLevel,
          },
          margin: margin,
        })

        const container = document.createElement("div")
        container.style.position = "absolute"
        container.style.top = "-9999px"
        container.style.left = "-9999px"
        document.body.appendChild(container)

        qrCode.append(container)

        setTimeout(() => {
          try {
            const qrCanvas = container.querySelector("canvas")
            if (qrCanvas) {
              const canvas = document.createElement("canvas")
              canvas.width = size
              canvas.height = size
              const ctx = canvas.getContext("2d")
              if (ctx) {
                ctx.drawImage(qrCanvas, 0, 0)
                const dataURL = canvas.toDataURL("image/png")
                setQrDataURL(dataURL)
              }
            }
            document.body.removeChild(container)
          } catch (error) {
            console.error("Error capturing QR code:", error)
          }
        }, 100)
      } catch (error) {
        console.error("Error generating QR code:", error)
      }
    }

    generateQRCode()
  }, [
    url,
    size,
    colorData,
    colorDataBG,
    margin,
    errorCorrectionLevel,
    dotType,
    cornerSquareType,
    cornerDotType,
    cornerSquareColor,
    cornerDotColor,
    logoBG
  ])

  if (!qrDataURL) return null

  // Calculate center position for logo
  const centerPosition = size / 2
  const logoContainerSize = Math.max(actualLogoWidth, actualLogoHeight) + 10

  return (
    <View style={{ width: size, height: size, position: "relative", ...style }}>
      {/* QR Code */}
      <Image src={qrDataURL || "/placeholder.svg"} style={{ width: size, height: size }} />

      {/* Logo */}
      {logo && (
        <View
          style={{
            position: "absolute",
            width: logoContainerSize,
            height: logoContainerSize,
            backgroundColor: logoBG || colorDataBG,
            left: centerPosition - logoContainerSize / 2,
            top: centerPosition - logoContainerSize / 2,
            borderRadius: 100,
            border: `5px solid ${colorData}`,
            padding: 0,
          }}
        >
          <Image
            src={logo || "/placeholder.svg"}
            style={{
              objectFit: "contain",
              width: actualLogoWidth,
              height: actualLogoHeight || actualLogoWidth,
            }}
          />
        </View>
      )}

      {/* Text (if no logo) */}
      {!logo && logoText && (
        <View
          style={{
            position: "absolute",
            backgroundColor: textBackgroundColor,
            padding: textPadding,
            borderRadius: 4,
            
            left: moveText + centerPosition - 20, // Approximate center
            top: centerPosition - 10, // Approximate center
          }}
        >
          <Text
            style={{
              color: textColor,
              fontSize: fontSize,
              fontFamily: fontFamily,
              fontWeight: textBold ? "bold" : "normal",
            }}
          >
            {logoText}
          </Text>
        </View>
      )}
    </View>
  )
}

export default QR
