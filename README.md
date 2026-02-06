<p align="center">
  <img src="https://genarogg.github.io/media/react-pdf-levelup/logo-de-react-pdf-levelup.png" alt="react-pdf-levelup logo" width="160" />
</p>

# react-pdf-levelup

Generador de PDFs dinámicos con React. Esta herramienta te permite crear plantillas PDF con componentes JSX personalizados y previsualizarlas en tiempo real dentro de una aplicación web. Ideal para facturas, reportes, certificados y más.

# 🌐 **Playground en vivo:** 
[https://react-pdf-levelup.nimbux.cloud](https://react-pdf-levelup.nimbux.cloud)

---

## 📦 Instalación

```bash
npm install react-pdf-levelup
```

---

## 🚀 Características

- 🧱 Construye PDFs con componentes de React usando los componentes de `react-pdf-levelup` (Layout, texto, listas, tablas, columnas, etc.)
- 🧩 Sistema de plugins para extender funcionalidades sin sobrecargar el core
- 🔳 Soporte para códigos QR y estilos avanzados mediante el plugin `@react-pdf-levelup/qr`
- 🖼 Vista previa en tiempo real de los documentos generados
- 🎨 Editor en vivo con Monaco Editor para personalizar código JSX
- 📦 Plantillas predefinidas listas para usar
- 📄 Soporte para tablas, imágenes, listas, layout dinámico, etc.
- 🔄 Generación de PDFs desde templates de React
- 📥 Descarga automática y vista previa de PDFs generados

---

## 🔌 Plugins

`react-pdf-levelup` cuenta con un sistema de plugins que permite agregar nuevas capacidades sin sobrecargar el núcleo de la librería, manteniendo el core ligero y modular.

### Plugins oficiales

| Plugin | Instalación | Docs |
|-------------------------|------------------------------|------|
| **@react-pdf-levelup/qr** | `npm install @react-pdf-levelup/qr` | [🔗](https://react-pdf-levelup.nimbux.cloud/docs/components/media/#qr) |

## 📋 Funciones Principales

### `generatePDF`

Genera un PDF en formato base64 a partir de un componente de React.

```ts
import { generatePDF } from 'react-pdf-levelup';
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
import { decodeBase64Pdf } from 'react-pdf-levelup';

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

## 💡 Ejemplo de Uso con componentes levelup

```ts
import React from 'react';
import { 
  generatePDF, 
  decodeBase64Pdf, 
  LayoutPDF, 
  H1, 
  P, 
  Strong, 
  Em, 
  HR, 
  Container, 
  Row, 
  Col6, 
  UL, 
  LI, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td 
} from 'react-pdf-levelup';

import { QR, QRstyle } from '@react-pdf-levelup/qr';

const MyPDFTemplate = ({ data }) => (
  <LayoutPDF>
    <H1>Documento de Presentación</H1>
    <P>
      Bienvenido a <Strong>react-pdf-levelup</Strong>. Construye PDFs con componentes de React de forma <Em>rápida</Em> y <Em>tipada</Em>.
    </P>
    <HR />
    <Container>
      <Row>
        <Col6>
          <UL>
            <LI>Plantillas listas</LI>
            <LI>Componentes composables</LI>
            <LI>TypeScript</LI>
            <LI>Integración moderna</LI>
          </UL>
        </Col6>
        <Col6>
          <QR 
            value="https://react-pdf-levelup.nimbux.cloud"
            size={120}
          />
        </Col6>
      </Row>
    </Container>
    <Table cellHeight={24}>
      <Thead>
        <Tr>
          <Th width="40%">Producto</Th>
          <Th width="20%">Cantidad</Th>
          <Th width="20%">Precio</Th>
          <Th width="20%">Total</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td width="40%">Etiqueta Térmica 50x30</Td>
          <Td width="20%">2</Td>
          <Td width="20%">$5.00</Td>
          <Td width="20%">$10.00</Td>
        </Tr>
      </Tbody>
    </Table>
  </LayoutPDF>
);

// Función para generar y descargar PDF
const handleGeneratePDF = async () => {
  try {
    const pdfBase64 = await generatePDF({
      template: MyPDFTemplate,
      data: {
        title: 'Mi Lista de Tareas',
        items: [
          'Revisar documentación',
          'Implementar nuevas funciones',
          'Realizar pruebas',
          'Desplegar a producción'
        ]
      }
    });
    
    decodeBase64Pdf(pdfBase64, 'lista-tareas.pdf');
    
  } catch (error) {
    console.error('Error generando PDF:', error);
  }
};

// Componente React
const App = () => {
  return (
    <div>
      <h1>Generador de PDF</h1>
      <button onClick={handleGeneratePDF}>
        Generar y Descargar PDF
      </button>
    </div>
  );
};

export default App;
```

---

## 🎨 Templates Avanzados

```ts
import { StyleSheet, Font, Document, Page, View, Text } from '@react-pdf/renderer';

// Ejemplo de template para factura
const InvoiceTemplate = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.companyName}>{data.company}</Text>
        <Text>Factura #{data.invoiceNumber}</Text>
      </View>
      
      <View style={styles.customerInfo}>
        <Text>Cliente: {data.customer.name}</Text>
        <Text>Email: {data.customer.email}</Text>
      </View>
      
      <View style={styles.itemsTable}>
        {data.items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQuantity}>{item.quantity}</Text>
            <Text style={styles.itemPrice}>${item.price}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.total}>
        <Text>Total: ${data.total}</Text>
      </View>
    </Page>
  </Document>
);
```

---

## 🔧 Configuración Avanzada

### Manejo de Errores

```ts
const handlePDFGeneration = async () => {
  try {
    const pdfBase64 = await generatePDF({
      template: MyTemplate,
      data: myData
    });
    
    decodeBase64Pdf(pdfBase64, 'documento.pdf');
    
  } catch (error) {
    if (error.message.includes('Template not provided')) {
      console.error('Error: No se proporcionó un template válido');
    } else {
      console.error('Error inesperado:', error.message);
    }
  }
};
```

---

### Solo Generar Base64 (sin descargar)

```ts
const generatePDFOnly = async () => {
  const pdfBase64 = await generatePDF({
    template: MyTemplate,
    data: myData
  });
  
  console.log('PDF generado:', pdfBase64);
  return pdfBase64;
};
```

---

## 🛠 Dependencias

Esta librería utiliza internamente:

- `@react-pdf/renderer` — Para la generación de PDFs  
- `react` — Para los componentes JSX  

### Plugins oficiales

- `@react-pdf-levelup/qr` — Componentes para generación y personalización de códigos QR  

---

## 📝 Notas Importantes

- La función `decodeBase64Pdf` solo funciona en contexto de navegador (requiere `document`)
- Los templates deben usar los componentes de `react-pdf-levelup` y retornar JSX válido
- El PDF se genera de forma asíncrona, asegúrate de usar `await` o `.then()`
- Los recursos de memoria se limpian automáticamente después de la descarga

---

## 🌐 API REST para generar PDFs

Genera PDFs vía HTTP desde cualquier lenguaje usando un template TSX en base64 y un objeto de datos.  
Devuelve un JSON con `data.pdf` que es el PDF en base64.

### Endpoints

- Cloud:  
https://react-pdf-levelup.nimbux.cloud/api

- Auto-hospedado ZIP:  
https://genarogg.github.io/react-pdf-levelup/public/api.zip

```
https://react-pdf-levelup.nimbux.cloud/api
```

```
https://genarogg.github.io/react-pdf-levelup/public/api.zip
```

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