import React, { createContext, useContext } from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";

/* ================= TYPES ================= */

type GridMode = "grid" | "modern";

interface TableProps {
  children: React.ReactNode;
  style?: any;
  cellHeight?: number;
  borderColor?: string;
  textColor?: string;
  headerBackground?: string;
  zebraColor?: string;
  /**
   * Fondo del cuerpo de la tabla (detrás de Thead/Tbody). Solo se usa
   * cuando se activa el "fix" de borde+radio (ver useRadiusFix más abajo):
   * al simular el borde con backgroundColor + padding en el Table, ese
   * color de borde llena TODA la caja exterior. Sin una capa de fondo por
   * detrás de las filas, cualquier celda sin backgroundColor propio (filas
   * no-zebra) dejaría ver el color del borde en vez de un fondo normal.
   * Default: blanco. Cambialo si la tabla vive sobre un fondo distinto.
   */
  background?: string;
  grid?: GridMode;
}

interface TheadProps {
  children: React.ReactNode;
  style?: any;
  textAlign?: "left" | "center" | "right";
  borderColor?: string;
  textColor?: string;
}

interface CellProps {
  children?: React.ReactNode;
  style?: any;
  width?: string | number;
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
}

/* ================= HELPERS ================= */

function flattenStyle(style: any): Record<string, any> {
  if (!style) return {};
  if (Array.isArray(style)) {
    return style.reduce((acc, s) => ({ ...acc, ...flattenStyle(s) }), {});
  }
  return style;
}

function toNumber(value: any): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const n = parseFloat(value);
    return isNaN(n) ? 0 : n;
  }
  return 0;
}

function extractBorderWidth(flat: Record<string, any>): number {
  if (flat.borderWidth !== undefined) return toNumber(flat.borderWidth);
  if (typeof flat.border === "string") {
    const match = flat.border.match(/^(\d+(\.\d+)?)/);
    if (match) return parseFloat(match[1]);
  }
  return 0;
}

function extractBorderColor(flat: Record<string, any>): string | undefined {
  if (flat.borderColor) return flat.borderColor;
  if (typeof flat.border === "string") {
    const parts = flat.border.trim().split(/\s+/);
    return parts[parts.length - 1];
  }
  return undefined;
}

function innerRadiusOf(outerRadius: number, outerBorderWidth: number): number {
  return Math.max(outerRadius - outerBorderWidth, 0);
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

function omitKeys(flat: Record<string, any>, keys: string[]): Record<string, any> {
  const result = { ...flat };
  keys.forEach((k) => delete result[k]);
  return result;
}

/* ================= CONTEXT ================= */

const TableContext = createContext({
  cellHeight: 22,
  textAlign: "left" as "left" | "center" | "right",
  borderColor: "#000",
  textColor: "#000",
  headerBackground: "#ccc",
  zebraColor: "#eeeeee",
  grid: "grid" as GridMode,
  outerRadius: 0,
  outerBorderWidth: 0,
  innerRadius: 0,
});

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  table: {
    width: "100%",
    marginBottom: 20,
  },
  tr: {
    flexDirection: "row",
  },
  th: {
    fontWeight: "bold",
    paddingLeft: 8,
    paddingRight: 8,
    justifyContent: "center",
  },
  td: {
    paddingLeft: 8,
    paddingRight: 8,
    justifyContent: "center",
  },
});

/* ================= TABLE ================= */

const Table: React.FC<TableProps> = ({
  children,
  style,
  cellHeight = 22,
  borderColor = "#000",
  textColor = "#000",
  headerBackground = "#ccc",
  zebraColor = "#eeeeee",
  background = "#fff",
  grid = "grid",
}) => {
  const flatStyle = flattenStyle(style);
  const outerRadius = toNumber(flatStyle.borderRadius);
  const styleBorderWidth = extractBorderWidth(flatStyle);
  // grid="grid" agrega su propio borde fino de 1 al Table (ver más abajo).
  // Si además hay borderRadius, ese borde también dispara el bug #395, así
  // que lo tratamos igual que un borde explícito del `style`.
  const gridBorderWidth = grid === "grid" ? 1 : 0;
  const outerBorderWidth = styleBorderWidth || gridBorderWidth;
  const outerBorderColor = extractBorderColor(flatStyle) ?? borderColor;

  const useRadiusFix = outerRadius > 0 && outerBorderWidth > 0;
  const innerRadius = innerRadiusOf(outerRadius, outerBorderWidth);

  const restStyle = useRadiusFix
    ? omitKeys(flatStyle, [...BORDER_SHORTHAND_KEYS, "overflow"])
    : style;

  // Capa de fondo del cuerpo: obligatoria cuando useRadiusFix está activo.
  // Sin ella, las celdas sin backgroundColor propio (filas no-zebra)
  // dejarían ver el outerBorderColor que llena toda la View exterior.
  // También le damos su propio borderRadius (innerRadius) para que sus
  // esquinas no asomen cuadradas por debajo de la curva del borde exterior.
  const content = useRadiusFix ? (
    <View style={{ backgroundColor: background, borderRadius: innerRadius }}>
      {children}
    </View>
  ) : (
    children
  );

  return (
    <TableContext.Provider
      value={{
        cellHeight,
        textAlign: "left",
        borderColor,
        textColor,
        headerBackground,
        zebraColor,
        grid,
        outerRadius,
        outerBorderWidth,
        innerRadius,
      }}
    >
      <View
        style={[
          styles.table,
          // Si useRadiusFix ya está activo, el borde fino de grid="grid"
          // queda absorbido por esa simulación (backgroundColor + padding),
          // así que no lo agregamos aparte: hacerlo reintroduciría el
          // mismo combo borderWidth+borderRadius que causa el bug #395.
          grid === "grid" && !useRadiusFix && {
            borderWidth: 1,
            borderColor,
          },
          useRadiusFix
            ? {
                backgroundColor: outerBorderColor,
                borderRadius: outerRadius,
                padding: outerBorderWidth,
              }
            : null,
          restStyle,
        ]}
      >
        {content}
      </View>
    </TableContext.Provider>
  );
};

