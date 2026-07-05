import { type TabId, type ComponentDoc } from "./types";

export const componentDocs_es: Record<TabId, ComponentDoc[]> = {
  layout: [
    {
      name: "Layout",
      description: "Componente principal para configurar el documento PDF",
      props: [
        {
          name: "size",
          type: "string",
          default: "A4",
          description: "Tamaño de la página (4A0-2A0, A0-A8, B0-B9, C0-C8, RA0-RA4, SRA0-SRA4, EXECUTIVE, FOLIO, LEGAL, LETTER, TABLOID, ID1)",
        },
        {
          name: "orientation",
          type: "string",
          default: "vertical",
          description: "Orientación de la página (vertical, horizontal)",
        },
        { name: "backgroundColor", type: "string", default: "white", description: "Color de fondo de la página" },
        {
          name: "padding",
          type: "number",
          default: "30",
          description: "Padding interno de la página en puntos (solo si margin=normal)",
        },
        {
          name: "margin",
          type: "string",
          default: "normal",
          description: "Tipo de margen (apa, normal, estrecho, ancho)",
        },
        { name: "style", type: "object", default: "{}", description: "Estilos adicionales para la página" },
        { name: "footer", type: "ReactNode", default: "", description: "Contenido del pie de página" },
        { name: "footerLines", type: "number", default: "1", description: "Número de líneas para el pie de página (1-10)" },
        { name: "pagination", type: "boolean", default: "true", description: "Mostrar numeración de páginas" },
        {
          name: "rule",
          type: "boolean",
          default: "false",
          description: "Mostrar rejilla de referencia en la página",
        },
        {
          name: "meta",
          type: "object",
          default: "{}",
          description: "Metadatos (title, author, subject, keywords, language, etc.)",
        },
      ],
      example: `const MyDocument = () => (
  <Layout 
    meta={{ title: 'Mi PDF', author: 'Genaro' }}
    pagination 
    footer={<P>Pie de página</P>}
  >
    <H1>Título</H1>
  </Layout>
);

export default MyDocument;`,
    },
    {
      name: "LayoutMultiPage",
      description: "Contenedor avanzado para PDFs con múltiples secciones (páginas) configurables",
      props: [
        { name: "size", type: "string", default: "A4", description: "Tamaño base de las páginas" },
        { name: "orientation", type: "string", default: "vertical", description: "Orientación base" },
        { name: "backgroundColor", type: "string", default: "white", description: "Color de fondo base" },
        { name: "padding", type: "number", default: "30", description: "Padding base" },
        {
          name: "margin",
          type: "string",
          default: "normal",
          description: "Margen base (apa, normal, estrecho, ancho)",
        },
        { name: "footer", type: "ReactNode", default: "", description: "Pie de página base" },
        { name: "pagination", type: "boolean", default: "true", description: "Numeración base" },
        { name: "debug", type: "boolean", default: "false", description: "Modo debug base" },
      ],
      example: `const MyMultiPageDocument = () => (
  <LayoutMultiPage backgroundColor="#eee">
    <Section>
      <H1>Página 1</H1>
    </Section>
    <Section backgroundColor="white">
      <H1>Página 2 (Blanca)</H1>
    </Section>
  </LayoutMultiPage>
);

export default MyMultiPageDocument;`,
    },
    {
      name: "Section",
      description: "Representa una página individual dentro de LayoutMultiPage",
      props: [
        { name: "backgroundColor", type: "string", default: "Heredado", description: "Color de fondo de esta página" },
        { name: "padding", type: "number", default: "Heredado", description: "Padding de esta página" },
        { name: "margin", type: "string", default: "Heredado", description: "Margen de esta página" },
        { name: "footer", type: "ReactNode", default: "Heredado", description: "Footer de esta página" },
        { name: "pagination", type: "boolean", default: "Heredado", description: "Numeración en esta página" },
        { name: "debug", type: "boolean", default: "Heredado", description: "Modo debug en esta página" },
      ],
      example: `<Section backgroundColor="skyblue" padding={50}>
  <H1>Contenido de la página</H1>
</Section>`,
    },
    {
      name: "Container",
      description: "Contenedor principal con padding horizontal",
      props: [
        { name: "style", type: "object", default: "{}", description: "Estilos adicionales para el contenedor" },
        { name: "debug", type: "boolean", default: "false", description: "Modo debug (bordes)" },
        { name: "fixed", type: "boolean", default: "false", description: "Fijar en todas las páginas" },
        { name: "break", type: "boolean", default: "false", description: "Salto de página" },
      ],
      example: `<Container>
  <Row>
    <Col6><P>Columna 1</P></Col6>
    <Col6><P>Columna 2</P></Col6>
  </Row>
</Container>`,
    },
    {
      name: "Row",
      description: "Fila para el sistema de grid",
      props: [
        { name: "style", type: "object", default: "{}", description: "Estilos adicionales para la fila" },
        { name: "debug", type: "boolean", default: "false", description: "Modo debug (bordes)" },
        { name: "fixed", type: "boolean", default: "false", description: "Fijar en todas las páginas" },
        { name: "break", type: "boolean", default: "false", description: "Salto de página" },
      ],
      example: `<Row>
  <Col4><P>A</P></Col4>
  <Col4><P>B</P></Col4>
  <Col4><P>C</P></Col4>
</Row>`,
    },
    {
      name: "Col1-Col12",
      description: "Columnas para el sistema de grid (de 1 a 12 unidades)",
      props: [
        { name: "style", type: "object", default: "{}", description: "Estilos adicionales para la columna" },
        { name: "debug", type: "boolean", default: "false", description: "Modo debug (bordes)" },
        { name: "fixed", type: "boolean", default: "false", description: "Fijar en todas las páginas" },
        { name: "break", type: "boolean", default: "false", description: "Salto de página" },
      ],
      example: `<Col12><P>Contenido a ancho completo</P></Col12>`,
    },
    {
      name: "Div",
      description: "Contenedor genérico para agrupar elementos",
      props: [
        { name: "style", type: "object", default: "{}", description: "Estilos adicionales" },
        { name: "debug", type: "boolean", default: "false", description: "Modo debug (bordes)" },
        { name: "fixed", type: "boolean", default: "false", description: "Fijar en todas las páginas" },
        { name: "break", type: "boolean", default: "false", description: "Salto de página" },
      ],
      example: `<Div style={{ padding: 10 }}>
  <P>Bloque con padding</P>
</Div>`,
    },
  ],
  text: [
    {
      name: "P, H1-H6",
      description: "Componentes de texto (párrafo, encabezados)",
      props: [
        { name: "style", type: "object", default: "{}", description: "Estilos adicionales para el texto" },
        { name: "debug", type: "boolean", default: "false", description: "Modo debug (bordes)" },
        { name: "fixed", type: "boolean", default: "false", description: "Fijar en todas las páginas" },
        { name: "break", type: "boolean", default: "false", description: "Salto de página" },
      ],
      example: `<H1>Título</H1>
<H3>Subtítulo</H3>
<P>Parrafo</P>`,
    },
    {
      name: "Strong, Em, U, Small",
      description: "Componentes de formato de texto",
      props: [
        { name: "style", type: "object", default: "{}", description: "Estilos adicionales" },
        { name: "debug", type: "boolean", default: "false", description: "Modo debug (bordes)" },
        { name: "fixed", type: "boolean", default: "false", description: "Fijar en todas las páginas" },
        { name: "break", type: "boolean", default: "false", description: "Salto de página" },
      ],
      example: `<P><Strong>Negrita</Strong>, <Em>Cursiva</Em>, <U>Subrayado</U>, <Small>Pequeño</Small></P>`,
    },
    {
      name: "Blockquote",
      description: "Bloque de cita",
      props: [
        { name: "style", type: "object", default: "{}", description: "Estilos adicionales" },
        { name: "debug", type: "boolean", default: "false", description: "Modo debug (bordes)" },
        { name: "fixed", type: "boolean", default: "false", description: "Fijar en todas las páginas" },
        { name: "break", type: "boolean", default: "false", description: "Salto de página" },
      ],
      example: `<Blockquote>Una cita destacada</Blockquote>`,
    },
    {
      name: "Mark",
      description: "Texto resaltado",
      props: [
        { name: "style", type: "object", default: "{}", description: "Estilos adicionales" },
        { name: "debug", type: "boolean", default: "false", description: "Modo debug (bordes)" },
        { name: "fixed", type: "boolean", default: "false", description: "Fijar en todas las páginas" },
        { name: "break", type: "boolean", default: "false", description: "Salto de página" },
      ],
      example: `<Mark>Texto resaltado</Mark>`,
    },
    {
      name: "Span",
      description: "Contenedor de texto inline",
      props: [
        { name: "style", type: "object", default: "{}", description: "Estilos adicionales" },
        { name: "debug", type: "boolean", default: "false", description: "Modo debug (bordes)" },
        { name: "fixed", type: "boolean", default: "false", description: "Fijar en todas las páginas" },
        { name: "break", type: "boolean", default: "false", description: "Salto de página" },
      ],
      example: `<Span>Inline</Span>`,
    },
    {
      name: "BR",
      description: "Salto de línea",
      props: [
        { name: "style", type: "object", default: "{}", description: "Estilos adicionales" },
        { name: "debug", type: "boolean", default: "false", description: "Modo debug (bordes)" },
        { name: "fixed", type: "boolean", default: "false", description: "Fijar en todas las páginas" },
        { name: "break", type: "boolean", default: "false", description: "Salto de página" },
      ],
      example: `<P>Linea 1</P>
<BR />
<P>Linea 2</P>`,
    },
    {
      name: "HR",
      description: "Línea horizontal divisoria",
      props: [
        { name: "style", type: "object", default: "{}", description: "Estilos adicionales" },
        { name: "debug", type: "boolean", default: "false", description: "Modo debug (bordes)" },
        { name: "fixed", type: "boolean", default: "false", description: "Fijar en todas las páginas" },
        { name: "break", type: "boolean", default: "false", description: "Salto de página" },
      ],
      example: `<HR />`,
    },
    {
      name: "A",
      description: "Enlace",
      props: [
        { name: "href", type: "string", default: "", description: "URL del enlace" },
        { name: "style", type: "object", default: "{}", description: "Estilos adicionales" },
        { name: "debug", type: "boolean", default: "false", description: "Modo debug (bordes)" },
        { name: "fixed", type: "boolean", default: "false", description: "Fijar en todas las páginas" },
        { name: "break", type: "boolean", default: "false", description: "Salto de página" },
      ],
      example: `<A href="https://example.com">Ir al sitio</A>`,
    },
  ],
  table: [
    {
      name: "Table (Tablet)",
      description: "Tabla completa",
      props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales para la tabla" }],
      example: `<Table>
  <Thead>
    <Tr>
      <Th>Col A</Th>
      <Th textAlign="right">Col B</Th>
    </Tr>
  </Thead>
  <Tbody>
    <Tr>
      <Td>1</Td>
      <Td>2</Td>
    </Tr>
    <Tr>
      <Td>3</Td>
      <Td>4</Td>
    </Tr>
  </Tbody>
</Table>`,
    },
    {
      name: "Thead",
      description: "Encabezado de tabla",
      props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales" }],
      example: `<Thead><Tr><Th>Columna</Th></Tr></Thead>`,
    },
    {
      name: "Tbody",
      description: "Cuerpo de tabla",
      props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales" }],
      example: `<Tbody><Tr><Td>Dato</Td></Tr></Tbody>`,
    },
    {
      name: "Tr",
      description: "Fila de tabla",
      props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales" }],
      example: `<Tr><Td>A</Td><Td>B</Td></Tr>`,
    },
    {
      name: "Th",
      description: "Celda de encabezado",
      props: [
        { name: "style", type: "object", default: "{}", description: "Estilos adicionales" },
        { name: "width", type: "string|number", default: "", description: "Ancho de la celda" },
        { name: "height", type: "string|number", default: "", description: "Alto de la celda" },
        { name: "colSpan", type: "number", default: "", description: "Número de columnas que ocupa" },
        {
          name: "textAlign",
          type: "string",
          default: "left",
          description: "Alineación del texto (left, center, right)",
        },
      ],
      example: `<Th textAlign="center">Encabezado</Th>`,
    },
    {
      name: "Td",
      description: "Celda de datos",
      props: [
        { name: "style", type: "object", default: "{}", description: "Estilos adicionales" },
        { name: "width", type: "string|number", default: "", description: "Ancho de la celda" },
        { name: "height", type: "string|number", default: "", description: "Alto de la celda" },
        { name: "colSpan", type: "number", default: "", description: "Número de columnas que ocupa" },
        {
          name: "textAlign",
          type: "string",
          default: "left",
          description: "Alineación del texto (left, center, right)",
        },
      ],
      example: `<Td textAlign="right">Dato</Td>`,
    },
  ],
  position: [
    {
      name: "Left",
      description: "Alinea el contenido a la izquierda",
      props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales" }],
      example: `<Left><P>Texto a la izquierda</P></Left>`,
    },
    {
      name: "Right",
      description: "Alinea el contenido a la derecha",
      props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales" }],
      example: `<Right><P>Texto a la derecha</P></Right>`,
    },
    {
      name: "Center",
      description: "Centra el contenido",
      props: [{ name: "style", type: "object", default: "{}", description: "Estilos adicionales" }],
      example: `<Center><P>Texto centrado</P></Center>`,
    },
  ],
  lists: [
    {
      name: "UL",
      description: "Lista desordenada",
      props: [
        { name: "style", type: "object", default: "{}", description: "Estilos adicionales" },
        { name: "type", type: "string", default: "disc", description: "Tipo de viñeta (disc, circle, square)" },
      ],
      example: `<UL type="square">
  <LI>Elemento</LI>
  <LI>Elemento</LI>
</UL>`,
    },
    {
      name: "OL",
      description: "Lista ordenada",
      props: [
        { name: "style", type: "object", default: "{}", description: "Estilos adicionales" },
        {
          name: "type",
          type: "string",
          default: "decimal",
          description: "Tipo de numeración (decimal, lower-alpha, upper-alpha, lower-roman, upper-roman)",
        },
        { name: "start", type: "number", default: "1", description: "Número inicial de la lista" },
      ],
      example: `<OL type="upper-roman" start={3}>
  <LI>Item</LI>
  <LI>Item</LI>
</OL>`,
    },
    {
      name: "LI",
      description: "Elemento de lista",
      props: [
        { name: "style", type: "object", default: "{}", description: "Estilos adicionales" },
        {
          name: "value",
          type: "number|string",
          default: "",
          description: "Valor específico para este elemento (solo para OL)",
        },
      ],
      example: `<LI value={10}>Valor específico</LI>`,
    },
  ],
  media: [
    {
      name: "Img",
      description: "Imagen",
      props: [
        { name: "src", type: "string", default: "", description: "URL de la imagen" },
        { name: "style", type: "object", default: "{}", description: "Estilos adicionales" },
        { name: "debug", type: "boolean", default: "false", description: "Modo debug (bordes)" },
        { name: "fixed", type: "boolean", default: "false", description: "Fijar en todas las páginas" },
        { name: "break", type: "boolean", default: "false", description: "Salto de página" },
      ],
      example: `<Img src="https://picsum.photos/400/200" style={{ width: 200 }} />`,
    },
    {
      name: "ImgBg",
      description: "Imagen de fondo con contenido superpuesto",
      props: [
        { name: "src", type: "string", default: "", description: "URL de la imagen de fondo" },
        { name: "width", type: "number|string", default: "100%", description: "Ancho del fondo" },
        { name: "height", type: "number|string", default: "100%", description: "Alto del fondo" },
        { name: "opacity", type: "number", default: "0.2", description: "Opacidad del fondo (0-1)" },
        {
          name: "objectFit",
          type: "string",
          default: "cover",
          description: "Ajuste de la imagen (cover, contain, fill, none, scale-down)",
        },
        { name: "objectPosition", type: "string", default: "center", description: "Posición de la imagen" },
        { name: "fixed", type: "boolean", default: "false", description: "Fijar en todas las páginas" },
        { name: "style", type: "object", default: "{}", description: "Estilos adicionales" },
        { name: "debug", type: "boolean", default: "false", description: "Modo debug (bordes)" },
        { name: "break", type: "boolean", default: "false", description: "Salto de página" },
      ],
      example: `<ImgBg src="https://picsum.photos/600/400" opacity={0.3}>
  <P>Texto sobre imagen de fondo</P>
</ImgBg>`,
    },
    {
      name: "QR",
      description: "Código QR",
      props: [
        { name: "url", type: "string", default: "", description: "Texto o URL para el código QR" },
        { name: "size", type: "number", default: "150", description: "Tamaño en píxeles" },
        { name: "colorDark", type: "string", default: "#000000", description: "Color de los puntos" },
        { name: "colorLight", type: "string", default: "#ffffff", description: "Color de fondo" },
        { name: "margin", type: "number", default: "0", description: "Margen alrededor del QR" },
        {
          name: "errorCorrectionLevel",
          type: "string",
          default: "M",
          description: "Nivel de corrección (L, M, Q, H)",
        },
        { name: "logo", type: "string", default: "", description: "URL de la imagen del logo" },
        { name: "logoWidth", type: "number", default: "30", description: "Ancho del logo en píxeles" },
        { name: "logoHeight", type: "number", default: "30", description: "Alto del logo en píxeles" },
        { name: "debug", type: "boolean", default: "false", description: "Modo debug (bordes)" },
        { name: "fixed", type: "boolean", default: "false", description: "Fijar en todas las páginas" },
        { name: "break", type: "boolean", default: "false", description: "Salto de página" },
      ],
      example: `<QR url="https://example.com" size={150} colorDark="#000" colorLight="#fff" logo="https://picsum.photos/80" logoWidth={30} logoHeight={30} />`,
    },
    {
      name: "QRstyle",
      description: "Código QR estilizado (qr-code-styling) con soporte de imagen central",
      props: [
        { name: "url", type: "string", default: "", description: "Texto o URL para el código QR" },
        { name: "size", type: "number", default: "300", description: "Tamaño del QR" },
        { name: "image", type: "string", default: "", description: "URL del logo central" },
        { name: "dotsOptions", type: "object", default: "{}", description: "Opciones de puntos (color, tipo)" },
        {
          name: "backgroundOptions",
          type: "object",
          default: "{ color: #ffffff }",
          description: "Opciones de fondo",
        },
        {
          name: "imageOptions",
          type: "object",
          default: "{ margin: 0, imageSize: 0.4 }",
          description: "Opciones de imagen central",
        },
        {
          name: "cornersSquareOptions",
          type: "object",
          default: "{}",
          description: "Opciones de esquinas cuadradas",
        },
        { name: "cornersDotOptions", type: "object", default: "{}", description: "Opciones de esquinas en punto" },
        { name: "colorDark", type: "string", default: "", description: "Color de puntos (fallback)" },
        { name: "colorLight", type: "string", default: "", description: "Color de fondo (fallback)" },
        { name: "margin", type: "number", default: "0", description: "Margen (fallback)" },
        {
          name: "errorCorrectionLevel",
          type: "string",
          default: "M",
          description: "Corrección de errores (fallback L, M, Q, H)",
        },
        { name: "style", type: "object", default: "{}", description: "Estilos adicionales" },
        { name: "debug", type: "boolean", default: "false", description: "Modo debug (bordes)" },
        { name: "fixed", type: "boolean", default: "false", description: "Fijar en todas las páginas" },
        { name: "break", type: "boolean", default: "false", description: "Salto de página" },
      ],
      example: `<QRstyle
  url="https://example.com"
  size={300}
  image="https://picsum.photos/80"
  dotsOptions={{ color: "#1f2937", type: "rounded" }}
  backgroundOptions={{ color: "#ffffff" }}
  imageOptions={{ margin: 0, imageSize: 0.35 }}
  cornersSquareOptions={{ type: "extra-rounded", color: "#1f2937" }}
  cornersDotOptions={{ type: "dot", color: "#1f2937" }}
/>`,
    },
  ],
  page: [

    {
      name: "Pie de página (Layout.footer)",
      description: "Contenido del pie de página en Layout",
      props: [
        { name: "footer", type: "ReactNode", default: "", description: "Contenido del pie de página" },
        { name: "footerLines", type: "number", default: "1", description: "Número de líneas reservadas" },
      ],
      example: `<Layout footer={<P>Pie</P>} footerLines={2}>
  <P>Contenido</P>
</Layout>`,
    },
  ],
  fonts: [
    {
      name: "Fuentes por defecto",
      description: "Fuentes disponibles sin registro previo.",
      props: [],
      example: `// Courier, Courier-Bold, Courier-Oblique, Courier-BoldOblique
// Helvetica, Helvetica-Bold, Helvetica-Oblique, Helvetica-BoldOblique
// Times-Roman, Times-Bold, Times-Italic, Times-BoldItalic`,
    },
    {
      name: "Font.register",
      description: "Registra fuentes personalizadas. IMPORTANTE: Deben ser URLs remotas (https://) para asegurar la generación correcta en todos los entornos.",
      props: [
        { name: "family", type: "string", default: "", description: "Nombre de la familia de la fuente" },
        { name: "fonts", type: "object[]", default: "[]", description: "Array de fuentes con src y propiedades" },
      ],
      example: `Font.register({
  family: "Lobster",
  fonts: [
    {
      src: "https://genarogg.github.io/react-pdf-levelup/public/font/Lobster-Regular.ttf",
      fontWeight: "normal",
    },
  ],
});`,
    },
  ],
};
