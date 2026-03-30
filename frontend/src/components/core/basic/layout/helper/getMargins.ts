export const MM_TO_POINTS = 2.834645669

export type MarginPreset = "apa" | "normal" | "estrecho" | "ancho"

const mm = (value: number) => value * MM_TO_POINTS
const toSides = (value: number) => ({ paddingTop: value, paddingRight: value, paddingBottom: value, paddingLeft: value })

const MARGIN_MAP: Record<Exclude<MarginPreset, "normal">, ReturnType<typeof toSides>> = {
    "apa": toSides(mm(25.4)),  // 25.4mm = 1 pulgada, estándar APA
    "estrecho": toSides(mm(12.7)),  // 12.7mm = 0.5 pulgadas
    "ancho": toSides(mm(38.1)),  // 38.1mm = 1.5 pulgadas
}

export function getMargins(margin: MarginPreset, padding: number) {
    return MARGIN_MAP[margin as Exclude<MarginPreset, "normal">] ?? toSides(padding)
}
