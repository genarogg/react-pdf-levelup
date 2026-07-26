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

  // El (o los) `Tr` que vienen como children acá nunca pasan por
  // `Tbody` — son los únicos `Tr` de toda la tabla que no reciben
  // `isLastRow` desde afuera. En grid="modern", `Tr` dibuja su propio
  // borderBottom salvo que sea la última fila (ver Tr.tsx), así que sin
  // este forzado ese `Tr` de encabezado dibujaría SU borde inferior,
  // duplicando el que este mismo componente ya agrega más abajo en el
  // `View` contenedor (`context.grid === "modern" && borderBottomWidth:
  // 1`). Forzar `isLastRow: true` acá apaga el borde propio del `Tr`,
  // dejando un único borde de cierre para el encabezado: el de `Thead`.
  const rows = React.Children.map(children, (child) =>
    React.isValidElement(child)
      ? React.cloneElement(child as React.ReactElement<any>, { isLastRow: true })
      : child
  );

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
        {...rest}
      >
        {rows}
      </View>
    </TableContext.Provider>
  );
};

export { Thead };