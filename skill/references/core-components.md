# Core Components Reference (`@react-pdf-levelup/core`)

Full prop tables for every component and function under react-pdf-levelup's `components` and `functions` sections. Source: https://react-pdf-levelup.nimbux.cloud/docs/en/get-started

## Table of contents
- [Layout](#layout)
- [LayoutMultiPage & Section](#layoutmultipage--section)
- [Grid: Container / Row / Col1–Col12](#grid-container--row--col1col12)
- [Text family](#text-family)
- [Media: Img / ImgBg](#media-img--imgbg)
- [Position: Left / Right / Center](#position-left--right--center)
- [Table family](#table-family)
- [Lists: UL / OL / LI](#lists-ul--ol--li)
- [Form family](#form-family)
- [Font management](#font-management)
- [generatePDF & decodeBase64Pdf](#generatepdf--decodebase64pdf)
- [REST API (no-JS-runtime fallback)](#rest-api-no-js-runtime-fallback)
- [Base @react-pdf/renderer properties that flow through everything](#base-react-pdfrenderer-properties-that-flow-through-everything)

---

## Layout

The structural core of a document — wraps `<Document>` and `<Page>` internally, and automatically manages page size, orientation, margins, background, footer, and numbering.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `size` | paper size enum (`"A4"`, `"LETTER"`, `"LEGAL"`, `"TABLOID"`, ISO A/B/C series, `"EXECUTIVE"`, `"FOLIO"`, `"ID1"`, etc) | `"A4"` | |
| `orientation` | `"vertical"` \| `"horizontal"` \| `"portrait"` \| `"landscape"` \| `"h"` \| `"v"` | `"vertical"` | normalized internally to portrait/landscape |
| `backgroundColor` | string | `"white"` | |
| `backgroundImage` | string (URL) | `undefined` | must be an absolute `https://` URL |
| `backgroundImageOpacity` | number 0–1 | `1` | |
| `padding` | number | `30` | only applied when `margin="normal"` |
| `margin` | `"apa"` \| `"normal"` \| `"estrecho"` \| `"ancho"` | `"normal"` | preset system, see below |
| `style` | object | `{}` | does not override the automatic footer space reservation |
| `footer` | ReactNode | `undefined` | |
| `footerLines` | number | `2` (if `footer` set) | reserved lines of footer space |
| `pagination` | boolean | `true` | automatic page numbering |
| `rule` | boolean | `false` | shows a centimeter reference grid — handy while laying out a design |
| `debug` | boolean | `false` | `@react-pdf/renderer` debug bounding boxes |
| `meta` | `DocumentMeta` object | `{}` | see Document Metadata below |

### Margin presets
Note the preset names mix English and Spanish — this is native to the library, not a typo:
- `normal` — uses the `padding` prop value
- `estrecho` ("narrow") — 36pt on all sides
- `ancho` ("wide") — 108pt on all sides
- `apa` — 72pt (1 inch) on all sides, meant for academic documents

### Document metadata (`meta`)
`title`, `author`, `subject`, `keywords` (space-separated), `creator` (default `"react-pdf-levelup"`), `producer` (same default), `language` (e.g. `"en-US"`), `pageMode` (`useNone`/`useOutlines`/`useThumbs`/`fullScreen`), `pageLayout` (`singlePage`/`oneColumn`/`twoColumnLeft`/`twoColumnRight`).

```jsx
<Layout meta={{ title: "Invoice #1234", author: "My Company Inc.", language: "en-US" }}>
```

### NextPage
Manual page break inside a `Layout` (internally a `<View break />`):
```jsx
<Layout>
  <H1>First page</H1>
  <NextPage />
  <H1>Second page</H1>
</Layout>
```
Use it to separate chapters, force a section onto a fresh page, or stop important content from splitting awkwardly.

---

## LayoutMultiPage & Section

An alternative to `Layout` for documents where each page has a distinct, hand-designed look (catalogs, cover + back cover, mixed-orientation reports) instead of one continuous auto-flowing stream.

`LayoutMultiPage` takes the same props as `Layout` (`size`, `orientation`, `backgroundColor`, `backgroundImage`, `backgroundImageOpacity`, `padding`, `margin`, `footer`, `footerLines`, `pagination`, `rule`, `debug`, `meta`) as **global defaults** — with one difference worth remembering: `footerLines` defaults to `1` here, versus `2` on plain `Layout`.

`Section` represents one page and accepts the same prop list to **override** the parent's defaults for that page only.

```jsx
import { LayoutMultiPage, Section, H1, P } from '@react-pdf-levelup/core';

const MyDoc = () => (
  <LayoutMultiPage size="A4" backgroundColor="#f0f0f0" footer={<P>Corporate Document</P>}>
    <Section>
      <H1>Cover Page</H1>
    </Section>
    <Section backgroundColor="white" pagination={false}>
      <H1>Special Content</H1>
    </Section>
  </LayoutMultiPage>
);
```

Use `Layout` for long, naturally-flowing text/reports; use `LayoutMultiPage` when pages need individually fixed designs.

---

## Grid: Container / Row / Col1–Col12

```jsx
import { Layout, Container, Row, Col6, Col3, Col9, P } from '@react-pdf-levelup/core';

<Layout>
  <Container>
    <Row>
      <Col6><P>Half width</P></Col6>
      <Col6><P>Half width</P></Col6>
    </Row>
    <Row>
      <Col3><P>One quarter</P></Col3>
      <Col9><P>Three quarters</P></Col9>
    </Row>
  </Container>
</Layout>
```

- `Container` — centers/bounds the content width. Props: `children`, `style`, `debug`, `fixed`, `break`.
- `Row` — wraps columns, keeps them aligned. Same prop set.
- `Col1`…`Col12` — each defines a width on a 12-column scale (`Col6` = half, `Col4` = a third, etc). Same prop set.

**No component in this family accepts a gutter/gap prop.** See gotcha #1 in the main `SKILL.md` and the wrapper pattern in `references/design-patterns.md`.

---

## Text family

All of these accept `style`, `debug`, `fixed`, `break` unless noted. Each ultimately renders either the underlying `Text` or `View` primitive from `@react-pdf/renderer` (noted per component).

| Component | Wraps | Notes |
|---|---|---|
| `H1`…`H6`, `P` | `Text` | headings + paragraph |
| `Strong` | `Text` | bold |
| `Em` | `Text` | italic |
| `U` | `Text` | underline |
| `Small` | `Text` | smaller size |
| `Blockquote` | `Text` | for highlighted quotes |
| `Mark` | `Text` | highlighter-style marked text |
| `Span` | `Text` | generic inline container, e.g. a colored word inside a `<P>` |
| `BR` | `Text` | line break |
| `HR` | `View` | horizontal rule — see gotcha #2 in `SKILL.md` before customizing |
| `A` | `Link` | adds `href`; needs a full URL with protocol (`https://…`) to behave as a clickable link |
| `Div` | `View` | generic block container — reach for this instead of raw `View` |

```jsx
<H1>Title</H1>
<P><Strong>Bold</Strong>, <Em>Italic</Em>, <U>Underlined</U>, <Small>Small</Small></P>
<Blockquote>A highlighted quote.</Blockquote>
<Mark>Highlighted text</Mark>
<P>Normal text with a <Span style={{ color: 'red' }}>red span</Span>.</P>
<A href="https://example.com">Go to website</A>
<Div style={{ padding: 10, backgroundColor: '#f0f0f0' }}><P>Boxed content</P></Div>
```

---

## Media: Img / ImgBg

### Img
| Prop | Type | Default |
|---|---|---|
| `src` | string (URL) | `""` |
| `style` | object | `{}` |
| `debug` / `fixed` / `break` | boolean | `false` |

```jsx
<Img src="https://picsum.photos/400/200" style={{ width: 200 }} />
```

### ImgBg
Background image with overlaid content — children render on top of it.

| Prop | Type | Default |
|---|---|---|
| `src` | string | `""` |
| `width` / `height` | number or string | `"100%"` |
| `opacity` | number 0–1 | **`0.2`** ⚠️ set this explicitly if the image should be at full strength |
| `objectFit` | `cover` \| `contain` \| `fill` \| `none` \| `scale-down` | `"cover"` |
| `objectPosition` | string | `"center"` |
| `fixed` / `style` / `debug` / `break` | — | — |

```jsx
<ImgBg src="https://picsum.photos/600/400" opacity={1}>
  <P>Text over background image</P>
</ImgBg>
```

---

## Position: Left / Right / Center

Simple horizontal-alignment wrappers; the only prop is `style`:

```jsx
<Left><P>Text to the left</P></Left>
<Right><P>Text to the right</P></Right>
<Center><P>Centered text</P></Center>
```

---

## Table family

```jsx
import { Table, Thead, Tbody, Tr, Th, Td } from '@react-pdf-levelup/core';

<Table cellHeight={25} borderColor="#FF0000" textColor="#0000FF" headerBackground="#ADD8E6" zebraColor="#D3D3D3" grid="modern">
  <Thead>
    <Tr>
      <Th>Column A</Th>
      <Th textAlign="right">Column B</Th>
    </Tr>
  </Thead>
  <Tbody>
    <Tr><Td>Data 1</Td><Td>Data 2</Td></Tr>
  </Tbody>
</Table>
```

- **`Table`**: `children`, `style`, `cellHeight` (default `22`), `borderColor` (default `"#000"`), `textColor` (default `"#000"`), `headerBackground` (default `"#ccc"`), `zebraColor` (default `"#eeeeee"`, used in `"modern"` mode), `grid` (`"grid"` = full borders, `"modern"` = bottom-borders-only; default `"grid"`).
- **`Thead`**: `children`, `style`, `textAlign` (default `"left"`), `borderColor`/`textColor` (inherit from `Table`, can override).
- **`Tbody`**: `children`, `borderColor`/`textColor` (inherit, can override).
- **`Tr`**: `children`, `style`.
- **`Th`** / **`Td`**: `children`, `style`, `width` (e.g. `"30%"` or a number), `height` (falls back to `Table`'s `cellHeight`), `colSpan`, `textAlign` (default `"left"`).

Use `colSpan` directly for merged header/data cells instead of manually recalculating widths.

---

## Lists: UL / OL / LI

```jsx
<UL type="square">
  <LI>Item 1</LI>
</UL>

<OL type="upper-roman" start={3}>
  <LI>Item III</LI>
</OL>
```

- `UL`: `style`, `type` (default `"disc"`, or `"circle"`/`"square"`).
- `OL`: `style`, `type` (default `"decimal"`, or `"lower-alpha"`/`"upper-alpha"`/`"lower-roman"`/`"upper-roman"`), `start` (default `1`).
- `LI`: `style`.

---

## Form family

Renders static, styled form-like fields (not real interactive AcroForm fields) — useful for order forms, intake sheets, or anything meant to be printed and filled by hand.

- **`Form`**: container/context. `children`, `style`, `borderColor` (default `"#282828"`), `borderRadius` (default `5`), `labelColor` (default `"#333"`), `textColor` (default `"#000"`).
- **`Input`**: `label`, `placeholder` (default `""`), `required` (default `false`), `width` (default `"100%"`), `height`, `style`, `labelStyle`.
- **`TextArea`**: same as `Input` but `height` defaults to `60`.
- **`Checkbox`**: `label`, `checked` (default `false`), `style`, `labelStyle`.

```jsx
<Form borderColor="#FF0000" borderRadius={10}>
  <Input label="Full Name" placeholder="Enter your name" required width="50%" />
  <TextArea label="Comments" height={100} />
  <Checkbox label="I accept the terms and conditions" checked />
</Form>
```

---

## Font management

Default fonts, no registration needed: `Courier`, `Courier-Bold`, `Courier-Oblique`, `Courier-BoldOblique`, `Helvetica`, `Helvetica-Bold`, `Helvetica-Oblique`, `Helvetica-BoldOblique`, `Times-Roman`, `Times-Bold`, `Times-Italic`, `Times-BoldItalic`.

Custom fonts:
```jsx
Font.register({
  family: "Lobster",
  fonts: [{ src: "https://genarogg.github.io/react-pdf-levelup/public/font/Lobster-Regular.ttf", fontWeight: "normal" }],
});
```

**The `src` must be an absolute `https://` URL — never a local filesystem path.** This is enforced, not just recommended, because the REST API / backend rendering pipeline has no access to the local disk.

Use the registered family via `style={{ fontFamily: 'Lobster' }}` (inline, in a `StyleSheet.create()` block, or on `Layout`'s own `style` prop to set it document-wide).

---

## generatePDF & decodeBase64Pdf

```ts
generatePDF({ template, data }: { template: React.ElementType, data?: any }): Promise<string> // base64
decodeBase64Pdf(base64: string, fileName: string): void // browser only — downloads + opens in a new tab
```

```jsx
import { generatePDF, decodeBase64Pdf } from '@react-pdf-levelup/core'; // or from /client

const base64 = await generatePDF({ template: MyDocument, data: { name: "John Doe" } });
decodeBase64Pdf(base64, "document.pdf");
```

Works identically in Node/backend contexts (Express, Fastify, plain scripts, bun) — any ESM-capable environment. See the REST API section below for the fallback when no JS runtime is available at all.

---

## REST API (no-JS-runtime fallback)

For consumers that can't run `generatePDF` directly (no Node/JS environment):

- **Cloud endpoint**: `POST https://react-pdf-levelup.nimbux.cloud/api`
- **Self-hosted**: download `https://genarogg.github.io/react-pdf-levelup/public/api.zip`, deploy it, and expose `/api/pdf`.
- **Request body**: `{ "template": "<TSX_IN_BASE64>", "data": { "field": "value" } }`
- **Response**: `{ "data": { "pdf": "<PDF_IN_BASE64>" } }`

Constraints that matter here specifically (stricter than local development):
- Custom fonts still need `Font.register` with an absolute `https://` URL — the API cannot resolve local files, ever.
- All images (`Img`/`ImgBg` `src`) must be absolute `https://` URLs, publicly accessible without auth, and not blocked by CORS. Prefer JPEG for photos, PNG for graphics/transparency; avoid oversized images and avoid inlining large base64 data URLs.
- SVGs technically work but should be well-formed with no local references/scripts; rasterize to PNG if rendering looks inconsistent.

Example (Node/fetch):
```ts
const res = await fetch("https://react-pdf-levelup.nimbux.cloud/api", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ template: templateBase64, data }),
});
const { data } = await res.json();
const pdfBase64 = data?.pdf ?? "";
```
The same shape works from curl, Python (`requests`), C#, Java, or PHP — it's a plain HTTP endpoint.

---

## Base `@react-pdf/renderer` properties that flow through everything

Every react-pdf-levelup component ultimately renders a `View`, `Text`, or `Link` from `@react-pdf/renderer`, so their base props leak through:

- `style` — a `StyleSheet.create()` result, a plain object, or an array mixing both (later entries win).
- `debug` — draws the element's bounding box; useful while laying things out.
- `fixed` — repeats the element on every page (headers/footers/watermarks).
- `wrap` — allow/disallow this element to split across a page break (default `true`).
- `break` — force a page break immediately before this element.

### Valid style units
`pt` (default for unitless numbers), `in`, `mm`, `cm`, `%`, `vw`, `vh`. No native `px` — treat plain numbers as the safe default everywhere.

### Valid CSS-like properties (the ones that matter most)
- **Flexbox**: `alignItems`, `alignContent`, `alignSelf`, `flex`, `flexDirection`, `flexWrap`, `flexGrow`/`flexShrink`/`flexBasis`, `justifyContent`, `gap`/`rowGap`/`columnGap`.
- **Layout**: `display`, `position` (`relative`/`absolute`/`static`), `top`/`right`/`bottom`/`left`, `overflow`, `zIndex`, `aspectRatio`.
- **Dimension**: `width`/`height`/`minWidth`/`maxWidth`/`minHeight`/`maxHeight`.
- **Color**: `backgroundColor`, `color`, `opacity`. **No `boxShadow`.**
- **Text**: `fontSize`, `fontFamily`, `fontWeight`, `fontStyle`, `letterSpacing`, `lineHeight`, `textAlign`, `textDecoration`/`textDecorationColor`/`textDecorationStyle`, `textIndent`, `textOverflow`, `textTransform`, `verticalAlign` (`sub`/`super`), `maxLines`, `direction`.
- **Margin/padding**: the full `margin*`/`padding*` set, including `marginHorizontal`/`marginVertical`.
- **Borders**: `border`, `border{Color,Style,Width}`, per-side `border{Top,Right,Bottom,Left}{Color,Style,Width}`, and per-corner `border{TopLeft,TopRight,BottomRight,BottomLeft}Radius` (no documented `borderRadius` shorthand, though it has worked in practice on this project — fall back to the four explicit corners if one won't round).
- **Transforms**: `transform:rotate/scale/scaleX/scaleY/translate/translateX/translateY/skew/skewX/skewY/matrix`, `transformOrigin`.

Full canonical reference: https://react-pdf.org/styling
