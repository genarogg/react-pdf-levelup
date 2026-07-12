# Chart Types for PDF (25 → `<ChartJS>`)

Source: `ui-ux-pro-max` → `data/charts.csv` (25 data-shape → chart-type recommendations).
Mapped to the `react-pdf-levelup` `<ChartJS>` component, whose `data` prop is a standard
**Chart.js `ChartConfiguration`** (see `plugins-and-qr.md`). A PDF is a static snapshot, so:

- **No interactivity.** `tooltip`, `hover`, `onClick`, zoom/pan, animation, streaming — all
  ignored at render time. Set `options.animation = false` and `options.responsive = false`.
- **Legends must be drawn by Chart.js** (`options.plugins.legend.display = true`); they bake
  into the image. Tooltips do NOT — if a value matters, also print it as a label or a table.
- **Accessibility = a data table.** Chart.js charts are images; pair every chart with a
  `<Table>` (or `<UL>`) listing the values so screen readers and print readers get the data.
- **Plugins are not all bundled.** Chart.js core supports `line, bar, pie, doughnut,
  scatter, bubble, radar, polarArea`. Types needing a community controller (treemap,
  boxplot, financial, funnel, sankey, matrix, gauge) are noted per row — confirm the plugin
  is registered in your ChartJS build, or use the Div-based fallback.

`<ChartJS>` renders the chart to a base64 image and embeds it; image format is PNG.

---

## 1. Trend Over Time → `line`
Use when: a time axis, observe rise/fall over a continuous period (sales over months,
temperature, cumulative progress).
```js
const data = {
  type: 'line',
  data: { labels: ['Jan','Feb','Mar'], datasets: [{ label: 'Revenue', data: [10,14,22],
    borderColor: '#0080FF', backgroundColor: 'rgba(0,128,255,0.2)', fill: true,
    borderWidth: 2, tension: 0.3 }] },
  options: { animation: false, responsive: false, plugins: { legend: { display: true } } },
};
```
Color: `#0080FF` primary; multiple series → distinct color **and** distinct `borderDash`.
PDF: differentiate series by line style, not color alone (colorblind fallback).

## 2. Compare Categories → `bar`
Use when: discrete categories ranked by magnitude (top products, regional totals).
```js
const data = { type: 'bar',
  data: { labels: ['A','B','C'], datasets: [{ label: 'Units', data: [120,90,60],
    backgroundColor: '#2563EB', borderRadius: 2 }] },
  options: { animation: false, indexAxis: 'x', plugins: { legend: { display: false } } } };
```
Sort descending; print value labels (`datalabels` or bake via a `%` axis). ≤15 bars; >15 → table.

## 3. Part-to-Whole → `pie` / `doughnut`
Use when: ≤5 categories, proportion over exact value.
```js
const data = { type: 'doughnut',
  data: { labels: ['New','Returning','Churned'], datasets: [{ data: [60,30,10],
    backgroundColor: ['#2563EB','#22C55E','#EF4444'] }] },
  options: { animation: false, plugins: { legend: { display: true } } } };
```
Largest slice at 12 o'clock; label slices with `%`. **WCAG fail for colorblind** → always
pair with a stacked-bar or `%` table. >5 categories → stacked bar instead.

## 4. Correlation / Distribution → `scatter` / `bubble`
Use when: relationship between two continuous variables, clusters/outliers.
```js
const data = { type: 'scatter',
  data: { datasets: [{ label: 'Samples', data: [{x:1,y:3},{x:2,y:5}],
    backgroundColor: 'rgba(0,128,255,0.7)', pointRadius: 4 }] },
  options: { animation: false, scales: { x: { type: 'linear' }, y: { type: 'linear' } } } };
```
Bubble = add `r`; combine color + shape per group for colorblind readers.

## 5. Heatmap / Intensity → `matrix` (or Div grid)
Use when: intensity across a 2D grid (activity by hour × day), ≤10k cells.
```js
// Needs chartjs-chart-matrix. If unavailable, render a colored grid with <Div> cells.
const data = { type: 'matrix',
  data: { datasets: [{ label: 'Intensity', data: cells /* {x,y,v} */,
    backgroundColor: (c) => intensityColor(c.raw.v), width: ({chart}) => cellSize }] },
  options: { animation: false } };
```
Gradient cool→hot; **always add numeric labels / legend ticks** + a data table fallback.

## 6. Geographic Data → pre-rendered map image + bar
Use when: regional/location dimension. Chart.js has no native choropleth; don't try to draw
one. Instead drop in a static `Img`/map image (must be absolute `https://`) and back it with
a `bar` of values per region.
PDF: include a sortable region table; label major regions in text.

