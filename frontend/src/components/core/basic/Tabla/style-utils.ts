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
  // Fallback a colores por lado (borderTopColor, borderRightColor, etc.).
  // El borde simulado por el "radius fix" es un solo relleno uniforme —
  // no puede representar cuatro colores distintos a la vez — así que acá
  // sólo importa no ignorarlos por completo: si el usuario definió algún
  // lado, se usa ese color en vez de caer silenciosamente al `borderColor`
  // default del Table. Prioridad fija top > right > bottom > left; si hay
  // varios lados con colores distintos, gana el primero de esa lista.
  return (
    flat.borderTopColor ??
    flat.borderRightColor ??
    flat.borderBottomColor ??
    flat.borderLeftColor
  );
}

export function innerRadiusOf(outerRadius: number, outerBorderWidth: number): number {
  return Math.max(outerRadius - outerBorderWidth, 0);
}

export function omitKeys(flat: Record<string, any>, keys: string[]): Record<string, any> {
  const result = { ...flat };
  keys.forEach((k) => delete result[k]);
  return result;
}