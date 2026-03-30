export type PdfOrientation = "portrait" | "landscape"

export function toPdfOrientation(orientation: string): PdfOrientation {
  const value = (orientation ?? "").toString().toLowerCase()
  switch (value) {
    case "vertical":
    case "portrait":
    case "v":
      return "portrait"
    case "horizontal":
    case "landscape":
    case "h":
      return "landscape"
    default:
      console.warn(`Orientación no reconocida: ${orientation}. Usando portrait.`)
      return "portrait"
  }
}
