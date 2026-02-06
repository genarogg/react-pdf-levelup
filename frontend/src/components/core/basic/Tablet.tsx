import React, { createContext, useContext } from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";

interface TableProps {
  children: React.ReactNode;
  style?: any;
  cellHeight?: number;
}

interface TheadProps {
  children: React.ReactNode;
  style?: any;
  textAlign?: "left" | "center" | "right" | any;
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
  textAlign?: "left" | "center" | "right" | any;
}

// Context para pasar cellHeight y textAlign a los componentes hijos
const TableContext = createContext<{
  cellHeight: number;
  textAlign?: "left" | "center" | "right" | any;
}>({
  cellHeight: 22,
  textAlign: "left",
});

const styles = StyleSheet.create({
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 20,
  },
  thead: {
    backgroundColor: "#ccc",
  },
  tr: {
    flexDirection: "row",
  },
  textBold: {
    fontSize: 10,
    fontWeight: "bold",
    paddingLeft: 8,
    paddingRight: 8,
    justifyContent: "center",

  },
  text: {
    fontSize: 10,
    paddingLeft: 8,
    paddingRight: 8,
    justifyContent: "center",

  },
  zebraOdd: {
    backgroundColor: "#eeeeee",
  },
});

const Table: React.FC<TableProps> = ({ children, style, cellHeight = 22 }) => (
  <TableContext.Provider value={{ cellHeight, textAlign: "left" }}>
    <View style={[styles.table, style]}>{children}</View>
  </TableContext.Provider>
);

const Thead: React.FC<TheadProps> = ({
  children,
  style,
  textAlign = "left",
}) => {
  const { cellHeight } = useContext(TableContext);

  return (
    <TableContext.Provider value={{ cellHeight, textAlign }}>
      <View style={[styles.thead, style]}>{children}</View>
    </TableContext.Provider>
  );
};

const Tbody: React.FC<TableProps> = ({ children }) => {
  const rows = React.Children.toArray(children) as React.ReactElement<any>[];
  const count = rows.length;
  return (
    <>
      {rows.map((row, idx) =>
        React.cloneElement(row, {
          isLastRow: idx === count - 1,
          isOdd: idx % 2 === 1,
        })
      )}
    </>
  );
};

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
        return React.cloneElement(child, { width, isLast, isLastRow, isOdd });
      })}
    </View>
  );
};

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
  const { cellHeight, textAlign: contextTextAlign } = useContext(TableContext);

  // Usar textAlign del prop si está definido, sino el del contexto
  const finalTextAlign = propTextAlign || contextTextAlign || "left";

  const baseWidth =
    typeof width === "string" && colSpan
      ? `${(parseFloat(width) * colSpan).toFixed(2)}%`
      : width;

  const cellHeightValue = height !== undefined ? height : cellHeight;

  const borders = {
    borderRightWidth: isLast ? 0 : 1,
    borderBottomWidth: isLastRow ? 0 : 1,
    borderColor: "#000",
    minHeight: cellHeightValue,
  };

  return (
    <View
      style={[
        styles.textBold,
        {
          width: baseWidth,
        },
        borders,
        style,
      ]}
    >
      <Text style={{ textAlign: finalTextAlign }}>{children}</Text>
    </View>
  );
};

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
  const { cellHeight, textAlign: contextTextAlign } = useContext(TableContext);

  // Usar textAlign del prop si está definido, sino el del contexto, sino 'left'
  const finalTextAlign = propTextAlign || contextTextAlign || "left";

  const baseWidth =
    typeof width === "string" && colSpan
      ? `${(parseFloat(width) * colSpan).toFixed(2)}%`
      : width;

  const cellHeightValue = height !== undefined ? height : cellHeight;

  const borders = {
    borderRightWidth: isLast ? 0 : 1,
    borderBottomWidth: isLastRow ? 0 : 1,
    borderColor: "#000",
    minHeight: cellHeightValue,
  };

  return (
    <View
      style={[
        styles.text,
        isOdd && styles.zebraOdd,
        {
          width: baseWidth,
        },
        borders,
        style,
      ]}
    >
      <Text style={{ textAlign: finalTextAlign }}>{children}</Text>
    </View>
  );
};

export { Table, Thead, Tbody, Tr, Th, Td };
