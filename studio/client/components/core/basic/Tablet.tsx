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
  isLast?: boolean;
  isLastRow?: boolean;
  isOdd?: boolean;
  textAlign?: "left" | "center" | "right";
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
  grid = "grid",
}) => (
  <TableContext.Provider
    value={{
      cellHeight,
      textAlign: "left",
      borderColor,
      textColor,
      headerBackground,
      zebraColor,
      grid,
    }}
  >
    <View
      style={[
        styles.table,
        grid === "grid" && {
          borderWidth: 1,
          borderColor,
        },
        style,
      ]}
    >
      {children}
    </View>
  </TableContext.Provider>
);

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
  // no como 1. Esto es lo que faltaba antes y provocaba overflow (>100%)
  // en filas con celdas fusionadas.
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
        const isLast = idx === count - 1;
        const span = child.props.colSpan ?? 1;
        // El ancho ya incluye el colSpan resuelto: Td/Th solo lo aplican,
        // no vuelven a multiplicarlo.
        const width = `${((100 * span) / totalUnits).toFixed(2)}%`;

        return React.cloneElement(child, {
          width,
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
      <Text style={{ textAlign: finalTextAlign, color: textColor }}>
        {children}
      </Text>
    </View>
  );
};

/* ================= TD ================= */

const Td: React.FC<CellProps> = ({
  children,
  style,
  width,
  height,
  isLast = false,
  isLastRow = false,
  isOdd = false,
  textAlign: propTextAlign,
}) => {
  const { cellHeight, textAlign, borderColor, textColor, zebraColor, grid } =
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
        style,
      ]}
    >
      <Text style={{ textAlign: finalTextAlign, color: textColor }}>
        {children}
      </Text>
    </View>
  );
};

export { Table, Thead, Tbody, Tr, Th, Td };