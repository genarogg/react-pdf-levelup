import type { FastifyPluginAsync } from "fastify"
import * as renderController from "../controllers/render.controller.js"
import type { GetRenderFileQuery } from "../types/index.js"

const renderRoutes: FastifyPluginAsync = async (app) => {
  // Genera el PDF con generatePDF.ts, lo guarda en el backend y devuelve
  // el base64 para que el cliente lo decodifique con decodeBase64Pdf.ts
  // (ver client/components/studio/preview/StudioPDFPreviewServerFile.tsx).
  app.get<{ Querystring: GetRenderFileQuery }>("/render/file", renderController.generateAndSaveFile)
}

export default renderRoutes
