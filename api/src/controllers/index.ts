import { generatePDF } from "react-pdf-levelup"
import type { FastifyRequest, FastifyReply } from "fastify"
import { successResponse, errorResponse } from "@/func/response"
import * as fs from "fs/promises"
import * as path from "path"

/* =========================
   Utils
========================= */

type AnyData = any

export function decodeBase64File(templateBase64: string): string {
    try {
        return Buffer.from(templateBase64, "base64").toString("utf-8")
    } catch (error) {
        throw new Error(`Error al decodificar archivo base64: ${error}`)
    }
}

/**
 * Guarda código JS en archivo temporal
 */
async function saveJsToFile(jsCode: string): Promise<string> {
    const tempDir = path.join(process.cwd(), "temp")
    await fs.mkdir(tempDir, { recursive: true })

    const fileName = `template-${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.js`

    const filePath = path.join(tempDir, fileName)
    await fs.writeFile(filePath, jsCode, "utf-8")

    return filePath
}

/**
 * Compila TSX → JS (sin JSX)
 */
async function compileTSXToJS(tsxCode: string): Promise<string> {
    try {
        const { transform } = await import("@babel/standalone")

        const result = transform(tsxCode, {
            presets: [
                "typescript",
                ["react", { runtime: "classic" }],
            ],
            filename: "template.tsx",
            sourceType: "module",
        })

        if (!result?.code) {
            throw new Error("Babel no generó código")
        }

        return result.code
    } catch (error) {
        throw new Error(`Error al compilar TSX a JS: ${error}`)
    }
}

/**
 * Importa componente React desde archivo JS
 */
async function loadComponentFromFile(
    filePath: string
): Promise<React.ComponentType<any>> {
    try {
        const fileUrl = `file://${filePath}`
        const module = await import(fileUrl)

        const Component = module.default || module

        if (typeof Component !== "function") {
            throw new Error("El archivo no exporta un componente React válido")
        }

        return Component
    } catch (error) {
        throw new Error(`Error al importar componente desde archivo: ${error}`)
    }
}

/**
 * Limpia archivo temporal
 */
async function cleanupTempFile(filePath: string) {
    try {
        await fs.unlink(filePath)
    } catch {
        // silencioso
    }
}

/* =========================
   Controller
========================= */

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

        // 1️⃣ Decodificar TSX
        const tsxCode = decodeBase64File(template)

        // 2️⃣ Compilar TSX → JS
        const jsCode = await compileTSXToJS(tsxCode)

        // 3️⃣ Guardar como .js
        tempFilePath = await saveJsToFile(jsCode)
        console.log("Template JS:", tempFilePath)

        // 4️⃣ Importar componente
        const TemplateComponent = await loadComponentFromFile(tempFilePath)

        // 5️⃣ Generar PDF
        const pdf = await generatePDF({
            template: TemplateComponent,
            data,
        })

        return reply
            .status(200)
            .send(successResponse({ data: { pdf } }))
    } catch (e: any) {
        console.error("Error en generatePdfController:", e)

        return reply.status(500).send(
            errorResponse({
                message: e?.message || "Error interno",
            })
        )
    } finally {
        // Limpieza (opcional)
        // if (tempFilePath) await cleanupTempFile(tempFilePath)
    }
}

export { generatePdfController }
