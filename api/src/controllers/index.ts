import { promises as fs } from "fs"
import path from "path"
import { pathToFileURL } from "url"
import type { ComponentType } from "react"
import { generatePDF } from "react-pdf-levelup"
import type { FastifyRequest, FastifyReply } from "fastify"
import { successResponse, errorResponse } from "@/func/response"

type AnyData = any

const ensureDefaultExport = (code: string) => {
  if (/export\s+default\s+/m.test(code)) return code
  const matchConst = code.match(/const\s+([A-Z][A-Za-z0-9_]*)\s*=/m)
  const matchFunc = code.match(/function\s+([A-Z][A-Za-z0-9_]*)\s*\(/m)
  const matchClass = code.match(/class\s+([A-Z][A-Za-z0-9_]*)\s*/m)
  const name = matchConst?.[1] || matchFunc?.[1] || matchClass?.[1]
  if (!name) return code
  return `${code}\nexport default ${name};`
}

export const generatePdfFromBase64Tsx = async (tsxBase64: string, data: AnyData): Promise<string> => {
  const tsxCode = Buffer.from(tsxBase64, "base64").toString("utf-8")
  const finalCode = ensureDefaultExport(tsxCode)

  const baseDir = path.join(process.cwd(), ".tmp-react-pdf-levelup")
  await fs.mkdir(baseDir, { recursive: true })
  const tmpDir = path.join(baseDir, `${Date.now()}`)
  await fs.mkdir(tmpDir, { recursive: true })
  const filePath = path.join(tmpDir, `Template_${Date.now()}.tsx`)
  await fs.writeFile(filePath, finalCode, "utf-8")

  const fileUrl = pathToFileURL(filePath).href
  const mod = await import(fileUrl)
  const Template: ComponentType<any> = mod.default || mod.Template || mod.Component

  if (!Template) throw new Error("No se encontró un componente React exportado")

  const base64 = await generatePDF({ template: Template, data })

  try {
    await fs.unlink(filePath)
    await fs.rmdir(tmpDir)
  } catch {}

  return base64
}

type BodyInput = {
  template: string
  data?: AnyData
}

export const generatePdfController = async (
  request: FastifyRequest<{ Body: BodyInput }>,
  reply: FastifyReply
) => {
  try {
    const { template, data } = request.body || {}
    if (!template || typeof template !== "string") {
      return reply.status(400).send(errorResponse({ message: "template es requerido en base64" }))
    }
    const pdf = await generatePdfFromBase64Tsx(template, data)
    return reply.status(200).send(successResponse({ data: { pdf } }))
  } catch (e: any) {
    return reply.status(500).send(errorResponse({ message: e?.message || "Error interno" }))
  }
}

export default { generatePdfFromBase64Tsx }
