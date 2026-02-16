



## 📋 Funciones Principales

### `generatePDF`

Genera un PDF en formato base64 a partir de un componente de React.

```ts
import { generatePDF } from '@react-pdf-levelup/core';
import Template from "./Template"

const pdfBase64 = await generatePDF({
  template: Template,
  data: { // opcional
    title: 'Mi Documento',
    items: ['Item 1', 'Item 2', 'Item 3']
  }
});
```

**Parámetros:**
- `template`: Componente de React que define la estructura del PDF  
- `data`: Datos opcionales que se pasarán al template  

**Retorna:** Promise que resuelve a un string en base64 del PDF generado.

---

### `decodeBase64Pdf`

Decodifica un PDF en base64 y permite descargarlo o abrirlo en una nueva pestaña.

```ts
import { decodeBase64Pdf } from '@react-pdf-levelup/client';

// Después de generar el PDF
const pdfBase64 = await generatePDF({ template: MyTemplate });

// Descargar y abrir el PDF
decodeBase64Pdf(pdfBase64, 'mi-documento.pdf');
```

**Parámetros:**
- `base64`: String del PDF en formato base64  
- `fileName`: Nombre del archivo para la descarga  

**Funcionalidad:**
- Descarga automática del archivo PDF  
- Abre el PDF en una nueva pestaña del navegador  
- Limpia automáticamente los recursos de memoria  



---

### Request

POST con `Content-Type: application/json`:

```json
{
  "template": "<TSX_EN_BASE64>",
  "data": { "campo": "valor" }
}
```

---

### Response

```json
{
  "data": {
    "pdf": "<PDF_EN_BASE64>"
  }
}
```

---

### Ejemplo rápido con Node.js (fetch)

```ts
import fs from "fs";
import path from "path";

type ApiResponse = { data?: { pdf?: string } };
const ENDPOINT_API = "https://react-pdf-levelup.nimbux.cloud/api";

const petition = async ({ template, data }: { template: string, data: any }): Promise<string> => {
  const templatePath = path.join(process.cwd(), "src", "useExample", template);
  const tsxCode = fs.readFileSync(templatePath, "utf-8");
  const templateBase64 = Buffer.from(tsxCode, "utf-8").toString("base64");

  const res = await fetch(ENDPOINT_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ template: templateBase64, data }),
  });

  if (!res.ok) throw new Error(`API error (${res.status}): ${await res.text()}`);

  const json = await res.json() as ApiResponse;
  return json?.data?.pdf ?? "";
}

const savePDF = (base64: string) => {
  const buffer = Buffer.from(base64, "base64");
  const outputPath = path.join(process.cwd(), "example.pdf");
  fs.writeFileSync(outputPath, buffer);
  console.log("PDF guardado:", outputPath);
}
```

---

### Self-hosting propio

- Descarga el paquete ZIP y despliega en tu infraestructura (Node/Docker/PaaS)
- Expón el endpoint `/api/pdf` con el mismo contrato JSON
- Usa el mismo cliente mostrado arriba apuntando a tu URL

Más detalles y ejemplos en la documentación:  
https://react-pdf-levelup-docs.nimbux.cloud/docs/guides/api-rest

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue o envía un pull request.

---

## 📄 Licencia

MIT License