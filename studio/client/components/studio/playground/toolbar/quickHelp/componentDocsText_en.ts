import { type TabId } from "./types";

export const componentDocsText_en: Record<TabId, Record<string, { description?: string; props: Record<string, string>; example?: string }>> = {
  layout: {
    Layout: {
      description: "Main component for configuring the PDF document",
      props: {
        size: "Page size (4A0-2A0, A0-A8, B0-B9, C0-C8, RA0-RA4, SRA0-SRA4, EXECUTIVE, FOLIO, LEGAL, LETTER, TABLOID, ID1)",
        orientation: "Page orientation (vertical, horizontal)",
        backgroundColor: "Page background color",
        padding: "Internal page padding in points (only if margin=normal)",
        margin: "Margin type (apa, normal, narrow, wide)",
        style: "Additional styles for the page",
        footer: "Footer content",
        footerLines: "Number of lines for the footer (1-10)",
        pagination: "Show page numbering",
        rule: "Show reference grid on the page",
        meta: "Metadata (title, author, subject, keywords, language, etc.)",
      },
      example: `const MyDocument = () => (
  <Layout 
    meta={{ title: 'My PDF', author: 'Genaro' }}
    pagination 
    footer={<P>Page Footer</P>}
  >
    <H1>Title</H1>
  </Layout>
);

export default MyDocument;`,
    },
    LayoutMultiPage: {
      description: "Advanced container for multi-section (page) configurable PDFs",
      props: {
        size: "Base page size",
        orientation: "Base orientation",
        backgroundColor: "Base background color",
        padding: "Base padding",
        margin: "Base margin (apa, normal, narrow, wide)",
        footer: "Base page footer",
        pagination: "Base numbering",
        debug: "Base debug mode",
      },
      example: `const MyMultiPageDocument = () => (
  <LayoutMultiPage backgroundColor="#eee">
    <Section>
      <H1>Page 1</H1>
    </Section>
    <Section backgroundColor="white">
      <H1>Page 2 (White)</H1>
    </Section>
  </LayoutMultiPage>
);

export default MyMultiPageDocument;`,
    },
    Section: {
      description: "Represents an individual page within LayoutMultiPage",
      props: {
        backgroundColor: "Background color of this page",
        padding: "Padding of this page",
        margin: "Margin of this page",
        footer: "Footer of this page",
        pagination: "Numbering on this page",
        debug: "Debug mode on this page",
      },
      example: `<Section backgroundColor="skyblue" padding={50}>
  <H1>Page Content</H1>
</Section>`,
    },
    Container: {
      description: "Main container with horizontal padding",
      props: {
        style: "Additional styles for the container",
        debug: "Debug mode (borders)",
        fixed: "Fix on all pages",
        break: "Page break",
      },
      example: `<Container>
  <Row>
    <Col6><P>Column 1</P></Col6>
    <Col6><P>Column 2</P></Col6>
  </Row>
</Container>`,
    },
    Row: {
      description: "Row for the grid system",
      props: {
        style: "Additional styles for the row",
        debug: "Debug mode (borders)",
        fixed: "Fix on all pages",
        break: "Page break",
      },
      example: `<Row>
  <Col4><P>A</P></Col4>
  <Col4><P>B</P></Col4>
  <Col4><P>C</P></Col4>
</Row>`,
    },
    "Col1-Col12": {
      description: "Columns for the grid system (1 to 12 units)",
      props: {
        style: "Additional styles for the column",
        debug: "Debug mode (borders)",
        fixed: "Fix on all pages",
        break: "Page break",
      },
      example: `<Col12><P>Full width content</P></Col12>`,
    },
    Div: {
      description: "Generic container to group elements",
      props: {
        style: "Additional styles",
        debug: "Debug mode (borders)",
        fixed: "Fix on all pages",
        break: "Page break",
      },
      example: `<Div style={{ padding: 10 }}>
  <P>Block with padding</P>
</Div>`,
    },
  },
  text: {
    "P, H1-H6": {
      description: "Text components (paragraph, headings)",
      props: {
        style: "Additional text styles",
        debug: "Debug mode (borders)",
        fixed: "Fix on all pages",
        break: "Page break",
      },
      example: `<H1>Title</H1>
<H3>Subtitle</H3>
<P>Paragraph</P>`,
    },
    "Strong, Em, U, Small": {
      description: "Text formatting components",
      props: {
        style: "Additional styles",
        debug: "Debug mode (borders)",
        fixed: "Fix on all pages",
        break: "Page break",
      },
      example: `<P><Strong>Bold</Strong>, <Em>Italic</Em>, <U>Underlined</U>, <Small>Small</Small></P>`,
    },
    Blockquote: {
      description: "Quote block",
      props: {
        style: "Additional styles",
        debug: "Debug mode (borders)",
        fixed: "Fix on all pages",
        break: "Page break",
      },
      example: `<Blockquote>A highlighted quote</Blockquote>`,
    },
    Mark: {
      description: "Highlighted text",
      props: {
        style: "Additional styles",
        debug: "Debug mode (borders)",
        fixed: "Fix on all pages",
        break: "Page break",
      },
      example: `<Mark>Highlighted text</Mark>`,
    },
    Span: {
      description: "Inline text container",
      props: {
        style: "Additional styles",
        debug: "Debug mode (borders)",
        fixed: "Fix on all pages",
        break: "Page break",
      },
      example: `<Span>Inline</Span>`,
    },
    BR: {
      description: "Line break",
      props: {
        style: "Additional styles",
        debug: "Debug mode (borders)",
        fixed: "Fix on all pages",
        break: "Page break",
      },
      example: `<P>Line 1</P>
<BR />
<P>Line 2</P>`,
    },
    HR: {
      description: "Horizontal dividing line",
      props: {
        style: "Additional styles",
        debug: "Debug mode (borders)",
        fixed: "Fix on all pages",
        break: "Page break",
      },
      example: `<HR />`,
    },
    A: {
      description: "Link",
      props: {
        href: "Link URL",
        style: "Additional styles",
        debug: "Debug mode (borders)",
        fixed: "Fix on all pages",
        break: "Page break",
      },
      example: `<A href="https://example.com">Go to site</A>`,
    },
  },
  table: {
    "Table (Tablet)": {
      description: "Complete table",
      props: { style: "Additional styles for the table" },
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
      description: "Table header",
      props: { style: "Additional styles" },
      example: `<Thead><Tr><Th>Column</Th></Tr></Thead>`,
    },
    Tbody: {
      description: "Table body",
      props: { style: "Additional styles" },
      example: `<Tbody><Tr><Td>Data</Td></Tr></Tbody>`,
    },
    Tr: {
      description: "Table row",
      props: { style: "Additional styles" },
      example: `<Tr><Td>A</Td><Td>B</Td></Tr>`,
    },
    Th: {
      description: "Header cell",
      props: {
        style: "Additional styles",
        width: "Cell width",
        height: "Cell height",
        colSpan: "Number of columns spanned",
        textAlign: "Text alignment (left, center, right)",
      },
      example: `<Th textAlign="center">Header</Th>`,
    },
    Td: {
      description: "Data cell",
      props: {
        style: "Additional styles",
        width: "Cell width",
        height: "Cell height",
        colSpan: "Number of columns spanned",
        textAlign: "Text alignment (left, center, right)",
      },
      example: `<Td textAlign="right">Data</Td>`,
    },
  },
  position: {
    Left: {
      description: "Aligns content to the left",
      props: { style: "Additional styles" },
      example: `<Left><P>Text to the left</P></Left>`,
    },
    Right: {
      description: "Aligns content to the right",
      props: { style: "Additional styles" },
      example: `<Right><P>Text to the right</P></Right>`,
    },
    Center: {
      description: "Centers the content",
      props: { style: "Additional styles" },
      example: `<Center><P>Centered text</P></Center>`,
    },
  },
  lists: {
    UL: {
      description: "Unordered list",
      props: {
        style: "Additional styles",
        type: "Bullet type (disc, circle, square)",
      },
      example: `<UL type="square">
  <LI>Item</LI>
  <LI>Item</LI>
</UL>`,
    },
    OL: {
      description: "Ordered list",
      props: {
        style: "Additional styles",
        type: "Numbering type (decimal, lower-alpha, upper-alpha, lower-roman, upper-roman)",
        start: "Starting number of the list",
      },
      example: `<OL type="upper-roman" start={3}>
  <LI>Item</LI>
  <LI>Item</LI>
</OL>`,
    },
    LI: {
      description: "List item",
      props: {
        style: "Additional styles",
        value: "Specific value for this item (OL only)",
      },
      example: `<LI value={10}>Specific value</LI>`,
    },
  },
  media: {
    Img: {
      description: "Image",
      props: {
        src: "Image URL",
        style: "Additional styles",
        debug: "Debug mode (borders)",
        fixed: "Fix on all pages",
        break: "Page break",
      },
      example: `<Img src="https://picsum.photos/400/200" style={{ width: 200 }} />`,
    },
    ImgBg: {
      description: "Background image with overlaid content",
      props: {
        src: "Background image URL",
        width: "Background width",
        height: "Background height",
        opacity: "Background opacity (0-1)",
        objectFit: "Image fit (cover, contain, fill, none, scale-down)",
        objectPosition: "Image position",
        fixed: "Fix on all pages",
        style: "Additional styles",
        debug: "Debug mode (borders)",
        break: "Page break",
      },
      example: `<ImgBg src="https://picsum.photos/600/400" opacity={0.3}>
  <P>Text over background image</P>
</ImgBg>`,
    },
    QR: {
      description: "QR code",
      props: {
        url: "Text or URL for the QR code",
        size: "Size in pixels",
        colorDark: "Color of dots",
        colorLight: "Background color",
        margin: "Margin around QR",
        errorCorrectionLevel: "Correction level (L, M, Q, H)",
        logo: "Logo image URL",
        logoWidth: "Logo width in pixels",
        logoHeight: "Logo height in pixels",
        debug: "Debug mode (borders)",
        fixed: "Fix on all pages",
        break: "Page break",
      },
      example: `<QR url="https://example.com" size={150} colorDark="#000" colorLight="#fff" logo="https://picsum.photos/80" logoWidth={30} logoHeight={30} />`,
    },
    QRstyle: {
      description: "Styled QR code (qr-code-styling) with central image support",
      props: {
        url: "Text or URL for the QR code",
        size: "QR size",
        image: "Central logo URL",
        dotsOptions: "Dots options (color, type)",
        backgroundOptions: "Background options",
        imageOptions: "Central image options",
        cornersSquareOptions: "Square corners options",
        cornersDotOptions: "Dot corners options",
        colorDark: "Dots color (fallback)",
        colorLight: "Background color (fallback)",
        margin: "Margin (fallback)",
        errorCorrectionLevel: "Error correction (fallback L, M, Q, H)",
        style: "Additional styles",
        debug: "Debug mode (borders)",
        fixed: "Fix on all pages",
        break: "Page break",
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
      description: "Page footer content in Layout",
      props: {
        footer: "Page footer content",
        footerLines: "Number of reserved lines",
      },
      example: `<Layout footer={<P>Footer</P>} footerLines={2}>
  <P>Content</P>
</Layout>`,
    },
  },
  fonts: {
    "Default Fonts": {
      description: "Fonts available without prior registration.",
      props: {},
      example: `// Courier, Courier-Bold, Courier-Oblique, Courier-BoldOblique
// Helvetica, Helvetica-Bold, Helvetica-Oblique, Helvetica-BoldOblique
// Times-Roman, Times-Bold, Times-Italic, Times-BoldItalic`,
    },
    "Font.register": {
      description: "Registers custom fonts. IMPORTANT: Must be remote URLs (https://) to ensure correct generation in all environments.",
      props: {
        family: "Font family name",
        fonts: "Array of fonts with src and properties",
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
