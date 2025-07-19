# react-pdf-levelup

Generador de PDFs dinámicos con React. Esta herramienta te permite crear plantillas PDF con componentes JSX personalizados y previsualizarlas en tiempo real dentro de una aplicación web. Ideal para etiquetas, facturas, reportes, certificados, tablas y más.

# 🌐 **Playground en vivo:** 
[https://react-pdf-levelup.netlify.app](https://react-pdf-levelup.netlify.app)

## 📦 Instalación

```bash
npm install react-pdf-levelup
```

## 🚀 Características

- 🧱 Construye PDFs con componentes de React usando `@react-pdf/renderer`
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
import { generatePDF } from 'react-pdf-levelup';

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

## 💡 Ejemplo de Uso Completo

```typescript
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { generatePDF, decodeBase64Pdf } from 'react-pdf-levelup';

// Definir estilos para el PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
});

// Crear template del PDF
const MyPDFTemplate = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>{data?.title || 'Documento PDF'}</Text>
        {data?.items?.map((item, index) => (
          <Text key={index}>• {item}</Text>
        ))}
      </View>
    </Page>
  </Document>
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
    
    // Descargar y abrir el PDF
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

## 🎨 Templates Avanzados

```typescript
import { StyleSheet, Font } from '@react-pdf/renderer';

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
- Los templates deben ser componentes válidos de `@react-pdf/renderer`
- El PDF se genera de forma asíncrona, asegúrate de usar `await` o `.then()`
- Los recursos de memoria se limpian automáticamente después de la descarga

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue o envía un pull request.

## 📄 Licencia

MIT License