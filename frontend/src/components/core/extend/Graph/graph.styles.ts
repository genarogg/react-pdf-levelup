import { StyleSheet } from "@react-pdf/renderer"

// ---------------------------------------------------------------------------
// Título, subtítulo y leyenda se renderizan siempre como Text de bloque
// normal (no SvgText dentro de <Svg>) para no depender de fuentes
// registradas específicamente para el contexto SVG donde no hace falta.
// El único texto que vive dentro de <Svg> es el que está pegado a la
// geometría del propio dibujo (ejes, valores sobre barras, labels de pie).
// ---------------------------------------------------------------------------

export const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 10,
    color: "#555",
    marginBottom: 8,
  },
  legendRow: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 12,
  },
  legendItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendSwatchWrapper: {
    width: 9,
    height: 9,
  },
  legendText: {
    fontSize: 9,
    color: "#333",
  },
})
