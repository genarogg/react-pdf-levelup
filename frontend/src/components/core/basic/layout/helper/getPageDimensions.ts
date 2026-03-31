export type PageSize =
  | "4A0" | "2A0"
  | "A0" | "A1" | "A2" | "A3" | "A4" | "A5" | "A6" | "A7" | "A8"
  | "B0" | "B1" | "B2" | "B3" | "B4" | "B5" | "B6" | "B7" | "B8" | "B9"
  | "C0" | "C1" | "C2" | "C3" | "C4" | "C5" | "C6" | "C7" | "C8"
  | "RA0" | "RA1" | "RA2" | "RA3" | "RA4"
  | "SRA0" | "SRA1" | "SRA2" | "SRA3" | "SRA4"
  | "EXECUTIVE" | "FOLIO" | "LEGAL" | "LETTER" | "TABLOID" | "ID1"

export type PdfOrientation = "portrait" | "landscape"

// Valores en puntos (72dpi), tal como los usa react-pdf internamente
const PAGE_SIZES: Record<PageSize, [number, number]> = {
  "4A0": [4767.87, 6740.79],
  "2A0": [3370.39, 4767.87],
  A0:   [2383.94, 3370.39],
  A1:   [1683.78, 2383.94],
  A2:   [1190.55, 1683.78],
  A3:   [841.89,  1190.55],
  A4:   [595.28,  841.89],
  A5:   [419.53,  595.28],
  A6:   [297.64,  419.53],
  A7:   [209.76,  297.64],
  A8:   [147.4,   209.76],
  B0:   [2834.65, 4008.19],
  B1:   [2004.09, 2834.65],
  B2:   [1417.32, 2004.09],
  B3:   [1000.63, 1417.32],
  B4:   [708.66,  1000.63],
  B5:   [498.9,   708.66],
  B6:   [354.33,  498.9],
  B7:   [249.45,  354.33],
  B8:   [175.75,  249.45],
  B9:   [124.72,  175.75],
  C0:   [2599.37, 3676.54],
  C1:   [1836.85, 2599.37],
  C2:   [1298.27, 1836.85],
  C3:   [918.43,  1298.27],
  C4:   [649.13,  918.43],
  C5:   [459.21,  649.13],
  C6:   [323.15,  459.21],
  C7:   [229.61,  323.15],
  C8:   [161.57,  229.61],
  RA0:  [2437.8,  3458.27],
  RA1:  [1729.13, 2437.8],
  RA2:  [1218.9,  1729.13],
  RA3:  [864.57,  1218.9],
  RA4:  [609.45,  864.57],
  SRA0: [2551.18, 3628.35],
  SRA1: [1814.17, 2551.18],
  SRA2: [1275.59, 1814.17],
  SRA3: [907.09,  1275.59],
  SRA4: [637.8,   907.09],
  EXECUTIVE: [521.86, 756.0],
  FOLIO:     [612.0,  936.0],
  LEGAL:     [612.0,  1008.0],
  LETTER:    [612.0,  792.0],
  TABLOID:   [792.0,  1224.0],
  ID1:       [153,    243],
}

export const PAGE_DIMENSIONS = PAGE_SIZES

export function getPageDimensions(pageSize: string, orientation: PdfOrientation) {
  const [w, h] = PAGE_SIZES[pageSize.toUpperCase() as PageSize] ?? PAGE_SIZES.A4
  return orientation === "landscape"
    ? { width: h, height: w }
    : { width: w, height: h }
}