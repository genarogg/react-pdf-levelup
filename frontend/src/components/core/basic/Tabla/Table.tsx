import React from "react";
import { View } from "@react-pdf/renderer";
import { TableContext } from "./TableContext";
import { styles } from "./styles";
import { resolveBorderRadiusFix } from "./border-radius-fix";
import type { TableProps } from "./types";

const Table: React.FC<TableProps> = ({
  children,
  style,
  cellHeight = 22,
  borderColor = "#000",
  textColor = "#000",
  headerBackground = "#ccc",
  zebraColor = "#eeeeee",
  zebra = true,
  grid = "grid",
  ...rest
}) => {
  const {
    useFix,
    outerBorderColor,
    outerBorderWidth,
    outerRadius,
    innerRadius,
    backgroundColor,
    restStyle,
  } = resolveBorderRadiusFix(style, grid, borderColor);

  // Capa de fondo del cuerpo: obligatoria cuando useFix está activo. Sin
  // ella, las celdas sin backgroundColor propio (filas no-zebra) dejarían
  // ver el outerBorderColor que llena toda la View exterior. También le
  // damos su propio borderRadius (innerRadius) para que sus esquinas no
  // asomen cuadradas por debajo de la curva del borde exterior. El color
  // sale del `backgroundColor` que el usuario haya puesto en `style`; si
  // no puso ninguno, queda `undefined` — el default nativo de la
  // librería, sin forzar blanco.
  const content = useFix ? (
    <View style={{ backgroundColor, borderRadius: innerRadius }}>{children}</View>
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
        zebra,
        grid,
        outerRadius,
        outerBorderWidth,
        innerRadius,
      }}
    >
      <View
        style={[
          styles.table,
          // Si useFix ya está activo, el borde fino de grid="grid" queda
          // absorbido por esa simulación (backgroundColor + padding), así
          // que no lo agregamos aparte: hacerlo reintroduciría el mismo
          // combo borderWidth+borderRadius que causa el bug #395.
          grid === "grid" && !useFix && {
            borderWidth: 1,
            borderColor,
          },
          useFix
            ? {
                backgroundColor: outerBorderColor,
                borderRadius: outerRadius,
                padding: outerBorderWidth,
              }
            : null,
          restStyle,
        ]}
        {...rest}
      >
        {content}
      </View>
    </TableContext.Provider>
  );
};

export { Table };
