# react-pdf-levelup

Generador de PDFs dinámicos con React. Esta herramienta te permite crear plantillas PDF con componentes JSX personalizados y previsualizarlas en tiempo real dentro de una aplicación web. Ideal para etiquetas, facturas, reportes, certificados, tablas y más.

<p align="center">
  <img src="https://genarogg.github.io/media/react-pdf-levelup/logo-de-react-pdf-levelup.png" alt="react-pdf-levelup logo" width="160" />
</p>


# 🌐 **Playground en vivo:** 
[https://react-pdf-levelup.nimbux.cloud/playground](https://react-pdf-levelup.nimbux.cloud/playground)

## 📦 Instalación

```bash
npm install @react-pdf-levelup/core
```

## 🚀 Características

- 🧱 Construye PDFs con componentes de React usando los componentes de  Layout, texto, listas, QR, tablas, columnas, etc.
- 🖼 Vista previa en tiempo real de los documentos generados
- 🎨 Editor en vivo con Monaco Editor para personalizar código JSX
- 📦 Plantillas predefinidas listas para usar
- 📄 Soporte para códigos QR, tablas, imágenes, listas, layout dinámico, etc.
- 🔄 Generación de PDFs desde templates de React
- 📥 Descarga automática y vista previa de PDFs generados

## 📋 Funciones Principales

### `generatePDF`

Genera un PDF en formato base64 a partir de un componente de React.

```typescript
import { generatePDF } from '@react-pdf-levelup/core';

const pdfBase64 = await generatePDF({
  template: MyPDFTemplate,
  data: {
    title: 'Mi Documento',
    items: ['Item 1', 'Item 2', 'Item 3']
  }
});
```

**Parámetros:**
- `template`: Componente de React que define la estructura del PDF
- `data`: Datos opcionales que se pasarán al template

**Retorna:** Promise que resuelve a un string en base64 del PDF generado

### `decodeBase64Pdf`

Decodifica un PDF en base64 y permite descargarlo o abrirlo en una nueva pestaña.

```typescript
import { decodeBase64Pdf } from '@react-pdf-levelup/core';

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

## 💡 Ejemplo de Uso con componentes levelup

```typescript
import React from 'react';
import { generatePDF, decodeBase64Pdf, Layout, H1, P, Strong, Em, HR, Container, Row, Col6, UL, LI, Table, Thead, Tbody, Tr, Th, Td } from '@react-pdf-levelup/core';
import { QR } from '@react-pdf-levelup/qr';

const MyPDFTemplate = ({ data }) => (
  <Layout>
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
          <QR url="https://react-pdf-levelup.nimbux.cloud" size={120} />
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
  </Layout>
);

export default MyPDFTemplate;
```

## 🔧 Configuración Avanzada

### Manejo de Errores

```typescript
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

### Solo Generar Base64 (sin descargar)

```typescript
const generatePDFOnly = async () => {
  const pdfBase64 = await generatePDF({
    template: MyTemplate,
    data: myData
  });
  
  // Usar el base64 para otros propósitos (envío por API, almacenamiento, etc.)
  console.log('PDF generado:', pdfBase64);
  return pdfBase64;
};
```

## 🛠 Dependencias

Esta librería utiliza internamente:
- `@react-pdf/renderer` - Para la generación de PDFs
- `react` - Para los componentes JSX

## 📝 Notas Importantes

- La función `decodeBase64Pdf` solo funciona en contexto de navegador (requiere `document`)
- Los templates deben usar los componentes de `@react-pdf-levelup/core` o `@react-pdf/renderer` y retornar JSX válido
- El PDF se genera de forma asíncrona, asegúrate de usar `await` o `.then()`
- Los recursos de memoria se limpian automáticamente después de la descarga

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue o envía un pull request.

## 📄 Licencia

MIT License
