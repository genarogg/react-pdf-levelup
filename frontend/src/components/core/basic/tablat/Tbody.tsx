import React, { useContext } from "react";
import { TableContext } from "./TableContext";
import type { TableProps } from "./types";

const Tbody: React.FC<TableProps> = ({ children, borderColor, textColor, ...rest }) => {
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
            ...rest,
          })
        )}
      </>
    </TableContext.Provider>
  );
};

export { Tbody };
