import { type TabId } from "./types";

export const componentDocsText_es: Record<TabId, Record<string, { description?: string; props: Record<string, string>; example?: string }>> = {
  layout: {
    Layout: {
      description:
        "Núcleo estructural del documento PDF. Gestiona tamaño de página, orientación, márgenes predefinidos, fondo de color o imagen, numeración automática, rejilla de referencia y modo debug.",
      props: {
        size: 'Tamaño de página: un preset (4A0-2A0, A0-A8, B0-B9, C0-C8, RA0-RA4, SRA0-SRA4, EXECUTIVE, FOLIO, LEGAL, LETTER, TABLOID, ID1) o un objeto {width, height} en puntos. Valor inválido cae a "A4"',
        orientation: 'Orientación de la página (vertical, horizontal, portrait, landscape, h, v). Se transforma internamente a portrait/landscape',
        backgroundColor: "Color de fondo de la página",
        backgroundImage: "URL de imagen de fondo que ocupa toda la página",
        backgroundImageOpacity: "Opacidad de la imagen de fondo (0–1)",
        padding: 'Padding base cuando margin="normal"',
        margin: "Sistema de márgenes: preset (apa, normal, estrecho, ancho) o número en puntos para los 4 lados",
        style: "Estilos adicionales para la página",
        footerLines: "Número de líneas reservadas abajo (usado por el contenedor de paginación para no solapar contenido)",
        pagination: "Muestra numeración automática de páginas",
        paginationStyle: "Estilos adicionales para el Text de paginación dentro del footer",
        rule: "Muestra rejilla de referencia en centímetros",
        debug: "Activa el modo debug de @react-pdf/renderer",
        dpi: "Resolución DPI de la página (se pasa directamente a Page dpi)",
        id: "ID HTML/CSS del elemento Page subyacente",
        meta: "Metadatos del documento (título, autor, palabras clave, contraseñas, permisos, etc.)",
      },
      example: `const MyDocument = () => (
  <Layout
    size="A4"
    margin="apa"
    backgroundColor="#ffffff"
    pagination
    paginationStyle={{ fontSize: 10, color: '#666' }}
    meta={{ title: 'Mi PDF', author: 'Genaro' }}
  >
    <H1>Título</H1>
  </Layout>
);

export default MyDocument;`,
    },
    LayoutMultiPage: {
      description:
        "Alternativa avanzada a Layout: en vez de un flujo continuo que se divide automáticamente, permite definir explícitamente cada página con Section y configurar propiedades por página.",
      props: {
        size: "Tamaño base de las páginas (preset o {width, height} en puntos)",
        orientation: "Orientación base de las páginas",
        backgroundColor: "Color de fondo base",
        backgroundImage: "Imagen de fondo base para todas las páginas",
        backgroundImageOpacity: "Opacidad de la imagen de fondo base",
        padding: "Padding base de las páginas",
        margin: "Ajuste de márgenes base (preset o número en puntos)",
        footerLines: "Espacio reservado para el footer en líneas (usado por el contenedor de paginación)",
        pagination: "Mostrar numeración de páginas base",
        paginationStyle: "Estilos adicionales para el Text de paginación dentro del footer",
        rule: "Mostrar rejilla de referencia base",
        debug: "Activar modo debug base",
        meta: "Metadatos del documento (título, autor, contraseñas, permisos, etc.)",
      },
      example: `const MyMultiPageDocument = () => (
  <LayoutMultiPage backgroundColor="#eee" footerLines={1}>
    <Section>
      <H1>Página 1</H1>
    </Section>
    <Section backgroundColor="white" pagination={false}>
      <H1>Página 2 (Blanca, sin numeración)</H1>
    </Section>
  </LayoutMultiPage>
);

export default MyMultiPageDocument;`,
    },
    Section: {
      description:
        "Representa una página individual dentro de un LayoutMultiPage. Hereda las propiedades globales del padre, pero permite sobrescribirlas para crear páginas únicas.",
      props: {
        style: "Estilos adicionales para la página",
        backgroundColor: "Sobrescribe el color de fondo para esta página",
        backgroundImage: "Sobrescribe la imagen de fondo para esta página",
        backgroundImageOpacity: "Sobrescribe la opacidad de la imagen de fondo",
        padding: "Sobrescribe el padding de esta página",
        margin: "Sobrescribe el preset de márgenes o un número en puntos",
        footerLines: "Sobrescribe el espacio reservado para el footer (en líneas)",
        pagination: "Activa/desactiva la numeración en esta página",
        paginationStyle: "Sobrescribe los estilos del Text de paginación",
        rule: "Activa/desactiva la rejilla en esta página",
        debug: "Activa/desactiva el modo debug en esta página",
        dpi: "Resolución DPI específica para esta página",
        id: "ID HTML/CSS del elemento Page de esta Section",
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
      description:
        "Componentes de formato de texto en línea: Strong (negrita), Em (cursiva), U (subrayado), Small (más pequeño)",
      props: {
        style: "Estilos adicionales",
        color: "Color para aplicar al subrayado de U",
        debug: "Modo debug (bordes)",
        fixed: "Fijar en todas las páginas",
        break: "Salto de página",
      },
      example: `<P><Strong>Negrita</Strong>, <Em>Cursiva</Em>, <U color="red">Subrayado rojo</U>, <Small>Pequeño</Small></P>`,
    },
    Blockquote: {
      description: "Bloque de cita para destacar texto importante",
      props: {
        style: "Estilos adicionales",
        color: "Color para el borde izquierdo de la cita",
        debug: "Modo debug (bordes)",
        fixed: "Fijar en todas las páginas",
        break: "Salto de página",
      },
      example: `<Blockquote color="blue">Una cita destacada con borde azul</Blockquote>`,
    },
    Mark: {
      description: "Texto resaltado (como con un marcador)",
      props: {
        style: "Estilos adicionales",
        color: "Color de fondo para el resaltado",
        debug: "Modo debug (bordes)",
        fixed: "Fijar en todas las páginas",
        break: "Salto de página",
      },
      example: `<Mark color="lime">Texto resaltado en lima</Mark>`,
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
      description: "Enlace (Link)",
      props: {
        href: "URL del enlace (preferido)",
        src: "URL del enlace (compatibilidad). Si href no se provee, se usa src",
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
      description:
        "Contenedor principal. Inyecta un contexto compartido (colores, tamaños, modo de cuadrícula) y controla bordes/esquinas redondeadas y paginación manual mediante rowsPerPage.",
      props: {
        style:
          "Estilos adicionales del contenedor exterior. Si incluye borderRadius explícito, activa el workaround del bug de border-radius (issue #395 de @react-pdf/renderer)",
        cellHeight: "Altura mínima (minHeight) por defecto de las celdas que no declaren su propio height",
        borderColor: "Color del borde exterior y de la cuadrícula interna",
        textColor: "Color del texto por defecto en toda la tabla (puede sobreescribirse por Thead, Tbody o cada celda)",
        headerBackground: "Color de fondo del contenedor del encabezado (Thead)",
        zebra: "Habilita el patrón zebra (filas impares con fondo alternado). Sólo afecta a Td",
        zebraColor: "Color de fondo usado para las filas impares cuando zebra es true",
        grid: 'Estilo de la cuadrícula interna: "grid" (bordes completos), "modern" (sólo bordes inferiores), "not-grid" (sin bordes internos)',
        borderRadiusMethod:
          '"view" simula el borde con un View exterior de relleno; "svg" (default) dibuja el contorno con un trazo SVG superpuesto y permite interior transparente',
        rowsPerPage:
          "Divide el Tbody en varias tablas independientes, una por cada tanda de filas, repitiendo el Thead en cada una",
      },
      example: `<Table
  cellHeight={25}
  borderColor="#4338ca"
  textColor="#1f2937"
  headerBackground="#c7d2fe"
  zebraColor="#eef2ff"
  zebra
  grid="modern"
  style={{ borderRadius: 8 }}
>
  <Thead>
    <Tr>
      <Th>Producto</Th>
      <Th textAlign="right">Precio</Th>
    </Tr>
  </Thead>
  <Tbody>
    <Tr>
      <Td>Mouse</Td>
      <Td textAlign="right">$ 29.99</Td>
    </Tr>
  </Tbody>
</Table>`,
    },
    Thead: {
      description:
        "Sección del encabezado. Renderiza un View con backgroundColor: headerBackground del contexto, redondea las esquinas superiores cuando el fix de border-radius está activo, y sobreescribe textAlign, borderColor y textColor para sus descendientes.",
      props: {
        style: "Estilos adicionales del contenedor del encabezado",
        textAlign: "Alineación por defecto de las celdas del encabezado (sobrescribe el Table)",
        borderColor: "Sobrescribe el borderColor heredado de Table para este Thead",
        textColor: "Sobrescribe el textColor heredado de Table para este Thead",
      },
      example: `<Thead textAlign="center" textColor="#fff" borderColor="#4338ca">
  <Tr>
    <Th>Nombre</Th>
    <Th>Edad</Th>
  </Tr>
</Thead>`,
    },
    Tbody: {
      description:
        "Sección del cuerpo. Por cada Tr que contiene le inyecta isLastRow (última fila) e isOdd (fila impar, para zebra) vía cloneElement, y propaga cualquier prop extra a cada Tr.",
      props: {
        borderColor: "Sobrescribe borderColor del contexto para este Tbody",
        textColor: "Sobrescribe textColor del contexto para este Tbody",
      },
      example: `<Tbody>
  <Tr><Td>Fila 1</Td></Tr>
  <Tr><Td>Fila 2</Td></Tr>
</Tbody>`,
    },
    Tr: {
      description:
        "Fila de tabla (dentro de Thead o Tbody). Calcula el ancho real de cada celda: suma las unidades de colSpan de la fila y reparte el ancho porcentual entre las celdas que no traen width manual.",
      props: {
        style: "Estilos adicionales del View de la fila",
        isLastRow: "Indica si es la última fila del Tbody. Inyectado por Tbody, se puede setear a mano si el Tr va suelto",
        isOdd: "Indica si es una fila impar (para zebra). Inyectado por Tbody",
      },
      example: `<Tr><Td>A</Td><Td>B</Td></Tr>`,
    },
    Th: {
      description:
        "Celda de encabezado. Usa fondo bold y nunca aplica zebra ni redondea esquinas inferiores.",
      props: {
        style: "Estilos adicionales de la celda",
        width: 'Ancho explícito de la celda ("100%", "120px", o número = puntos). Si no se provee, se calcula proporcionalmente por colSpan',
        height: "Alto mínimo de la celda (minHeight). Si no se provee, usa el cellHeight del contexto",
        colSpan: "Cantidad de columnas que abarca la celda (sólo afecta el ancho, no hay fusión real de celdas)",
        textAlign: "Alineación del texto. Precedencia: valor explícito → Thead/contexto → left por defecto",
        text: 'Si es true (default), el contenido se envuelve en un Text. Ponelo en false cuando children sea un componente basado en View (ej. un Badge)',
      },
      example: `<Th textAlign="center" width="20%">Encabezado</Th>`,
    },
    Td: {
      description:
        "Celda de datos. Aplica zebra si zebra && isOdd, y redondea las esquinas inferiores de la última fila cuando hay borderRadius.",
      props: {
        style: "Estilos adicionales de la celda",
        width: 'Ancho explícito de la celda ("100%", "120px", o número = puntos). Si no se provee, se calcula proporcionalmente por colSpan',
        height: "Alto mínimo de la celda (minHeight). Si no se provee, usa el cellHeight del contexto",
        colSpan: "Cantidad de columnas que abarca la celda (sólo afecta el ancho, no hay fusión real de celdas)",
        textAlign: "Alineación del texto. Precedencia: valor explícito → Thead/contexto → left por defecto",
        text: 'Si es true (default), el contenido se envuelve en un Text. Ponelo en false cuando children sea un componente basado en View (ej. un Badge)',
      },
      example: `<Td textAlign="right">$ 29.99</Td>

// Celda con componente View (requiere text={false}):
<Td text={false}>
  <Badge color="#ef4444">BAJA</Badge>
</Td>`,
    },
  },
  position: {
    Left: {
      description: "Alinea el contenido a la izquierda (alignItems: flex-start)",
      props: {
        style: "Estilos adicionales (se mezclan al final)",
        vertical: "Si es true, además centra verticalmente (justifyContent: center). Útil para contenido con altura conocida",
      },
      example: `<Left><P>Texto a la izquierda</P></Left>`,
    },
    Right: {
      description: "Alinea el contenido a la derecha (alignItems: flex-end)",
      props: {
        style: "Estilos adicionales (se mezclan al final)",
        vertical: "Si es true, además centra verticalmente (justifyContent: center). Útil para contenido con altura conocida",
      },
      example: `<Right><P>Texto a la derecha</P></Right>`,
    },
    Center: {
      description: "Centra el contenido horizontalmente (alignItems: center)",
      props: {
        style: "Estilos adicionales (se mezclan al final)",
        vertical: "Si es true, además centra verticalmente (justifyContent: center). Útil para contenido con altura conocida",
      },
      example: `<Div style={{ height: 120 }}>
  <Center vertical>
    <P>Centrado horizontal y vertical</P>
  </Center>
</Div>`,
    },
  },
  lists: {
    UL: {
      description: "Lista desordenada (Unordered List). Contenedor para elementos LI con viñetas",
      props: {
        style: "Estilos adicionales para el contenedor",
        type: 'Tipo de viñeta: disc, circle, square (SVG) o none. Tipado estricto (UlBulletType)',
        fontSize: "Tamaño de fuente para viñetas y texto de los LI (puede sobreescribirse por LI individual)",
        bulletColor: "Color de la viñeta (puede sobreescribirse por LI individual)",
      },
      example: `<UL type="square" bulletColor="#4338ca">
  <LI>Elemento 1</LI>
  <LI>Elemento 2</LI>
</UL>`,
    },
    OL: {
      description: "Lista ordenada (Ordered List). Contenedor para elementos LI con numeración automática",
      props: {
        style: "Estilos adicionales para el contenedor",
        type: "Tipo de numeración: decimal, lower-alpha, upper-alpha, lower-roman, upper-roman o none. Tipado estricto (OlBulletType)",
        start: "Número (o equivalente) inicial de la secuencia",
        fontSize: "Tamaño de fuente para marcadores y texto de los LI (puede sobreescribirse por LI individual)",
        bulletColor: "Color del marcador numérico (puede sobreescribirse por LI individual)",
      },
      example: `<OL type="upper-roman" start={3} fontSize={12}>
  <LI>Item III</LI>
  <LI>Item IV</LI>
</OL>`,
    },
    LI: {
      description:
        "Elemento de lista (List Item). Debe usarse dentro de UL u OL. Hereda bulletType, isOrdered, index, start, fontSize y bulletColor del padre, o puede declararse aislado y sobreescribir esos valores",
      props: {
        style: "Estilos adicionales para el contenedor del item",
        bulletType: "Tipo de viñeta/marcador. Heredado de UL/OL (recibe UlBulletType u OlBulletType según el padre)",
        isOrdered: "Indica si se renderiza como numerado. Heredado de UL/OL",
        index: "Posición (1-based) dentro de la lista. Heredado de UL/OL",
        start: "Valor inicial de la secuencia (solo listas ordenadas). Heredado de OL",
        fontSize: "Tamaño de fuente para viñeta/marcador y el texto contenido (si children es string)",
        bulletColor: "Color de la viñeta/marcador",
      },
      example: `// Dentro de una lista
<UL type="circle">
  <LI bulletColor="red">Elemento rojo</LI>
</UL>

// Uso aislado (sin UL/OL)
<LI bulletType="disc" isOrdered={false} index={1} bulletColor="#22C55E">
  Item con viñeta verde
</LI>`,
    },
  },
  media: {
    Img: {
      description:
        "Imagen. Soporta todas las propiedades del componente Image de @react-pdf/renderer. Por defecto aplica width: 100% y height: auto",
      props: {
        src: "URL o ruta de la imagen",
        style: "Estilos adicionales",
        width: "Ancho de la imagen",
        height: "Alto de la imagen",
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
  advanced: {
    Badge: {
      description:
        "Insignia estilizada con variantes de color y tamaños predefinidos. Combina un View contenedor con un Text estilizado, por lo que dentro de una Td requiere text={false}.",
      props: {
        variant: "Variante de color predefinida (default, active, pending, cancelled, success, warning, error, info)",
        size: "Tamaño de la insignia: sm, md o lg (afecta el padding)",
        style: "Estilos adicionales para el contenedor View exterior",
      },
      example: `<Badge variant="success" size="md">En stock</Badge>

// Dentro de una tabla requiere text={false}:
<Td text={false}>
  <Badge variant="error">Agotado</Badge>
</Td>`,
    },
    Button: {
      description:
        "Botón estilizado con variantes de color y tamaños. Soporta enlaces (href) y estado deshabilitado. La variante outline simula el borde con un anillo de relleno (asume fondo blanco).",
      props: {
        variant: "Variante de color: primary, secondary, success, danger u outline",
        size: "Tamaño predefinido: sm, md o lg (afecta padding y fontSize)",
        disabled: "Desactiva el botón (colores apagados, ignora href)",
        href: "Si se provee y disabled es false, renderiza como enlace (Link)",
        width: 'Ancho explícito del botón (número en puntos o string "100%")',
        height: "Alto explícito del botón",
        style: "Estilos adicionales para el contenedor exterior (sobrescribe estilos base)",
        textStyle: "Estilos adicionales para el texto interno del botón",
      },
      example: `<Button variant="primary" size="md">Aceptar</Button>

<Button variant="outline" size="sm" href="https://example.com">
  Ver más
</Button>`,
    },
    Divider: {
      description:
        "Línea divisoria con una etiqueta de texto centrada entre dos líneas, útil para separar secciones. Usa alignSelf: stretch, por lo que width tiene por defecto 100% (necesario para que las líneas no se encojan a 0 dentro de un padre que centra su contenido).",
      props: {
        label: "Texto de la etiqueta central (requerido, se muestra en mayúsculas)",
        variant: "Estilo de la línea: line (continua), dashed (discontinua) o dotted (punteada)",
        color: "Color de la línea divisoria",
        textColor: "Color del texto de la etiqueta",
        fontSize: "Tamaño de fuente de la etiqueta",
        marginVertical: "Margen superior e inferior del componente",
        width: "Ancho total del Divider (por defecto ocupa todo el ancho disponible)",
        style: "Estilos adicionales para el contenedor exterior",
      },
      example: `<Divider label="Sección 2" variant="dashed" color="#6366f1" />`,
    },
    Gradiant: {
      description:
        "Degradado lineal o radial para documentos PDF, con soporte de colores personalizados, ángulo (lineales) y forma (cuadrado o círculo).",
      props: {
        colors:
          'Colores del degradado: array de strings (["#fff","#000"]) o de objetos {color, offset} (requerido)',
        width: "Ancho del bloque degradado",
        height: "Alto del bloque degradado",
        type: "Tipo de degradado: linear o radial",
        shape: "Forma del contenedor: square o circle",
        angle: "Ángulo del degradado lineal en grados (0 = izq→der, 90 = arriba→abajo)",
        style: "Estilos adicionales para el contenedor principal",
      },
      example: `<Gradiant colors={["#FF6B6B", "#4ECDC4"]} width={300} height={100}>
  <P style={{ color: "white" }}>Hola Mundo</P>
</Gradiant>`,
    },
    Pass: {
      description:
        'Placeholder nulo (equivalente al "pass" de Python): no renderiza nada, no acepta children. Existe para satisfacer contratos de children obligatorios o marcar puntos pendientes del árbol.',
      props: {},
      example: `<Section>
  <H1>Firmas</H1>
  <Pass />  {/* stub temporal: se reemplaza cuando haya contenido real */}
</Section>`,
    },
    Graph: {
      description:
        "Gráficos vectoriales SVG nativos (barras, líneas, áreas, pie, donut), sin canvas ni Chart.js. El texto de ejes y etiquetas es un nodo de texto real, buscable y copiable.",
      props: {
        variant: "Tipo de gráfico: bar, horizontal-bar, line, area, pie o donut (requerido)",
        series: "Datos del gráfico, una o más series. Pie/Donut usan solo series[0] (requerido)",
        width: "Ancho total del Svg en unidades del viewBox (debe ser número)",
        height: "Alto total del Svg en unidades del viewBox (debe ser número)",
        title: "Título superior del gráfico",
        subtitle: "Subtítulo debajo del título",
        colors: "Paleta de colores alternativa (una por serie o porción)",
        showLegend: "Muestra/oculta la leyenda debajo del gráfico",
        showValues: "Muestra/oculta el valor numérico sobre cada barra o porción",
        showDots: "Sólo line/area: dibuja un círculo en cada punto válido",
        smooth: "Sólo line/area: suaviza la curva con splines Catmull-Rom",
        yTickCount: "Cantidad aproximada de ticks en el eje de valores",
        style: "Estilos adicionales para el View contenedor exterior (no el Svg)",
      },
      example: `<Graph
  variant="bar"
  width={500}
  height={300}
  title="Ventas por región"
  showValues
  series={[
    { name: "2026", data: [
      { label: "Norte", value: 120 },
      { label: "Sur", value: 150 },
    ]},
  ]}
/>`,
    },
    Form: {
      description:
        "Contenedor para todos los campos del formulario (Input, TextArea, Checkbox), proporcionando un contexto de estilo compartido.",
      props: {
        style: "Estilos adicionales para el contenedor del formulario",
        borderColor: "Color del borde para los campos del formulario",
        borderRadius: "Radio del borde para los campos del formulario",
        labelColor: "Color del texto de las etiquetas",
        textColor: "Color del texto general dentro del formulario",
      },
      example: `<Form borderColor="#FF0000" borderRadius={10}>
  <Input label="Nombre" required />
  <TextArea label="Comentarios" />
  <Checkbox label="Acepto los términos" />
</Form>`,
    },
    Input: {
      description: "Campo de entrada de texto de una sola línea.",
      props: {
        label: "Etiqueta del campo de entrada",
        placeholder: "Texto de marcador de posición",
        required: "Indica si el campo es obligatorio",
        width: "Ancho del campo de entrada",
        height: "Altura mínima del campo de entrada",
        style: "Estilos adicionales para el contenedor del campo",
        labelStyle: "Estilos adicionales para la etiqueta",
      },
      example: `<Input label="Nombre Completo" placeholder="Introduce tu nombre" required width="50%" />`,
    },
    TextArea: {
      description: "Campo de entrada de texto de varias líneas.",
      props: {
        label: "Etiqueta del campo de texto",
        placeholder: "Texto de marcador de posición",
        required: "Indica si el campo es obligatorio",
        width: "Ancho del campo de texto",
        height: "Altura del campo de texto",
        style: "Estilos adicionales para el contenedor del campo",
        labelStyle: "Estilos adicionales para la etiqueta",
      },
      example: `<TextArea label="Comentarios" placeholder="Escribe tus comentarios aquí..." height={100} />`,
    },
    Checkbox: {
      description: "Casilla de selección para valores booleanos.",
      props: {
        label: "Etiqueta del checkbox",
        checked: "Indica si el checkbox está marcado",
        style: "Estilos adicionales para el contenedor del checkbox",
        labelStyle: "Estilos adicionales para la etiqueta del checkbox",
      },
      example: `<Checkbox label="Acepto los términos y condiciones" checked={true} />`,
    },
  },
};
