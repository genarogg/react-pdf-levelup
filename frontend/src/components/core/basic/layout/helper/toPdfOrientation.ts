import type { PdfOrientation } from "./getPageDimensions"

const ORIENTATION_MAP: Record<string, PdfOrientation> = {
  "vertical": "portrait",
  "portrait": "portrait",
  "v": "portrait",
  "horizontal": "landscape",
  "landscape": "landscape",
  "h": "landscape",
}

export { type PdfOrientation }

export function toPdfOrientation(orientation: string): PdfOrientation {
  const value = (orientation ?? "").toString().toLowerCase()
  return ORIENTATION_MAP[value] ?? (console.warn(`Orientación no reconocida: ${orientation}. Usando portrait.`), "portrait")
}
