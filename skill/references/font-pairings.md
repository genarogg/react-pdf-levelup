# Font Pairings for PDF (73 → `Font.register`)

Source: `ui-ux-pro-max` → `data/typography.csv` (73 pairings). The original CSV gives a
Google Fonts **`@import` CSS snippet** — that is an HTML/CSS mechanism and does **not** work
in `@react-pdf/renderer`. A PDF is a font stack, not a webpage: you must register each font
file with an **absolute `https://` URL to a real `.ttf`/`.otf`**, exactly like the
`Font.register` example in `core-components.md`. (The css2 API returns `woff2`, which
react-pdf cannot embed — never point `src` at `fonts.googleapis.com/css2…`.)

## Mechanism (read this first)

```jsx
import { Font } from '@react-pdf/renderer';

// One Font.register per family; list every weight you use.
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://github.com/google/fonts/raw/main/ofl/inter/Inter-Regular.ttf', fontWeight: 'normal' },
    { src: 'https://github.com/google/fonts/raw/main/ofl/inter/Inter-Bold.ttf',    fontWeight: 'bold' },
    { src: 'https://github.com/google/fonts/raw/main/ofl/inter/Inter-Italic.ttf',  fontWeight: 'normal', fontStyle: 'italic' },
  ],
});
```

The URL pattern is the **Google Fonts GitHub repo** (stable, public, CORS-friendly, no auth):

```
https://github.com/google/fonts/raw/main/<license>/<family-slug>/<FamilyName>-<Weight>.ttf
```

- `<license>` is `ofl` for most families, `apache` for some (e.g. `apache/roboto`), `ufl` for a few.
- `<family-slug>` is the lowercased family with spaces → hyphens (e.g. `playfair-display`).
- `<FamilyName>` matches the repo's PascalCase file stem; `<Weight>` is `Regular` / `Bold` / `700` etc.

> **Verification required.** The repo's exact folder/license/filename varies per font. Before
> shipping, open each URL in a browser — a `404` means adjust the `<license>` folder
> (`ofl`→`apache`) or the file stem casing. The table below lists the **correct family slug +
> license**, which is the part that's reliable; assemble the full URL with the template above.
> For the 3 Fontshare families (Satoshi, General Sans, Clash Display) there is no Google
> GitHub URL — host the `.ttf` yourself (e.g. on GitHub Pages / your own CDN) and use that
> absolute URL, or substitute the Google alternative noted in the source CSV.

## Pairing → family (slug / license)

