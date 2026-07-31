import React, { useContext } from "react";
import { View } from "@react-pdf/renderer";
import { TableContext } from "./TableContext";
import type { TheadProps } from "./types";

const Thead: React.FC<TheadProps> = ({
  children,
  style,
  textAlign = "left",
  borderColor,
  textColor,
  ...rest
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
          // El borde inferior de grid="modern" para la cabecera lo dibuja
          // el propio Tr interno (ver Tr.tsx: borderBottomWidth cuando
          // isLastRow es false, que es siempre el caso para la fila de
          // Thead). Agregarlo también acá duplicaba la línea — las dos
          // se apilaban y se veía como un borde doble/más grueso
          // únicamente en la fila de encabezado.
          context.innerRadius
            ? {
                borderTopLeftRadius: context.innerRadius,
                borderTopRightRadius: context.innerRadius,
              }
            : null,
          style,
        ]}
        {...rest}
      >
        {children}
      </View>
    </TableContext.Provider>
  );
};

export { Thead };