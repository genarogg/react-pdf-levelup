# `@react-pdf-levelup/client`

Frontend utility to decode a base64 PDF generated with @react-pdf-levelup/core and download/open/print it in the browser.

## IMPORTANT NOTE this library is a complement to @react-pdf-levelup/core

<p align="center">
  <img src="https://genarogg.github.io/media/react-pdf-levelup/logo-de-react-pdf-levelup.png" 
  alt="react-pdf-levelup logo" 
  width="160"
   />
</p>

## Installation

```bash
npm install @react-pdf-levelup/client
```

## API

### decodeBase64Pdf

Decodes a base64 string corresponding to a PDF, generates an `application/pdf` Blob, triggers the download, and opens the document in a new tab. Automatically cleans up the created `ObjectURL`.

Signature:

```ts
decodeBase64Pdf(base64: string, fileName: string): void
```

Parameters:

- `base64`: PDF content in base64 (without the `data:application/pdf;base64,` prefix).
- `fileName`: name of the file to download, e.g. `document.pdf`.

### printBase64Pdf

Decodes a base64 string corresponding to a PDF and opens the browser's print dialog. Automatically cleans up resources after 3 seconds.

Signature:

```ts
printBase64Pdf(base64: string): void
```

Parameters:

- `base64`: PDF content in base64 (without the `data:application/pdf;base64,` prefix).

### Basic example (decodeBase64Pdf)

```ts
import { decodeBase64Pdf } from "@react-pdf-levelup/client";

const base64 = "..."; // PDF in base64
decodeBase64Pdf(base64, "my-document.pdf");
```

### Example after generating the PDF (decodeBase64Pdf)

If you already generated the PDF in base64 (for example with `react-pdf-levelup`):

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

### Print example (printBase64Pdf)

```ts
import { printBase64Pdf } from "@react-pdf-levelup/client";

const base64 = "..."; // PDF in base64
printBase64Pdf(base64);
```
