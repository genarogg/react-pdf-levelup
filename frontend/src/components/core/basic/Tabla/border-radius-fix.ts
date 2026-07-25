import {
  flattenStyle,
  toNumber,
  extractBorderWidth,
  extractBorderColor,
  innerRadiusOf,
  omitKeys,
  BORDER_SHORTHAND_KEYS,
} from "./style-utils";
import { resolveBorderRadiusFixSvg } from "./border-radius-svg-fix";
import type { GridMode, BorderRadiusMethod } from "./types";

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
   * Método efectivamente aplicado — hoy siempre coincide con el
   * `borderRadiusMethod` pedido en `Table`, porque los dos métodos
   * ("view" y "svg") ya están implementados. Se mantiene como campo
   * aparte, en vez de que `Table` reutilice directamente el prop crudo,
   * pensando en el día en que un tercer método necesite resolver a otro
   * como fallback (por ejemplo, si no está disponible en cierto
   * contexto). `Table` guarda este valor en `TableContext`, no el prop.
   */
  method: BorderRadiusMethod;
  outerBorderColor: string;
  outerBorderWidth: number;
  outerRadius: number;
  innerRadius: number;
  /**
   * backgroundColor original del usuario. Solo tiene un uso real en el
   * método "view" (se reserva para la capa interna del sándwich — ver
   * `content` en Table.tsx). En "svg" no hay ninguna capa que lo
   * necesite aparte — el `backgroundColor` del usuario ya viaja tal cual
   * dentro de `restStyle` — así que ahí este campo queda solo por
   * completitud de la interfaz, sin que `Table.tsx` lo use.
   */
  backgroundColor: any;
  /** `style` ya resuelto: sin las keys de borde/radius cuando useFix está activo, o el `style` original sin tocar si no. */
  restStyle: any;
}

/**
 * Resuelve el workaround del bug #395 para `Table`.
 *
 * Es un dispatcher fino: la geometría real vive en una función privada
 * por método (`resolveBorderRadiusFixView` acá abajo,
 * `resolveBorderRadiusFixSvg` en `border-radius-svg-fix.tsx`). Agregar un
 * método nuevo el día de mañana es sumar un `case` acá + su función, sin
 * tocar `Table.tsx` ni el resto del árbol (que ya leen
 * `useFix`/`method`/la geometría desde el resultado, no el método
 * pedido).
 *
 * OJO con la dirección de las dependencias: este archivo importa
 * `resolveBorderRadiusFixSvg` desde `border-radius-svg-fix.tsx`, pero
 * ese archivo NUNCA importa nada (en tiempo de ejecución) desde acá — lo
 * que necesita compartir (`BORDER_SHORTHAND_KEYS`) vive en
 * `style-utils.ts`, un tercer archivo neutral. Si `border-radius-svg-fix`
 * necesitara importar un valor de acá, se armaría una dependencia
 * circular entre los dos.
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
// Este es el método "view". El otro método implementado, "svg", vive en
// `border-radius-svg-fix.tsx` y resuelve el mismo bug de otra forma: en
// vez de simular el borde con un relleno, lo dibuja con un trazo de SVG
// sin fill, así el interior de la tabla puede quedar completamente
// "hueco" (sin ningún backgroundColor forzado) si el usuario no puso
// ninguno — cosa que "view" no puede hacer, porque necesita ese relleno
// para armar el efecto de borde.
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
