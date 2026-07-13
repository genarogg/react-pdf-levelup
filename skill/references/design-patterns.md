# Design Patterns & Field Notes

Visual conventions this project has converged on for professional/corporate PDFs, plus gotchas discovered by actually rendering documents rather than just reading the docs. Reuse these defaults unless the person asks for a different visual direction.

## Color System

Centralize every color in one object at the top of the template so the whole palette can be adjusted from one place:

```jsx
const COLORS = {
  // Primary & Secondary
  ink: "#1a1a2e",           // primary text / strong headings
  slate: "#5c6079",         // secondary text
  muted: "#94a0b8",         // captions, meta, footer text

  // Neutral
  border: "#e6e8f0",        // card borders, dividers
  cardBg: "#ffffff",        // card background
  pageBg: "#f5f6fa",        // page background

  // Brand Accent
  accentPrimary: "#4338ca", // section bars, links, eyebrow labels

  // Semantic Colors (for charts, status indicators, highlights)
  success: "#22C55E",       // green - positive status, growth
  warning: "#F59E0B",      // amber - caution, attention needed
  error: "#EF4444",        // red - errors, critical info
  info: "#3B82F6",         // blue - informational, links
};
```

### Color Roles
| Role | Usage |
|------|-------|
| **Primary (ink)** | Headings, important text, key data |
| **Secondary (slate)** | Subheadings, secondary text |
| **Muted** | Captions, footnotes, metadata |
| **Border** | Card outlines, dividers, rules |
| **Card Background** | Card surfaces, table headers |
| **Page Background** | Document background |
| **Accent Primary** | Section markers, links, highlights |
| **Success** | Positive metrics, completions |
| **Warning** | Attention items, cautions |
| **Error** | Critical errors, warnings |
| **Info** | Neutral information, tips |

For corporate/clean documents: a white or near-white page background, a single accent color used sparingly (section markers, an eyebrow label, a rule), and everything else in a gray scale (`ink` → `slate` → `muted`).

## Typography System

### Type Scale (4px base grid aligned)
Use this scale for consistent visual hierarchy across PDFs:

| Element | Size (pt) | Weight | Line Height | Usage |
|---------|-----------|--------|-------------|-------|
| **Display** | 36 | 700 | 1.1 | Cover page titles |
| **H1** | 24 | 700 | 1.2 | Section headings |
| **H2** | 20 | 600 | 1.25 | Subsections |
| **H3** | 16 | 600 | 1.3 | Card titles |
| **H4** | 14 | 600 | 1.35 | Minor headings |
| **Body** | 11 | 400 | 1.5 | Main text |
| **Small** | 9 | 400 | 1.4 | Captions, footnotes |
| **Label** | 8 | 500 | 1.4 | Form labels |

### Font Stack
Default fonts (no registration needed), or register custom fonts with `Font.register`:
- `Helvetica`, `Helvetica-Bold`, `Helvetica-Oblique`, `Helvetica-BoldOblique`
- `Times-Roman`, `Times-Bold`, `Times-Italic`, `Times-BoldItalic`
- `Courier`, `Courier-Bold`, `Courier-Oblique`, `Courier-BoldOblique`

