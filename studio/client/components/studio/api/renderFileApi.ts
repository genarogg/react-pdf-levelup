export interface RenderFileResult {
  ok: boolean
  pdfBase64?: string
  fileName?: string
  error?: string
}

/**
 * GET /api/render/file — el backend genera el PDF con generatePDF.ts
 * (renderToStream), lo guarda en disco (.playground/output/render.pdf
 * dentro del workspace) y devuelve el mismo base64 ya guardado.
 *
 * Nunca lanza por errores de negocio (400/404/422): siempre devuelve
 * `{ ok, pdfBase64, error }`. Solo lanza ante fallos de red/transporte
 * genuinos.
 */
export async function renderPdfFile(mainFile: string): Promise<RenderFileResult> {
  const params = new URLSearchParams({ mainFile })
  const res = await fetch(`/api/render/file?${params.toString()}`, {
    method: "GET",
  })

  const data = await res.json().catch(() => null)

  if (!data || typeof data.ok !== "boolean") {
    throw new Error(`Respuesta inesperada de /api/render/file (HTTP ${res.status})`)
  }

  return data as RenderFileResult
}
