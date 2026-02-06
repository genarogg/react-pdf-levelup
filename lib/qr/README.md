# `@react-pdf-levelup/qr`

Paquete de componentes y utilidades para generar códigos QR estilizados dentro de plantillas PDF (React + `@react-pdf/renderer`) y en el frontend.

## NOTA IMPORTANTE esta libreria es un complemento de @react-pdf-levelup/core

<p align="center">
  <img src="https://genarogg.github.io/media/react-pdf-levelup/logo-de-react-pdf-levelup.png" alt="react-pdf-levelup logo" width="160" />
</p>

## Instalación

```bash
npm install @react-pdf-levelup/qr
```

## Componentes principales

- `QR`: componente para insertar un código QR en una plantilla PDF.
- `QRStyle`: utilidades/constructores para generar estilos personalizados de QR (colores, forma de puntos, máscaras, etc.).

## Uso en plantillas PDF (ejemplo mínimo)

```tsx
import React from "react";
import { Document, Page } from "@react-pdf/renderer";
import { QR } from "@react-pdf-levelup/qr";

const MyPdfTemplate = ({ data }) => (
  <Document>
    <Page size="A4">
      {/* QR simple */}
      <QR value={data.url} size={120} />
    </Page>
  </Document>
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
const style = QRStyle({
  dotColor: "#0b74de",
  backgroundColor: "#ffffff",
  eyeColor: "#0b74de",
  eyeRadius: 4,
  dotShape: "rounded",
});

// Usarlo en el componente QR
// <QR value="https://example.com" size={140} style={style} />
```

## Ejemplo avanzado (preview + export)

Frontend (vista previa y generación):

```tsx
import React from "react";
import { QRGenerator, QRstyleGenerator } from "@react-pdf-levelup/qr";

function Preview() {
  const qrValue = "https://react-pdf-levelup.nimbux.cloud";
  const previewStyle = QRstyleGenerator({
    dotColor: "#222",
    eyeColor: "#ff6b6b",
  });

  return (
    <div>
      <h3>Previsualización QR</h3>
      <QRGenerator value={qrValue} size={180} style={previewStyle} />
    </div>
  );
}

export default Preview;
```

## Notes

- Asegúrate de compilar el paquete (`dist/`) antes de publicar.
- `QRStyle`/`QRGenerator` APIs pueden variar según la versión; revisa los archivos fuente `frontend/src/components/core/qr` si necesitas adaptar propiedades concretas.

Si quieres, puedo actualizar README con la API exacta detectada en `frontend/src/components/core/qr` y añadir ejemplos concretos basados en las props reales.
