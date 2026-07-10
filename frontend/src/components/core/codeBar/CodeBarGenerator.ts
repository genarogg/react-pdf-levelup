import JsBarcode from "jsbarcode"

export type CodeBarFormat =
  | "CODE128"
  | "CODE128A"
  | "CODE128B"
  | "CODE128C"
  | "EAN13"
  | "EAN8"
  | "EAN5"
  | "EAN2"
  | "UPC"
  | "CODE39"
  | "ITF14"
  | "ITF"
  | "MSI"
  | "MSI10"
  | "MSI11"
  | "MSI1010"
  | "MSI1110"
  | "pharmacode"
  | "codabar"

export interface CodeBarOptions {
  value: string
  format?: CodeBarFormat
  width?: number 
  height?: number 
  displayValue?: boolean
  text?: string 
  fontOptions?: string 
  fontSize?: number
  textMargin?: number
  textAlign?: "left" | "center" | "right"
  textPosition?: "top" | "bottom"
  background?: string
  lineColor?: string
  margin?: number
  marginTop?: number
  marginBottom?: number
  marginLeft?: number
  marginRight?: number
  /**
   * Por defecto, si el checksum (dígito verificador) de un valor EAN13/EAN8/UPC
   * es incorrecto, se lanza un error explícito en vez de corregirlo en
   * silencio. Poné `autoFixChecksum: true` si preferís que se recalcule y
   * reemplace automáticamente (se sigue avisando por consola con un warn).
   */
  autoFixChecksum?: boolean
}


// (igual que se hace con los charts).
const barcodeCache = new Map<string, string>()

const buildCacheKey = (options: CodeBarOptions): string => JSON.stringify(options)

/**
 * Calcula el dígito verificador (checksum) para códigos EAN/UPC según el
 * algoritmo estándar GS1 (módulo 10, pesos alternados 3-1).
 * `digits` debe ser el número SIN el dígito de control (12 dígitos para
 * EAN13/UPC, 7 para EAN8).
 */
const calculateEanCheckDigit = (digits: string): string => {
  const nums = digits.split("").map(Number)
  // El peso se aplica de derecha a izquierda: el último dígito (el más
  // cercano al checksum) tiene peso 3.
  let sum = 0
  for (let i = 0; i < nums.length; i++) {
    const weight = (nums.length - i) % 2 === 0 ? 1 : 3
    sum += nums[i] * weight
  }
  const checkDigit = (10 - (sum % 10)) % 10
  return String(checkDigit)
}

/**
 * Error específico para checksums EAN/UPC inválidos, para poder
 * distinguirlo si hace falta (instanceof CodeBarChecksumError) y para que
 * el mensaje llegue tal cual hasta la UI (ver CodeBar.tsx).
 */
export class CodeBarChecksumError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "CodeBarChecksumError"
  }
}

/**
 * Valida el checksum de un valor EAN13, EAN8 o UPC antes de pasarlo a
 * JsBarcode.
 *
 * Comportamiento por defecto (autoFixChecksum = false): si el valor viene
 * con la longitud completa pero el dígito verificador es incorrecto, se
 * lanza un CodeBarChecksumError explícito en vez de corregirlo en
 * silencio — un checksum equivocado suele indicar un dato mal generado
 * río arriba, y taparlo con una corrección automática puede esconder ese
 * bug en vez de mostrarlo.
 *
 * Si se pasa autoFixChecksum = true, se recalcula y reemplaza el dígito
 * verificador incorrecto (se avisa igual por consola con un warn).
 *
 * En ambos casos, si el valor viene "sin calcular" (un dígito menos que lo
 * esperado), se completa automáticamente con el checksum calculado: esto
 * no es una corrección de un dato erróneo, sino una forma soportada de
 * pasar el código sin el dígito de control.
 */
