import QRCode from "qrcode"

interface QROptions {
  url: string
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
  url,
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
      type: "image/png" as const,
      quality: 0.92,
      margin: margin,
      color: {
        dark: colorDark,
        light: colorLight,
      },
      width: size,
    }

    // Generar el código QR como base64
    const qrDataUrl = QRCode.toDataURL(url, options)
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
  return new Promise(async (resolve) => {
    if (!qrDataUrl || !logoUrl) {
      resolve(qrDataUrl)
      return
    }

    try {
      const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
      let canvas: any;
      let ctx: any;
      let ImageConstructor: any;

      if (isBrowser) {
        canvas = document.createElement("canvas")
        ctx = canvas.getContext("2d")
        ImageConstructor = window.Image;
      } else {
        // Node environment
        try {
          // Use dynamic imports to avoid bundling canvas in browser build if possible
          // although typically 'canvas' is excluded from browser bundles or shimmed.
          const { createCanvas, Image } = await import('canvas');
          canvas = createCanvas(100, 100); // Initial size, will be resized
          ctx = canvas.getContext("2d");
          ImageConstructor = Image;
        } catch (e) {
          console.error("Canvas not available in Node environment for addLogoToQR", e);
          resolve(qrDataUrl);
          return;
        }
      }

      if (!ctx) {
        resolve(qrDataUrl)
        return
      }

      // Cargar la imagen del QR
      const qrImage = new ImageConstructor()
      // crossOrigin is only needed in browser usually, but node-canvas might support/ignore it
      if (isBrowser) qrImage.crossOrigin = "anonymous"
      
      qrImage.onload = () => {
        // Establecer el tamaño del canvas
        canvas.width = qrImage.width
        canvas.height = qrImage.height

        // Dibujar el QR en el canvas
        ctx.drawImage(qrImage, 0, 0, canvas.width, canvas.height)

        // Cargar el logo
        const logoImage = new ImageConstructor()
        if (isBrowser) logoImage.crossOrigin = "anonymous"
        
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

        logoImage.onerror = (err: any) => {
          console.error("Error cargando el logo:", err)
          resolve(qrDataUrl) // Devolver el QR sin logo en caso de error
        }

        logoImage.src = logoUrl
      }

      qrImage.onerror = (err: any) => {
        console.error("Error cargando el QR:", err)
        resolve("")
      }

      qrImage.src = qrDataUrl
    } catch (error) {
      console.error("Error procesando el QR con logo:", error)
      resolve(qrDataUrl) // Devolver el QR sin logo en caso de error
    }
  })
}