## 7. Funnel / Flow → `bar` (horizontal) or funnel plugin
Use when: sequential stages, conversion/drop-off.
```js
// chartjs-plugin-funnel, or approximate with a descending horizontal bar:
const data = { type: 'bar', data: { labels: ['Visit','Signup','Pay'], datasets: [{ data: [1000,400,120],
  backgroundColor: '#6366F1' }] }, options: { indexAxis: 'y', animation: false } };
```
Show conversion `%` between stages as text; linear list fallback required for a11y.

## 8. Performance vs Target → `doughnut` (gauge) or `bar` (bullet)
Use when: one KPI vs a threshold (dashboard summary).
```js
// Gauge ≈ a 270° doughnut with a needle dataset; simpler: a horizontal bullet bar:
const data = { type: 'bar', data: { labels: ['Actual'], datasets: [
  { data: [72], backgroundColor: '#22C55E', borderRadius: 4 },
  { data: [28], backgroundColor: '#E5E7EB' } ] }, /* track behind */ options: { animation: false } };
```
Always print `value + % of target` as visible text — never rely on color/position alone.

## 9. Time-Series Forecast → `line` with confidence band
Use when: historical + predicted, uncertainty range.
```js
const data = { type: 'line', data: { labels, datasets: [
  { label: 'Actual', data, borderColor: '#0080FF' },
  { label: 'Forecast', data, borderColor: '#FF9500', borderDash: [6,4] },
  { label: 'Band', data: upper, fill: '+1', backgroundColor: 'rgba(255,149,0,0.15)' } ] },
  options: { animation: false } };
```
Legend must distinguish solid (actual) vs dashed (forecast) — not color alone.

## 10. Anomaly Detection → `line` with highlighted points
Use when: monitoring a series for outliers.
```js
const data = { type: 'line', data: { datasets: [{ data, borderColor: '#0080FF',
  pointBackgroundColor: (c) => c.raw.anomaly ? '#FF0000' : '#0080FF', pointRadius: (c) => c.raw.anomaly ? 6 : 2 }] },
  options: { animation: false } };
```
Mark anomalies with shape (not color only) + a text annotation per event.

## 11. Hierarchical / Nested → `treemap` (plugin) or indented table
Use when: size within a hierarchy (budget breakdown). Needs `chartjs-chart-treemap`.
```js
const data = { type: 'treemap', data: { datasets: [{ tree: hierarchy,
  backgroundColor: () => '#3B82F6', borderWidth: 2, borderColor: '#fff' }] }, options: { animation: false } };
```
Mandatory table alternative; label large areas; ≤3 levels deep.

## 12. Flow / Process → flow table (Sankey not native)
Use when: quantities flowing source→target. Chart.js has no Sankey; render a
`<Table>` (Source → Target → Value) or a pre-rendered Sankey image. Keyboard-traversable row
list as the a11y view.

## 13. Cumulative Changes → `bar` (waterfall plugin or stacked)
Use when: components add to a total (P&L, budget variance), 4–12 bars.
```js
// chartjs-chart-waterfall, or emulate with a transparent "float" stacked bar:
const data = { type: 'bar', data: { labels: ['Start','+Rev','-Cost','End'], datasets: [
  { data: [0, 100, 0, 0], backgroundColor: 'transparent' },     // float
  { data: [100, 0, -40, 60], backgroundColor: ['#2196F3','#4CAF50','#F44336','#0D47A1'] } ] },
  options: { animation: false } };
```
Labels on every bar; direction arrows (▲/▼) not color alone.

## 14. Multi-Variable Comparison → `radar`
Use when: 2–3 entities across the same 5–8 attributes.
```js
const data = { type: 'radar', data: { labels: ['Speed','Cost','Quality','Support'], datasets: [
  { label: 'Plan A', data: [4,3,5,4], borderColor: '#0080FF', backgroundColor: 'rgba(0,128,255,0.3)' },
  { label: 'Plan B', data: [3,5,4,3], borderColor: '#F59E0B', backgroundColor: 'rgba(245,158,11,0.3)' } ] },
  options: { animation: false, scales: { r: { suggestedMin: 0, suggestedMax: 5 } } } };
```
≤8 axes; always pair with a grouped bar alternative for precise reading.

## 15. Stock / Trading OHLC → `candlestick` (financial plugin)
Use when: Open/High/Low/Close financial series. Needs `chartjs-chart-financial`.
```js
const data = { type: 'candlestick', data: { datasets: [{ data: ohlc /* {o,h,l,c} */,
  color: { up: '#26A69A', down: '#EF5350' } }] }, options: { animation: false } };
```
Provide an OHLC data table; bullish=filled / bearish=hollow (not color alone).