/* ================= THEAD ================= */

const Thead: React.FC<TheadProps> = ({
  children,
  style,
  textAlign = "left",
  borderColor,
  textColor,
}) => {
  const context = useContext(TableContext);

  return (
    <TableContext.Provider
      value={{
        ...context,
        textAlign,
        borderColor: borderColor ?? context.borderColor,
        textColor: textColor ?? context.textColor,
      }}
    >
      <View
        style={[
          { backgroundColor: context.headerBackground },
          context.grid === "modern" && {
            borderBottomWidth: 1,
            borderColor: context.borderColor,
          },
          context.innerRadius
            ? {
                borderTopLeftRadius: context.innerRadius,
                borderTopRightRadius: context.innerRadius,
              }
            : null,
          style,
        ]}
      >
        {children}
      </View>
    </TableContext.Provider>
  );
};

/* ================= TBODY ================= */

const Tbody: React.FC<TableProps> = ({ children, borderColor, textColor }) => {
  const context = useContext(TableContext);

  const rows = React.Children.toArray(children) as React.ReactElement<any>[];
  const count = rows.length;

  return (
    <TableContext.Provider
      value={{
        ...context,
        borderColor: borderColor ?? context.borderColor,
        textColor: textColor ?? context.textColor,
      }}
    >
      <>
        {rows.map((row, idx) =>
          React.cloneElement(row, {
            isLastRow: idx === count - 1,
            isOdd: idx % 2 === 1,
          })
        )}
      </>
    </TableContext.Provider>
  );
};

/* ================= TR ================= */

const Tr: React.FC<TableProps & { isLastRow?: boolean; isOdd?: boolean }> = ({
  children,
  style,
  isLastRow = false,
  isOdd = false,
}) => {
  const { grid, borderColor } = useContext(TableContext);

  const elements = React.Children.toArray(
    children
  ) as React.ReactElement<CellProps>[];

  const count = elements.length;

  // Unidades de columna reales de la fila: un colSpan={2} cuenta como 2,
  // no como 1. Evita overflow (>100%) en filas con celdas fusionadas.
  const totalUnits = elements.reduce(
    (sum, child) => sum + (child.props.colSpan ?? 1),
    0
  );

  return (
    <View
      style={[
        styles.tr,
        grid === "modern" && {
          borderBottomWidth: isLastRow ? 0 : 1,
          borderColor,
        },
        style,
      ]}
    >
      {elements.map((child, idx) => {
        const isFirst = idx === 0;
        const isLast = idx === count - 1;
        const span = child.props.colSpan ?? 1;
        // El ancho ya incluye el colSpan resuelto: Td/Th solo lo aplican,
        // no vuelven a multiplicarlo.
        const width = `${((100 * span) / totalUnits).toFixed(2)}%`;

        return React.cloneElement(child, {
          width,
          isFirst,
          isLast,
          isLastRow,
          isOdd,
        });
      })}
    </View>
  );
};

/* ================= TH ================= */

const Th: React.FC<CellProps> = ({
  children,
  style,
  width,
  height,
  isLast = false,
  isLastRow = false,
  textAlign: propTextAlign,
  text = true,
}) => {
  const { cellHeight, textAlign, borderColor, textColor, grid } =
    useContext(TableContext);

  const finalTextAlign = propTextAlign || textAlign || "left";

  return (
    <View
      style={[
        styles.th,
        {
          width, // ya resuelto en Tr, colSpan incluido
          borderColor,
          minHeight: height ?? cellHeight,
        },
        grid === "grid" && {
          borderRightWidth: isLast ? 0 : 1,
          borderBottomWidth: isLastRow ? 0 : 1,
        },
        style,
      ]}
    >
      {text ? (
        <Text style={{ textAlign: finalTextAlign, color: textColor }}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
};

/* ================= TD ================= */

const Td: React.FC<CellProps> = ({
  children,
  style,
  width,
  height,
  isFirst = false,
  isLast = false,
  isLastRow = false,
  isOdd = false,
  textAlign: propTextAlign,
  text = true,
}) => {
  const { cellHeight, textAlign, borderColor, textColor, zebraColor, grid, innerRadius } =
    useContext(TableContext);

  const finalTextAlign = propTextAlign || textAlign || "left";

  return (
    <View
      style={[
        styles.td,
        {
          width, // ya resuelto en Tr, colSpan incluido
          borderColor,
          minHeight: height ?? cellHeight,
          backgroundColor: isOdd ? zebraColor : undefined,
        },
        grid === "grid" && {
          borderRightWidth: isLast ? 0 : 1,
          borderBottomWidth: isLastRow ? 0 : 1,
        },
        isLastRow && isFirst && innerRadius
          ? { borderBottomLeftRadius: innerRadius }
          : null,
        isLastRow && isLast && innerRadius
          ? { borderBottomRightRadius: innerRadius }
          : null,
        style,
      ]}
    >
      {text ? (
        <Text style={{ textAlign: finalTextAlign, color: textColor }}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
};

export { Table, Thead, Tbody, Tr, Th, Td };