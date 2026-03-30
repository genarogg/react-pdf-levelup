export const MM_TO_POINTS = 2.834645669

export type MarginPreset = "apa" | "normal" | "estrecho" | "ancho"

export function getMargins(margin: MarginPreset, padding: number) {
  const mm = (value: number) => value * MM_TO_POINTS
  const all = (value: number) => ({ paddingTop: value, paddingRight: value, paddingBottom: value, paddingLeft: value })

  switch (margin) {
    case "apa":
      return all(mm(25.4))  // 25.4mm = 1 pulgada, estándar APA
    case "estrecho":
      return all(mm(12.7))  // 12.7mm = 0.5 pulgadas
    case "ancho":
      return all(mm(38.1))  // 38.1mm = 1.5 pulgadas
    case "normal":
    default:
      return all(padding)
  }
}
