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
        {children}
      </View>
    </TableContext.Provider>
  );
};

export { Thead };
