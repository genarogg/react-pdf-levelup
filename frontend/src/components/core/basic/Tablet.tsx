import React, { createContext, useContext } from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";

/* ================= TYPES ================= */

interface TableProps {
  children: React.ReactNode;
  style?: any;
  cellHeight?: number;
  borderColor?: string;
  textColor?: string;
  headerBackground?: string;
  zebraColor?: string;
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
});

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  table: {
    width: "100%",
    borderWidth: 1,
    marginBottom: 20,
  },
  tr: {
    flexDirection: "row",
  },
  th: {
    fontSize: 10,
    fontWeight: "bold",
    paddingLeft: 8,
    paddingRight: 8,
    justifyContent: "center",
  },
  td: {
    fontSize: 10,
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
}) => (
  <TableContext.Provider
    value={{
      cellHeight,
      textAlign: "left",
      borderColor,
      textColor,
      headerBackground,
      zebraColor,
    }}
  >
    <View style={[styles.table, { borderColor }, style]}>
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
  const elements = React.Children.toArray(
    children
  ) as React.ReactElement<CellProps>[];

  const count = elements.length;

  return (
    <View style={[styles.tr, style]}>
      {elements.map((child, idx) => {
        const isLast = idx === count - 1;
        const width = `${(100 / count).toFixed(2)}%`;

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
  colSpan,
  isLast = false,
  isLastRow = false,
  textAlign: propTextAlign,
}) => {
  const { cellHeight, textAlign, borderColor, textColor } =
    useContext(TableContext);

  const finalTextAlign = propTextAlign || textAlign || "left";

  const baseWidth =
    typeof width === "string" && colSpan
      ? `${(parseFloat(width) * colSpan).toFixed(2)}%`
      : width;

  return (
    <View
      style={[
        styles.th,
        {
          width: baseWidth,
          borderRightWidth: isLast ? 0 : 1,
          borderBottomWidth: isLastRow ? 0 : 1,
          borderColor,
          minHeight: height ?? cellHeight,
          justifyContent: "center",
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
  colSpan,
  isLast = false,
  isLastRow = false,
  isOdd = false,
  textAlign: propTextAlign,
}) => {
  const {
    cellHeight,
    textAlign,
    borderColor,
    textColor,
    zebraColor,
  } = useContext(TableContext);

  const finalTextAlign = propTextAlign || textAlign || "left";

  const baseWidth =
    typeof width === "string" && colSpan
      ? `${(parseFloat(width) * colSpan).toFixed(2)}%`
      : width;

  return (
    <View
      style={[
        styles.td,
        {
          width: baseWidth,
          borderRightWidth: isLast ? 0 : 1,
          borderBottomWidth: isLastRow ? 0 : 1,
          borderColor,
          minHeight: height ?? cellHeight,
          backgroundColor: isOdd ? zebraColor : undefined,
          justifyContent: "center",
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