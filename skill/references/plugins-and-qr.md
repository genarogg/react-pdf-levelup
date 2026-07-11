# Plugins & QR Reference

Prop tables for the plugin packages: `ChartJS`, `Icon`, the `Client` utilities, `QR`, and `QRStyle`. Source: https://react-pdf-levelup.nimbux.cloud/docs/en/plugin/

---

## ChartJS (`@react-pdf-levelup/charts`)

Renders a Chart.js chart to an internal canvas, converts it to a base64 image, and embeds it — so any chart type/option Chart.js supports works here.

| Prop | Type | Default |
|---|---|---|
| `data` | Chart.js `ChartConfiguration` object (`type`, `data`, `options`) | required |
| `width` | number | `600` |
| `height` | number | `400` |
| `backgroundColor` | string | `"white"` |
| `devicePixelRatio` | number | `2` |
| `style` | object | `{}` (applies to the wrapping `View`) |

```jsx
import { ChartJS } from '@react-pdf-levelup/charts';

const chartData = {
  type: "bar",
  data: {
    labels: ["January", "February", "March", "April"],
    datasets: [{ label: "Sales", data: [50, 75, 40, 90], backgroundColor: ["#4CAF50", "#2196F3", "#FFC107", "#F44336"] }],
  },
  options: { plugins: { legend: { display: true } } },
};

<ChartJS data={chartData} width={500} height={300} />
```

`data` follows the official [Chart.js docs](https://www.chartjs.org/docs/) exactly — any chart type (`bar`, `line`, `pie`, `doughnut`, `radar`, etc) and any option Chart.js supports is valid here. Prefer setting `backgroundColor` on the component itself (not just inside `data`) so the chart's canvas matches the surrounding card/page background instead of defaulting to plain white.

---

## Icon (`@react-pdf-levelup/icons`)

Renders a [Lucide](https://lucide.dev/icons/) icon as a scalable vector graphic.

| Prop | Type | Default |
|---|---|---|
| `ico` | string, PascalCase Lucide name (e.g. `"Home"`, `"FileText"`, `"Heart"`) | required |
| `color` | string (stroke color) | `"currentColor"` |
| `fill` | string | `"none"` |
| `size` | number | `18` |
| `style` | object | `{}` (wrapping `View`) |

```jsx
<Icon ico="Heart" size={24} color="red" fill="red" />
<Icon ico="CheckCircle" size={30} color="green" />
<Icon ico="AlarmClock" size={28} color="orange" style={{ marginRight: 10 }} />
```

No `strokeWidth` prop is exposed — Lucide's default stroke width is used as-is. Browse names at https://lucide.dev/icons/; they must match PascalCase exactly (`AlarmClock`, not `alarm-clock` or `alarmClock`).

---

## Client utilities (`@react-pdf-levelup/client`)

Utility functions for interacting with generated PDFs in browser or Node environments.

- **`generatePDF({ template, data })`** → `Promise<string>` (base64). Same function documented under core.
- **`decodeBase64Pdf(base64, fileName)`** → `void`. Browser only: decodes, triggers a download, opens it in a new tab.
- **`printBase64Pdf(base64Data)`** → `void`. Browser only: builds a hidden iframe, loads the PDF into it, and opens the browser's print dialog.

```jsx
import { generatePDF, decodeBase64Pdf } from '@react-pdf-levelup/client';

async function createAndDownloadPdf() {
  const base64Pdf = await generatePDF({ template: myTemplate, data: { name: 'World' } });
  if (base64Pdf) decodeBase64Pdf(base64Pdf, 'my-document.pdf');
}
```

---

## QR (`@react-pdf-levelup/qr`)

Simple QR generator with optional centered logo.

| Prop | Type | Default |
|---|---|---|
| `url` | string — text/URL to encode | `""` |
| `size` | number | `150` |
| `style` | object | `{}` |
| `colorDark` | string | `"#000000"` |
| `colorLight` | string | `"#ffffff"` |
| `margin` | number | `0` |
| `logo` | string (image URL) | `""` |
| `logoWidth` / `logoHeight` | number | `30` / `30` |
| `errorCorrectionLevel` | `"L"` \| `"M"` \| `"Q"` \| `"H"` | `"H"` with a logo, `"M"` without |
| `debug` / `fixed` / `break` | boolean | `false` |

```jsx
<QR
  url="https://react-pdf-levelup.com"
  size={200}
  colorDark="#1a202c"
  colorLight="#f7fafc"
  margin={5}
  logo="https://picsum.photos/id/237/200/200"
  logoWidth={40}
  logoHeight={40}
  errorCorrectionLevel="H"
/>
```

---

## QRStyle (`@react-pdf-levelup/qr`, formerly `QRV2`)

Advanced QR styling (dot shapes, corner shapes, background, centered image) via the `qr-code-styling` library.

| Prop | Type | Default |
|---|---|---|
| `value` ⚠️ see note | string — text/URL to encode | `""` |
| `size` | number | `300` |
| `style` | object | `{}` |
| `image` | string (logo URL) | `undefined` |
| `dotsOptions` | `{ color?, type?: "rounded"\|"dots"\|"classy"\|"classy-rounded"\|"square"\|"extra-rounded" }` | `undefined` |
| `backgroundOptions` | `{ color? }` (default fill `#ffffff`) | `undefined` |
| `imageOptions` | `{ crossOrigin?, margin?, imageSize?: 0–1 }` | `{ margin: 0 }` |
| `cornersSquareOptions` | `{ type?: "dot"\|"square"\|"extra-rounded", color? }` | `undefined` |
| `cornersDotOptions` | `{ type?: "dot"\|"square", color? }` | `undefined` |
| `colorDark`/`colorLight`/`margin`/`errorCorrectionLevel` | — | fallback/compatibility props, used only if the equivalent nested option above isn't set |
| `debug` / `fixed` / `break` | boolean | `false` |

⚠️ **Two known inconsistencies, worth double-checking against whatever's actually installed:**
- **Prop name**: the official prop table calls the encoded-content prop `value`, but the official example code — and every working QR block built in this project so far — passes `url=` instead. Don't assume either name blindly.
- **Casing**: the hosted docs spell the component `QRStyle` (capital S), but working code in this project has consistently used `QRstyle` (lowercase s) successfully. Match whatever the installed version actually exports rather than trusting the docs' casing.

```jsx
<QRStyle
  url="https://react-pdf-levelup.com/docs/qrstyle"
  size={300}
  image="https://picsum.photos/id/66/200/200"
  dotsOptions={{ color: "#4267B2", type: "extra-rounded" }}
  backgroundOptions={{ color: "#E0E0E0" }}
  imageOptions={{ imageSize: 0.4, margin: 2 }}
  cornersSquareOptions={{ type: "dot", color: "#FF0000" }}
  cornersDotOptions={{ type: "square", color: "#00FF00" }}
/>
```
