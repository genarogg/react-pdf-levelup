import React from "react";
import { View } from "@react-pdf/renderer";
import { TableContext } from "./TableContext";
import { styles } from "./styles";
import { resolveBorderRadiusFix } from "./border-radius-fix";
import { BorderRadiusSvgOverlay } from "./border-radius-svg-fix";
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
  borderRadiusMethod = "view",
  ...rest
}) => {
  const {
    useFix,
    method,
    outerBorderColor,
    outerBorderWidth,
    outerRadius,
    innerRadius,
    backgroundColor,
    restStyle,
  } = resolveBorderRadiusFix(style, grid, borderColor, borderRadiusMethod);

  const isViewFix = useFix && method === "view";
  const isSvgFix = useFix && method === "svg";

  // Capa de fondo del cuerpo: obligatoria SOLO en el método "view". Sin
  // ella, las celdas sin backgroundColor propio (filas no-zebra) dejarían
  // ver el outerBorderColor que llena toda la View exterior. También le
  // damos su propio borderRadius (innerRadius) para que sus esquinas no
  // asomen cuadradas por debajo de la curva del borde exterior. El color
  // sale del `backgroundColor` que el usuario haya puesto en `style`; si
  // no puso ninguno, queda `undefined` — el default nativo de la
  // librería, sin forzar blanco.
  //
  // El método "svg" no arma esta capa: no hay ningún fondo que simular
  // (el borde se dibuja aparte, ver `BorderRadiusSvgOverlay` más abajo),
  // así que `children` se renderiza directo — el interior queda "hueco"
  // salvo que el usuario haya puesto su propio backgroundColor en
  // `style` (que sí se respeta: `resolveBorderRadiusFixSvg` no lo saca
  // de `restStyle`).
  const content = isViewFix ? (
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
        borderRadiusMethod: method,
      }}
    >
      <View
        style={[
          styles.table,
          // Si useFix ya está activo (cualquiera de los dos métodos), el
          // borde fino de grid="grid" queda absorbido por esa simulación
          // (backgroundColor+padding en "view", padding+Svg en "svg"), así
          // que no lo agregamos aparte: hacerlo reintroduciría el mismo
          // combo borderWidth+borderRadius que causa el bug #395.
          grid === "grid" && !useFix && {
            borderWidth: 1,
            borderColor,
          },
          isViewFix
            ? {
                backgroundColor: outerBorderColor,
                borderRadius: outerRadius,
                padding: outerBorderWidth,
              }
            : null,
          // "svg" no necesita backgroundColor ni borderRadius en esta
          // View — no clipearía nada igual (issue #640), y el trazo real
          // lo dibuja `BorderRadiusSvgOverlay` aparte. Solo necesita
          // `position: relative` como referencia para ese overlay
          // absoluto, y el mismo `padding: outerBorderWidth` que "view"
          // usa, para que el contenido no quede pegado contra el trazo.
          isSvgFix
            ? {
                position: "relative",
                padding: outerBorderWidth,
              }
            : null,
          restStyle,
        ]}
        {...rest}
      >
        {content}
        {isSvgFix && (
          <BorderRadiusSvgOverlay
            outerRadius={outerRadius}
            outerBorderWidth={outerBorderWidth}
            outerBorderColor={outerBorderColor}
          />
        )}
      </View>
    </TableContext.Provider>
  );
};

export { Table };
