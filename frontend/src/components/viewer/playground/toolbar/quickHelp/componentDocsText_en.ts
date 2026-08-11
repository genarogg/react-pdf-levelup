import { type TabId } from "./types";

export const componentDocsText_en: Record<TabId, Record<string, { description?: string; props: Record<string, string>; example?: string }>> = {
  layout: {
    Layout: {
      description:
        "Structural core of the PDF document. Manages page size, orientation, predefined margins, color or image background, automatic numbering, reference grid and debug mode.",
      props: {
        size: 'Page size: a preset (4A0-2A0, A0-A8, B0-B9, C0-C8, RA0-RA4, SRA0-SRA4, EXECUTIVE, FOLIO, LEGAL, LETTER, TABLOID, ID1) or a {width, height} object in points. Invalid value falls back to "A4"',
        orientation: "Page orientation (vertical, horizontal, portrait, landscape, h, v). Internally transformed to portrait/landscape",
        backgroundColor: "Page background color",
        backgroundImage: "URL of a background image covering the whole page",
        backgroundImageOpacity: "Opacity of the background image (0–1)",
        padding: 'Base padding when margin="normal"',
        margin: "Margin system: preset (apa, normal, estrecho/narrow, ancho/wide) or a number in points for all 4 sides",
        style: "Additional styles for the page",
        footerLines: "Number of lines reserved at the bottom (used by the pagination container to avoid overlapping content)",
        pagination: "Shows automatic page numbering",
        paginationStyle: "Additional styles for the pagination Text inside the footer",
        rule: "Shows a centimeter reference grid",
        debug: "Enables @react-pdf/renderer debug mode",
        dpi: "Page DPI resolution (passed directly to Page dpi)",
        id: "HTML/CSS ID of the underlying Page element",
        meta: "Document metadata (title, author, keywords, passwords, permissions, etc.)",
      },
      example: `const MyDocument = () => (
  <Layout
    size="A4"
    margin="apa"
    backgroundColor="#ffffff"
    pagination
    paginationStyle={{ fontSize: 10, color: '#666' }}
    meta={{ title: 'My PDF', author: 'Genaro' }}
  >
    <H1>Title</H1>
  </Layout>
);

export default MyDocument;`,
    },
    LayoutMultiPage: {
      description:
        "Advanced alternative to Layout: instead of a continuous flow that auto-splits, it lets you explicitly define each page with Section and configure properties per page.",
      props: {
        size: "Base page size (preset or {width, height} in points)",
        orientation: "Base page orientation",
        backgroundColor: "Base background color",
        backgroundImage: "Base background image for all pages",
        backgroundImageOpacity: "Base background image opacity",
        padding: "Base page padding",
        margin: "Base margin setting (preset or number in points)",
        footerLines: "Space reserved for the footer, in lines (used by the pagination container)",
        pagination: "Show base page numbering",
        paginationStyle: "Additional styles for the pagination Text inside the footer",
        rule: "Show base reference grid",
        debug: "Enable base debug mode",
        meta: "Document metadata (title, author, passwords, permissions, etc.)",
      },
      example: `const MyMultiPageDocument = () => (
  <LayoutMultiPage backgroundColor="#eee" footerLines={1}>
    <Section>
      <H1>Page 1</H1>
    </Section>
    <Section backgroundColor="white" pagination={false}>
      <H1>Page 2 (White, no numbering)</H1>
    </Section>
  </LayoutMultiPage>
);

export default MyMultiPageDocument;`,
    },
    Section: {
      description:
        "Represents an individual page within a LayoutMultiPage. Inherits the global properties from its parent, but allows overriding them to create unique pages.",
      props: {
        style: "Additional styles for the page",
        backgroundColor: "Overrides the background color for this page",
        backgroundImage: "Overrides the background image for this page",
        backgroundImageOpacity: "Overrides the background image opacity",
        padding: "Overrides the padding for this page",
        margin: "Overrides the margin preset or a number in points",
        footerLines: "Overrides the space reserved for the footer (in lines)",
        pagination: "Enables/disables numbering on this page",
        paginationStyle: "Overrides the pagination Text styles",
        rule: "Enables/disables the grid on this page",
        debug: "Enables/disables debug mode on this page",
        dpi: "Specific DPI resolution for this page",
        id: "HTML/CSS ID of the Page element for this Section",
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
      description:
        "Inline text formatting components: Strong (bold), Em (italic), U (underline), Small (smaller)",
      props: {
        style: "Additional styles",
        color: "Color applied to U's underline",
        debug: "Debug mode (borders)",
        fixed: "Fix on all pages",
        break: "Page break",
      },
      example: `<P><Strong>Bold</Strong>, <Em>Italic</Em>, <U color="red">Red underline</U>, <Small>Small</Small></P>`,
    },
    Blockquote: {
      description: "Quote block to highlight important text",
      props: {
        style: "Additional styles",
        color: "Color for the quote's left border",
        debug: "Debug mode (borders)",
        fixed: "Fix on all pages",
        break: "Page break",
      },
      example: `<Blockquote color="blue">A highlighted quote with a blue border</Blockquote>`,
    },
    Mark: {
      description: "Highlighted text (like a marker)",
      props: {
        style: "Additional styles",
        color: "Background color for the highlight",
        debug: "Debug mode (borders)",
        fixed: "Fix on all pages",
        break: "Page break",
      },
      example: `<Mark color="lime">Highlighted text in lime</Mark>`,
    },
    Span: {
      description: "Generic inline text container",
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
        href: "Link URL (preferred)",
        src: "Link URL (compatibility). If href is not provided, src is used",
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
      description:
        "Main container. Injects a shared context (colors, sizes, grid mode) and controls borders/rounded corners and manual pagination via rowsPerPage.",
      props: {
        style:
          "Additional styles for the outer container. If it includes an explicit borderRadius, it activates the border-radius bug workaround (issue #395 of @react-pdf/renderer)",
        cellHeight: "Default minimum height (minHeight) for cells that don't declare their own height",
        borderColor: "Color of the outer border and inner grid",
        textColor: "Default text color for the whole table (can be overridden by Thead, Tbody or each individual cell)",
        headerBackground: "Background color of the header container (Thead)",
        zebra: "Enables the zebra pattern (odd rows with alternating background). Only affects Td",
        zebraColor: "Background color used for odd rows when zebra is true",
        grid: 'Inner grid style: "grid" (full borders), "modern" (only bottom borders), "not-grid" (no inner borders)',
        borderRadiusMethod:
          '"view" simulates the border with an outer padding View; "svg" (default) draws the outline with an overlaid SVG stroke and allows a transparent interior',
        rowsPerPage:
          "Splits the Tbody into several independent tables, one per batch of rows, repeating the Thead in each one",
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
      <Th>Product</Th>
      <Th textAlign="right">Price</Th>
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
        "Header section. Renders a View with backgroundColor: headerBackground from context, rounds the top corners when the border-radius fix is active, and overrides textAlign, borderColor and textColor for its descendants.",
      props: {
        style: "Additional styles for the header container",
        textAlign: "Default alignment for header cells (overrides Table)",
        borderColor: "Overrides the borderColor inherited from Table for this Thead",
        textColor: "Overrides the textColor inherited from Table for this Thead",
      },
      example: `<Thead textAlign="center" textColor="#fff" borderColor="#4338ca">
  <Tr>
    <Th>Name</Th>
    <Th>Age</Th>
  </Tr>
</Thead>`,
    },
    Tbody: {
      description:
        "Body section. For each Tr it contains, it injects isLastRow (last row) and isOdd (odd row, for zebra) via cloneElement, and propagates any extra prop to each Tr.",
      props: {
        borderColor: "Overrides the context borderColor for this Tbody",
        textColor: "Overrides the context textColor for this Tbody",
      },
      example: `<Tbody>
  <Tr><Td>Row 1</Td></Tr>
  <Tr><Td>Row 2</Td></Tr>
</Tbody>`,
    },
    Tr: {
      description:
        "Table row (inside Thead or Tbody). Calculates the real width of each cell: sums the colSpan units of the row and distributes the percentage width among cells that don't have a manual width.",
      props: {
        style: "Additional styles for the row's View",
        isLastRow: "Indicates whether this is the last row of the Tbody. Injected by Tbody, can be set manually for a standalone Tr",
        isOdd: "Indicates whether this is an odd row (for zebra). Injected by Tbody",
      },
      example: `<Tr><Td>A</Td><Td>B</Td></Tr>`,
    },
    Th: {
      description:
        "Header cell. Uses bold styling and never applies zebra or rounds bottom corners.",
      props: {
        style: "Additional cell styles",
        width: 'Explicit cell width ("100%", "120px", or a number = points). If not provided, it\'s calculated proportionally by colSpan',
        height: "Minimum cell height (minHeight). If not provided, uses the cellHeight from context",
        colSpan: "Number of columns the cell spans (only affects width, there's no real cell merging)",
        textAlign: "Text alignment. Precedence: explicit value → Thead/context → left by default",
        text: "If true (default), the content is wrapped in a Text. Set it to false when children is a View-based component (e.g. a Badge)",
      },
      example: `<Th textAlign="center" width="20%">Header</Th>`,
    },
    Td: {
      description:
        "Data cell. Applies zebra if zebra && isOdd, and rounds the bottom corners of the last row when there's a borderRadius.",
      props: {
        style: "Additional cell styles",
        width: 'Explicit cell width ("100%", "120px", or a number = points). If not provided, it\'s calculated proportionally by colSpan',
        height: "Minimum cell height (minHeight). If not provided, uses the cellHeight from context",
        colSpan: "Number of columns the cell spans (only affects width, there's no real cell merging)",
        textAlign: "Text alignment. Precedence: explicit value → Thead/context → left by default",
        text: "If true (default), the content is wrapped in a Text. Set it to false when children is a View-based component (e.g. a Badge)",
      },
      example: `<Td textAlign="right">$ 29.99</Td>

// Cell with a View-based component (requires text={false}):
<Td text={false}>
  <Badge color="#ef4444">LOW</Badge>
</Td>`,
    },
  },
  position: {
    Left: {
      description: "Aligns content to the left (alignItems: flex-start)",
      props: {
        style: "Additional styles (merged at the end)",
        vertical: "If true, also centers vertically (justifyContent: center). Useful for content with known height",
      },
      example: `<Left><P>Text to the left</P></Left>`,
    },
    Right: {
      description: "Aligns content to the right (alignItems: flex-end)",
      props: {
        style: "Additional styles (merged at the end)",
        vertical: "If true, also centers vertically (justifyContent: center). Useful for content with known height",
      },
      example: `<Right><P>Text to the right</P></Right>`,
    },
    Center: {
      description: "Centers the content horizontally (alignItems: center)",
      props: {
        style: "Additional styles (merged at the end)",
        vertical: "If true, also centers vertically (justifyContent: center). Useful for content with known height",
      },
      example: `<Div style={{ height: 120 }}>
  <Center vertical>
    <P>Horizontally and vertically centered</P>
  </Center>
</Div>`,
    },
  },
  lists: {
    UL: {
      description: "Unordered list. Container for LI elements with bullets",
      props: {
        style: "Additional styles for the container",
        type: "Bullet type: disc, circle, square (SVG) or none. Strictly typed (UlBulletType)",
        fontSize: "Font size for bullets and LI text (can be overridden per LI)",
        bulletColor: "Bullet color (can be overridden per LI)",
      },
      example: `<UL type="square" bulletColor="#4338ca">
  <LI>Item 1</LI>
  <LI>Item 2</LI>
</UL>`,
    },
    OL: {
      description: "Ordered list. Container for LI elements with automatic numbering",
      props: {
        style: "Additional styles for the container",
        type: "Numbering type: decimal, lower-alpha, upper-alpha, lower-roman, upper-roman or none. Strictly typed (OlBulletType)",
        start: "Starting number (or equivalent) of the sequence",
        fontSize: "Font size for markers and LI text (can be overridden per LI)",
        bulletColor: "Numeric marker color (can be overridden per LI)",
      },
      example: `<OL type="upper-roman" start={3} fontSize={12}>
  <LI>Item III</LI>
  <LI>Item IV</LI>
</OL>`,
    },
    LI: {
      description:
        "List item. Must be used inside UL or OL. Inherits bulletType, isOrdered, index, start, fontSize and bulletColor from the parent, or can be declared standalone and override those values",
      props: {
        style: "Additional styles for the item container",
        bulletType: "Bullet/marker type. Inherited from UL/OL (receives UlBulletType or OlBulletType depending on parent)",
        isOrdered: "Indicates whether it's rendered as numbered. Inherited from UL/OL",
        index: "Position (1-based) within the list. Inherited from UL/OL",
        start: "Starting value of the sequence (ordered lists only). Inherited from OL",
        fontSize: "Font size for the bullet/marker and the contained text (if children is a string)",
        bulletColor: "Bullet/marker color",
      },
      example: `// Inside a list
<UL type="circle">
  <LI bulletColor="red">Red item</LI>
</UL>

// Standalone use (without UL/OL)
<LI bulletType="disc" isOrdered={false} index={1} bulletColor="#22C55E">
  Item with green bullet
</LI>`,
    },
  },
  media: {
    Img: {
      description:
        "Image. Supports all properties of @react-pdf/renderer's Image component. Defaults to width: 100% and height: auto",
      props: {
        src: "Image URL or path",
        style: "Additional styles",
        width: "Image width",
        height: "Image height",
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
  advanced: {
    Badge: {
      description:
        "Styled badge with predefined color variants and sizes. Combines a container View with a styled Text, so inside a Td it requires text={false}.",
      props: {
        variant: "Predefined color variant (default, active, pending, cancelled, success, warning, error, info)",
        size: "Badge size: sm, md or lg (affects padding)",
        style: "Additional styles for the outer container View",
      },
      example: `<Badge variant="success" size="md">In stock</Badge>

// Inside a table it requires text={false}:
<Td text={false}>
  <Badge variant="error">Out of stock</Badge>
</Td>`,
    },
    Button: {
      description:
        "Styled button with color variants and sizes. Supports links (href) and a disabled state. The outline variant simulates the border with a padding ring (assumes a white background).",
      props: {
        variant: "Color variant: primary, secondary, success, danger or outline",
        size: "Predefined size: sm, md or lg (affects padding and fontSize)",
        disabled: "Disables the button (dimmed colors, ignores href)",
        href: "If provided and disabled is false, renders as a link (Link)",
        width: 'Explicit button width (number in points or string "100%")',
        height: "Explicit button height",
        style: "Additional styles for the outer container (overrides base styles)",
        textStyle: "Additional styles for the button's inner text",
      },
      example: `<Button variant="primary" size="md">Accept</Button>

<Button variant="outline" size="sm" href="https://example.com">
  Learn more
</Button>`,
    },
    Divider: {
      description:
        "Divider line with a centered text label between two lines, useful for separating sections. Uses alignSelf: stretch, so width defaults to 100% (needed so the lines don't shrink to 0 inside a centering parent).",
      props: {
        label: "Text of the centered label (required, shown uppercase)",
        variant: "Line style: line (solid), dashed or dotted",
        color: "Color of the divider line",
        textColor: "Color of the label text",
        fontSize: "Label font size",
        marginVertical: "Top and bottom margin of the component",
        width: "Total width of the Divider (defaults to full available width)",
        style: "Additional styles for the outer container",
      },
      example: `<Divider label="Section 2" variant="dashed" color="#6366f1" />`,
    },
    Gradiant: {
      description:
        "Linear or radial gradient for PDF documents, with support for custom colors, angle (linear) and shape (square or circle).",
      props: {
        colors:
          'Gradient colors: array of strings (["#fff","#000"]) or of {color, offset} objects (required)',
        width: "Width of the gradient block",
        height: "Height of the gradient block",
        type: "Gradient type: linear or radial",
        shape: "Container shape: square or circle",
        angle: "Angle of the linear gradient in degrees (0 = left→right, 90 = top→bottom)",
        style: "Additional styles for the main container",
      },
      example: `<Gradiant colors={["#FF6B6B", "#4ECDC4"]} width={300} height={100}>
  <P style={{ color: "white" }}>Hello World</P>
</Gradiant>`,
    },
    Pass: {
      description:
        'Null placeholder (equivalent to Python\'s "pass"): renders nothing, accepts no children. Exists to satisfy required-children contracts or mark pending spots in the tree.',
      props: {},
      example: `<Section>
  <H1>Signatures</H1>
  <Pass />  {/* temporary stub: replace once real content exists */}
</Section>`,
    },
    Graph: {
      description:
        "Native SVG vector charts (bar, line, area, pie, donut), no canvas or Chart.js. Axis and label text is real, searchable, copyable text.",
      props: {
        variant: "Chart type: bar, horizontal-bar, line, area, pie or donut (required)",
        series: "Chart data, one or more series. Pie/Donut use only series[0] (required)",
        width: "Total width of the Svg in viewBox units (must be a number)",
        height: "Total height of the Svg in viewBox units (must be a number)",
        title: "Chart title above the graph",
        subtitle: "Subtitle below the title",
        colors: "Alternative color palette (one per series or slice)",
        showLegend: "Shows/hides the legend row below the chart",
        showValues: "Shows/hides the numeric value over each bar or slice",
        showDots: "Line/area only: draws a circle at each valid point",
        smooth: "Line/area only: smooths the curve with Catmull-Rom splines",
        yTickCount: "Approximate number of ticks on the value axis",
        style: "Additional styles for the outer container View (not the Svg)",
      },
      example: `<Graph
  variant="bar"
  width={500}
  height={300}
  title="Sales by region"
  showValues
  series={[
    { name: "2026", data: [
      { label: "North", value: 120 },
      { label: "South", value: 150 },
    ]},
  ]}
/>`,
    },
    Form: {
      description:
        "Container for all form fields (Input, TextArea, Checkbox), providing a shared style context.",
      props: {
        style: "Additional styles for the form container",
        borderColor: "Border color for form fields",
        borderRadius: "Border radius for form fields",
        labelColor: "Label text color",
        textColor: "General text color inside the form",
      },
      example: `<Form borderColor="#FF0000" borderRadius={10}>
  <Input label="Name" required />
  <TextArea label="Comments" />
  <Checkbox label="I accept the terms" />
</Form>`,
    },
    Input: {
      description: "Single-line text input field.",
      props: {
        label: "Label for the input field",
        placeholder: "Placeholder text",
        required: "Indicates whether the field is required",
        width: "Width of the input field",
        height: "Minimum height of the input field",
        style: "Additional styles for the field container",
        labelStyle: "Additional styles for the label",
      },
      example: `<Input label="Full Name" placeholder="Enter your name" required width="50%" />`,
    },
    TextArea: {
      description: "Multi-line text input field.",
      props: {
        label: "Label for the text field",
        placeholder: "Placeholder text",
        required: "Indicates whether the field is required",
        width: "Width of the text field",
        height: "Height of the text field",
        style: "Additional styles for the field container",
        labelStyle: "Additional styles for the label",
      },
      example: `<TextArea label="Comments" placeholder="Write your comments here..." height={100} />`,
    },
    Checkbox: {
      description: "Checkbox for boolean selections.",
      props: {
        label: "Label for the checkbox",
        checked: "Indicates whether the checkbox is checked",
        style: "Additional styles for the checkbox container",
        labelStyle: "Additional styles for the checkbox label",
      },
      example: `<Checkbox label="I accept the terms and conditions" checked={true} />`,
    },
  },
};
