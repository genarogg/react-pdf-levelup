# `@react-pdf-levelup/charts`

Componentes y utilidades para generar y renderizar gráficos (Chart.js) dentro de PDFs con @react-pdf/renderer. Utiliza `chartjs-node-canvas` en entornos Node/SSR y un fallback con `Chart.js` + canvas en navegador.

toda la documentacion de Chart.js https://www.chartjs.org/ es valida para utilizar en este paquete.

## NOTA IMPORTANTE esta libreria es un complemento de @react-pdf-levelup/core

<p align="center">
  <img src="https://genarogg.github.io/media/react-pdf-levelup/logo-de-react-pdf-levelup.png" 
  alt="react-pdf-levelup logo" 
  width="160"
   />
</p>

## Instalación

```bash
npm install @react-pdf-levelup/chart
```

## Componentes

### ChartJS

Componente que renderiza un gráfico de Chart.js como imagen dentro de un documento PDF.

Props:

```ts
type ChartConfiguration = import("chart.js").ChartConfiguration
interface ChartJSProps {
  data: ChartConfiguration
  width?: number
  height?: number
  backgroundColor?: string
  devicePixelRatio?: number
  style?: any
}
```

Parámetros principales:

- `data`: configuración completa de Chart.js (`ChartConfiguration`).
- `width`, `height`: dimensiones del gráfico (px).
- `backgroundColor`: color de fondo del canvas.
- `devicePixelRatio`: escala de render para nitidez.
- `style`: estilos del contenedor (`View`).

### Ejemplo básico

```tsx
import { Layout, ChartJS } from "@react-pdf-levelup/charts"
import type { ChartConfiguration } from "chart.js"

const configuration: ChartConfiguration = {
  type: "bar",
  data: {
    labels: ["Enero", "Febrero", "Marzo", "Abril"],
    datasets: [
      { label: "Ventas", data: [50, 75, 40, 90],
        backgroundColor: ["#4CAF50","#2196F3","#FFC107","#F44336"] }
    ]
  },
  options: { plugins: { legend: { display: true } } }
}

const MyPdf = () => (
  <Layout>
    <ChartJS data={configuration} width={500} height={300} />
  </Layout>
)
```

### Notas

- En Node/SSR se usa `chartjs-node-canvas` para generar imágenes base64 del gráfico.
- En navegador se utiliza `Chart.js` sobre un `canvas` para obtener el DataURL y se inserta con `Image` de `@react-pdf/renderer`.
- Este paquete es un complemento de `@react-pdf-levelup/core`.
