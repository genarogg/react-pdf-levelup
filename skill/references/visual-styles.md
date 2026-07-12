# Visual Styles (filtered for static PDF)

Source: `ui-ux-pro-max` → `data/styles.csv` (84 styles). Filter rule applied: a style
**survives** only if its core visual identity — palette + borders + `borderRadius` +
typography + spacing/layout — can be expressed with `@react-pdf/renderer` primitives
that exist in `react-pdf-levelup` (color, `border`, `borderRadius`, `fontFamily`,
`Div`/`Container`/`Row`/`Col`, `H1`–`H6`/`P`, `Table`, `Img`/`ImgBg`).

Hard constraints from the renderer (see `core-components.md` and `SKILL.md`):
- **No `boxShadow`.** Faked elevation = `border` + `borderRadius` only.
- No `backdrop-filter` / blur, no `text-shadow` glow, no CSS gradients, no 3D/WebGL,
  no animation, no hover/focus/gesture states (a PDF is a static snapshot).
- `ImgBg` opacity defaults to `0.2` — set it explicitly if a background texture is used.

Styles kept entirely are marked **Static**. Styles whose identity needs a shadow/gradient
but can be approximated are marked **Approx.** (closest PDF approach documented).
Discarded styles list one-line reasons.

---

## Surviving styles (Static — use as-is)

| # | Style | PDF-safe palette (from styles.csv) | Typography | Radius / Border | Notes for PDF |
|---|-------|--------------------------------------|------------|-----------------|---------------|
| 1 | Minimalism & Swiss | Monochrome `#000`/`#FFF` + 1 neutral accent | Sans-serif, strong hierarchy | `0`, thin rules | Grid-based; high contrast; no decoration |
| 4 | Brutalism | Pure primaries `#FF0000`/`#0000FF`/`#FFFF00` + B/W | System/mono, weight 700+ | `0`, visible 2–4px borders | Asymmetric; instant feel; plain text |
| 6 | Vibrant & Block-based | 4–6 vibrant (neon/duotone) | Bold 32px+, 1 family | blocks, 48px+ gaps | Color blocking; duotone; remove animation |
| 7 | Dark Mode (OLED) | Deep `#000`/`#121212` + neon accents | Any, high contrast | `0`–small | Use as dark color *scheme*; **drop the glow** |
| 8 | Accessible & Ethical | WCAG AA/AAA, 7:1+ | 16px+, clear | visible borders | Keep contrast/symbol rules; drop focus-ring-only guidance |
| 12 | Flat Design | 4–6 solid bright | Bold sans | `0`–4px | No shadow/gradient; clean shapes; SVG icons |
| 17 | Inclusive Design | WCAG AAA, avoid red-green-only | 16px+ | visible borders | Keep symbol/contrast rules; drop haptic/voice |
| 20 | Hero-Centric (layout) | Brand + white + CTA accent | Large headline | — | Use as a page *layout*: full-width hero, single CTA |
| 21 | Conversion-Optimized (layout) | Brand + high-contrast CTA | — | — | Single CTA, trust badges, social proof block |
| 22 | Feature-Rich Showcase (layout) | Brand + feature-card colors | — | card radius | Grid of benefit cards w/ icons; drop hover lift |
| 23 | Minimal & Direct (layout) | Mono primary + 1 accent | Clean 18–20px | — | Single column, generous whitespace, one CTA |
| 24 | Social Proof-Focused (layout) | Brand + trust/success | — | — | Testimonials, logo row, star ratings, metrics |
| 26 | Trust & Authority (layout) | Navy/grey + gold cert accents | Professional | — | Badges, credentials, case metrics, security marks |
| 27 | Storytelling-Driven (layout) | Section-coded palettes | Varied | — | Multi-section narrative flow; drop scroll animation |
| 28 | Data-Dense Dashboard (layout) | Neutral `#F5F5F5` + data colors | 12–14px dense | 8–12px gaps | KPI cards + tables + charts grid — ideal for reports |
| 30 | Executive Dashboard (layout) | Brand + status R/Y/G | Large metrics | card radius | 4–6 big KPI cards + sparkline + trend arrows |
| 33 | Comparative Analysis (layout) | Compare orange/blue + delta | — | — | Side-by-side metrics w/ +/- delta colors |
| 36 | Financial Dashboard (layout) | Trust navy + profit/loss green/red | Tabular figures | table borders | P&L, budget variance, currency formatting |
| 37 | Sales Intelligence (layout) | Won/lost green/red + gold | — | — | Pipeline, gauges (ChartJS), leaderboard table |
| 42 | Organic Biophilic | Earth `#228B22`/brown/sky | Humanist | 16–24px organic | Drop textures/gradients; keep colors + soft radius |
| 44 | Memphis Design | Clashing brights | Bold | geometric | Clip-path/View shapes; drop blend modes/rotation anim |
| 47 | Exaggerated Minimalism | B/W + 1 accent | Oversized 900 | `0` | Huge type, extreme whitespace, single accent |
| 50 | Swiss Modernism 2.0 | `#000`/`#FFF` + 1 accent | Inter/Helvetica | `0` | Strict 12-col grid, math spacing, single accent |
| 52 | Pixel Art | Limited NES palette | Pixel font (register) | blocky | Blocky shapes via `Div`; pixel font via `Font.register` |
| 56 | E-Ink / Paper | Paper `#FDFBF7` / ink `#1A1A1A` | Serif reading | 1px hairline | Instant transitions; monochrome; print-friendly |
| 59 | Anti-Polish / Raw | Paper `#FAFAF8` / pencil `#4A4A4A` | Sketch/handwritten | hand-drawn SVG | Paper texture optional (ImgBg); authentic imperfection |
| 61 | Nature Distilled | Terracotta/sand/olive | Humanist sans | organic radius | Drop parallax; keep earthy warm tones |
| 66 | Editorial Grid / Magazine | B/W + brand accent | Serif body | — | Asymmetric grid, pull quotes, **drop caps**, columns |
| 68 | Vintage Analog / Film | Faded cream/sepia/teal | — | — | Keep warm faded palette; grain/VHS are optional texture |
| 70 | Minimalist Monochrome | Pure `#000`/`#FFF` | Serif + mono labels | `0`, no shadow | Inversion via fill color; 4px black rules |
| 73 | Terminal CLI | Matrix green `#33FF00` on `#050505` | Mono only | `0` | ASCII borders via chars; drop blink/typewriter/haptic |
| 75 | Flat Design Mobile (Touch-First) | Blue `#3B82F6`/emerald `#10B981` | 800/600/400 | 6/12/999 | Color-blocking sections; zero elevation |
| 78 | Bold Typography (Poster) | Near-black `#0A0A0A`/warm white | Inter Tight + mono | `0` | 5:1 type scale, underline CTA, edge-to-edge headline |
| 79 | Academia (Scholarly) | Mahogany/oak/parchment + brass | Cormorant/Crimson/Cinzel | arch-top radius | Drop vignette/shadow → use borders; serif system |
| 83 | Enterprise SaaS (Mobile) | Indigo `#4F46E5`/violet `#7C3AED` | Plus Jakarta Sans | 16 / pill | Keep tokens; **gradient CTA → flat indigo**; shadow→border |
| 84 | Sketch Hand-Drawn (Mobile) | Paper + pencil `#2D2D2D` + red marker | Kalam/Patrick Hand | wobbly per corner | Drop jiggle; hard offset shadow via Div (see Approx.) |