const normalizeEanValue = (
  value: string,
  format: CodeBarFormat,
  autoFixChecksum: boolean,
): string => {
  const expectedLengths: Partial<Record<CodeBarFormat, number>> = {
    EAN13: 13,
    EAN8: 8,
    UPC: 12,
  }

  const expectedLength = expectedLengths[format]
  if (!expectedLength) return value // no es un formato con checksum conocido acá

  const onlyDigits = value.replace(/\D/g, "")

  // Si vino sin el dígito verificador (un dígito menos), lo calculamos y completamos.
  if (onlyDigits.length === expectedLength - 1) {
    const checkDigit = calculateEanCheckDigit(onlyDigits)
    return onlyDigits + checkDigit
  }

  // Si vino con la longitud completa, verificamos que el checksum sea correcto.
  if (onlyDigits.length === expectedLength) {
    const body = onlyDigits.slice(0, -1)
    const providedCheckDigit = onlyDigits.slice(-1)
    const correctCheckDigit = calculateEanCheckDigit(body)

    if (providedCheckDigit !== correctCheckDigit) {
      if (autoFixChecksum) {
        console.warn(
          `El dígito verificador de "${value}" para ${format} es incorrecto ` +
            `(esperado ${correctCheckDigit}, recibido ${providedCheckDigit}). Se corrige automáticamente (autoFixChecksum=true).`,
        )
        return body + correctCheckDigit
      }

      throw new CodeBarChecksumError(
        `Dígito verificador inválido para "${value}" (${format}): se esperaba ${correctCheckDigit}, ` +
          `se recibió ${providedCheckDigit}. Pasá autoFixChecksum={true} si preferís que se corrija automáticamente.`,
      )
    }
  }

  // Cualquier otra longitud la dejamos pasar tal cual: JsBarcode se encargará
  // de validar y, si corresponde, lanzar su propio error.
  return value
}

/**
 * Genera un código de barras como PNG en base64 (data URL).
 * Funciona tanto en browser (canvas nativo) como en Node (paquete `canvas`),
 * de forma análoga a como QRGenerator resuelve el logo sobre canvas.
 */
export const generateCodeBarAsBase64 = async ({
  value,
  format = "CODE128",
  width = 2,
  height = 100,
  displayValue = true,
  text,
  fontOptions = "",
  fontSize = 20,
  textMargin = 2,
  textAlign = "center",
  textPosition = "bottom",
  background = "#ffffff",
  lineColor = "#000000",
  margin = 10,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  autoFixChecksum = false,
}: CodeBarOptions): Promise<string> => {
  const cacheOptions = {
    value,
    format,
    width,
    height,
    displayValue,
    text,
    fontOptions,
    fontSize,
    textMargin,
    textAlign,
    textPosition,
    background,
    lineColor,
    margin,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    autoFixChecksum,
  }
  const cacheKey = buildCacheKey(cacheOptions)
  if (barcodeCache.has(cacheKey)) return barcodeCache.get(cacheKey)!

  // Se valida/normaliza el checksum ANTES del try/catch genérico y sin
  // atraparlo acá: si el checksum es inválido (y autoFixChecksum es
  // false), queremos que el error suba tal cual hasta quien llamó a esta
  // función, en vez de quedar silenciado como un "" genérico. CodeBar.tsx
  // ya tiene su propio try/catch y muestra error.message.
  const normalizedValue = normalizeEanValue(value, format, autoFixChecksum)

  try {
    const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined"

    let canvas: any

    if (isBrowser) {
      canvas = document.createElement("canvas")
    } else {
      try {
        const { createCanvas } = await import("canvas")
        // JsBarcode setea el tamaño real del canvas internamente,
        // el valor inicial acá es solo un placeholder.
        canvas = createCanvas(100, 100)
      } catch (e) {
        throw new Error(
          `Canvas no disponible en entorno Node (¿falta instalar el paquete "canvas"?): ${
            e instanceof Error ? e.message : String(e)
          }`,
        )
      }
    }

    JsBarcode(canvas, normalizedValue, {
      format,
      width,
      height,
      displayValue,
      text,
      fontOptions,
      fontSize,
      textMargin,
      textAlign,
      textPosition,
      background,
      lineColor,
      margin,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
    })

    const dataUrl = canvas.toDataURL("image/png")

    if (!dataUrl || dataUrl === "data:," || !dataUrl.startsWith("data:image")) {
      throw new Error(`Data URL generada es inválida: ${dataUrl}`)
    }

    barcodeCache.set(cacheKey, dataUrl)
    return dataUrl
  } catch (error) {
    // Se loguea acá para tener el detalle en consola/servidor, pero el
    // error se re-lanza (no se traga como "") para que quien llamó pueda
    // mostrar el mensaje real en vez de un genérico "no se pudo generar".
    console.error("Error generando código de barras:", error)
    throw error instanceof Error ? error : new Error(String(error))
  }
}