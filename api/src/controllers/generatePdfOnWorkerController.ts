import { generatePDFonWorker } from "@react-pdf-levelup/server"
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

const generatePdfOnWorkerController = async (
    request: FastifyRequest<{ Body: BodyInput }>,
    reply: FastifyReply
) => {
    let tempFilePath: string | null = null
    console.log("paso 1")
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

        // 4️⃣ Generar PDF en el pool de worker threads.
        //    Ya NO se importa el componente en el hilo principal
        //    (loadComponentFromFile ya no hace falta): generatePDFonWorker
        //    recibe la ruta del archivo y es el propio worker el que hace
        //    el `import()` dinámico del template, dentro de su hilo.

        // 5️⃣ Limpiar archivo temporal
        // await cleanupTempFile(tempFilePath)
        console.log("paso 2")

        // 6️⃣ Devolver PDF base64
        const pdf = await generatePDFonWorker({
            templatePath: tempFilePath,
            data,
        })

        console.log("paso 3")

        return reply
            .status(200)
            .send(successResponse({ data: { pdf } }))
    } catch (e: any) {
        console.error("Error en generatePdfOnWorker:", e)

        return reply.status(500).send(
            errorResponse({
                message: e?.message || "Error interno",
            })
        )
    } finally {
        // A diferencia de la versión no-worker, acá SÍ conviene limpiar:
        // el worker ya terminó de importar/renderizar el archivo temporal
        // en el momento en que llegamos a este bloque (el `await` de más
        // arriba no resuelve hasta que el worker devuelve el buffer), así
        // que no hay riesgo de borrar el archivo mientras todavía se está
        // usando.
        if (tempFilePath) await cleanupTempFile(tempFilePath)
    }
}

export { generatePdfOnWorkerController }