## Surviving styles (Approx. — shadow/gradient faked with borders/offset Div)

| # | Style | Closest PDF approach | Why approximated |
|---|-------|----------------------|------------------|
| 38 | Neubrutalism | Thick 3px+ black borders, `0` radius, hard **offset shadow faked with a solid-color `Div` placed 4px behind/right** of the card | Real offset shadow needs `boxShadow` (unsupported) |
| 39 | Bento Box Grid | Modular `Container`/`Row`/`Col` grid, 16–24px radius, **`border` instead of soft shadow**, neutral `#F5F5F7` page | Soft shadows unsupported; borders give the same card separation |
| 53 | Bento Grids | Same as #39 | Same |
| 69 | Bauhaus | Primary color blocking (red/blue/yellow), geometric `Div` shapes, **hard 4px offset shadow via offset `Div`**, `Outfit` 900 uppercase | Offset shadow unsupported natively |
| 76 | Material You (MD3) | Pill radius (`999`), tonal color tokens, **state-layer → flat tinted fill**, shadow→`border` | Tonal elevation + shadow unsupported |
| 77 | Neo Brutalism (Mobile) | Cream `#FFFDF5` bg, 4px black borders, pop colors, **offset shadow via offset `Div`**, slightly rotated cards | Hard offset shadow unsupported |
| 29 | Heat Map (style) | Map to `<ChartJS>` heatmap (see `chart-types.md`); grid of colored cells, **add numeric labels for colorblind fallback** | Gradient/intensity is a chart, not a style effect |

## Discarded styles (reason per style)

