import {
  flattenStyle,
  toNumber,
  extractBorderWidth,
  extractBorderColor,
  innerRadiusOf,
  omitKeys,
} from "./style-utils";
import type { GridMode } from "./types";

// @react-pdf/renderer tiene un bug conocido (issue #395) al combinar
// `border`/`borderWidth` (stroke) con `borderRadius` en la MISMA View: la
// geometría de la curva sale distorsionada. Cuando detectamos esa
// combinación en el `style` del Table, quitamos esas keys de ahí y
// simulamos el borde con backgroundColor (color del borde) + padding
// (grosor del borde) + borderRadius, que es un relleno normal (sin stroke)
// y no dispara el bug. Ver también issue #640 (overflow no recorta el
// backgroundColor de Views hijas), por eso además redondeamos a mano las
// esquinas de Thead/Td en vez de confiar en overflow:hidden.
const BORDER_SHORTHAND_KEYS = [
  "border",
  "borderWidth",
  "borderStyle",
  "borderColor",
  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor",
  "borderRadius",
];

export interface BorderRadiusFixResult {
  /** true cuando Table necesita el workaround (hay borderRadius + borderWidth reales combinados). */
  useFix: boolean;
  outerBorderColor: string;
  outerBorderWidth: number;
  outerRadius: number;
  innerRadius: number;
  /** backgroundColor original del usuario, reservado para la capa interna cuando useFix está activo. */
  backgroundColor: any;
  /** `style` ya resuelto: sin las keys de borde/radius cuando useFix está activo, o el `style` original sin tocar si no. */
  restStyle: any;
}

/**
 * Resuelve el workaround del bug #395 para `Table`.
 *
 * A propósito NO se llama `useBorderRadiusFix`: no usa ningún hook de
 * React por dentro (nada de useState/useContext/useEffect), es una
 * función pura sobre `style`/`grid`/`borderColor`. Nombrarla como hook
 * sugeriría que está atada a las Rules of Hooks cuando no lo está, y
 * se puede testear pasándole un `style` y comprobando qué
 * backgroundColor/padding/radius produce, sin montar ningún componente.
 */
export function resolveBorderRadiusFix(
  style: any,
  grid: GridMode,
  borderColor: string
): BorderRadiusFixResult {
  const flatStyle = flattenStyle(style);
  const outerRadius = toNumber(flatStyle.borderRadius);
  const styleBorderWidth = extractBorderWidth(flatStyle);

  // grid="grid" agrega su propio borde fino de 1 al Table (ver Table.tsx).
  // grid="not-grid" NO dibuja ningún borde real: @react-pdf/renderer (vía
  // pdfkit) no reconoce la keyword CSS "transparent" ni rgba() con alpha
  // como borderColor — _normalizeColor devuelve null para esos valores, lo
  // que hace que el motor conserve el último color de stroke usado
  // (típicamente negro) en vez de no dibujar nada. Por eso "not-grid" usa
  // borderWidth 0 en vez de intentar un borde "invisible" por color.
  //
  // OJO: esto describe el borde IMPLÍCITO que grid agregaría por su
  // cuenta si el usuario no puso nada — no debe confundirse con un
  // borderWidth real que el usuario sí puso a mano en `style`.
  const gridBorderWidth = grid === "grid" ? 1 : 0;
  const hasExplicitBorderWidth =
    flatStyle.borderWidth !== undefined || typeof flatStyle.border === "string";
  // outerBorderWidth solo decide el grosor del borde EXTERIOR real (lo que
  // se ve/dibuja), respetando siempre un borderWidth explícito del
  // usuario; solo cae al default de grid (0 para not-grid, 1 para grid)
  // cuando el usuario no especificó nada.
  const outerBorderWidth = hasExplicitBorderWidth ? styleBorderWidth : gridBorderWidth;
  const outerBorderColor = extractBorderColor(flatStyle) ?? borderColor;

  const useFix = outerRadius > 0 && outerBorderWidth > 0;
  const innerRadius = innerRadiusOf(outerRadius, outerBorderWidth);

  // Si useFix está activo, el `backgroundColor` del usuario se reserva
  // para la capa interna (ver `content` en Table.tsx): el View exterior ya
  // tiene su propio backgroundColor forzado (outerBorderColor, simulando
  // el borde) y dejar pasar el de restStyle lo pisaría, tapando el efecto
  // de borde.
  const restStyle = useFix
    ? omitKeys(flatStyle, [...BORDER_SHORTHAND_KEYS, "overflow", "backgroundColor"])
    : style;

  return {
    useFix,
    outerBorderColor,
    outerBorderWidth,
    outerRadius,
    innerRadius,
    backgroundColor: flatStyle.backgroundColor,
    restStyle,
  };
}
