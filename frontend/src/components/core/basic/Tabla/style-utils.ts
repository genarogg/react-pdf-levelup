/* =================================================================
 * Utilidades genéricas de `style` de @react-pdf/renderer.
 * No son específicas de tabla — cualquier componente que necesite leer
 * border/radius de un `style` puede importarlas desde acá en vez de
 * reimplementarlas.
 * ================================================================= */

export function flattenStyle(style: any): Record<string, any> {
  if (!style) return {};
  if (Array.isArray(style)) {
    return style.reduce((acc, s) => ({ ...acc, ...flattenStyle(s) }), {});
  }
  return style;
}

export function toNumber(value: any): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const n = parseFloat(value);
    return isNaN(n) ? 0 : n;
  }
  return 0;
}

export function extractBorderWidth(flat: Record<string, any>): number {
  if (flat.borderWidth !== undefined) return toNumber(flat.borderWidth);
  if (typeof flat.border === "string") {
    const match = flat.border.match(/^(\d+(\.\d+)?)/);
    if (match) return parseFloat(match[1]);
  }
  return 0;
}

export function extractBorderColor(flat: Record<string, any>): string | undefined {
  if (flat.borderColor) return flat.borderColor;
  if (typeof flat.border === "string") {
    const parts = flat.border.trim().split(/\s+/);
    return parts[parts.length - 1];
  }
  return undefined;
}

export function innerRadiusOf(outerRadius: number, outerBorderWidth: number): number {
  return Math.max(outerRadius - outerBorderWidth, 0);
}

export function omitKeys(flat: Record<string, any>, keys: string[]): Record<string, any> {
  const result = { ...flat };
  keys.forEach((k) => delete result[k]);
  return result;
}