| # | Style | Motivo del descarte |
|---|-------|---------------------|
| 2 | Neumorphism | Sombra suave multicapa es la identidad; sin `boxShadow` no existe |
| 3 | Glassmorphism | `backdrop-filter: blur` + translúcido es el núcleo; no soportado |
| 5 | 3D & Hyperrealism | WebGL, sombras realistas, parallax, 3D |
| 9 | Claymorphism | 3D suave, doble sombra, gradientes pastel |
| 10 | Aurora UI | Gradientes vibrantes, blur, glow |
| 11 | Retro-Futurism | CRT scanlines, neon glow, glitch |
| 13 | Skeuomorphism | Texturas, sombras realistas, gradientes 8–12 stops |
| 14 | Liquid Glass | Vidrio morphing, blur, aberración cromática |
| 15 | Motion-Driven | El núcleo es el movimiento/animación |
| 16 | Micro-interactions | Animaciones pequeñas, gestos, háptica |
| 18 | Zero Interface | Voice-first, gestos, UI invisible |
| 19 | Soft UI Evolution | Depende de sombras suaves mejoradas |
| 25 | Interactive Product Demo | Video embebido, hover-reveal, modales |
| 31 | Real-Time Monitoring | Updates en vivo, pulse, streaming |
| 32 | Drill-Down Analytics | Expandible, breadcrumb interactivo, drill |
| 34 | Predictive Analytics | Forecast lines, bandas de confianza, toggles |
| 35 | User Behavior Analytics | Funnel/cohort sobreviven como *chart* (véase #29/#37); descartado como "estilo" interactivo |
| 40 | Y2K Aesthetic | Gradientes metálicos, glossy, glow |
| 41 | Cyberpunk UI | Neon glow, glitch, scanlines, terminal |
| 43 | AI-Native UI | Chat, streaming text, typing indicators |
| 45 | Vaporwave | Sunset gradients, glitch, glow |
| 46 | Dimensional Layering | z-index, backdrop blur, elevation shadows |
| 48 | Kinetic Typography | Texto animado es el núcleo |
| 49 | Parallax Storytelling | Scroll-driven, parallax, inmersivo |
| 51 | HUD / Sci-Fi FUI | Glow, scanning animation, transparencia, líneas neon |
| 54 | (fila ausente en datos) | — |
| 55 | Spatial UI (VisionOS) | Cristal, profundidad, blur, parallax |
| 57 | Gen Z Chaos / Maximalism | Marquee, jitter, GIF, blend modes |
| 58 | Biomimetic / Organic 2.0 | Respiración animada, morphing, gradientes, WebGL |
| 60 | Tactile Digital / Deformable | Jelly buttons, spring physics, deformación |
| 62 | Interactive Cursor Design | Cursor custom, hover, magnético |
| 63 | Voice-First Multimodal | Voz, waveform, audio |
| 64 | 3D Product Preview | 360 rotate, AR, WebGL |
| 65 | Gradient Mesh / Aurora Evolved | Mesh gradients, iridescent, glow |
| 67 | Chromatic Aberration / RGB Split | RGB offset, glitch, scanlines, filter |
| 71 | Modern Dark (Cinema Mobile) | Blur, glow, gradient blobs, glassmorphism, haptic |
| 72 | SaaS Mobile (Boutique) | Gradient buttons, glass, spring, haptic, shadow |
| 74 | Kinetic Brutalism (Mobile) | Marquee, parallax, scroll-driven, haptic |
| 80 | Cyberpunk Mobile HUD | Neon glow, glitch, scanlines, chamfered, blur |
| 81 | Bitcoin DeFi (Mobile) | Gradiente, glass, blur, glow |
| 82 | Claymorphism (Mobile) | Clay shadows, gradient, blur |

**Totals:** 37 Static + 7 Approx. = **44 survive**; **40 discarded** (of 84).

---

## How to apply a surviving style in react-pdf-levelup

```jsx
import { Layout, H1, P, Div, Container, Row, Col6 } from '@react-pdf-levelup/core';
import { Font } from '@react-pdf/renderer';

// Pick a palette from color-palettes.md and a pairing from font-pairings.md
Font.register({ family: 'Inter', fonts: [{ src: '…ttf', fontWeight: 'normal' }, /* … */] });

const MyDoc = ({ data }) => (
  <Layout size="A4" meta={{ title: data.title, language: 'en-US' }}>
    {/* Brutalism example: 0 radius, visible 3px border, high contrast */}
    <Div style={{ borderWidth: 3, borderColor: '#000', padding: 16 }}>
      <H1 style={{ fontWeight: 800 }}>{data.title}</H1>
      <P>{data.body}</P>
    </Div>
  </Layout>
);
```

For an **offset-shadow** look (Neubrutalism / Bauhaus / Neo-Brutalism), render a solid
`Div` behind the card, offset by the shadow distance:

```jsx
<Div style={{ position: 'relative' }}>
  <Div style={{ position: 'absolute', top: 4, left: 4, right: 0, bottom: 0, backgroundColor: '#000' }} />
  <Div style={{ position: 'relative', borderWidth: 3, borderColor: '#000', backgroundColor: '#FFFDF5', padding: 16 }}>
    <P>Card content sits above the offset block.</P>
  </Div>
</Div>
```
