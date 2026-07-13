# UX Guidelines for Static PDF (filtered from 99)

Source: `ui-ux-pro-max` → `data/ux-guidelines.csv` (99 guidelines). A PDF is a static,
paginated, non-interactive snapshot — so we **discard** every guideline whose value depends
on hover, focus, keyboard, loading, touch, responsive breakpoints, animation, scroll, or
web performance (those documented in the source as `Web`/`Mobile`/`All` interaction). We
**keep** guidelines about visual hierarchy, contrast, typographic legibility, information
density, alignment, and composition — the things that still apply to a printed page.

**Survived: 28 (several adapted to PDF). Discarded: 71.** Full discard list at the bottom.

---

## 1. Visual hierarchy & structure

- **#39 Heading Hierarchy** — Use sequential `H1`→`H6` (no level skips). In `@react-pdf/renderer`
  these become the tagged-PDF outline, which screen readers and PDF viewers use for
  navigation. `Do`: one `H1` per logical section. `Don't`: skip levels (H1→H4).
- **#77 Heading Clarity** — Headings must clearly outrank body: larger size **and** bolder
  weight. `Don't`: make a heading the same size as body text.
- **#19 Content Jumping → reserve space** — Reserve a fixed `height`/`width` for every
  `Img`/chart/table cell so content doesn't overlap or unexpectedly push the next block
  across a page break. `Do`: set explicit dimensions. `Don't`: let images render at 0 size
  then expand.
- **#21 Container Width / #73 Line Length** — Limit reading measure to ~65–75 characters per
  line (`maxWidth` on the text container, or `Layout` `margin`). `Do`: `max-w` prose-style
  column. `Don't`: let body text span the full page width.
- **#71 Table Handling (adapted)** — Wide tables overflow a fixed page. `Do`: shrink to fit,
  switch to landscape `orientation="landscape"`, or split columns across pages. `Don't`:
  let a table run off the right edge.

## 2. Color & contrast

- **#36 Color Contrast** — Text ≥ 4.5:1 on its background (large text 3:1). `Do`: `#333` on
  white (≈7:1). `Don't`: `#999` on white (≈2.8:1). Check every palette in
  `color-palettes.md` before use.
- **#76 Contrast Readability** — Body text dark on light. `Do`: `text-gray-900` on white.
  `Don't`: gray-on-gray.
- **#37 Color Not Only** — Never convey meaning by color alone. `Do`: pair red/green status
  with an icon or text ("Paid" / "Overdue"). `Don't`: red border only for an error state.

## 3. Typographic legibility

- **#72 Line Height** — Body `lineHeight` 1.5–1.75. `Don't`: 1.0 (cramped).
- **#74 Font Size Scale** — Use a consistent modular scale (e.g. 12/14/16/18/24/32).
  `Don't`: arbitrary sizes per element.
- **#75 Font Loading (adapted)** — Web's `font-display: swap` has no PDF equivalent; instead
  **register every font with `Font.register` before calling `generatePDF`**, and always keep
  Helvetica/Times as the implicit fallback so a failed `src` degrades gracefully (see
  `font-pairings.md`).

## 4. Forms (printable / fill-by-hand)

The `Form`/`Input`/`TextArea`/`Checkbox` family in `react-pdf-levelup` renders static form
fields, so form guidelines still apply.

- **#43 / #54 Input Labels** — Every input needs a visible label (above/beside). `Don't`:
  placeholder-only inputs.
- **#55 Error Placement** — Show error text directly below the relevant field. `Don't`: one
  error block at the top of the form.
- **#59 Required Indicators** — Mark required fields (asterisk or "(required)"). `Don't`:
  leave it ambiguous.
- **#62 Input Affordance** — Inputs should look fillable (border + background distinct from
  plain text). `Don't`: borderless inputs that read as labels.
- **#44 / #80 Error Messages** — Errors must state cause **and** recovery (e.g. "Invalid
  VAT: must be 11 digits — edit and resubmit"). `Don't`: a bare "Invalid input".
- **#31 Disabled States** — Render disabled fields clearly (reduced opacity + distinct look),
  but still visible/printable. `Don't`: hide them.
- **#79 Empty States** — Tables/charts with no data show a helpful "No data yet" + guidance,
  not a blank frame.
- **#83 Confirmation Messages** — Confirm successful actions with brief visible text
  ("Saved", "Submitted"). `Don't`: silent success.

## 5. Content & data formatting

- **#85 Date Formatting** — Use locale-aware dates (`Intl.DateTimeFormat`), not ambiguous
  `01/02/03`.
- **#86 Number Formatting** — Thousand separators / locale abbreviations (`1,234` /
  `$1.2K`). `Don't`: unformatted `1234567`.
- **#84 Truncation** — Handle long values gracefully: wrap when possible; if truncating,
  show ellipsis and provide the full value in a tooltip-equivalent (a footnote or a full
  column). `Don't`: clip mid-word with no recovery.
