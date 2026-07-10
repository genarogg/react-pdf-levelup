import QRCode from "qrcode"

interface QROptions {
  url: string
  size?: number
  colorDark?: string
  colorLight?: string
  margin?: number
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
    const qrDataUrl = await QRCode.toDataURL(url, {
      errorCorrectionLevel,
      type: "image/png" as const,
      margin,
      color: {
        dark: colorDark,
        light: colorLight,
      },
      width: size,
    })

    return qrDataUrl
  } catch (error) {
    console.error("Error generando QR:", error)
    return ""
  }
}

const loadImage = (ImageConstructor: any, src: string, isBrowser: boolean): Promise<any> =>
  new Promise((resolve, reject) => {
    const img = new ImageConstructor()
    if (isBrowser) img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })

export const addLogoToQR = async (
  qrDataUrl: string,
  logoUrl: string,
  logoWidth: number,
  logoHeight: number,
): Promise<string> => {
  if (!qrDataUrl || !logoUrl) return qrDataUrl

  try {
    const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined"
    let canvas: any
    let ctx: any
    let ImageConstructor: any

    if (isBrowser) {
      canvas = document.createElement("canvas")
      ctx = canvas.getContext("2d")
      ImageConstructor = window.Image
    } else {
      try {
        const { createCanvas, Image } = await import("canvas")
        canvas = createCanvas(100, 100)
        ctx = canvas.getContext("2d")
        ImageConstructor = Image
      } catch (e) {
        console.error("Canvas no disponible en entorno Node:", e)
        return qrDataUrl
      }
    }

    if (!ctx) return qrDataUrl

    const qrImage = await loadImage(ImageConstructor, qrDataUrl, isBrowser)

    canvas.width = qrImage.width
    canvas.height = qrImage.height
    ctx.drawImage(qrImage, 0, 0, canvas.width, canvas.height)

    const logoImage = await loadImage(ImageConstructor, logoUrl, isBrowser)

    const x = (canvas.width - logoWidth) / 2
    const y = (canvas.height - logoHeight) / 2

    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(x - 5, y - 5, logoWidth + 10, logoHeight + 10)
    ctx.drawImage(logoImage, x, y, logoWidth, logoHeight)

    return canvas.toDataURL("image/png")
  } catch (error) {
    console.error("Error procesando el QR con logo:", error)
    return qrDataUrl
  }
}