## 16. Relationship / Connection → pre-rendered image + list
Use when: network topology. No native graph in Chart.js. Drop a static network image
(absolute `https://`) + an adjacency list `<Table>` (Node A → Node B → weight).

## 17. Distribution / Statistical → `boxplot` (plugin)
Use when: spread/median/outliers across groups. Needs `chartjs-chart-boxplot`.
```js
const data = { type: 'boxplot', data: { labels: ['G1','G2'], datasets: [{ data: [[3,5,7,8,12],[4,6,7,9,11]] }] },
  options: { animation: false } };
```
Include a stats summary table (min/Q1/median/Q3/max + outlier count).

## 18. Performance vs Target (Compact) → `bar` (bullet)
Use when: several KPIs side by side in a dashboard grid.
```js
const data = { type: 'bar', data: { labels: ['KPI1','KPI2'], datasets: [{ data: [82,64],
  backgroundColor: '#1976D2' }] }, options: { animation: false } };
```
All values visible as text; color ranges labeled with threshold text, not color alone.

## 19. Proportional / Percentage → Waffle (Div grid)
Use when: fraction of a whole, ≤5 categories. No native waffle; render a 10×10 grid of
`<Div>` cells colored per category (12% opacity gap), each with `aria-label`.
```jsx
<Container style={{ flexDirection: 'row', flexWrap: 'wrap', width: 100 }}>
  {cells.map((c,i) => <Div key={i} style={{ width: 10, height: 10, backgroundColor: c.color }} />)}
</Container>
```
Percentage text always visible (better than pie for a11y).

## 20. Hierarchical Proportional → `treemap` (or Sunburst image)
Use when: nested proportions, ≤3 levels. Prefer treemap (plugin) over sunburst; mandatory
collapsible indented list with `%` for a11y.

## 21. Root Cause Analysis → decomposition tree table
Use when: a metric decomposing into contributing factors. No native tree; render a
`<Table>` (Factor → Value → % Impact) or an indented list; keyboard-expandable in HTML,
printed flat in PDF.

## 22. 3D Spatial Data → static image only
Use when: Z-axis carries essential info. **3D cannot render in a PDF chart canvas.** Drop a
pre-rendered 3D screenshot (absolute `https://`) + a 2D projection image + data table.
Never use as the sole representation.

## 23. Real-Time Streaming → latest snapshot `line`/`area`
Use when: live monitoring context. A PDF captures one moment — take the **latest snapshot**
and render it as a normal `line`/`area`; print "as of <timestamp>". No pulse/streaming.

## 24. Sentiment / Emotion → sized-word Divs or image
Use when: NLP output frequency-weighted by sentiment. No native word cloud; render words as
`<Div>`s sized by frequency with sentiment color, OR a pre-rendered cloud image + a sortable
list (term | sentiment | frequency) as the a11y source.

## 25. Process Mining → flow table / image
Use when: event-log flows, bottlenecks. No native process map; render a `<Table>` (Variant →
Frequency → Avg Duration) + note top-3 bottlenecks as text annotations.

---

## Quick decision table

| Data shape | Chart.js type | Plugin needed? | PDF fallback |
|---|---|---|---|
| Trend over time | `line` | no | labels + table |
| Compare categories | `bar` | no | value labels |
| Part-to-whole | `doughnut` | no | `%` table (a11y) |
| Correlation | `scatter`/`bubble` | no | shape+color |
| Heatmap | `matrix` | yes | Div grid |
| Geographic | image + `bar` | n/a | region table |
| Funnel | `bar`(y) | plugin opt. | `%` text |
| Target/KPI | `doughnut`/`bar` | no | value+% text |
| Forecast | `line` | no | band fill |
| Anomaly | `line` | no | point shape |
| Hierarchy | `treemap` | yes | indented table |
| Flow/Sankey | image/table | n/a | row list |
| Waterfall | `bar` | plugin opt. | arrow labels |
| Multi-var | `radar` | no | grouped bar |
| OHLC | `candlestick` | yes | OHLC table |
| Network | image/table | n/a | adjacency list |
| Distribution | `boxplot` | yes | stats table |
| Waffle | Div grid | n/a | `%` text |
| 3D | image | n/a | 2D + table |
| Streaming | snapshot `line` | no | "as of" |
| Word cloud | Div/image | n/a | term list |
| Process map | table/image | n/a | variant table |

Combine with `color-palettes.md` for the series colors and `font-pairings.md` for axis labels.
