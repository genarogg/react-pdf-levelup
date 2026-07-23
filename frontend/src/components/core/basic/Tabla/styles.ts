import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  table: {
    width: "100%",
    marginBottom: 20,
  },
  tr: {
    flexDirection: "row",
  },
  th: {
    fontWeight: "bold",
    paddingLeft: 8,
    paddingRight: 8,
    justifyContent: "center",
  },
  td: {
    paddingLeft: 8,
    paddingRight: 8,
    justifyContent: "center",
  },
});