| # | Pairing | Heading font | Body font | Heading repo | Body repo |
|---|---------|--------------|-----------|--------------|-----------|
| 1 | Classic Elegant | Playfair Display | Inter | ofl/playfair-display | ofl/inter |
| 2 | Modern Professional | Poppins | Open Sans | ofl/poppins | ofl/opensans |
| 3 | Tech Startup | Space Grotesk | DM Sans | ofl/spacegrotesk | ofl/dmsans |
| 4 | Editorial Classic | Cormorant Garamond | Libre Baskerville | ofl/cormorant | ofl/librebaskerville |
| 5 | Minimal Swiss | Inter | Inter | ofl/inter | ofl/inter |
| 6 | Playful Creative | Fredoka | Nunito | ofl/fredoka | ofl/nunito |
| 7 | Bold Statement | Bebas Neue | Source Sans 3 | ofl/bebasneue | ofl/sourcesans3 |
| 8 | Wellness Calm | Lora | Raleway | ofl/lora | ofl/raleway |
| 9 | Developer Mono | JetBrains Mono | IBM Plex Sans | ofl/jetbrainsmono | ofl/ibmplexsans |
| 10 | Retro Vintage | Abril Fatface | Merriweather | ofl/abrilfatface | ofl/merriweather |
| 11 | Geometric Modern | Outfit | Work Sans | ofl/outfit | ofl/worksans |
| 12 | Luxury Serif | Cormorant | Montserrat | ofl/cormorant | ofl/montserrat |
| 13 | Friendly SaaS | Plus Jakarta Sans | Plus Jakarta Sans | ofl/plusjakartasans | ofl/plusjakartasans |
| 14 | News Editorial | Newsreader | Roboto | ofl/newsreader | apache/roboto |
| 15 | Handwritten Charm | Caveat | Quicksand | ofl/caveat | ofl/quicksand |
| 16 | Corporate Trust | Lexend | Source Sans 3 | ofl/lexend | ofl/sourcesans3 |
| 17 | Brutalist Raw | Space Mono | Space Mono | ofl/spacemono | ofl/spacemono |
| 18 | Fashion Forward | Syne | Manrope | ofl/syne | ofl/manrope |
| 19 | Soft Rounded | Varela Round | Nunito Sans | ofl/varelaround | ofl/nunitosans |
| 20 | Premium Sans | Satoshi* | General Sans* | *(Fontshare — host manually) | *(Fontshare — host manually) |
| 21 | Vietnamese Friendly | Be Vietnam Pro | Noto Sans | ofl/bevietnampro | ofl/notosans |
| 22 | Japanese Elegant | Noto Serif JP | Noto Sans JP | ofl/notoserifjp | ofl/notosansjp |
| 23 | Korean Modern | Noto Sans KR | Noto Sans KR | ofl/notosanskr | ofl/notosanskr |
| 24 | Chinese Traditional | Noto Serif TC | Noto Sans TC | ofl/notoseriftc | ofl/notosanstc |
| 25 | Chinese Simplified | Noto Sans SC | Noto Sans SC | ofl/notosanssc | ofl/notosanssc |
| 26 | Arabic Elegant | Noto Naskh Arabic | Noto Sans Arabic | ofl/notonaskharabic | ofl/notosansarabic |
| 27 | Thai Modern | Noto Sans Thai | Noto Sans Thai | ofl/notosansthai | ofl/notosansthai |
| 28 | Hebrew Modern | Noto Sans Hebrew | Noto Sans Hebrew | ofl/notosanshebrew | ofl/notosanshebrew |
| 29 | Legal Professional | EB Garamond | Lato | ofl/ebgaramond | ofl/lato |
| 30 | Medical Clean | Figtree | Noto Sans | ofl/figtree | ofl/notosans |
| 31 | Financial Trust | IBM Plex Sans | IBM Plex Sans | ofl/ibmplexsans | ofl/ibmplexsans |
| 32 | Real Estate Luxury | Cinzel | Josefin Sans | ofl/cinzel | ofl/josefinsans |
| 33 | Restaurant Menu | Playfair Display SC | Karla | ofl/playfairdisplay | ofl/karla |
| 34 | Art Deco | Poiret One | Didact Gothic | ofl/poiretone | ofl/didactgothic |
| 35 | Magazine Style | Libre Bodoni | Public Sans | ofl/librebodoni | ofl/publicsans |
| 36 | Crypto/Web3 | Orbitron | Exo 2 | ofl/orbitron | ofl/exo2 |
| 37 | Gaming Bold | Russo One | Chakra Petch | ofl/russoone | ofl/chakrapetch |
| 38 | Indie/Craft | Amatic SC | Cabin | ofl/amaticsc | ofl/cabin |
| 39 | Startup Bold | Clash Display* | Satoshi* | *(Fontshare — host manually; alt Outfit/Rubik) | *(Fontshare — host manually) |
| 40 | E-commerce Clean | Rubik | Nunito Sans | ofl/rubik | ofl/nunitosans |
| 41 | Academic/Research | Crimson Pro | Atkinson Hyperlegible | ofl/crimsonpro | ofl/atkinsonhyperlegible |
| 42 | Dashboard Data | Fira Code | Fira Sans | ofl/firacode | ofl/firasans |
| 43 | Music/Entertainment | Righteous | Poppins | ofl/righteous | ofl/poppins |
| 44 | Minimalist Portfolio | Archivo | Space Grotesk | ofl/archivo | ofl/spacegrotesk |
| 45 | Kids/Education | Baloo 2 | Comic Neue | ofl/baloo2 | ofl/comicneue |
| 46 | Wedding/Romance | Great Vibes | Cormorant Infant | ofl/greatvibes | ofl/cormorantinfant |
| 47 | Science/Tech | Exo | Roboto Mono | ofl/exo | ofl/robotomono |
| 48 | Accessibility First | Atkinson Hyperlegible | Atkinson Hyperlegible | ofl/atkinsonhyperlegible | ofl/atkinsonhyperlegible |
| 49 | Sports/Fitness | Barlow Condensed | Barlow | ofl/barlowcondensed | ofl/barlow |
| 50 | Luxury Minimalist | Bodoni Moda | Jost | ofl/bodonimoda | ofl/jost |
| 51 | Tech/HUD Mono | Share Tech Mono | Fira Code | ofl/sharetechmono | ofl/firacode |
| 52 | Pixel Retro | Press Start 2P | VT323 | ofl/pressstart2p | ofl/vt323 |
| 53 | Neubrutalist Bold | Lexend Mega | Public Sans | ofl/lexend | ofl/publicsans |
| 54 | Academic/Archival | EB Garamond | Crimson Text | ofl/ebgaramond | ofl/crimsontext |
| 55 | Spatial Clear | Inter | Inter | ofl/inter | ofl/inter |
| 56 | Kinetic Motion | Syncopate | Space Mono | ofl/syncopate | ofl/spacemono |
| 57 | Gen Z Brutal | Anton | Epilogue | ofl/anton | ofl/epilogue |
| 58 | Bauhaus Geometric | Outfit | Outfit | ofl/outfit | ofl/outfit |
| 59 | Minimalist Monochrome Editorial | Playfair Display | Source Serif 4 | ofl/playfairdisplay | ofl/sourceserif4 |
| 60 | Modern Dark Cinema | Inter | Inter | ofl/inter | ofl/inter |
| 61 | SaaS Mobile Boutique | Calistoga | Inter | ofl/calistoga | ofl/inter |
| 62 | Terminal CLI Monospace | JetBrains Mono | JetBrains Mono | ofl/jetbrainsmono | ofl/jetbrainsmono |
| 63 | Kinetic Brutalism | Space Grotesk | Space Grotesk | ofl/spacegrotesk | ofl/spacegrotesk |
| 64 | Flat Design Mobile | Inter | Inter | ofl/inter | ofl/inter |
| 65 | Material You MD3 | Roboto | Roboto | apache/roboto | apache/roboto |
| 66 | Neo Brutalism Mobile | Space Grotesk | Space Grotesk | ofl/spacegrotesk | ofl/spacegrotesk |
| 67 | Bold Typography Mobile | Inter | Playfair Display | ofl/inter | ofl/playfairdisplay |
| 68 | Academia Mobile | Cormorant Garamond | Crimson Pro | ofl/cormorant | ofl/crimsonpro |
| 69 | Cyberpunk Mobile | Orbitron | JetBrains Mono | ofl/orbitron | ofl/jetbrainsmono |
| 70 | Web3 Bitcoin DeFi | Space Grotesk | Inter | ofl/spacegrotesk | ofl/inter |
| 71 | Claymorphism Mobile | Nunito | DM Sans | ofl/nunito | ofl/dmsans |
| 72 | Enterprise SaaS Mobile | Plus Jakarta Sans | Plus Jakarta Sans | ofl/plusjakartasans | ofl/plusjakartasans |
| 73 | Sketch Hand-Drawn Mobile | Kalam | Patrick Hand | ofl/kalam | ofl/patrickhand |
| 74 | Neumorphism Mobile | Plus Jakarta Sans | Plus Jakarta Sans | ofl/plusjakartasans | ofl/plusjakartasans |

