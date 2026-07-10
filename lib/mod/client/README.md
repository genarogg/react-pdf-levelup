# `@react-pdf-levelup/client`

Utilidad de frontend para decodificar un PDF en base64 generados con @react-pdf-levelup/core y descargarlo/abrirlo en el navegador.

## NOTA IMPORTANTE esta libreria es un complemento de @react-pdf-levelup/core

<p align="center">
  <img src="https://genarogg.github.io/media/react-pdf-levelup/logo-de-react-pdf-levelup.png" 
  alt="react-pdf-levelup logo" 
  width="160"
   />
</p>

## Instalación

```bash
npm install @react-pdf-levelup/client
```

## API

### decodeBase64Pdf

Decodifica un string en base64 correspondiente a un PDF, genera un Blob tipo `application/pdf`, dispara la descarga y abre el documento en una nueva pestaña. Limpia automáticamente el `ObjectURL` creado.

Firma:

```ts
decodeBase64Pdf(base64: string, fileName: string): void
```

Parámetros:

- `base64`: contenido del PDF en base64 (sin prefijo `data:application/pdf;base64,`).
- `fileName`: nombre del archivo a descargar, por ejemplo `documento.pdf`.

### Ejemplo básico (frontend)

```ts
import { decodeBase64Pdf } from "@react-pdf-levelup/client";

const base64 = "..."; // PDF en base64
decodeBase64Pdf(base64, "mi-documento.pdf");
```

### Ejemplo tras generar el PDF

Si ya generaste el PDF en base64 (por ejemplo con `react-pdf-levelup`):

```ts
import { generatePDF } from "@react-pdf-levelup/core";
import { decodeBase64Pdf } from "@react-pdf-levelup/client";
import Template from "./MyTemplate";

const pdfBase64 = await generatePDF({
  template: Template,
  data: { title: "Demo" },
});
decodeBase64Pdf(pdfBase64, "demo.pdf");
```
