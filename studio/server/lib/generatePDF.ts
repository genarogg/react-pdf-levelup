// Adaptación server-side de generatePDF.ts (archivo provisto por el
// usuario). Mantiene la misma lógica de renderizado (renderToStream +
// acumulación de chunks a base64) pero además persiste el PDF resultante
// en disco, dentro del workspace (.playground/output/render.pdf), para
// poder exponerlo vía GET /api/render/file sin volver a renderizar en
// cada request de lectura del archivo guardado.
//
// Es el único endpoint de render del Studio: GET /api/render/file,
// que compila el workspace server-side y persiste el resultado.
import fs from "node:fs/promises"
import path from "node:path"
import type * as React from "react"
import { createElement } from "react"
import { renderToStream } from "@react-pdf/renderer"
import { WORKSPACE_DIR } from "../config.js"

export class PdfGenerationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "PdfGenerationError"
  }
}

const OUTPUT_DIR = path.join(WORKSPACE_DIR, ".playground", "output")
const OUTPUT_FILE = path.join(OUTPUT_DIR, "render.pdf")

interface PDFData {
  template: React.ElementType
  data?: any
}

/**
 * Genera el PDF a partir del template compilado (mismo shape que ya usa
 * renderPdf.ts: un React.ComponentType resultado de compileServerWorkspace),
 * lo guarda en disco dentro del workspace, y devuelve el base64.
 *
 * Siempre genera de nuevo (sin cache): cada llamada vuelve a renderizar y
 * sobreescribe el archivo guardado.
 */
const generatePDF = async ({ template: Template, data }: PDFData): Promise<string> => {
  try {
    if (!Template) {
      throw new Error("Template not provided")
    }

    // Crear el componente con los datos
    const MyDocument = createElement(Template, { data })

    // Renderizar a stream
    const stream = await renderToStream(MyDocument)

    const buffer: Buffer = await new Promise((resolve, reject) => {
      const chunks: Buffer[] = []
      stream.on("data", (chunk) => chunks.push(chunk))
      stream.on("end", () => resolve(Buffer.concat(chunks)))
      stream.on("error", (error) => reject(error))
    })

    // Guardar en el backend, dentro del workspace (.playground/output/)
    await fs.mkdir(OUTPUT_DIR, { recursive: true })
    await fs.writeFile(OUTPUT_FILE, buffer)

    return buffer.toString("base64")
  } catch (error) {
    throw new PdfGenerationError(
      "Error generating PDF: " + (error instanceof Error ? error.message : "Unknown error")
    )
  }
}

export default generatePDF
