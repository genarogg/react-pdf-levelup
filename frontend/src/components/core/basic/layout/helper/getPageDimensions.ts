import { MM_TO_POINTS } from "./getMargins"

export type PageSize = "A0" | "A1" | "A2" | "A3" | "A4" | "A5" | "A6" | "A7" | "A8" | "A9" | "LETTER" | "LEGAL" | "TABLOID"
export type PdfOrientation = "portrait" | "landscape"

export const PAGE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  A0: { width: 841, height: 1189 },
  A1: { width: 594, height: 841 },
  A2: { width: 420, height: 594 },
  A3: { width: 297, height: 420 },
  A4: { width: 210, height: 297 },
  A5: { width: 148, height: 210 },
  A6: { width: 105, height: 148 },
  A7: { width: 74, height: 105 },
  A8: { width: 52, height: 74 },
  A9: { width: 37, height: 52 },
  LETTER: { width: 216, height: 279 },
  LEGAL: { width: 216, height: 356 },
  TABLOID: { width: 279, height: 432 },
}

const PAGE_DIMENSIONS_PTS: Record<PageSize, { width: number; height: number }> = Object.fromEntries(
  Object.entries(PAGE_DIMENSIONS).map(([key, dims]) => [
    key,
    { width: dims.width * MM_TO_POINTS, height: dims.height * MM_TO_POINTS }
  ])
) as Record<PageSize, { width: number; height: number }>

export function getPageDimensions(pageSize: string, orientation: PdfOrientation) {
  const dims = PAGE_DIMENSIONS_PTS[pageSize.toUpperCase() as PageSize] ?? PAGE_DIMENSIONS_PTS.A4
  return orientation === "landscape"
    ? { width: dims.height, height: dims.width }
    : { width: dims.width, height: dims.height }
}