- **#87 Placeholder Content** — During template dev, use realistic sample data, not
  "Lorem ipsum", so layout/spacing is validated against real content length.

## 6. Images & assets

- **#38 Alt Text** — Every meaningful `Img` needs descriptive context (a caption or a
  `fixed` label). `Don't`: drop in an unlabeled image.
- **#46 Image Optimization (adapted)** — The renderer needs **absolute `https://` image
  URLs** (see `core-components.md` gotcha #4). Keep images reasonably sized and avoid
  inlining huge base64 — both matter most when rendering through the REST API. Prefer JPEG
  for photos, PNG for graphics.

---

## Discarded guidelines (reason)

| # | Guideline | Why discarded |
|---|-----------|---------------|
| 1 | Smooth Scroll | No scrolling in a paginated PDF |
| 2 | Sticky Navigation | No scroll/fixed-nav behavior |
| 3 | Active State (nav) | No current-page highlight needed in static doc |
| 4 | Back Button | No navigation stack |
| 5 | Deep Linking | No URL/state |
| 6 | Breadcrumbs | Web hierarchy aid (section paths kept only as text if wanted) |
| 7 | Excessive Motion | No animation in static PDF |
| 8 | Duration Timing | No animation |
| 9 | Reduced Motion | No motion to reduce |
| 10 | Loading States | No async loading in a snapshot |
| 11 | Hover vs Tap | No hover/tap |
| 12 | Continuous Animation | No animation |
| 13 | Transform Performance | No animation/repaint |
| 14 | Easing Functions | No animation |
| 15 | Z-Index Management | No stacking context in static layout |
| 16 | Overflow Hidden | No overflow clipping in paginated doc |
| 17 | Fixed Positioning (safe areas) | `fixed` repeats per page; safe-area concept N/A |
| 18 | Stacking Context | No z-index |
| 20 | Viewport Units | No viewport |
| 22 | Touch Target Size | No tap targets in a static page |
| 23 | Touch Spacing | No touch |
| 24 | Gesture Conflicts | No gestures |
| 25 | Tap Delay | No taps |
| 26 | Pull to Refresh | No scroll |
| 27 | Haptic Feedback | No haptics |
| 28 | Focus States | No keyboard focus |
| 29 | Hover States | No hover |
| 30 | Active States (press) | No press interaction |
| 32 | Loading Buttons | No async submit |
| 33 | Error Feedback (live) | Covered by static #44/#80 |
| 34 | Success Feedback (live) | Covered by static #83 |
| 35 | Confirmation Dialogs | No destructive runtime actions |
| 40 | ARIA Labels | Web ARIA; PDF uses H1–H6 structure instead (#39) |
| 41 | Keyboard Navigation | No keyboard nav |
| 42 | Screen Reader (semantic divs) | Covered by H1–H6 structure (#39) |
| 45 | Skip Links | No nav-heavy web page |
| 47 | Lazy Loading | No runtime loading |
| 48 | Code Splitting | Web bundling |
| 49 | Caching | Web |
| 50 | Font Loading (web) | Adapted to #75 (register upfront) |
| 51 | Third Party Scripts | Web |
| 52 | Bundle Size | Web |
| 53 | Render Blocking | Web |
| 56 | Inline Validation | No live validation |
| 57 | Input Types (inputmode) | No on-screen keyboards |
| 58 | Autofill Support | No browser autofill |
| 60 | Password Visibility | No interactive toggle |
| 61 | Submit Feedback (live) | Covered by #83 |
| 63 | Mobile Keyboards | No keyboards |
| 64 | Mobile First | No responsive |
| 65 | Breakpoint Testing | No breakpoints |
| 66 | Touch Friendly | No touch |
| 67 | Readable Font Size (mobile) | Covered by #74 scale |
| 68 | Viewport Meta | No viewport |
| 69 | Horizontal Scroll | No scroll |
| 70 | Image Scaling (responsive) | Fixed page size |
| 78 | Loading Indicators | No async |
| 81 | Progress Indicators | No multi-step runtime |
| 82 | Toast Notifications | No transient UI |
| 88 | User Freedom (skip tours) | No onboarding tours |
| 89 | Autocomplete | No live search |
| 90 | No Results (web) | N/A |
| 91 | Bulk Actions | No runtime editing |
| 92 | AI Disclaimer | N/A for documents |
| 93 | AI Streaming | No streaming |
| 94 | Spatial Gaze Hover | No spatial UI |
| 95 | Spatial Depth Layering | No spatial UI |
| 96 | Auto-Play Video | No video |
| 97 | Asset Weight (3D) | Heavy 3D N/A |
| 98 | AI Feedback Loop | N/A |
| 99 | Motion Sensitivity | No motion |

> Net: **28 kept** (hierarchy 5, color 3, typography 3, forms 9, content 4, images 2, table 1,
> plus #75 adapted), **71 discarded**.
