import { type TabId } from "./types";

export const componentDocsText_es: Record<TabId, Record<string, { description?: string; props: Record<string, string>; example?: string }>> = {
  layout: {
    Layout: {
      description: "Componente principal para configurar el documento PDF",
      props: {
        size: "Tamaño de la página (4A0-2A0, A0-A8, B0-B9, C0-C8, RA0-RA4, SRA0-SRA4, EXECUTIVE, FOLIO, LEGAL, LETTER, TABLOID, ID1)",
        orientation: "Orientación de la página (vertical, horizontal)",
        backgroundColor: "Color de fondo de la página",
        padding: "Padding interno de la página en puntos (solo si margin=normal)",
        margin: "Tipo de margen (apa, normal, estrecho, ancho)",
        style: "Estilos adicionales para la página",
        footer: "Contenido del pie de página",
        footerLines: "Número de líneas para el pie de página (1-10)",
        pagination: "Mostrar numeración de páginas",
        rule: "Mostrar rejilla de referencia en la página",
        meta: "Metadatos (title, author, subject, keywords, language, etc.)",
      },
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
    LayoutMultiPage: {
      description: "Contenedor avanzado para PDFs con múltiples secciones (páginas) configurables",
      props: {
        size: "Tamaño base de las páginas",
        orientation: "Orientación base",
        backgroundColor: "Color de fondo base",
        padding: "Padding base",
        margin: "Margen base (apa, normal, estrecho, ancho)",
        footer: "Pie de página base",
        pagination: "Numeración base",
        debug: "Modo debug base",
      },
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
    Section: {
      description: "Representa una página individual dentro de LayoutMultiPage",
      props: {
        backgroundColor: "Color de fondo de esta página",
        padding: "Padding de esta página",
        margin: "Margen de esta página",
        footer: "Footer de esta página",
        pagination: "Numeración en esta página",
        debug: "Modo debug en esta página",
      },
      example: `<Section backgroundColor="skyblue" padding={50}>
  <H1>Contenido de la página</H1>
</Section>`,
    },
    Container: {
      description: "Contenedor principal con padding horizontal",
      props: {
        style: "Estilos adicionales para el contenedor",
        debug: "Modo debug (bordes)",
        fixed: "Fijar en todas las páginas",
        break: "Salto de página",
      },
      example: `<Container>
  <Row>
    <Col6><P>Columna 1</P></Col6>
    <Col6><P>Columna 2</P></Col6>
  </Row>
</Container>`,
    },
    Row: {
      description: "Fila para el sistema de grid",
      props: {
        style: "Estilos adicionales para la fila",
        debug: "Modo debug (bordes)",
        fixed: "Fijar en todas las páginas",
        break: "Salto de página",
      },
      example: `<Row>
  <Col4><P>A</P></Col4>
  <Col4><P>B</P></Col4>
  <Col4><P>C</P></Col4>
</Row>`,
    },
    "Col1-Col12": {
      description: "Columnas para el sistema de grid (de 1 a 12 unidades)",
      props: {
        style: "Estilos adicionales para la columna",
        debug: "Modo debug (bordes)",
        fixed: "Fijar en todas las páginas",
        break: "Salto de página",
      },
      example: `<Col12><P>Contenido a ancho completo</P></Col12>`,
    },
    Div: {
      description: "Contenedor genérico para agrupar elementos",
      props: {
        style: "Estilos adicionales",
        debug: "Modo debug (bordes)",
        fixed: "Fijar en todas las páginas",
        break: "Salto de página",
      },
      example: `<Div style={{ padding: 10 }}>
  <P>Bloque con padding</P>
</Div>`,
    },
  },
  text: {
    "P, H1-H6": {
      description: "Componentes de texto (párrafo, encabezados)",
      props: {
        style: "Estilos adicionales para el texto",
        debug: "Modo debug (bordes)",
        fixed: "Fijar en todas las páginas",
        break: "Salto de página",
      },
      example: `<H1>Título</H1>
<H3>Subtítulo</H3>
<P>Parrafo</P>`,
    },
    "Strong, Em, U, Small": {
      description: "Componentes de formato de texto",
      props: {
        style: "Estilos adicionales",
        debug: "Modo debug (bordes)",
        fixed: "Fijar en todas las páginas",
        break: "Salto de página",
      },
      example: `<P><Strong>Negrita</Strong>, <Em>Cursiva</Em>, <U>Subrayado</U>, <Small>Pequeño</Small></P>`,
    },
    Blockquote: {
      description: "Bloque de cita",
      props: {
        style: "Estilos adicionales",
        debug: "Modo debug (bordes)",
        fixed: "Fijar en todas las páginas",
        break: "Salto de página",
      },
      example: `<Blockquote>Una cita destacada</Blockquote>`,
    },
    Mark: {
      description: "Texto resaltado",
      props: {
        style: "Estilos adicionales",
        debug: "Modo debug (bordes)",
        fixed: "Fijar en todas las páginas",
        break: "Salto de página",
      },
      example: `<Mark>Texto resaltado</Mark>`,
    },
    Span: {
      description: "Contenedor de texto inline",
      props: {
        style: "Estilos adicionales",
        debug: "Modo debug (bordes)",
        fixed: "Fijar en todas las páginas",
        break: "Salto de página",
      },
      example: `<Span>Inline</Span>`,
    },
    BR: {
      description: "Salto de línea",
      props: {
        style: "Estilos adicionales",
        debug: "Modo debug (bordes)",
        fixed: "Fijar en todas las páginas",
        break: "Salto de página",
      },
      example: `<P>Linea 1</P>
<BR />
<P>Linea 2</P>`,
    },
    HR: {
      description: "Línea horizontal divisoria",
      props: {
        style: "Estilos adicionales",
        debug: "Modo debug (bordes)",
        fixed: "Fijar en todas las páginas",
        break: "Salto de página",
      },
      example: `<HR />`,
    },
    A: {
      description: "Enlace",
      props: {
        href: "URL del enlace",
        style: "Estilos adicionales",
        debug: "Modo debug (bordes)",
        fixed: "Fijar en todas las páginas",
        break: "Salto de página",
      },
      example: `<A href="https://example.com">Ir al sitio</A>`,
    },
  },
  table: {
    "Table (Tablet)": {
      description: "Tabla completa",
      props: { style: "Estilos adicionales para la tabla" },
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
    Thead: {
      description: "Encabezado de tabla",
      props: { style: "Estilos adicionales" },
      example: `<Thead><Tr><Th>Columna</Th></Tr></Thead>`,
    },
    Tbody: {
      description: "Cuerpo de tabla",
      props: { style: "Estilos adicionales" },
      example: `<Tbody><Tr><Td>Dato</Td></Tr></Tbody>`,
    },
    Tr: {
      description: "Fila de tabla",
      props: { style: "Estilos adicionales" },
      example: `<Tr><Td>A</Td><Td>B</Td></Tr>`,
    },
    Th: {
      description: "Celda de encabezado",
      props: {
        style: "Estilos adicionales",
        width: "Ancho de la celda",
        height: "Alto de la celda",
        colSpan: "Número de columnas que ocupa",
        textAlign: "Alineación del texto (left, center, right)",
      },
      example: `<Th textAlign="center">Encabezado</Th>`,
    },
    Td: {
      description: "Celda de datos",
      props: {
        style: "Estilos adicionales",
        width: "Ancho de la celda",
        height: "Alto de la celda",
        colSpan: "Número de columnas que ocupa",
        textAlign: "Alineación del texto (left, center, right)",
      },
      example: `<Td textAlign="right">Dato</Td>`,
    },
  },
  position: {
    Left: {
      description: "Alinea el contenido a la izquierda",
      props: { style: "Estilos adicionales" },
      example: `<Left><P>Texto a la izquierda</P></Left>`,
    },
    Right: {
      description: "Alinea el contenido a la derecha",
      props: { style: "Estilos adicionales" },
      example: `<Right><P>Texto a la derecha</P></Right>`,
    },
    Center: {
      description: "Centra el contenido",
      props: { style: "Estilos adicionales" },
      example: `<Center><P>Texto centrado</P></Center>`,
    },
  },
  lists: {
    UL: {
      description: "Lista desordenada",
      props: {
        style: "Estilos adicionales",
        type: "Tipo de viñeta (disc, circle, square)",
      },
      example: `<UL type="square">
  <LI>Elemento</LI>
  <LI>Elemento</LI>
</UL>`,
    },
    OL: {
      description: "Lista ordenada",
      props: {
        style: "Estilos adicionales",
        type: "Tipo de numeración (decimal, lower-alpha, upper-alpha, lower-roman, upper-roman)",
        start: "Número inicial de la lista",
      },
      example: `<OL type="upper-roman" start={3}>
  <LI>Item</LI>
  <LI>Item</LI>
</OL>`,
    },
    LI: {
      description: "Elemento de lista",
      props: {
        style: "Estilos adicionales",
        value: "Valor específico para este elemento (solo para OL)",
      },
      example: `<LI value={10}>Valor específico</LI>`,
    },
  },
  media: {
    Img: {
      description: "Imagen",
      props: {
        src: "URL de la imagen",
        style: "Estilos adicionales",
        debug: "Modo debug (bordes)",
        fixed: "Fijar en todas las páginas",
        break: "Salto de página",
      },
      example: `<Img src="https://picsum.photos/400/200" style={{ width: 200 }} />`,
    },
    ImgBg: {
      description: "Imagen de fondo con contenido superpuesto",
      props: {
        src: "URL de la imagen de fondo",
        width: "Ancho del fondo",
        height: "Alto del fondo",
        opacity: "Opacidad del fondo (0-1)",
        objectFit: "Ajuste de la imagen (cover, contain, fill, none, scale-down)",
        objectPosition: "Posición de la imagen",
        fixed: "Fijar en todas las páginas",
        style: "Estilos adicionales",
        debug: "Modo debug (bordes)",
        break: "Salto de página",
      },
      example: `<ImgBg src="https://picsum.photos/600/400" opacity={0.3}>
  <P>Texto sobre imagen de fondo</P>
</ImgBg>`,
    },
    QR: {
      description: "Código QR",
      props: {
        url: "Texto o URL para el código QR",
        size: "Tamaño en píxeles",
        colorDark: "Color de los puntos",
        colorLight: "Color de fondo",
        margin: "Margen alrededor del QR",
        errorCorrectionLevel: "Nivel de corrección (L, M, Q, H)",
        logo: "URL de la imagen del logo",
        logoWidth: "Ancho del logo en píxeles",
        logoHeight: "Alto del logo en píxeles",
        debug: "Modo debug (bordes)",
        fixed: "Fijar en todas las páginas",
        break: "Salto de página",
      },
      example: `<QR url="https://example.com" size={150} colorDark="#000" colorLight="#fff" logo="https://picsum.photos/80" logoWidth={30} logoHeight={30} />`,
    },
    QRstyle: {
      description: "Código QR estilizado (qr-code-styling) con soporte de imagen central",
      props: {
        url: "Texto o URL para el código QR",
        size: "Tamaño del QR",
        image: "URL del logo central",
        dotsOptions: "Opciones de puntos (color, tipo)",
        backgroundOptions: "Opciones de fondo",
        imageOptions: "Opciones de imagen central",
        cornersSquareOptions: "Opciones de esquinas cuadradas",
        cornersDotOptions: "Opciones de esquinas en punto",
        colorDark: "Color de puntos (fallback)",
        colorLight: "Color de fondo (fallback)",
        margin: "Margen (fallback)",
        errorCorrectionLevel: "Corrección de errores (fallback L, M, Q, H)",
        style: "Estilos adicionales",
        debug: "Modo debug (bordes)",
        fixed: "Fijar en todas las páginas",
        break: "Salto de página",
      },
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
  },
  page: {
    "Page Footer (Layout.footer)": {
      description: "Contenido del pie de página en Layout",
      props: {
        footer: "Contenido del pie de página",
        footerLines: "Número de líneas reservadas",
      },
      example: `<Layout footer={<P>Pie</P>} footerLines={2}>
  <P>Contenido</P>
</Layout>`,
    },
  },
  fonts: {
    "Default Fonts": {
      description: "Fuentes disponibles sin registro previo.",
      props: {},
      example: `// Courier, Courier-Bold, Courier-Oblique, Courier-BoldOblique
// Helvetica, Helvetica-Bold, Helvetica-Oblique, Helvetica-BoldOblique
// Times-Roman, Times-Bold, Times-Italic, Times-BoldItalic`,
    },
    "Font.register": {
      description: "Registra fuentes personalizadas. IMPORTANTE: Deben ser URLs remotas (https://) para asegurar la generación correcta en todos los entornos.",
      props: {
        family: "Nombre de la familia de la fuente",
        fonts: "Array de fuentes con src y propiedades",
      },
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
  },
};
