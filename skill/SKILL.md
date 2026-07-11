---
name: react-pdf-levelup
description: Create, refactor, or restyle PDF documents built with react-pdf-levelup — invoices, certificates, reports, catalogs, QR showcases, charts, and any other PDF template in this stack. Trigger this skill whenever react-pdf-levelup or any of its packages (@react-pdf-levelup/core, /qr, /charts, /icons, /client) is mentioned, or when code uses components like Layout, LayoutMultiPage, Container/Row/Col, H1-H6, Table, QR, QRStyle, ChartJS, Icon, or Font.register — even with no import statement shown. Always prioritize react-pdf-levelup's own semantic components over hand-rolled View/Text/StyleSheet code whenever a react-pdf-levelup equivalent exists.
---

# React PDF Levelup

`react-pdf-levelup` is a component library that wraps [`@react-pdf/renderer`](https://react-pdf.org/) and adds a layer of ready-made, semantic components — headings, grids, tables, QR codes, charts, icons — so PDF templates read like ordinary marked-up React instead of a wall of `View`/`Text`/`StyleSheet` calls. Official docs: https://react-pdf-levelup.nimbux.cloud/docs/en/get-started (also available in Spanish under `/docs/es/...`).

## Golden rule: prefer the library's own components

When a react-pdf-levelup component already does something, use it instead of reaching for raw `View`/`Text` plus a hand-built `StyleSheet`. Concretely:

| Instead of...                                        | Use...                                             |
| ----------------------------------------------------- | --------------------------------------------------- |
| `<View>` for a generic box                             | `<Div>`                                             |
| `<Text style={{fontSize:24,fontWeight:'bold'}}>`       | `<H1>`…`<H6>`, `<P>`                                |
| `<Text style={{fontWeight:'bold'}}>` inline            | `<Strong>` (also `<Em>`, `<U>`, `<Small>`, `<Mark>`) |
| Manual flexbox row/column math                         | `<Container>`/`<Row>`/`<Col1>`…`<Col12>`             |
| Hand-rolled table-like Views                           | `<Table>`/`<Thead>`/`<Tbody>`/`<Tr>`/`<Th>`/`<Td>`    |
| A `View` styled as a border-bottom rule                | `<HR />` (see gotcha #2 before customizing it)       |
| A QR you render/rasterize yourself                     | `<QR>` or `<QRStyle>`                                |
| An externally-rendered chart image                     | `<ChartJS>`                                          |
| An inline SVG icon                                     | `<Icon ico="..." />` (Lucide names)                  |

Only fall back to raw `@react-pdf/renderer` primitives (`View`, `Text`, `Svg`, `Canvas`, `PDFViewer`, `renderToBuffer`, etc — see the tail of `references/core-components.md`, and https://react-pdf.org/ for the full spec) for things react-pdf-levelup doesn't wrap: custom SVG shapes, freehand Canvas drawing, in-browser preview (`PDFViewer`/`BlobProvider`), or Node output helpers (`renderToFile`/`renderToBuffer`/`renderToStream`).

## Before writing any code

1. Read `references/core-components.md` — full prop tables for `Layout`, `LayoutMultiPage`/`Section`, the grid, the text family, `Media`, `Position`, `Table`, `Lists`, `Form`, font registration, and `generatePDF`.
2. Read `references/plugins-and-qr.md` — `ChartJS`, `Icon`, the `Client` plugin, `QR`, and `QRStyle`.
3. Read `references/design-patterns.md` — the visual conventions (color system, card layout, section headers) this project defaults to, plus the field-tested gotchas below. Several of these were only discovered by actually rendering documents, not from the docs alone.

Don't guess a prop name from generic `@react-pdf/renderer` familiarity or from memory of an earlier session — verify it against these reference files first. If something still isn't covered, `web_fetch` the relevant page under `https://react-pdf-levelup.nimbux.cloud/docs/en/...` before answering.

## Minimal document skeleton

```jsx
import { Layout, H1, P } from '@react-pdf-levelup/core';

const MyTemplate = ({ data }) => (
  <Layout size="A4" meta={{ title: data.title, language: 'en-US' }}>
    <H1>{data.title}</H1>
    <P>{data.body}</P>
  </Layout>
);

export default MyTemplate;
```

Every template is a function component returning either a `Layout` (content flows and auto-paginates — best for reports, invoices, long text) or a `LayoutMultiPage` with `Section` children (each page is designed independently — best for catalogs, covers, mixed layouts). Full comparison in `references/core-components.md`.

## Component map

- **Structure**: `Layout`, `LayoutMultiPage` + `Section`, `Container`/`Row`/`Col1`–`Col12`
- **Text**: `H1`–`H6`, `P`, `Strong`, `Em`, `U`, `Small`, `Blockquote`, `Mark`, `Span`, `BR`, `HR`, `A`, `Div`
- **Data**: `Table`/`Thead`/`Tbody`/`Tr`/`Th`/`Td`, `UL`/`OL`/`LI`
- **Media**: `Img`, `ImgBg`
- **Alignment**: `Left`, `Right`, `Center`
- **Forms**: `Form`, `Input`, `TextArea`, `Checkbox`
- **Plugins**: `ChartJS` (`@react-pdf-levelup/charts`), `Icon` (`@react-pdf-levelup/icons`, Lucide names), `QR` + `QRStyle`/`QRstyle` (`@react-pdf-levelup/qr`)
- **Output**: `Font.register`, `generatePDF`, `decodeBase64Pdf`, `printBase64Pdf` (`@react-pdf-levelup/client`)

> **Package names**: the docs' own code comments hedge with "adjust import according to your structure" for the charts/icons packages, and spell them out in the plural (`charts`, `icons`) in the one place they give a concrete scoped name — even though people often say "chart"/"icon" casually, and the person may refer to them in the singular too. Check the project's `package.json` before hardcoding an import path.

## Styling ground rules (inherited from `@react-pdf/renderer`)

Every `style` prop across every react-pdf-levelup component is a `@react-pdf/renderer` style object — `StyleSheet.create()`, a plain inline object, or an array mixing both. Full valid-property list in `references/core-components.md`, but the ones that bite most often:

- **Units**: `pt` (default — plain numbers), `in`, `mm`, `cm`, `%`, `vw`, `vh`. There is no native `px` unit; unitless numbers are the safest default. Shorthand strings like `"1px solid #ccc"` for `border` tend to still work in practice, but don't rely on `px` anywhere else.
- **No `boxShadow`.** It isn't in the supported property list — fake elevation/"card" looks with `border` + `borderRadius` instead (see `references/design-patterns.md`).
- **`borderRadius`**: the official valid-properties list only documents the four per-corner props (`borderTopLeftRadius`, etc), not a `borderRadius` shorthand — though the shorthand has worked fine in this project's own rendering. If a corner ever refuses to round, fall back to the four explicit properties.
- `gap`, `rowGap`, `columnGap` are supported inside flex containers.

## Field-tested gotchas

Each of these was found by actually rendering a document, not by reading the docs — trust them over intuition:

1. **The grid has no gutter.** `Col1`–`Col12` don't space themselves apart — two adjacent columns holding bordered cards will visibly touch. Wrap each column's content in a `Div` with `paddingLeft`/`paddingRight` (plus `marginBottom` for row spacing) to create the gap. Don't add margin to the card itself, or the column width breaks unevenly.
2. **`HR` is a styled `View`, not an `<hr>`.** A bare `<HR />` already renders a default line — fine for a plain divider. But layering custom `borderBottomWidth`/`borderBottomColor` onto it can render as a thick solid block instead of a thin rule. For a precise, colored divider (e.g. a brand-colored underline under a section title), skip `HR` and use a plain `Div` styled as a solid bar instead: `{ height: 2, backgroundColor: '#...', borderRadius: 2 }`.
3. **`ImgBg` defaults to `opacity: 0.2`.** If a background image looks unexpectedly washed out, that's why — set `opacity` explicitly (close to `1`) for full strength.
4. **Remote assets only.** `Font.register` sources and any `Img`/`ImgBg` `src` must be absolute `https://` URLs, never local filesystem paths. This is a hard requirement — not just a suggestion — the moment a document might render through the REST API or a backend job, since those environments can't see the local disk at all.
5. **`QRStyle` disagrees with its own docs.** The prop table names the encoded-content prop `value`, but the official example code — and every `QRstyle`/`QRStyle` block built successfully in this project so far — passes `url`. Also watch the casing: the hosted docs write `QRStyle` (capital S), while working code here has consistently used `QRstyle` (lowercase s). Don't assume either the prop name or the casing without checking what the installed version actually exports.
6. **`Table` cells support `colSpan`** on both `Th` and `Td` — use it directly instead of manually recalculating column widths to fake a merged cell.

## Output & generation

- **Browser**: `generatePDF({ template, data })` → base64 string, then `decodeBase64Pdf(base64, fileName)` to download/open it, or `printBase64Pdf(base64)` to trigger the print dialog. All three come from `@react-pdf-levelup/client`.
- **Node/backend** (Express, Fastify, plain scripts, bun): the same `generatePDF` from `@react-pdf-levelup/core` — works out of the box in any ESM-capable environment.
- **No JS runtime available**: the hosted REST API (`POST https://react-pdf-levelup.nimbux.cloud/api`, body `{ template: base64Tsx, data }`, response `{ data: { pdf: base64 } }`) or a self-hosted copy (`api.zip`). Full request/response shape and multi-language examples in `references/core-components.md`.

## Design conventions

`references/design-patterns.md` holds the color-system and layout conventions this project defaults to for professional/corporate documents (certificates, invoices, reports, catalogs) — reuse them unless the person asks for a different visual direction.
