// Controller de GET /api/render/file (genera y guarda el PDF en disco,
// modo servidor). Sigue el mismo patrón MVC ligero que el resto del
// server: valida el input HTTP, orquesta las piezas de dominio (grafo ->
// compilación -> render), y formatea la respuesta / los códigos de error.
// No toca fs directo en ningún punto — eso vive en workspace.model.ts,
// vía serverModuleGraph.
import type { FastifyReply, FastifyRequest } from "fastify"
import type * as React from "react"
import * as workspaceModel from "../models/workspace.model.js"
import * as stateModel from "../models/state.model.js"
import { buildServerModuleGraph } from "../lib/serverModuleGraph.js"
import { compileServerWorkspace } from "../lib/serverCompileWorkspace.js"
import generatePDF, { PdfGenerationError } from "../lib/generatePDF.js"
import { userConfig } from "../config.js"
import type {
  GetRenderFileQuery,
  GetRenderFileResponse,
} from "../types/index.js"

/**
 * Resuelve mainFile (query o el persistido en state.json), valida que
 * exista, y devuelve el componente ya compilado listo para renderizar.
 * Lanza (para que errorHandler.ts lo traduzca) o devuelve
 * { ok: false, error } si la compilación falla.
 */
async function resolveCompiledComponent(
  mainFileInput: string | null | undefined
): Promise<{ ok: true; mainFile: string; component: React.ComponentType } | { ok: false; error: string }> {
  let mainFile = mainFileInput

  if (!mainFile || typeof mainFile !== "string") {
    const state = await stateModel.readState()
    mainFile = state.mainFile
  }

  if (!mainFile || typeof mainFile !== "string") {
    return {
      ok: false,
      error: "Falta 'mainFile' y no hay mainFile persistido en el workspace.",
    }
  }

  if (!(await workspaceModel.exists(mainFile))) {
    const err = new Error(`No existe: ${mainFile}`) as NodeJS.ErrnoException
    err.code = "ENOENT"
    throw err // lo traduce errorHandler.ts a 404
  }

  const graph = await buildServerModuleGraph(mainFile)
  const compileResult = await compileServerWorkspace(graph, userConfig.serverNpmWhitelist)

  if (!compileResult.ok) {
    return { ok: false, error: compileResult.error }
  }

  return { ok: true, mainFile, component: compileResult.component }
}

// GET /api/render/file — genera el PDF con generatePDF.ts
// (renderToStream) y GUARDA el PDF generado en el backend
// (.playground/output/render.pdf dentro del workspace) antes de
// devolver el mismo base64 ya guardado. Siempre genera de nuevo, sin
// cache: cada request vuelve a compilar y renderizar.
export async function generateAndSaveFile(
  req: FastifyRequest<{ Querystring: GetRenderFileQuery }>,
  reply: FastifyReply
) {
  const resolved = await resolveCompiledComponent(req.query?.mainFile)

  if (!resolved.ok) {
    const response: GetRenderFileResponse = { ok: false, error: resolved.error }
    return reply.code(resolved.error.includes("Falta 'mainFile'") ? 400 : 422).send(response)
  }

  try {
    const pdfBase64 = await generatePDF({ template: resolved.component })
    const fileName = resolved.mainFile.replace(/\.[tj]sx?$/i, "") + ".pdf"
    const response: GetRenderFileResponse = { ok: true, pdfBase64, fileName }
    return reply.send(response)
  } catch (err) {
    if (err instanceof PdfGenerationError) {
      const response: GetRenderFileResponse = { ok: false, error: err.message }
      return reply.code(422).send(response)
    }
    throw err
  }
}
