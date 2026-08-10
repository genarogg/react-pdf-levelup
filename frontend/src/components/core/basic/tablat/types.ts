import type React from "react";
import type { CornerRadii } from "./style-utils";

/* ================= TYPES ================= */

export type GridMode = "grid" | "modern" | "not-grid";

/**
 * Método usado para aplicar el workaround del bug de borderWidth +
 * borderRadius de @react-pdf/renderer (issue #395 — ver la lógica en
 * `border-radius-fix.ts`):
 *
 *   - "view" (`border-radius-fix.ts`): simula el borde combinando
 *     `backgroundColor` + `padding` en un `View` exterior en vez de un
 *     stroke real + radio en la misma View. Como consecuencia, el
 *     interior de la tabla SIEMPRE queda con ese color de fondo — no
 *     hay forma de dejarlo transparente.
 *   - "svg" (`border-radius-svg-fix.tsx`): dibuja el contorno con un
 *     trazo de `<Svg><Rect stroke .../></Svg>` sin `fill`, superpuesto
 *     al contenido real. El interior queda "hueco" (o con el
 *     `backgroundColor` que el usuario haya puesto), y de paso evita el
 *     límite práctico de radio ~12 del método "view" (ver `bug.md`,
 *     punto 2), porque dibuja una sola curva real en vez de aproximarla
 *     con dos `View`s anidados.
 *
 * El *método* es independiente de si el fix se *activa* o no: la
 * activación sigue dependiendo únicamente de un `borderRadius` explícito
 * en `style` (ver `TableProps.borderRadiusMethod` y `resolveBorderRadiusFix`).
 */
export type BorderRadiusMethod = "view" | "svg";

/**
 * Distingue si una celda compartida (`Cell`) se está usando como `Th` o
 * `Td`. Es un detalle interno — no se expone en la API pública de
 * `Th`/`Td`, que siguen recibiendo `CellProps` como siempre.
 */
export type CellVariant = "th" | "td";

/**
 * Una tanda de `rowsPerPage`: cuántas filas tiene y si fuerza salto de
 * página antes de renderizarse.
 *
 *   - `nRow`: cantidad de filas de ESTA tabla (no acumulado).
 *   - `break`: opcional. Si se omite, default `false` — o sea, salvo
 *     que lo pidas explícitamente, ninguna tabla fuerza salto de
 *     página por sí sola. Esto es distinto del comportamiento viejo
 *     (donde toda tabla != la primera saltaba automáticamente): ahora
 *     el salto es 100% explícito, entrada por entrada.
 */
export interface RowsPerPageEntry {
  nRow: number;
  break?: boolean;
}

export interface TableProps {
  children: React.ReactNode;
  style?: any;
  cellHeight?: number;
  borderColor?: string;
  textColor?: string;
  headerBackground?: string;
  zebraColor?: string;
  zebra?: boolean;
  grid?: GridMode;
  /**
   * Qué implementación usar para el workaround del bug de border-radius
   * cuando ese workaround está activo (ver `BorderRadiusMethod` arriba).
   * Default: "view".
   *
   * Este prop NO decide si el fix se activa — eso sigue pasando
   * automáticamente cuando `style` trae un `borderRadius` explícito
   * (`style={{ borderRadius }}`), igual que antes. `borderRadiusMethod`
   * solo elige QUÉ implementación se usa una vez que ya está activo.
   */
  borderRadiusMethod?: BorderRadiusMethod;
  /**
   * Corta la tabla en tablas independientes de verdad — una por página —
   * en vez de dejar que @react-pdf/renderer parta el contenido
   * automáticamente en medio de las filas.
   *
   * Por qué existe: @react-pdf/renderer NO expone el tamaño de página ni
   * el espacio restante a los componentes hijos (no hay un
   * `usePageSize()` ni nada parecido) — así que `Table` no tiene forma
   * de calcular solo cuántas filas entran. `rowsPerPage` evita ese
   * problema pidiéndoselo directo: vos ya sabés cuántas filas entran por
   * página (según tu `cellHeight`, el tamaño de página, y cuánto otro
   * contenido comparte esa página).
   *
   * Formato: un array de `{ nRow, break? }`, uno por tanda, en orden —
   * no acumulado. `[{ nRow: 5 }, { nRow: 10, break: true }]` es "la
   * primera tabla tiene 5 filas y no fuerza salto; la segunda tiene 10
   * filas y sí fuerza salto de página antes de renderizarse". `break`
   * es opcional en cada entrada — si se omite, esa tabla NO fuerza
   * salto (default `false`).
   *
   * Si `Tbody` tiene más filas de las que cubre el array, las que
   * sobran se siguen cortando repitiendo la ÚLTIMA entrada completa
   * (mismo `nRow` Y mismo `break`): con
   * `[{ nRow: 5 }, { nRow: 10, break: true }]` y 27 filas en total,
   * queda 5 + 10 + 10 + 2, y las tablas 3ª y 4ª (las que vienen de
   * repetir la última entrada) también fuerzan `break: true`.
   *
   * Cada tabla resultante es una tabla `Table` completa e
   * independiente — repite el `Thead`, y tiene su propio borde/esquinas
   * redondeadas de arriba a abajo (con cualquiera de los dos métodos,
   * "view" o "svg") como si hubieras escrito varios `<Table>` a mano.
   *
   * IMPORTANTE: mientras `rowsPerPage` esté activo (y realmente parta
   * las filas en más de una tabla), la prop `break` de nivel `Table`
   * (la de @react-pdf/renderer, para la tabla entera) se ignora — el
   * salto de página entre tandas se controla ÚNICAMENTE con el `break`
   * de cada entrada de `rowsPerPage`. Si querés controlar el `break` de
   * la tabla completa vos mismo, no uses `rowsPerPage`.
   *
   * Sin este prop (default), `Table` se comporta como siempre: una sola
   * tabla que @react-pdf parte automáticamente donde no entre más — sin
   * cierre/apertura prolijos en el corte.
   */
  rowsPerPage?: RowsPerPageEntry[];
  /** Cualquier otra prop de View (@react-pdf/renderer): wrap, break, id, fixed, debug, etc. */
  [key: string]: any;
}