### Best Practices
- Base size: 11pt for body text (optimal for readability)
- Headings: 1.1-1.3 line height for visual impact
- Body text: 1.5 line height for readability
- Letter spacing: 0.025em for uppercase labels (eyebrow text)
- Use `Strong` for hierarchy instead of bold inline styles
- Never use pure black (#000) - use #111 or similar for softer contrast

## Spacing System

4px base unit for consistent vertical rhythm:

```jsx
const SPACING = {
  xs: 2,    // 2pt (tight)
  sm: 4,    // 4pt
  md: 8,    // 8pt
  base: 12, // 12pt (default)
  lg: 16,   // 16pt
  xl: 24,   // 24pt (section spacing)
  xxl: 32,  // 32pt
  xxxl: 48, // 48pt (major section breaks)
};
```

### Common Applications
| Spacing | Usage |
|---------|-------|
| 4pt | Between related inline elements |
| 8pt | Paragraph spacing, tight margins |
| 12pt | Default row/card spacing |
| 16pt | Section internal padding |
| 24pt | Between major sections |
| 32pt+ | Page-level divisions |

## Card Pattern

A "card" is a `Div` with a border and radius — never a shadow (`boxShadow` isn't supported; see the styling gotchas in `references/core-components.md`):

```jsx
const card = {
  backgroundColor: COLORS.cardBg,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 10,
  padding: 16,
};
```

When a card wraps an image, QR code, or chart, add an inner "frame" `Div` (light gray background, its own smaller radius) around just that visual — it reads much better than the visual floating directly on the white card:

```jsx
const frame = { padding: 10, backgroundColor: "#fafafa", borderRadius: 8, marginBottom: 10 };

<Div style={card}>
  <Div style={frame}><QR url="..." size={120} /></Div>
  <P style={{ fontSize: 11 }}><Strong>Label</Strong></P>
  <Small style={{ color: COLORS.muted }}>Caption describing the variant</Small>
</Div>
```

## Layout Composition

### Visual Hierarchy Principles
1. **Establish clear focal points** - One element should dominate each section
2. **Use whitespace as a separator** - Not just borders; let elements breathe
3. **Align to an implicit grid** - Even in single-column layouts, imagine 12 columns
4. **Group related items** - Use cards or background colors to create visual containers
5. **Progressive disclosure** - Start with overview, drill down to details

### Grid Composition (for multi-column layouts)
```jsx
const colWrap = { paddingLeft: 7, paddingRight: 7, marginBottom: 14 };

<Row>
  <Col6><Div style={colWrap}>{/* card A */}</Div></Col6>
  <Col6><Div style={colWrap}>{/* card B */}</Div></Col6>
</Row>
```

7px on each side of two adjacent columns gives a 14px visual gap between them; adjust to taste, but always apply the padding inside the column, not on the `Row`/`Container`.

## Section Headers

Two variants depending on level:

- **Document header**: a small letter-spaced "eyebrow" label in the accent color, then an `H1`, then a muted subtitle — gives a report/cover-page feel before the content starts.
- **In-body section header**: an `H3` (or similar) followed by a short solid accent-colored bar (see the `HR` gotcha below — use a `Div`, not `HR`, for this bar) to visually anchor the start of a new group of content.

```jsx
<Small style={{ fontSize: 9, color: COLORS.accentPrimary, letterSpacing: 2 }}>DOCUMENT LABEL</Small>
<H1>Document Title</H1>
<P style={{ fontSize: 10, color: COLORS.slate }}>One-line description of the document</P>
```

### Fixing HR for a Precise Colored Rule

`<HR />` alone renders a default line — fine for a plain divider. But if a specific color/thickness is needed (a "brand underline" under a section title, for instance), don't layer `border*` props onto `HR`: it can render as a solid block rather than a thin line. Use a plain `Div` sized as a solid bar instead:

```jsx
const sectionRule = { height: 3, width: 32, backgroundColor: COLORS.accentPrimary, borderRadius: 3, marginBottom: 12 };

<Div style={sectionRule} />
```

## Footer Pattern

A simple flex row, small muted text on both ends:

```jsx
const footerRow = { display: "flex", flexDirection: "row", justifyContent: "space-between" };

<Div style={footerRow}>
  <Small>Source / generated-by note</Small>
  <Small>Document name</Small>
</Div>
```

Pass this directly to `Layout`'s `footer` prop so it repeats automatically on every page, instead of placing it manually at the end of the content.

## Certificate-Specific Patterns

- **Ornamental divider**: a short line – dot – short line, centered, in a muted/gold tone, used to visually separate the title block from the recipient's name.
- **Signature/date row**: two (or more) columns, each with a thin line (`Div` with `height: 1, backgroundColor`), a value below it (name/date), and a small uppercase label below that (e.g. "Issue Date", "Authorized Signature").
- **Links need a full protocol.** `<A href="www.site.com">` often won't behave as a clickable link in PDF viewers — always include `https://`.
- Replace long `<BR />` chains used purely for vertical spacing with explicit `marginTop`/`marginBottom` on the surrounding elements — far easier to tune and reason about than counting line breaks.

## General Workflow Reminders

- Verify prop names against `references/core-components.md` / `references/plugins-and-qr.md` before using them — this library has at least one internal documentation inconsistency (`QRStyle`'s `value`/`url` and casing), so "the docs say X" isn't always the last word.
- If something genuinely isn't covered anywhere in these references, `web_fetch` the specific page under `https://react-pdf-levelup.nimbux.cloud/docs/en/...` rather than guessing from generic `@react-pdf/renderer` familiarity — this library renames things (`Div` instead of `View`), uses Spanish-named margin presets, and uses plural package names where singular might be expected.