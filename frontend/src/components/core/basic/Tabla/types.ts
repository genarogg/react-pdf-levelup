import type React from "react";

/* ================= TYPES ================= */

export type GridMode = "grid" | "modern" | "not-grid";

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
}
