import { type TabId, type ComponentDoc } from "./types";

export const componentDocs_en: Record<TabId, ComponentDoc[]> = {
  layout: [
    {
      name: "Layout",
      description: "Main component for configuring the PDF document",
      props: [
        {
          name: "size",
          type: "string",
          default: "A4",
          description: "Page size (4A0-2A0, A0-A8, B0-B9, C0-C8, RA0-RA4, SRA0-SRA4, EXECUTIVE, FOLIO, LEGAL, LETTER, TABLOID, ID1)",
        },
        {
          name: "orientation",
          type: "string",
          default: "vertical",
          description: "Page orientation (vertical, horizontal)",
        },
        { name: "backgroundColor", type: "string", default: "white", description: "Page background color" },
        {
          name: "padding",
          type: "number",
          default: "30",
          description: "Internal page padding in points (only if margin=normal)",
        },
        {
          name: "margin",
          type: "string",
          default: "normal",
          description: "Margin type (apa, normal, narrow, wide)",
        },
        { name: "style", type: "object", default: "{}", description: "Additional styles for the page" },
        { name: "footer", type: "ReactNode", default: "", description: "Footer content" },
        { name: "footerLines", type: "number", default: "1", description: "Number of lines for the footer (1-10)" },
        { name: "pagination", type: "boolean", default: "true", description: "Show page numbering" },
        {
          name: "rule",
          type: "boolean",
          default: "false",
          description: "Show reference grid on the page",
        },
        {
          name: "meta",
          type: "object",
          default: "{}",
          description: "Metadata (title, author, subject, keywords, language, etc.)",
        },
      ],
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
    {
      name: "LayoutMultiPage",
      description: "Advanced container for multi-section (page) configurable PDFs",
      props: [
        { name: "size", type: "string", default: "A4", description: "Base page size" },
        { name: "orientation", type: "string", default: "vertical", description: "Base orientation" },
        { name: "backgroundColor", type: "string", default: "white", description: "Base background color" },
        { name: "padding", type: "number", default: "30", description: "Base padding" },
        {
          name: "margin",
          type: "string",
          default: "normal",
          description: "Base margin (apa, normal, narrow, wide)",
        },
        { name: "footer", type: "ReactNode", default: "", description: "Base page footer" },
        { name: "pagination", type: "boolean", default: "true", description: "Base numbering" },
        { name: "debug", type: "boolean", default: "false", description: "Base debug mode" },
      ],
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
    {
      name: "Section",
      description: "Represents an individual page within LayoutMultiPage",
      props: [
        { name: "backgroundColor", type: "string", default: "Inherited", description: "Background color of this page" },
        { name: "padding", type: "number", default: "Inherited", description: "Padding of this page" },
        { name: "margin", type: "string", default: "Inherited", description: "Margin of this page" },
        { name: "footer", type: "ReactNode", default: "Inherited", description: "Footer of this page" },
        { name: "pagination", type: "boolean", default: "Inherited", description: "Numbering on this page" },
        { name: "debug", type: "boolean", default: "Inherited", description: "Debug mode on this page" },
      ],
      example: `<Section backgroundColor="skyblue" padding={50}>
  <H1>Page Content</H1>
</Section>`,
    },
    {
      name: "Container",
      description: "Main container with horizontal padding",
      props: [
        { name: "style", type: "object", default: "{}", description: "Additional styles for the container" },
        { name: "debug", type: "boolean", default: "false", description: "Debug mode (borders)" },
        { name: "fixed", type: "boolean", default: "false", description: "Fix on all pages" },
        { name: "break", type: "boolean", default: "false", description: "Page break" },
      ],
      example: `<Container>
  <Row>
    <Col6><P>Column 1</P></Col6>
    <Col6><P>Column 2</P></Col6>
  </Row>
</Container>`,
    },
    {
      name: "Row",
      description: "Row for the grid system",
      props: [
        { name: "style", type: "object", default: "{}", description: "Additional styles for the row" },
        { name: "debug", type: "boolean", default: "false", description: "Debug mode (borders)" },
        { name: "fixed", type: "boolean", default: "false", description: "Fix on all pages" },
        { name: "break", type: "boolean", default: "false", description: "Page break" },
      ],
      example: `<Row>
  <Col4><P>A</P></Col4>
  <Col4><P>B</P></Col4>
  <Col4><P>C</P></Col4>
</Row>`,
    },
    {
      name: "Col1-Col12",
      description: "Columns for the grid system (1 to 12 units)",
      props: [
        { name: "style", type: "object", default: "{}", description: "Additional styles for the column" },
        { name: "debug", type: "boolean", default: "false", description: "Debug mode (borders)" },
        { name: "fixed", type: "boolean", default: "false", description: "Fix on all pages" },
        { name: "break", type: "boolean", default: "false", description: "Page break" },
      ],
      example: `<Col12><P>Full width content</P></Col12>`,
    },
    {
      name: "Div",
      description: "Generic container to group elements",
      props: [
        { name: "style", type: "object", default: "{}", description: "Additional styles" },
        { name: "debug", type: "boolean", default: "false", description: "Debug mode (borders)" },
        { name: "fixed", type: "boolean", default: "false", description: "Fix on all pages" },
        { name: "break", type: "boolean", default: "false", description: "Page break" },
      ],
      example: `<Div style={{ padding: 10 }}>
  <P>Block with padding</P>
</Div>`,
    },
  ],
  text: [
    {
      name: "P, H1-H6",
      description: "Text components (paragraph, headings)",
      props: [
        { name: "style", type: "object", default: "{}", description: "Additional text styles" },
        { name: "debug", type: "boolean", default: "false", description: "Debug mode (borders)" },
        { name: "fixed", type: "boolean", default: "false", description: "Fix on all pages" },
        { name: "break", type: "boolean", default: "false", description: "Page break" },
      ],
      example: `<H1>Title</H1>
<H3>Subtitle</H3>
<P>Paragraph</P>`,
    },
    {
      name: "Strong, Em, U, Small",
      description: "Text formatting components",
      props: [
        { name: "style", type: "object", default: "{}", description: "Additional styles" },
        { name: "debug", type: "boolean", default: "false", description: "Debug mode (borders)" },
        { name: "fixed", type: "boolean", default: "false", description: "Fix on all pages" },
        { name: "break", type: "boolean", default: "false", description: "Page break" },
      ],
      example: `<P><Strong>Bold</Strong>, <Em>Italic</Em>, <U>Underlined</U>, <Small>Small</Small></P>`,
    },
    {
      name: "Blockquote",
      description: "Quote block",
      props: [
        { name: "style", type: "object", default: "{}", description: "Additional styles" },
        { name: "debug", type: "boolean", default: "false", description: "Debug mode (borders)" },
        { name: "fixed", type: "boolean", default: "false", description: "Fix on all pages" },
        { name: "break", type: "boolean", default: "false", description: "Page break" },
      ],
      example: `<Blockquote>A highlighted quote</Blockquote>`,
    },
    {
      name: "Mark",
      description: "Highlighted text",
      props: [
        { name: "style", type: "object", default: "{}", description: "Additional styles" },
        { name: "debug", type: "boolean", default: "false", description: "Debug mode (borders)" },
        { name: "fixed", type: "boolean", default: "false", description: "Fix on all pages" },
        { name: "break", type: "boolean", default: "false", description: "Page break" },
      ],
      example: `<Mark>Highlighted text</Mark>`,
    },
    {
      name: "Span",
      description: "Inline text container",
      props: [
        { name: "style", type: "object", default: "{}", description: "Additional styles" },
        { name: "debug", type: "boolean", default: "false", description: "Debug mode (borders)" },
        { name: "fixed", type: "boolean", default: "false", description: "Fix on all pages" },
        { name: "break", type: "boolean", default: "false", description: "Page break" },
      ],
      example: `<Span>Inline</Span>`,
    },
    {
      name: "BR",
      description: "Line break",
      props: [
        { name: "style", type: "object", default: "{}", description: "Additional styles" },
        { name: "debug", type: "boolean", default: "false", description: "Debug mode (borders)" },
        { name: "fixed", type: "boolean", default: "false", description: "Fix on all pages" },
        { name: "break", type: "boolean", default: "false", description: "Page break" },
      ],
      example: `<P>Line 1</P>
<BR />
<P>Line 2</P>`,
    },
    {
      name: "HR",
      description: "Horizontal dividing line",
      props: [
        { name: "style", type: "object", default: "{}", description: "Additional styles" },
        { name: "debug", type: "boolean", default: "false", description: "Debug mode (borders)" },
        { name: "fixed", type: "boolean", default: "false", description: "Fix on all pages" },
        { name: "break", type: "boolean", default: "false", description: "Page break" },
      ],
      example: `<HR />`,
    },
    {
      name: "A",
      description: "Link",
      props: [
        { name: "href", type: "string", default: "", description: "Link URL" },
        { name: "style", type: "object", default: "{}", description: "Additional styles" },
        { name: "debug", type: "boolean", default: "false", description: "Debug mode (borders)" },
        { name: "fixed", type: "boolean", default: "false", description: "Fix on all pages" },
        { name: "break", type: "boolean", default: "false", description: "Page break" },
      ],
      example: `<A href="https://example.com">Go to site</A>`,
    },
  ],
  table: [
    {
      name: "Table (Tablet)",
      description: "Complete table",
      props: [{ name: "style", type: "object", default: "{}", description: "Additional styles for the table" }],
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
      description: "Table header",
      props: [{ name: "style", type: "object", default: "{}", description: "Additional styles" }],
      example: `<Thead><Tr><Th>Column</Th></Tr></Thead>`,
    },
    {
      name: "Tbody",
      description: "Table body",
      props: [{ name: "style", type: "object", default: "{}", description: "Additional styles" }],
      example: `<Tbody><Tr><Td>Data</Td></Tr></Tbody>`,
    },
    {
      name: "Tr",
      description: "Table row",
      props: [{ name: "style", type: "object", default: "{}", description: "Additional styles" }],
      example: `<Tr><Td>A</Td><Td>B</Td></Tr>`,
    },
    {
      name: "Th",
      description: "Header cell",
      props: [
        { name: "style", type: "object", default: "{}", description: "Additional styles" },
        { name: "width", type: "string|number", default: "", description: "Cell width" },
        { name: "height", type: "string|number", default: "", description: "Cell height" },
        { name: "colSpan", type: "number", default: "", description: "Number of columns spanned" },
        {
          name: "textAlign",
          type: "string",
          default: "left",
          description: "Text alignment (left, center, right)",
        },
      ],
      example: `<Th textAlign="center">Header</Th>`,
    },
    {
      name: "Td",
      description: "Data cell",
      props: [
        { name: "style", type: "object", default: "{}", description: "Additional styles" },
        { name: "width", type: "string|number", default: "", description: "Cell width" },
        { name: "height", type: "string|number", default: "", description: "Cell height" },
        { name: "colSpan", type: "number", default: "", description: "Number of columns spanned" },
        {
          name: "textAlign",
          type: "string",
          default: "left",
          description: "Text alignment (left, center, right)",
        },
      ],
      example: `<Td textAlign="right">Data</Td>`,
    },
  ],
  position: [
    {
      name: "Left",
      description: "Aligns content to the left",
      props: [{ name: "style", type: "object", default: "{}", description: "Additional styles" }],
      example: `<Left><P>Text to the left</P></Left>`,
    },
    {
      name: "Right",
      description: "Aligns content to the right",
      props: [{ name: "style", type: "object", default: "{}", description: "Additional styles" }],
      example: `<Right><P>Text to the right</P></Right>`,
    },
    {
      name: "Center",
      description: "Centers the content",
      props: [{ name: "style", type: "object", default: "{}", description: "Additional styles" }],
      example: `<Center><P>Centered text</P></Center>`,
    },
  ],
  lists: [
    {
      name: "UL",
      description: "Unordered list",
      props: [
        { name: "style", type: "object", default: "{}", description: "Additional styles" },
        { name: "type", type: "string", default: "disc", description: "Bullet type (disc, circle, square)" },
      ],
      example: `<UL type="square">
  <LI>Item</LI>
  <LI>Item</LI>
</UL>`,
    },
    {
      name: "OL",
      description: "Ordered list",
      props: [
        { name: "style", type: "object", default: "{}", description: "Additional styles" },
        {
          name: "type",
          type: "string",
          default: "decimal",
          description: "Numbering type (decimal, lower-alpha, upper-alpha, lower-roman, upper-roman)",
        },
        { name: "start", type: "number", default: "1", description: "Starting number of the list" },
      ],
      example: `<OL type="upper-roman" start={3}>
  <LI>Item</LI>
  <LI>Item</LI>
</OL>`,
    },
    {
      name: "LI",
      description: "List item",
      props: [
        { name: "style", type: "object", default: "{}", description: "Additional styles" },
        {
          name: "value",
          type: "number|string",
          default: "",
          description: "Specific value for this item (OL only)",
        },
      ],
      example: `<LI value={10}>Specific value</LI>`,
    },
  ],
  media: [
    {
      name: "Img",
      description: "Image",
      props: [
        { name: "src", type: "string", default: "", description: "Image URL" },
        { name: "style", type: "object", default: "{}", description: "Additional styles" },
        { name: "debug", type: "boolean", default: "false", description: "Debug mode (borders)" },
        { name: "fixed", type: "boolean", default: "false", description: "Fix on all pages" },
        { name: "break", type: "boolean", default: "false", description: "Page break" },
      ],
      example: `<Img src="https://picsum.photos/400/200" style={{ width: 200 }} />`,
    },
    {
      name: "ImgBg",
      description: "Background image with overlaid content",
      props: [
        { name: "src", type: "string", default: "", description: "Background image URL" },
        { name: "width", type: "number|string", default: "100%", description: "Background width" },
        { name: "height", type: "number|string", default: "100%", description: "Background height" },
        { name: "opacity", type: "number", default: "0.2", description: "Background opacity (0-1)" },
        {
          name: "objectFit",
          type: "string",
          default: "cover",
          description: "Image fit (cover, contain, fill, none, scale-down)",
        },
        { name: "objectPosition", type: "string", default: "center", description: "Image position" },
        { name: "fixed", type: "boolean", default: "false", description: "Fix on all pages" },
        { name: "style", type: "object", default: "{}", description: "Additional styles" },
        { name: "debug", type: "boolean", default: "false", description: "Debug mode (borders)" },
        { name: "break", type: "boolean", default: "false", description: "Page break" },
      ],
      example: `<ImgBg src="https://picsum.photos/600/400" opacity={0.3}>
  <P>Text over background image</P>
</ImgBg>`,
    },
    {
      name: "QR",
      description: "QR code",
      props: [
        { name: "url", type: "string", default: "", description: "Text or URL for the QR code" },
        { name: "size", type: "number", default: "150", description: "Size in pixels" },
        { name: "colorDark", type: "string", default: "#000000", description: "Color of dots" },
        { name: "colorLight", type: "string", default: "#ffffff", description: "Background color" },
        { name: "margin", type: "number", default: "0", description: "Margin around QR" },
        {
          name: "errorCorrectionLevel",
          type: "string",
          default: "M",
          description: "Correction level (L, M, Q, H)",
        },
        { name: "logo", type: "string", default: "", description: "Logo image URL" },
        { name: "logoWidth", type: "number", default: "30", description: "Logo width in pixels" },
        { name: "logoHeight", type: "number", default: "30", description: "Logo height in pixels" },
        { name: "debug", type: "boolean", default: "false", description: "Debug mode (borders)" },
        { name: "fixed", type: "boolean", default: "false", description: "Fix on all pages" },
        { name: "break", type: "boolean", default: "false", description: "Page break" },
      ],
      example: `<QR url="https://example.com" size={150} colorDark="#000" colorLight="#fff" logo="https://picsum.photos/80" logoWidth={30} logoHeight={30} />`,
    },
    {
      name: "QRstyle",
      description: "Styled QR code (qr-code-styling) with central image support",
      props: [
        { name: "url", type: "string", default: "", description: "Text or URL for the QR code" },
        { name: "size", type: "number", default: "300", description: "QR size" },
        { name: "image", type: "string", default: "", description: "Central logo URL" },
        { name: "dotsOptions", type: "object", default: "{}", description: "Dots options (color, type)" },
        {
          name: "backgroundOptions",
          type: "object",
          default: "{ color: #ffffff }",
          description: "Background options",
        },
        {
          name: "imageOptions",
          type: "object",
          default: "{ margin: 0, imageSize: 0.4 }",
          description: "Central image options",
        },
        {
          name: "cornersSquareOptions",
          type: "object",
          default: "{}",
          description: "Square corners options",
        },
        { name: "cornersDotOptions", type: "object", default: "{}", description: "Dot corners options" },
        { name: "colorDark", type: "string", default: "", description: "Dots color (fallback)" },
        { name: "colorLight", type: "string", default: "", description: "Background color (fallback)" },
        { name: "margin", type: "number", default: "0", description: "Margin (fallback)" },
        {
          name: "errorCorrectionLevel",
          type: "string",
          default: "M",
          description: "Error correction (fallback L, M, Q, H)",
        },
        { name: "style", type: "object", default: "{}", description: "Additional styles" },
        { name: "debug", type: "boolean", default: "false", description: "Debug mode (borders)" },
        { name: "fixed", type: "boolean", default: "false", description: "Fix on all pages" },
        { name: "break", type: "boolean", default: "false", description: "Page break" },
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
      name: "Page Footer (Layout.footer)",
      description: "Page footer content in Layout",
      props: [
        { name: "footer", type: "ReactNode", default: "", description: "Page footer content" },
        { name: "footerLines", type: "number", default: "1", description: "Number of reserved lines" },
      ],
      example: `<Layout footer={<P>Footer</P>} footerLines={2}>
  <P>Content</P>
</Layout>`,
    },
  ],
  fonts: [
    {
      name: "Default Fonts",
      description: "Fonts available without prior registration.",
      props: [],
      example: `// Courier, Courier-Bold, Courier-Oblique, Courier-BoldOblique
// Helvetica, Helvetica-Bold, Helvetica-Oblique, Helvetica-BoldOblique
// Times-Roman, Times-Bold, Times-Italic, Times-BoldItalic`,
    },
    {
      name: "Font.register",
      description: "Registers custom fonts. IMPORTANT: Must be remote URLs (https://) to ensure correct generation in all environments.",
      props: [
        { name: "family", type: "string", default: "", description: "Font family name" },
        { name: "fonts", type: "object[]", default: "[]", description: "Array of fonts with src and properties" },
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
