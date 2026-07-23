import { createContext } from "react";
import type { TableContextValue } from "./types";

export const TableContext = createContext<TableContextValue>({
  cellHeight: 22,
  textAlign: "left",
  borderColor: "#000",
  textColor: "#000",
  headerBackground: "#ccc",
  zebraColor: "#eeeeee",
  zebra: true,
  grid: "grid",
  outerRadius: 0,
  outerBorderWidth: 0,
  innerRadius: 0,
});
