import React, { useContext } from "react";
import { View } from "@react-pdf/renderer";
import { TableContext } from "./TableContext";
import { styles } from "./styles";
import type { TableProps, CellProps } from "./types";

const Tr: React.FC<TableProps & { isLastRow?: boolean; isOdd?: boolean }> = ({
  children,
  style,
  isLastRow = false,
  isOdd = false,
  ...rest
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
      {...rest}
    >
      {elements.map((child, idx) => {
        const isFirst = idx === 0;
        const isLast = idx === count - 1;
        const span = child.props.colSpan ?? 1;
        // Si la celda ya trae su propio width (ej. width="120px" o
        // width="30%"), se respeta tal cual. Si no lo trae, se calcula
        // el ancho proporcional por colSpan como antes.
        const width =
          child.props.width ??
          `${((100 * span) / totalUnits).toFixed(2)}%`;

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

export { Tr };
