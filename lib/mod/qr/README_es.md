# `@react-pdf-levelup/qr`

Paquete de componentes y utilidades para generar códigos QR estilizados dentro de plantillas de @react-pdf-levelup/core e incluso funciona con @react-pdf/renderer puro

<p align="center">
  <img src="https://genarogg.github.io/media/react-pdf-levelup/logo-de-react-pdf-levelup.png" alt="react-pdf-levelup logo" width="160" />
</p>

## Instalación

```bash
npm install @react-pdf-levelup/qr
```

## Componentes principales

- `QR`: Componente basico para insertar un código QR en una plantilla PDF.
- `QRstyle`: Componente avanzado para generar estilos personalizados de QR (colores, forma de puntos, máscaras, etc.).

## Uso en plantillas PDF (ejemplo mínimo)

```tsx
import { QR } from "@react-pdf-levelup/qr";

const MyPdfTemplate = ({ data }) => (
  ...
      {/* QR simple */}
      <QR value={data.url} size={120} />
  ...
);

export default MyPdfTemplate;
```

Props comunes de `QR` (ejemplos):

- `value` (string): contenido del QR (URL, texto).
- `size` (number): tamaño en px.
- `style` (object): estilo generado por `QRStyle` o un objeto inline con colores y forma.

## Personalizar apariencia con `QRStyle` (ejemplos)

```ts
import { QRStyle } from "@react-pdf-levelup/qr";

// Genera un objeto estilo reutilizable
<QRstyle
  url="https://facebook.com"
  size={100}
  imageOptions={{ imageSize: 0.4, margin: 2 }}
  dotsOptions={{ type: "classy", color: "#1877f2" }}
  cornersSquareOptions={{ type: "extra-rounded", color: "#1877f2" }}
/>

```