export interface TheadProps {
  children: React.ReactNode;
  style?: any;
  textAlign?: "left" | "center" | "right";
  borderColor?: string;
  textColor?: string;
  /** Cualquier otra prop de View (@react-pdf/renderer): wrap, break, id, fixed, debug, etc. */
  [key: string]: any;
}

export interface CellProps {
  children?: React.ReactNode;
  style?: any;
  /**
   * Ancho de la celda, igual que en `style={{ width: ... }}`.
   * Acepta cualquier valor válido de @react-pdf/renderer:
   *   width="100%"   width="120px"   width={120}
   * Si no se especifica, Tr calcula el ancho proporcional automáticamente
   * según el colSpan de todas las celdas de la fila. Si SÍ se especifica,
   * ese valor manual tiene prioridad y el cálculo automático se omite
   * para esta celda.
   */
  width?: string | number;
  /**
   * Alto de la celda, igual que en `style={{ height: ... }}` (se aplica
   * como minHeight internamente). Acepta cualquier valor válido:
   *   height="40px"   height={40}
   * Si no se especifica, usa el `cellHeight` del Table (default 22).
   */
  height?: string | number;
  colSpan?: number;
  isFirst?: boolean;
  isLast?: boolean;
  isLastRow?: boolean;
  isOdd?: boolean;
  textAlign?: "left" | "center" | "right";
  /**
   * Cuando es `true` (default), `children` se envuelve en un `Text` propio
   * de la celda — el comportamiento de siempre, correcto para strings,
   * números, o contenido mixto (texto + componentes basados en `Text`
   * como `Strong`/`Em`).
   *
   * Ponelo en `false` cuando `children` sea un componente basado en `View`
   * (por ejemplo un `Badge`). `Text` no puede contener `View` en
   * @react-pdf/renderer — anidarlos igual rompe el render. Con `text=false`
   * la celda renderiza `children` directo como hijo del `View` de la celda,
   * sin el `Text` intermedio.
   */
  text?: boolean;
  /** Cualquier otra prop de View/Text (@react-pdf/renderer): wrap, break, id, fixed, debug, etc. */
  [key: string]: any;
}

/**
 * Props internas de `Cell`: todo lo de `CellProps` más el `variant` que
 * decide si se comporta como Th o como Td. No se exporta desde
 * `index.tsx` — `Th`/`Td` son los que exponen la API pública.
 */
export interface CellBaseProps extends CellProps {
  variant: CellVariant;
}

export interface TableContextValue {
  cellHeight: number;
  textAlign: "left" | "center" | "right";
  borderColor: string;
  textColor: string;
  headerBackground: string;
  zebraColor: string;
  zebra: boolean;
  grid: GridMode;
  /**
   * LIMITACIÓN CONOCIDA — radio de esquina vs. alto de fila: cada
   * esquina de `outerRadius`/`innerRadius` es ahora independiente (ver
   * `CornerRadii`), pero `innerRadius` se sigue aplicando sobre `View`s
   * de alto acotado (la fila de `Thead`, o la última fila de `Tbody` vía
   * `Cell` — `minHeight: height ?? cellHeight`). Si el radio de una
   * esquina supera el alto disponible de esa fila, Yoga clampea la
   * curva ahí adentro, mientras que `BorderRadiusSvgOverlay` sigue
   * trazando el contorno EXTERIOR completo (no depende del alto de
   * ninguna celda) — el resultado es un descalce visible entre el
   * contorno exterior y el interior de esa esquina (confirmado
   * renderizando: con `cellHeight: 22` y esa esquina en 30+, queda una
   * cuña del color de fondo del header asomando bajo la curva).
   * Es una variante del límite práctico de radio ~12 del método "view"
   * que ya menciona `BorderRadiusMethod` más abajo (ver `bug.md`), pero
   * ahora más fácil de disparar sin querer: con radios por esquina, una
   * sola esquina puede pedir un radio grande sin que las demás lo
   * "diluyan" hacia el shorthand. No hay clamp automático — quien use
   * radios por esquina debe mantener cada uno por debajo del alto de la
   * fila que lo contiene (`cellHeight` de `Table`, o `height` de la
   * celda si lo sobreescribe).
   */
  outerRadius: CornerRadii;
  outerBorderWidth: number;
  innerRadius: CornerRadii;
  /**
   * Método EFECTIVAMENTE aplicado por `resolveBorderRadiusFix` — hoy
   * coincide siempre con el `borderRadiusMethod` pedido en `Table`
   * ("view" en `border-radius-fix.ts`, "svg" en
   * `border-radius-svg-fix.tsx`, ambos implementados). Se expone acá,
   * en vez de que cada componente lea el prop crudo de `Table`, para
   * que `Cell`/`Thead`/etc. puedan bifurcar su propia lógica por método
   * si algún día lo necesitan — hoy ninguno de los dos lo necesita: los
   * dos métodos calculan `innerRadius` igual, y ese es el único valor
   * del que depende el redondeo de esquinas de `Thead`/`Cell`.
   */
  borderRadiusMethod: BorderRadiusMethod;
}