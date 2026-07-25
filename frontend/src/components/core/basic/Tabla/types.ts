import type React from "react";

/* ================= TYPES ================= */

export type GridMode = "grid" | "modern" | "not-grid";

/**
 * Método usado para aplicar el workaround del bug de borderWidth +
 * borderRadius de @react-pdf/renderer (issue #395 — ver la lógica en
 * `border-radius-fix.ts`):
 *
 *   - "view": simula el borde combinando `backgroundColor` + `padding`
 *     en un `View` exterior en vez de un stroke real + radio en la
 *     misma View. Es el único método implementado hoy.
 *   - "svg": reservado para una futura implementación basada en
 *     `Svg`/`Path` de @react-pdf/renderer, que evitaría el límite
 *     práctico de radio ~12 del método "view" (ver `bug.md`, punto 2).
 *     Todavía no existe: pedirlo cae a "view" con un warning (ver
 *     `resolveBorderRadiusFixSvg` en `border-radius-fix.ts`).
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
  outerRadius: number;
  outerBorderWidth: number;
  innerRadius: number;
  /**
   * Método EFECTIVAMENTE aplicado por `resolveBorderRadiusFix` — no
   * necesariamente el `borderRadiusMethod` que pidió el usuario en
   * `Table`. Por ejemplo, hoy pedir "svg" siempre resuelve en "view"
   * (fallback, ver `resolveBorderRadiusFixSvg`), así que esto va a decir
   * "view" en ambos casos. Se expone en el contexto para que
   * `Cell`/`Thead`/etc. puedan bifurcar su propia lógica por método el
   * día que exista una segunda implementación real.
   */
  borderRadiusMethod: BorderRadiusMethod;
}
