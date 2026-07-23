import React, { useContext } from "react";
import { View, Text } from "@react-pdf/renderer";
import { TableContext } from "./TableContext";
import { styles } from "./styles";
import type { CellProps, CellBaseProps } from "./types";

/* ================= CELL (base compartida por Th y Td) =================
 *
 * Th y Td compartían casi toda su implementación letra por letra. Lo
 * único que de verdad cambia entre uno y otro es:
 *
 *   1. El estilo base: `styles.th` (fontWeight bold) vs `styles.td`.
 *   2. El fondo zebra: SOLO Td lo tiene — Th nunca alterna color de fondo.
 *   3. El redondeo de esquina inferior en la última fila: SOLO Td lo
 *      necesita, porque Thead ya redondea sus propias esquinas superiores
 *      a nivel de contenedor; Th nunca es la última fila de la tabla.
 *
 * `variant` decide esas tres diferencias; todo lo demás vive acá una
 * sola vez. `Th`/`Td` son wrappers finos con la misma firma pública de
 * siempre.
 * ======================================================================= */

const Cell: React.FC<CellBaseProps> = ({
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
  variant,
  ...rest
}) => {
  const { cellHeight, textAlign, borderColor, textColor, zebraColor, zebra, grid, innerRadius } =
    useContext(TableContext);

  const finalTextAlign = propTextAlign || textAlign || "left";
  const isHeader = variant === "th";

  return (
    <View
      style={[
        isHeader ? styles.th : styles.td,
        {
          width, // ya resuelto en Tr, colSpan incluido
          borderColor,
          minHeight: height ?? cellHeight,
          // Zebra es exclusivo de Td: Th nunca alterna color de fondo.
          backgroundColor: !isHeader && zebra && isOdd ? zebraColor : undefined,
        },
        grid === "grid" && {
          borderRightWidth: isLast ? 0 : 1,
          borderBottomWidth: isLastRow ? 0 : 1,
        },
        // not-grid no dibuja borde (@react-pdf/renderer no soporta
        // colores "transparentes"), pero compensa con padding el mismo
        // pixel que ocuparía la línea de grid, para que el tamaño de
        // celda no cambie entre modos.
        grid === "not-grid" && {
          paddingRight: isLast ? 8 : 9,
          paddingBottom: isLastRow ? 0 : 1,
        },
        // Redondeo de esquina inferior en la última fila: solo Td. Th
        // nunca es la última fila (Thead ya redondea sus propias
        // esquinas superiores a nivel de contenedor).
        !isHeader && isLastRow && isFirst && innerRadius
          ? { borderBottomLeftRadius: innerRadius }
          : null,
        !isHeader && isLastRow && isLast && innerRadius
          ? { borderBottomRightRadius: innerRadius }
          : null,
        style,
      ]}
      {...rest}
    >
      {text
        ? children != null && (
            <Text style={{ textAlign: finalTextAlign, color: textColor }}>
              {children}
            </Text>
          )
        : children}
    </View>
  );
};

/* ================= TH ================= */

const Th: React.FC<CellProps> = (props) => {
  return <Cell {...props} variant="th" />;
};

/* ================= TD ================= */

const Td: React.FC<CellProps> = (props) => {
  return <Cell {...props} variant="td" />;
};

export { Th, Td };
