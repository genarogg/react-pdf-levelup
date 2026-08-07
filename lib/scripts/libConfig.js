// Config explícita: qué símbolos necesita cada mod/<lib>/index.ts de cada
// barrel real. Derivada a mano leyendo cada mod/<lib>/index.ts (ver §3 del
// diagnóstico). Cuando exista el helper de extracción automática (AST),
// esta tabla puede generarse en vez de mantenerse a mano — por ahora es
// la fuente de verdad.
//
// Regla de lectura: si una lib NO tiene entrada para un barrel (undefined,
// no un array vacío), ese barrel NO se toca para esa lib. Un array vacío
// significaría "podar todo", que no es lo que queremos para libs que
// simplemente no importan de ese barrel.

// Rutas relativas a basePath (raíz del repo de build). Ambos barrels viven
// en `frontend/`, hermano de la raíz del repo de build.
export const BARRELS = {
  components: "../frontend/src/components/core/index.tsx",
  functions: "../frontend/src/functions/index.ts",
};

// símbolos por lib y por barrel (undefined = esa lib no usa ese barrel)
const libConfig = {
  client: {
    functions: ["decodePDF", "generatePDF", "getFont"],
  },

  core: {
    components: [
      "Layout", "LayoutMultiPage", "Section", "NextPage",
      "Img", "ImgBg",
      "UL", "OL", "LI",
      "P", "A", "H1", "H2", "H3", "H4", "H5", "H6", "HR", "Strong", "U",
      "Small", "Blockquote", "Mark", "Span", "BR", "Div", "Em",
      "Container", "Row", "Col1", "Col2", "Col3", "Col4", "Col5",
      "Col6", "Col7", "Col8", "Col9", "Col10", "Col11", "Col12",
      "Table", "Thead", "Tbody", "Tr", "Th", "Td",
      "Form", "Input", "Checkbox", "TextArea",
      "Left", "Right", "Center",
      "Gradiant", "Button", "Badge", "Divider", "Graph",
      "Note", "Svg", "PDFViewer", "Document", "Page", "Text",
      "View", "Image", "Link", "Canvas", "Defs", "Rect",
      "LinearGradient", "RadialGradient", "Stop",
      "G", "Polygon", "Polyline", "ClipPath", "Line", "Path",
      "Circle", "Ellipse", "Tspan", "PDFDownloadLink",
      "BlobProvider", "StyleSheet", "Font","Pass"
    ],
    functions: [
      "decodePDF", "generatePDF", "getFont", "pdf",
      "renderToStream", "renderToBuffer", "renderToFile", "usePDF",
    ],
  },

  qr: {
    components: ["QR", "QRstyle"],
  },

  chart: {
    components: ["ChartJS"],
  },

  icons: {
    components: ["Icon"],
  },

  codebar: {
    components: ["CodeBar"],
  },

  // studio: no importa de ningún barrel (build externo vía build-lib.mjs).
  // Sin entrada acá a propósito -> buildLib.js debe saltear el enganche
  // de cleanBarrelFile por completo para esta lib.
};

export default libConfig;
