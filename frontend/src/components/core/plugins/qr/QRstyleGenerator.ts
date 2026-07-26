import { generateQRAsBase64 } from "./QRGenerator"

export interface QRstyleOptions {
  url: string
  width?: number
  height?: number
  image?: string
  dotsOptions?: {
    color?: string
    type?: "rounded" | "dots" | "classy" | "classy-rounded" | "square" | "extra-rounded"
  }
  backgroundOptions?: {
    color?: string
  }
  imageOptions?: {
    crossOrigin?: string
    margin?: number
    imageSize?: number
  }
  cornersSquareOptions?: {
    type?: "dot" | "square" | "extra-rounded"
    color?: string
  }
  cornersDotOptions?: {
    type?: "dot" | "square"
    color?: string
  }
  fallbackColorDark?: string
  fallbackColorLight?: string
  fallbackMargin?: number
  fallbackErrorCorrectionLevel?: "L" | "M" | "Q" | "H"
}

const toSafeInt = (value: unknown, fallback: number): number =>
  typeof value === "number" && isFinite(value) ? Math.round(value) : fallback

const toSafeFloat = (value: unknown, fallback: number, min = -Infinity, max = Infinity): number =>
  typeof value === "number" && isFinite(value) ? Math.max(min, Math.min(max, value)) : fallback

const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () =>
      typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Failed to convert blob to base64"))
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })

export const generateQRstyleAsBase64 = async (options: QRstyleOptions): Promise<string> => {
  try {
    const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined"

    let QRCodeStylingConstructor: any
    let extraOptions = {}

    if (isBrowser) {
      try {
        const mod = await import("qr-code-styling")
        QRCodeStylingConstructor = mod.default || mod
      } catch (e) {
        console.error("Failed to load qr-code-styling in browser", e)
        throw e
      }
    } else {
      const jsdomName = "jsdom"
      const canvasName = "canvas"
      const qrCommonName = "qr-code-styling/lib/qr-code-styling.common.js"

      try {
        const [jsdomMod, canvasMod, qrCommonMod] = await Promise.all([
          import(/* @vite-ignore */ jsdomName),
          import(/* @vite-ignore */ canvasName),
          import(/* @vite-ignore */ qrCommonName),
        ])

        const { JSDOM } = jsdomMod
        const nodeCanvas = canvasMod.default || canvasMod
        const { QRCodeStyling } = qrCommonMod

        QRCodeStylingConstructor = QRCodeStyling
        extraOptions = { jsdom: JSDOM, nodeCanvas }
      } catch (e) {
        console.error("Failed to load Node dependencies for QR generation", e)
        throw e
      }
    }

    const width = toSafeInt(options.width, 300)
    const height = toSafeInt(options.height, 300)
    const imageSize = toSafeFloat(options.imageOptions?.imageSize, 0.4, 0, 1)
    const imageMargin = toSafeInt(options.imageOptions?.margin, 0)
    const backgroundColor = options.backgroundOptions?.color ?? "#ffffff"

    // @ts-ignore
    const qrCodeImage = new QRCodeStylingConstructor({
      type: "png",
      ...extraOptions,
      width,
      height,
      data: options.url,
      image: options.image,
      dotsOptions: options.dotsOptions,
      backgroundOptions: { color: backgroundColor },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: imageMargin,
        saveAsBlob: true,
        imageSize,
      },
      cornersSquareOptions: options.cornersSquareOptions,
      cornersDotOptions: options.cornersDotOptions,
    })

    const rawData = await qrCodeImage.getRawData("png")

    if (!rawData) throw new Error("Failed to generate raw data from qr-code-styling")

    if (isBrowser && rawData instanceof Blob) return blobToBase64(rawData)

    if (typeof Buffer !== "undefined" && Buffer.isBuffer(rawData))
      return `data:image/png;base64,${rawData.toString("base64")}`

    throw new Error(`Unexpected raw data type: ${typeof rawData}`)
  } catch (error) {
    console.error("Error generating QR V2, falling back to V1:", error)

    return generateQRAsBase64({
      url: options.url,
      size: options.width,
      colorDark: options.fallbackColorDark ?? options.dotsOptions?.color,
      colorLight: options.fallbackColorLight ?? options.backgroundOptions?.color,
      margin: options.fallbackMargin ?? 0,
      errorCorrectionLevel: options.fallbackErrorCorrectionLevel ?? "M",
    })
  }
}