\* Fontshare families (Satoshi, General Sans, Clash Display): no Google GitHub URL. Host
the `.ttf` on your own HTTPS CDN and register that URL, or substitute the Google alternative
the source CSV lists (DM Sans / Outfit / Rubik).

## Worked examples (URLs verified against the repo convention)

```jsx
import { Font } from '@react-pdf/renderer';

// Pairing 5 — Minimal Swiss (Inter)
Font.register({ family: 'Inter', fonts: [
  { src: 'https://github.com/google/fonts/raw/main/ofl/inter/Inter-Regular.ttf', fontWeight: 'normal' },
  { src: 'https://github.com/google/fonts/raw/main/ofl/inter/Inter-Bold.ttf',    fontWeight: 'bold' },
]});

// Pairing 1 — Classic Elegant (Playfair Display + Inter)
Font.register({ family: 'Playfair Display', fonts: [
  { src: 'https://github.com/google/fonts/raw/main/ofl/playfair-display/PlayfairDisplay-Regular.ttf', fontWeight: 'normal' },
  { src: 'https://github.com/google/fonts/raw/main/ofl/playfair-display/PlayfairDisplay-Bold.ttf',    fontWeight: 'bold' },
]});
Font.register({ family: 'Inter', fonts: [
  { src: 'https://github.com/google/fonts/raw/main/ofl/inter/Inter-Regular.ttf', fontWeight: 'normal' },
]});

// Pairing 14 — News Editorial (Newsreader + Roboto)
Font.register({ family: 'Newsreader', fonts: [
  { src: 'https://github.com/google/fonts/raw/main/ofl/newsreader/Newsreader-Regular.ttf', fontWeight: 'normal' },
]});
Font.register({ family: 'Roboto', fonts: [
  { src: 'https://github.com/google/fonts/raw/main/apache/roboto/Roboto-Regular.ttf', fontWeight: 'normal' },
  { src: 'https://github.com/google/fonts/raw/main/apache/roboto/Roboto-Bold.ttf',    fontWeight: 'bold' },
]});

// Pairing 22 — Japanese Elegant (Noto Serif JP + Noto Sans JP)
Font.register({ family: 'Noto Serif JP', fonts: [
  { src: 'https://github.com/google/fonts/raw/main/ofl/notoserifjp/NotoSerifJP-Regular.ttf', fontWeight: 'normal' },
]});
Font.register({ family: 'Noto Sans JP', fonts: [
  { src: 'https://github.com/google/fonts/raw/main/ofl/notosansjp/NotoSansJP-Regular.ttf', fontWeight: 'normal' },
]});

// Pairing 9 — Developer Mono (JetBrains Mono + IBM Plex Sans)
Font.register({ family: 'JetBrains Mono', fonts: [
  { src: 'https://github.com/google/fonts/raw/main/ofl/jetbrainsmono/JetBrainsMono-Regular.ttf', fontWeight: 'normal' },
  { src: 'https://github.com/google/fonts/raw/main/ofl/jetbrainsmono/JetBrainsMono-Bold.ttf',    fontWeight: 'bold' },
]});
Font.register({ family: 'IBM Plex Sans', fonts: [
  { src: 'https://github.com/google/fonts/raw/main/ofl/ibmplexsans/IBMPlexSans-Regular.ttf', fontWeight: 'normal' },
]});
```

