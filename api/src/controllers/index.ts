import { generatePDF } from "react-pdf-levelup"
import type { FastifyRequest, FastifyReply } from "fastify"
import { successResponse, errorResponse } from "@/func/response"
import * as fs from "fs/promises"
import * as path from "path"

type AnyData = any

export function decodeBase64File(templateBase64: string): string {
    try {
        const buffer = Buffer.from(templateBase64, "base64")
        const tsxCode = buffer.toString("utf-8")
        return tsxCode
    } catch (error) {
        throw new Error(`Error al decodificar archivo base64: ${error}`)
    }
}

/**
 * Guarda el código TSX en un archivo temporal
 */
async function saveTsxToFile(tsxCode: string): Promise<string> {
    const tempDir = path.join(process.cwd(), "temp")

    // Crear directorio temp si no existe
    await fs.mkdir(tempDir, { recursive: true })

    // Generar nombre único para el archivo
    const fileName = `template-${Date.now()}-${Math.random().toString(36).substring(7)}.tsx`
    const filePath = path.join(tempDir, fileName)

    // Guardar el archivo
    await fs.writeFile(filePath, tsxCode, "utf-8")

    return filePath
}

/**
 * Carga el componente dinámicamente desde el archivo TSX usando import()
 */
async function loadComponentFromFile(filePath: string): Promise<React.ComponentType<any>> {
    try {
        // Convertir a URL absoluta para import dinámico
        const fileUrl = `file://${filePath}`

        // Importar dinámicamente el módulo
        const module = await import(fileUrl)

        // Obtener el componente (export default o named export)
        const Component = module.default || module

        // Verificar que sea un componente válido
        if (!Component || (typeof Component !== 'function' && typeof Component !== 'object')) {
            throw new Error("El archivo no exporta un componente React válido")
        }

        return Component
    } catch (error) {
        throw new Error(`Error al importar componente desde archivo: ${error}`)
    }
}

/**
 * Limpia el archivo temporal después de usarlo
 */
async function cleanupTempFile(filePath: string): Promise<void> {
    try {
        await fs.unlink(filePath)
    } catch (error) {
        console.error(`Error al eliminar archivo temporal: ${error}`)
    }
}

type BodyInput = {
    template: string
    data?: AnyData
}

const generatePdfController = async (
    request: FastifyRequest<{ Body: BodyInput }>,
    reply: FastifyReply
) => {
    let tempFilePath: string | null = null

    try {
        const { template, data } = request.body

        if (!template || typeof template !== "string") {
            return reply.status(400).send(
                errorResponse({ message: "template es requerido en base64" })
            )
        }

        // Decodificar template
        const tsxCode = decodeBase64File(template)

        // Guardar en archivo temporal
        tempFilePath = await saveTsxToFile(tsxCode)
        console.log(`Template guardado en: ${tempFilePath}`)

        // Cargar el componente dinámicamente desde el archivo
        const ComponentFromString = await loadComponentFromFile(tempFilePath)

        // Generar PDF con el componente cargado dinámicamente
        const pdf = await generatePDF({
            template: ComponentFromString,
            data,
        })

        console.log("PDF generado exitosamente")

        return reply.status(200).send(successResponse({ data: { pdf } }))
    } catch (e: any) {
        console.error("Error en generatePdfController:", e)
        return reply.status(500).send(
            errorResponse({ message: e?.message || "Error interno" })
        )
    } finally {
        // Limpiar archivo temporal
        // if (tempFilePath) {
        //     await cleanupTempFile(tempFilePath)
        // }
    }
}

export { generatePdfController }