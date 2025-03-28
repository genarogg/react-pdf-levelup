// Utilidad para generar códigos QR como base64
import QRCode from "qrcode"

interface QROptions {
  value: string
  size?: number
  colorDark?: string
  colorLight?: string
  margin?: number
  logoImage?: string
  logoWidth?: number
  logoHeight?: number
  errorCorrectionLevel?: "L" | "M" | "Q" | "H"
}

export const generateQRAsBase64 = async ({
  value,
  size = 150,
  colorDark = "#000000",
  colorLight = "#ffffff",
  margin = 0,
  errorCorrectionLevel = "M",
}: QROptions): Promise<string> => {
  try {
    // Configuración para QRCode
    const options = {
      errorCorrectionLevel: errorCorrectionLevel,
      type: "image/png",
      quality: 0.92,
      margin: margin,
      color: {
        dark: colorDark,
        light: colorLight,
      },
      width: size,
    }

    // Generar el código QR como base64
    const qrDataUrl = await QRCode.toDataURL(value, options)
    return qrDataUrl
  } catch (error) {
    console.error("Error generando QR:", error)
    return ""
  }
}

// Función para añadir un logo al QR generado
export const addLogoToQR = async (
  qrDataUrl: string,
  logoUrl: string,
  logoWidth: number,
  logoHeight: number,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!qrDataUrl || !logoUrl) {
      resolve(qrDataUrl)
      return
    }

    try {
      // Crear un canvas para manipular las imágenes
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        resolve(qrDataUrl)
        return
      }

      // Cargar la imagen del QR
      const qrImage = new Image()
      qrImage.crossOrigin = "anonymous"
      qrImage.onload = () => {
        // Establecer el tamaño del canvas
        canvas.width = qrImage.width
        canvas.height = qrImage.height

        // Dibujar el QR en el canvas
        ctx.drawImage(qrImage, 0, 0, canvas.width, canvas.height)

        // Cargar el logo
        const logoImage = new Image()
        logoImage.crossOrigin = "anonymous"
        logoImage.onload = () => {
          // Calcular la posición central para el logo
          const x = (canvas.width - logoWidth) / 2
          const y = (canvas.height - logoHeight) / 2

          // Dibujar un fondo blanco para el logo (opcional)
          ctx.fillStyle = "#FFFFFF"
          ctx.fillRect(x - 5, y - 5, logoWidth + 10, logoHeight + 10)

          // Dibujar el logo
          ctx.drawImage(logoImage, x, y, logoWidth, logoHeight)

          // Convertir el canvas a base64
          const finalQrDataUrl = canvas.toDataURL("image/png")
          resolve(finalQrDataUrl)
        }

        logoImage.onerror = () => {
          console.error("Error cargando el logo")
          resolve(qrDataUrl) // Devolver el QR sin logo en caso de error
        }

        logoImage.src = logoUrl
      }

      qrImage.onerror = () => {
        console.error("Error cargando el QR")
        resolve("")
      }

      qrImage.src = qrDataUrl
    } catch (error) {
      console.error("Error procesando el QR con logo:", error)
      resolve(qrDataUrl) // Devolver el QR sin logo en caso de error
    }
  })
}