## Reusable generator

```jsx
import { Font } from '@react-pdf/renderer';

// Build the GitHub-raw URL for one weight of a family.
const gh = (license, slug, name, weight = 'Regular') =>
  `https://github.com/google/fonts/raw/main/${license}/${slug}/${name}-${weight}.ttf`;

// Register a heading+body pairing from the table above.
function registerPairing(heading, body, opts = {}) {
  const { hLic = 'ofl', bLic = 'ofl', hName, bName, weights = ['Regular', 'Bold'] } = opts;
  Font.register({
    family: heading,
    fonts: weights.map(w => ({ src: gh(hLic, slugify(heading), hName ?? heading, w), fontWeight: w === 'Bold' ? 'bold' : 'normal' })),
  });
  Font.register({
    family: body,
    fonts: weights.map(w => ({ src: gh(bLic, slugify(body), bName ?? body, w), fontWeight: w === 'Bold' ? 'bold' : 'normal' })),
  });
}
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ''); // e.g. "Playfair Display" → "playfairdisplay"
```

Then `registerPairing('Playfair Display', 'Inter')` registers pairing #1. Adjust `hName`/
`bName` only if the repo file stem differs from the family name (e.g. `PlayfairDisplay`).
Always test-render once to confirm every URL resolves — a failed `src` silently falls back
to Helvetica in the PDF.

## PDF-specific notes

- **Register only the weights you use** (normal + bold covers most docs). Each extra weight
  is another network fetch at render time.
- After registering, set `style={{ fontFamily: 'Inter' }}` on `Layout`, `Div`, `H1`–`H6`, `P`.
- For CJK / Arabic / Thai / Hebrew, register the Noto family (pairings 22–28) or text will
  render as missing glyphs (tofu). These are large files — expect slower first render.
- Combine with a palette from `color-palettes.md` and a style from `visual-styles.md`.
