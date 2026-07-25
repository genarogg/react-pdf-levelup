import {
  flattenStyle,
  toNumber,
  extractBorderWidth,
  extractBorderColor,
  innerRadiusOf,
  omitKeys,
} from "./style-utils";
import type { GridMode, BorderRadiusMethod } from "./types";

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
  /**
   * true cuando Table necesita el workaround. Se dispara únicamente por
   * la presencia de un `borderRadius` explícito (`outerRadius > 0`),
   * sin importar si además hay `borderWidth` real: el bug de
   * @react-pdf/renderer con radios grandes también aparece sin borde
   * (ej. `grid="not-grid"` sin `borderWidth` explícito), así que atar
   * el fix a `outerBorderWidth > 0` dejaba esos casos sin protección.
   *
   * Esta condición de activación es la misma sin importar
   * `borderRadiusMethod`: el método solo decide CÓMO se resuelve el fix
   * una vez activo, no SI se activa.
   */
  useFix: boolean;
  /**
   * Método efectivamente aplicado. Puede diferir del `borderRadiusMethod`
   * pedido en `Table` si ese método todavía no está implementado (hoy,
   * "svg" cae a "view" — ver `resolveBorderRadiusFixSvg`). `Table` guarda
   * este valor (no el prop crudo) en `TableContext`.
   */
  method: BorderRadiusMethod;
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
 * Es un dispatcher fino: la geometría real vive en una función privada
 * por método (`resolveBorderRadiusFixView`, `resolveBorderRadiusFixSvg`).
 * Agregar un método nuevo el día de mañana es sumar un `case` acá + su
 * función, sin tocar `Table.tsx` ni el resto del árbol (que ya leen
 * `useFix`/`method`/la geometría desde el resultado, no el método
 * pedido).
 *
 * A propósito NO se llama `useBorderRadiusFix`: no usa ningún hook de
 * React por dentro (nada de useState/useContext/useEffect), es una
 * función pura sobre `style`/`grid`/`borderColor`/`borderRadiusMethod`.
 * Nombrarla como hook sugeriría que está atada a las Rules of Hooks
 * cuando no lo está, y se puede testear pasándole un `style` y
 * comprobando qué backgroundColor/padding/radius produce, sin montar
 * ningún componente.
 */
export function resolveBorderRadiusFix(
  style: any,
  grid: GridMode,
  borderColor: string,
  borderRadiusMethod: BorderRadiusMethod = "view"
): BorderRadiusFixResult {
  switch (borderRadiusMethod) {
    case "svg":
      return resolveBorderRadiusFixSvg(style, grid, borderColor);
    case "view":
    default:
      return resolveBorderRadiusFixView(style, grid, borderColor);
  }
}

// @react-pdf/renderer tiene un bug conocido (issue #395) al combinar
// `border`/`borderWidth` (stroke) con `borderRadius` en la MISMA View: la
// geometría de la curva sale distorsionada. Cuando detectamos esa
// combinación en el `style` del Table, quitamos esas keys de ahí y
// simulamos el borde con backgroundColor (color del borde) + padding
// (grosor del borde) + borderRadius, que es un relleno normal (sin stroke)
// y no dispara el bug. Ver también issue #640 (overflow no recorta el
// backgroundColor de Views hijas), por eso además redondeamos a mano las
// esquinas de Thead/Td en vez de confiar en overflow:hidden.
//
// Este es el método "view" — el único implementado hoy (ver
// `BorderRadiusMethod` en types.ts).
function resolveBorderRadiusFixView(
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

  // El fix se dispara solo por `borderRadius` explícito (outerRadius > 0
  // ya lo garantiza: el default es 0, no hay radio implícito en ningún
  // lado). Ya NO exige `outerBorderWidth > 0`: el bug de renderizado con
  // radios grandes en @react-pdf/renderer ocurre tenga o no borde real,
  // así que gatearlo por el borde dejaba sin fix, por ejemplo, a
  // grid="not-grid" (sin borderWidth explícito) con radios grandes.
  const useFix = outerRadius > 0;
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
    method: "view",
    outerBorderColor,
    outerBorderWidth,
    outerRadius,
    innerRadius,
    backgroundColor: flatStyle.backgroundColor,
    restStyle,
  };
}

// Evita spamear la consola si Table se re-renderiza varias veces con
// borderRadiusMethod="svg" (ej. una preview en vivo con <PDFViewer>): el
// warning es útil una vez, no en cada render.
let hasWarnedAboutSvgMethod = false;

/**
 * Método "svg": TODO — no implementado todavía.
 *
 * La idea a futuro es dibujar el borde redondeado con un `Svg`/`Path` de
 * @react-pdf/renderer en vez de la simulación con View +
 * backgroundColor + padding del método "view". Eso evitaría el límite
 * práctico de radio ~12 documentado en `bug.md` (punto 2): un `Path`
 * dibuja la curva real en vez de aproximarla restando
 * `outerRadius - outerBorderWidth` (`innerRadiusOf()`), que es lineal y
 * deja de calzar visualmente a partir de cierto tamaño. También podría
 * eventualmente ayudar con el punto 1 de `bug.md` (la celda de esquina
 * de la última fila), aunque eso además requeriría cambios en `Cell.tsx`.
 *
 * Mientras tanto, pedir "svg" no debe romper el render ni dejar la tabla
 * sin ningún fix — cae a "view" con un warning, para que quien lo pida
 * hoy siga viendo una tabla funcional (con el límite de radio ~12 del
 * método "view") en vez de un radio roto o una excepción.
 */
function resolveBorderRadiusFixSvg(
  style: any,
  grid: GridMode,
  borderColor: string
): BorderRadiusFixResult {
  if (!hasWarnedAboutSvgMethod) {
    hasWarnedAboutSvgMethod = true;
    console.warn(
      '[Table] borderRadiusMethod="svg" todavía no está implementado. Usando "view" como fallback.'
    );
  }
  return resolveBorderRadiusFixView(style, grid, borderColor);
}
