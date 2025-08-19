"use client"

import { createContext, useContext, type ReactNode } from "react"
import React from 'react'
interface ComponentProp {
  name: string
  type: string
  required: boolean
  description: {
    es: string
    en: string
  }
  default?: string
}

interface ComponentExample {
  title: {
    es: string
    en: string
  }
  description: {
    es: string
    en: string
  }
  code: string
}

interface ComponentData {
  id: string
  name: string
  description: {
    es: string
    en: string
  }
  category: string
  tags: string[]
  overview: {
    es: string
    en: string
  }
  features?: {
    es: string[]
    en: string[]
  }
  props: ComponentProp[]
  examples: ComponentExample[]
  usage: {
    es: string
    en: string
  }
}

const componentsData: ComponentData[] = [
  {
    id: "implementation",
    name: "Implementation",
    description: {
      es: "Guía completa para implementar react-pdf-levelup en backend y frontend",
      en: "Complete guide for implementing react-pdf-levelup in backend and frontend",
    },
    category: "Getting Started",
    tags: ["backend", "frontend", "implementation", "base64", "decode"],
    overview: {
      es: "Esta sección proporciona una guía completa sobre cómo usar react-pdf-levelup tanto en el backend para generar PDFs como en el frontend para decodificar y mostrar los PDFs generados.",
      en: "This section provides a complete guide on how to use react-pdf-levelup both in the backend to generate PDFs and in the frontend to decode and display the generated PDFs.",
    },
    features: {
      es: [
        "Generación de PDFs en el servidor (Backend)",
        "Conversión a base64 para transferencia",
        "Decodificación en el cliente (Frontend)",
        "Descarga automática de archivos",
        "Apertura en nueva pestaña",
        "Gestión de memoria optimizada",
        "Soporte completo para TypeScript",
      ],
      en: [
        "PDF generation on server (Backend)",
        "Base64 conversion for transfer",
        "Client-side decoding (Frontend)",
        "Automatic file download",
        "New tab opening",
        "Optimized memory management",
        "Full TypeScript support",
      ],
    },
    props: [
      {
        name: "decodeBase64Pdf",
        type: "function",
        required: true,
        description: {
          es: "Función para decodificar PDFs en base64 en el frontend",
          en: "Function to decode base64 PDFs in the frontend",
        },
      },
    ],
    examples: [
      {
        title: {
          es: "Instalación",
          en: "Installation",
        },
        description: {
          es: "Instala react-pdf-levelup en tu proyecto",
          en: "Install react-pdf-levelup in your project",
        },
        code: `npm install react-pdf-levelup`,
      },
      {
        title: {
          es: "Generación en Backend (API Route)",
          en: "Backend Generation (API Route)",
        },
        description: {
          es: "Genera PDFs en el servidor y convierte a base64",
          en: "Generate PDFs on server and convert to base64",
        },
        code: `// app/api/generate-pdf/route.ts
import { pdf } from 'react-pdf-levelup'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-pdf-levelup'

export async function POST(request: Request) {
  try {
    const { data } = await request.json()
    
    // Crear el documento PDF
    const MyDocument = () => (
      <Document>
        <Page size="A4" style={{ padding: 30 }}>
          <Table>
            <Thead>
              <Tr>
                <Th>Nombre</Th>
                <Th>Email</Th>
                <Th>Fecha</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((item, index) => (
                <Tr key={index}>
                  <Td>{item.name}</Td>
                  <Td>{item.email}</Td>
                  <Td>{item.date}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Page>
      </Document>
    )
    
    // Generar PDF como buffer
    const pdfBuffer = await pdf(<MyDocument />).toBuffer()
    
    // Convertir a base64
    const base64 = pdfBuffer.toString('base64')
    
    return Response.json({ 
      success: true, 
      pdf: base64,
      filename: 'report.pdf'
    })
  } catch (error) {
    return Response.json({ error: 'Error generating PDF' }, { status: 500 })
  }
}`,
      },
      {
        title: {
          es: "Decodificación en Frontend",
          en: "Frontend Decoding",
        },
        description: {
          es: "Decodifica y muestra PDFs en el cliente usando la función decode-base64",
          en: "Decode and display PDFs on client using decode-base64 function",
        },
        code: `// components/decode-base64.tsx
const decodeBase64Pdf = (base64: string, fileName: string) => {
  const byteCharacters = atob(base64)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  const blob = new Blob([byteArray], { type: "application/pdf" })
  const blobUrl = URL.createObjectURL(blob)

  if (document === undefined) {
    console.error("document is undefined, only works in browser context")
    return
  }

  // Crear enlace para descarga
  const link = document.createElement("a")
  link.href = blobUrl
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Abrir en nueva pestaña
  window.open(blobUrl, "_blank")

  // Limpiar memoria
  setTimeout(() => {
    URL.revokeObjectURL(blobUrl)
  }, 100)
}

export default decodeBase64Pdf`,
      },
      {
        title: {
          es: "Uso Completo en Componente React",
          en: "Complete Usage in React Component",
        },
        description: {
          es: "Ejemplo completo de generación y decodificación de PDF",
          en: "Complete example of PDF generation and decoding",
        },
        code: `// components/PDFGenerator.tsx
'use client'
import { useState } from 'react'
import decodeBase64Pdf from './decode-base64'

export default function PDFGenerator() {
  const [loading, setLoading] = useState(false)
  
  const generatePDF = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [
            { name: 'Juan Pérez', email: 'juan@email.com', date: '2024-01-15' },
            { name: 'María García', email: 'maria@email.com', date: '2024-01-16' }
          ]
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Decodificar y mostrar PDF
        decodeBase64Pdf(result.pdf, result.filename)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <button 
      onClick={generatePDF} 
      disabled={loading}
      className="px-4 py-2 bg-blue-600 text-white rounded"
    >
      {loading ? 'Generando...' : 'Generar PDF'}
    </button>
  )
}`,
      },
    ],
    usage: {
      es: `
      <h3>Flujo de Trabajo Completo</h3>
      <p><strong>1. Backend (Generación):</strong></p>
      <ul>
        <li>Instala react-pdf-levelup en tu proyecto</li>
        <li>Crea una API route que genere PDFs usando los componentes</li>
        <li>Convierte el PDF a base64 para transferencia</li>
        <li>Retorna el base64 junto con el nombre del archivo</li>
      </ul>
      
      <p><strong>2. Frontend (Decodificación):</strong></p>
      <ul>
        <li>Recibe el PDF en formato base64 desde el backend</li>
        <li>Usa la función decodeBase64Pdf para convertir a blob</li>
        <li>Descarga automáticamente el archivo</li>
        <li>Abre el PDF en una nueva pestaña</li>
        <li>Limpia la memoria revocando el objeto URL</li>
      </ul>
      
      <h4>Mejores Prácticas:</h4>
      <ul>
        <li>Siempre maneja errores en la generación de PDFs</li>
        <li>Usa loading states para mejor UX</li>
        <li>Limpia los object URLs para evitar memory leaks</li>
        <li>Considera el tamaño del PDF para la transferencia base64</li>
        <li>Implementa validación de datos antes de generar PDFs</li>
      </ul>
      `,
      en: `
      <h3>Complete Workflow</h3>
      <p><strong>1. Backend (Generation):</strong></p>
      <ul>
        <li>Install react-pdf-levelup in your project</li>
        <li>Create an API route that generates PDFs using components</li>
        <li>Convert PDF to base64 for transfer</li>
        <li>Return base64 along with filename</li>
      </ul>
      
      <p><strong>2. Frontend (Decoding):</strong></p>
      <ul>
        <li>Receive PDF in base64 format from backend</li>
        <li>Use decodeBase64Pdf function to convert to blob</li>
        <li>Automatically download the file</li>
        <li>Open PDF in new tab</li>
        <li>Clean memory by revoking object URL</li>
      </ul>
      
      <h4>Best Practices:</h4>
      <ul>
        <li>Always handle errors in PDF generation</li>
        <li>Use loading states for better UX</li>
        <li>Clean object URLs to prevent memory leaks</li>
        <li>Consider PDF size for base64 transfer</li>
        <li>Implement data validation before generating PDFs</li>
      </ul>
      `,
    },
  },
  {
    id: "tablet",
    name: "Table",
    description: {
      es: "Sistema completo de componentes de tabla para documentos PDF con Table, Thead, Tbody, Tr, Th, Td",
      en: "Complete table component system for PDF documents with Table, Thead, Tbody, Tr, Th, Td",
    },
    category: "Layout",
    tags: ["table", "thead", "tbody", "tr", "th", "td", "data", "grid"],
    overview: {
      es: "El sistema de componentes Table proporciona todas las etiquetas necesarias (Table, Thead, Tbody, Tr, Th, Td) para crear tablas profesionales en documentos PDF con soporte completo para estilos, bordes y datos dinámicos.",
      en: "The Table component system provides all necessary tags (Table, Thead, Tbody, Tr, Th, Td) to create professional tables in PDF documents with full support for styling, borders, and dynamic data.",
    },
    features: {
      es: [
        "Componentes completos: Table, Thead, Tbody, Tr, Th, Td",
        "Tablas estáticas y dinámicas",
        "Soporte para colSpan y rowSpan",
        "Estilos zebra automáticos",
        "Alineación de texto configurable",
        "Altura de celda personalizable",
        "Bordes automáticos",
        "Soporte TypeScript completo",
      ],
      en: [
        "Complete components: Table, Thead, Tbody, Tr, Th, Td",
        "Static and dynamic tables",
        "ColSpan and rowSpan support",
        "Automatic zebra styling",
        "Configurable text alignment",
        "Customizable cell height",
        "Automatic borders",
        "Full TypeScript support",
      ],
    },
    props: [
      {
        name: "Table",
        type: "Component",
        required: true,
        description: {
          es: "Contenedor principal de la tabla con contexto para altura de celda",
          en: "Main table container with context for cell height",
        },
      },
      {
        name: "Thead",
        type: "Component",
        required: false,
        description: {
          es: "Encabezado de la tabla con estilos de fondo automáticos",
          en: "Table header with automatic background styling",
        },
      },
      {
        name: "Tbody",
        type: "Component",
        required: false,
        description: {
          es: "Cuerpo de la tabla con soporte para estilos zebra",
          en: "Table body with zebra styling support",
        },
      },
      {
        name: "Tr",
        type: "Component",
        required: true,
        description: {
          es: "Fila de tabla con distribución automática de ancho",
          en: "Table row with automatic width distribution",
        },
      },
      {
        name: "Th",
        type: "Component",
        required: false,
        description: {
          es: "Celda de encabezado con texto en negrita",
          en: "Header cell with bold text",
        },
      },
      {
        name: "Td",
        type: "Component",
        required: false,
        description: {
          es: "Celda de datos con soporte para estilos zebra",
          en: "Data cell with zebra styling support",
        },
      },
    ],
    examples: [
      {
        title: {
          es: "Tabla Básica Estática",
          en: "Basic Static Table",
        },
        description: {
          es: "Tabla simple usando todos los componentes básicos",
          en: "Simple table using all basic components",
        },
        code: `import {Table, Thead, Tbody, Tr, Th, Td } from "react-pdf-levelup"

<Table cellHeight={25}>
  <Thead>
    <Tr>
      <Th>Nombre</Th>
      <Th>Edad</Th>
      <Th>Cargo</Th>
    </Tr>
  </Thead>
  <Tbody>
    <Tr>
      <Td>Juan Pérez</Td>
      <Td>28</Td>
      <Td>Desarrollador</Td>
    </Tr>
    <Tr>
      <Td>María García</Td>
      <Td>32</Td>
      <Td>Diseñadora</Td>
    </Tr>
    <Tr>
      <Td>Carlos López</Td>
      <Td>45</Td>
      <Td>Gerente</Td>
    </Tr>
  </Tbody>
</Table>`,
      },
      {
        title: {
          es: "Tabla con Estilos Personalizados",
          en: "Table with Custom Styles",
        },
        description: {
          es: "Tabla con alineación y estilos personalizados",
          en: "Table with custom alignment and styling",
        },
        code: `<Table cellHeight={30} style={{ marginBottom: 20 }}>
  <Thead textAlign="center">
    <Tr>
      <Th>Producto</Th>
      <Th>Precio</Th>
      <Th>Stock</Th>
      <Th>Estado</Th>
    </Tr>
  </Thead>
  <Tbody>
    <Tr>
      <Td>Laptop HP</Td>
      <Td textAlign="right">$899.99</Td>
      <Td textAlign="center">15</Td>
      <Td textAlign="center">Disponible</Td>
    </Tr>
    <Tr>
      <Td>Mouse Logitech</Td>
      <Td textAlign="right">$29.99</Td>
      <Td textAlign="center">50</Td>
      <Td textAlign="center">Disponible</Td>
    </Tr>
  </Tbody>
</Table>`,
      },
      {
        title: {
          es: "Tabla Avanzada con Datos Dinámicos",
          en: "Advanced Table with Dynamic Data",
        },
        description: {
          es: "Tabla que renderiza datos desde un array con lógica condicional",
          en: "Table that renders data from an array with conditional logic",
        },
        code: `const salesData = [
  { id: 1, product: "Smartphone", sales: 1250, target: 1000, region: "Norte" },
  { id: 2, product: "Tablet", sales: 890, target: 900, region: "Sur" },
  { id: 3, product: "Laptop", sales: 750, target: 800, region: "Este" },
  { id: 4, product: "Smartwatch", sales: 1100, target: 950, region: "Oeste" }
];

<Table cellHeight={28}>
  <Thead textAlign="center">
    <Tr>
      <Th>Producto</Th>
      <Th>Ventas</Th>
      <Th>Objetivo</Th>
      <Th>% Cumplimiento</Th>
      <Th>Región</Th>
      <Th>Estado</Th>
    </Tr>
  </Thead>
  <Tbody>
    {salesData.map((item) => {
      const percentage = ((item.sales / item.target) * 100).toFixed(1);
      const isSuccess = item.sales >= item.target;
      
      return (
        <Tr key={item.id}>
          <Td>{item.product}</Td>
          <Td textAlign="right">{item.sales.toLocaleString()}</Td>
          <Td textAlign="right">{item.target.toLocaleString()}</Td>
          <Td textAlign="center">{percentage}%</Td>
          <Td textAlign="center">{item.region}</Td>
          <Td textAlign="center" style={{ 
            color: isSuccess ? '#22c55e' : '#ef4444' 
          }}>
            {isSuccess ? '✓ Cumplido' : '✗ Pendiente'}
          </Td>
        </Tr>
      );
    })}
  </Tbody>
</Table>`,
      },
      {
        title: {
          es: "Tabla con ColSpan",
          en: "Table with ColSpan",
        },
        description: {
          es: "Tabla usando colSpan para celdas que abarcan múltiples columnas",
          en: "Table using colSpan for cells spanning multiple columns",
        },
        code: `<Table cellHeight={25}>
  <Thead>
    <Tr>
      <Th colSpan={3}>Información Personal</Th>
      <Th colSpan={2}>Contacto</Th>
    </Tr>
    <Tr>
      <Th>Nombre</Th>
      <Th>Apellido</Th>
      <Th>Edad</Th>
      <Th>Email</Th>
      <Th>Teléfono</Th>
    </Tr>
  </Thead>
  <Tbody>
    <Tr>
      <Td>Ana</Td>
      <Td>Martínez</Td>
      <Td>29</Td>
      <Td>ana@email.com</Td>
      <Td>+1234567890</Td>
    </Tr>
  </Tbody>
</Table>`,
      },
    ],
    usage: {
      es: `
      <h4>Componentes Disponibles:</h4>
      <ul>
        <li><strong>Table:</strong> Contenedor principal con contexto para altura de celda</li>
        <li><strong>Thead:</strong> Encabezado con fondo gris automático</li>
        <li><strong>Tbody:</strong> Cuerpo con estilos zebra automáticos</li>
        <li><strong>Tr:</strong> Fila con distribución automática de ancho</li>
        <li><strong>Th:</strong> Celda de encabezado con texto en negrita</li>
        <li><strong>Td:</strong> Celda de datos con soporte zebra</li>
      </ul>
      <h4>Cuándo usar Table:</h4>
      <ul>
        <li>Mostrar datos estructurados en filas y columnas</li>
        <li>Crear reportes financieros o de ventas</li>
        <li>Mostrar inventarios, listas de productos o empleados</li>
        <li>Tablas de comparación o especificaciones</li>
      </ul>
      <h4>Mejores Prácticas:</h4>
      <ul>
        <li>Usar cellHeight consistente para mejor apariencia</li>
        <li>Aplicar textAlign apropiado según el tipo de dato</li>
        <li>Usar colSpan para encabezados agrupados</li>
        <li>Considerar saltos de página para tablas muy largas</li>
        <li>Usar estilos condicionales para resaltar datos importantes</li>
      </ul>
    `,
      en: `
      <h4>Available Components:</h4>
      <ul>
        <li><strong>Table:</strong> Main container with cell height context</li>
        <li><strong>Thead:</strong> Header with automatic gray background</li>
        <li><strong>Tbody:</strong> Body with automatic zebra styling</li>
        <li><strong>Tr:</strong> Row with automatic width distribution</li>
        <li><strong>Th:</strong> Header cell with bold text</li>
        <li><strong>Td:</strong> Data cell with zebra support</li>
      </ul>
      <h4>When to use Table:</h4>
      <ul>
        <li>Displaying structured data in rows and columns</li>
        <li>Creating financial or sales reports</li>
        <li>Showing inventories, product lists, or employee data</li>
        <li>Comparison tables or specifications</li>
      </ul>
      <h4>Best Practices:</h4>
      <ul>
        <li>Use consistent cellHeight for better appearance</li>
        <li>Apply appropriate textAlign based on data type</li>
        <li>Use colSpan for grouped headers</li>
        <li>Consider page breaks for very long tables</li>
        <li>Use conditional styling to highlight important data</li>
      </ul>
    `,
    },
  },
  {
    id: "grid",
    name: "Grid System",
    description: {
      es: "Sistema de cuadrícula tipo Bootstrap para diseños PDF con componentes Container, Row y Column",
      en: "Bootstrap-like grid system for PDF layouts with Container, Row, and Column components",
    },
    category: "Layout",
    tags: ["grid", "layout", "responsive", "bootstrap"],
    overview: {
      es: "Un sistema de cuadrícula completo inspirado en Bootstrap, que proporciona Container, Row y un sistema de diseño de 12 columnas para organizar contenido en documentos PDF.",
      en: "A complete grid system inspired by Bootstrap, providing Container, Row, and 12-column layout system for organizing content in PDF documents.",
    },
    features: {
      es: [
        "Sistema de cuadrícula de 12 columnas",
        "Container para envolver contenido",
        "Row para agrupación horizontal",
        "Anchos de columna flexibles (Col1 a Col12)",
        "Soporte de estilos personalizados",
        "Comportamiento tipo responsive",
      ],
      en: [
        "12-column grid system",
        "Container for content wrapping",
        "Row for horizontal grouping",
        "Flexible column widths (Col1 to Col12)",
        "Custom styling support",
        "Responsive-like behavior",
      ],
    },
    props: [
      {
        name: "children",
        type: "ReactNode",
        required: true,
        description: {
          es: "Contenido a renderizar dentro del componente de cuadrícula",
          en: "Content to be rendered inside the grid component",
        },
      },
      {
        name: "style",
        type: "Style",
        required: false,
        description: {
          es: "Estilos personalizados para el componente de cuadrícula",
          en: "Custom styles for the grid component",
        },
      },
    ],
    examples: [
      {
        title: {
          es: "Diseño de Cuadrícula Básico",
          en: "Basic Grid Layout",
        },
        description: {
          es: "Diseño simple de 3 columnas",
          en: "Simple 3-column layout",
        },
        code: `import { Container, Row, Col4 } from 'react-pdf-levelup'

<Container>
  <Row>
    <Col4>
      <Text>Column 1</Text>
    </Col4>
    <Col4>
      <Text>Column 2</Text>
    </Col4>
    <Col4>
      <Text>Column 3</Text>
    </Col4>
  </Row>
</Container>`,
      },
      {
        title: {
          es: "Anchos de Columnas Mixtos",
          en: "Mixed Column Widths",
        },
        description: {
          es: "Tamaños diferentes de columnas en una fila",
          en: "Different column sizes in one row",
        },
        code: `<Container>
  <Row>
    <Col8>
      <Text>Main content (8/12)</Text>
    </Col8>
    <Col4>
      <Text>Sidebar (4/12)</Text>
    </Col4>
  </Row>
</Container>`,
      },
    ],
    usage: {
      es: `
      <h4>Componentes Disponibles:</h4>
      <ul>
        <li><strong>Container:</strong> Envuelve contenido con padding</li>
        <li><strong>Row:</strong> Crea grupos horizontales de columnas</li>
        <li><strong>Col1-Col12:</strong> Componentes de columna con diferentes anchos</li>
      </ul>
      <h4>Anchos de Columnas:</h4>
      <ul>
        <li>Col1: 8.33% | Col2: 16.66% | Col3: 25% | Col4: 33.33%</li>
        <li>Col5: 41.66% | Col6: 50% | Col7: 58.33% | Col8: 66.66%</li>
        <li>Col9: 75% | Col10: 83.33% | Col11: 91.66% | Col12: 100%</li>
      </ul>
    `,
      en: `
      <h4>Available Components:</h4>
      <ul>
        <li><strong>Container:</strong> Wraps content with padding</li>
        <li><strong>Row:</strong> Creates horizontal groups of columns</li>
        <li><strong>Col1-Col12:</strong> Column components with different widths</li>
      </ul>
      <h4>Column Widths:</h4>
      <ul>
        <li>Col1: 8.33% | Col2: 16.66% | Col3: 25% | Col4: 33.33%</li>
        <li>Col5: 41.66% | Col6: 50% | Col7: 58.33% | Col8: 66.66%</li>
        <li>Col9: 75% | Col10: 83.33% | Col11: 91.66% | Col12: 100%</li>
      </ul>
    `,
    },
  },
  {
    id: "qr",
    name: "QR Code",
    description: {
      es: "Componente avanzado de código QR con soporte de logo y opciones de personalización",
      en: "Advanced QR code component with logo support and customization options",
    },
    category: "Media",
    tags: ["qr", "code", "barcode", "logo"],
    overview: {
      es: "Genera códigos QR en documentos PDF con opciones de personalización extensas que incluyen colores, tamaño, niveles de corrección de errores y incrustación de logo.",
      en: "Generate QR codes in PDF documents with extensive customization options including colors, size, error correction, and logo embedding.",
    },
    features: {
      es: [
        "Colores personalizados (oscuro y claro)",
        "Tamaño y margen ajustables",
        "Incrustación de logo con control de tamaño",
        "Niveles de corrección de errores (L, M, Q, H)",
        "Soporte para generación externa si falla",
        "Soporte para generación en Base64",
      ],
      en: [
        "Custom colors (dark and light)",
        "Adjustable size and margin",
        "Logo embedding with size control",
        "Error correction levels (L, M, Q, H)",
        "Fallback to external API if generation fails",
        "Base64 generation support",
      ],
    },
    props: [
      {
        name: "value",
        type: "string",
        required: true,
        description: {
          es: "Los datos a codificar en el código QR",
          en: "The data to encode in the QR code",
        },
      },
      {
        name: "size",
        type: "number",
        required: false,
        default: "150",
        description: {
          es: "Tamaño del código QR en píxeles",
          en: "Size of the QR code in pixels",
        },
      },
      {
        name: "colorDark",
        type: "string",
        required: false,
        default: "#000000",
        description: {
          es: "Color de los módulos oscuros",
          en: "Color of the dark modules",
        },
      },
      {
        name: "colorLight",
        type: "string",
        required: false,
        default: "#ffffff",
        description: {
          es: "Color de los módulos claros",
          en: "Color of the light modules",
        },
      },
      {
        name: "margin",
        type: "number",
        required: false,
        default: "0",
        description: {
          es: "Margen alrededor del código QR",
          en: "Margin around the QR code",
        },
      },
      {
        name: "logo",
        type: "string",
        required: false,
        description: {
          es: "URL o ruta a la imagen del logo a incrustar",
          en: "URL or path to logo image to embed",
        },
      },
      {
        name: "logoWidth",
        type: "number",
        required: false,
        default: "30",
        description: {
          es: "Ancho del logo incrustado",
          en: "Width of the embedded logo",
        },
      },
      {
        name: "logoHeight",
        type: "number",
        required: false,
        default: "30",
        description: {
          es: "Alto del logo incrustado",
          en: "Height of the embedded logo",
        },
      },
      {
        name: "errorCorrectionLevel",
        type: "'L' | 'M' | 'Q' | 'H'",
        required: false,
        default: "M (H si hay logo)",
        description: {
          es: "Nivel de corrección de errores",
          en: "Error correction level",
        },
      },
    ],
    examples: [
      {
        title: {
          es: "Código QR Básico",
          en: "Basic QR Code",
        },
        description: {
          es: "Código QR simple con texto",
          en: "Simple QR code with text",
        },
        code: `import QR from 'react-pdf-levelup'

<QR 
  value="https://example.com"
  size={200}
/>`,
      },
      {
        title: {
          es: "Código QR con Logo",
          en: "QR Code with Logo",
        },
        description: {
          es: "Código QR con logo de empresa incrustado",
          en: "QR code with embedded company logo",
        },
        code: `<QR 
  value="https://mycompany.com"
  size={250}
  logo="/logo.png"
  logoWidth={40}
  logoHeight={40}
  errorCorrectionLevel="H"
/>`,
      },
      {
        title: {
          es: "Código QR Estilizado",
          en: "Styled QR Code",
        },
        description: {
          es: "Colores y estilos personalizados",
          en: "Custom colors and styling",
        },
        code: `<QR 
  value="Contact: +1234567890"
  size={180}
  colorDark="#2563eb"
  colorLight="#f1f5f9"
  margin={10}
  style={{ border: '2px solid #2563eb' }}
/>`,
      },
    ],
    usage: {
      es: `
      <h4>Niveles de Corrección de Errores:</h4>
      <ul>
        <li><strong>L:</strong> ~7% capacidad de recuperación</li>
        <li><strong>M:</strong> ~15% capacidad de recuperación (por defecto)</li>
        <li><strong>Q:</strong> ~25% capacidad de recuperación</li>
        <li><strong>H:</strong> ~30% capacidad de recuperación (recomendado para logos)</li>
      </ul>
      <h4>Mejores Prácticas:</h4>
      <ul>
        <li>Usar alta corrección de errores (H) cuando se incruste un logo</li>
        <li>Mantener el tamaño del logo razonable (máx 20% del tamaño del QR)</li>
        <li>Probar códigos QR con escáneres reales</li>
        <li>Asegurar suficiente contraste entre colores</li>
      </ul>
    `,
      en: `
      <h4>Error Correction Levels:</h4>
      <ul>
        <li><strong>L:</strong> ~7% recovery capability</li>
        <li><strong>M:</strong> ~15% recovery capability (default)</li>
        <li><strong>Q:</strong> ~25% recovery capability</li>
        <li><strong>H:</strong> ~30% recovery capability (recommended for logos)</li>
      </ul>
      <h4>Best Practices:</h4>
      <ul>
        <li>Use high error correction (H) when embedding logos</li>
        <li>Keep logo size reasonable (max 20% of QR size)</li>
        <li>Test QR codes with actual scanners</li>
        <li>Ensure sufficient contrast between colors</li>
      </ul>
    `,
    },
  },
  {
    id: "img",
    name: "Image",
    description: {
      es: "Componente simple e eficiente de imagen para mostrar imágenes en documentos PDF",
      en: "Simple and efficient image component for displaying images in PDF documents",
    },
    category: "Media",
    tags: ["image", "media", "picture"],
    overview: {
      es: "Un componente de imagen simple que maneja la visualización de imágenes en documentos PDF con manejo automático de tamaño y opciones de estilo.",
      en: "A straightforward image component that handles image display in PDF documents with automatic sizing and styling options.",
    },
    features: {
      es: [
        "Manejo automático de ancho y alto",
        "Soporte de estilos personalizados",
        "Tamaño de imagen responsivo",
        "Control de margen",
        "Soporte para varios formatos de imagen",
      ],
      en: [
        "Automatic width and height handling",
        "Custom styling support",
        "Responsive image sizing",
        "Margin control",
        "Support for various image formats",
      ],
    },
    props: [
      {
        name: "src",
        type: "string",
        required: false,
        description: {
          es: "URL o ruta al archivo de imagen",
          en: "Source URL or path to the image file",
        },
      },
      {
        name: "style",
        type: "Style",
        required: false,
        description: {
          es: "Estilos personalizados para la imagen",
          en: "Custom styles for the image",
        },
      },
    ],
    examples: [
      {
        title: {
          es: "Imagen Básica",
          en: "Basic Image",
        },
        description: {
          es: "Visualización simple de imagen",
          en: "Simple image display",
        },
        code: `import Img from 'react-pdf-levelup'

<Img src="/path/to/image.jpg" />`,
      },
      {
        title: {
          es: "Imagen Estilizada",
          en: "Styled Image",
        },
        description: {
          es: "Imagen con estilos personalizados",
          en: "Image with custom styling",
        },
        code: `<Img 
  src="/logo.png"
  style={{
    width: 200,
    height: 100,
    marginBottom: 20,
    border: '1px solid #ccc'
  }}
/>`,
      },
    ],
    usage: {
      es: `
      <h4>Formatos Soportados:</h4>
      <ul>
        <li>JPEG (.jpg, .jpeg)</li>
        <li>PNG (.png)</li>
        <li>Imágenes codificadas en Base64</li>
        <li>URL externos (con soporte CORS)</li>
      </ul>
      <h4>Comportamiento por Defecto:</h4>
      <ul>
        <li>Ancho: 100% del contenedor</li>
        <li>Alto: Auto (mantiene la relación de aspecto)</li>
        <li>Margen inferior: 14px</li>
      </ul>
    `,
      en: `
      <h4>Supported Formats:</h4>
      <ul>
        <li>JPEG (.jpg, .jpeg)</li>
        <li>PNG (.png)</li>
        <li>Base64 encoded images</li>
        <li>External URLs (with CORS support)</li>
      </ul>
      <h4>Default Behavior:</h4>
      <ul>
        <li>Width: 100% of container</li>
        <li>Height: Auto (maintains aspect ratio)</li>
        <li>Bottom margin: 14px</li>
      </ul>
    `,
    },
  },
  {
    id: "lista",
    name: "Lists",
    description: {
      es: "Componentes de lista completos que soportan listas ordenadas y no ordenadas con varios tipos de marcadores",
      en: "Comprehensive list components supporting ordered and unordered lists with various marker types",
    },
    category: "Content",
    tags: ["list", "ul", "ol", "bullets", "numbering"],
    overview: {
      es: "Sistema de listas completo con soporte para listas no ordenadas (UL), listas ordenadas (OL) y elementos de lista (LI) con opciones extensas de personalización para marcadores y numeración.",
      en: "Complete list system with support for unordered lists (UL), ordered lists (OL), and list items (LI) with extensive customization options for markers and numbering.",
    },
    features: {
      es: [
        "Listas no ordenadas con tipos de viñetas (disco, círculo, cuadrado)",
        "Listas ordenadas con tipos de numeración (decimal, alfa, romano)",
        "Números de inicio personalizados para listas ordenadas",
        "Soporte para listas anidadas",
        "Estilos personalizados para listas y elementos",
        "Generación automática de marcadores",
      ],
      en: [
        "Unordered lists with bullet types (disc, circle, square)",
        "Ordered lists with numbering types (decimal, alpha, roman)",
        "Custom start numbers for ordered lists",
        "Nested list support",
        "Custom styling for lists and items",
        "Automatic marker generation",
      ],
    },
    props: [
      {
        name: "children",
        type: "ReactNode",
        required: true,
        description: {
          es: "Elementos de lista (componentes LI)",
          en: "List items (LI components)",
        },
      },
      {
        name: "style",
        type: "Style",
        required: false,
        description: {
          es: "Estilos personalizados para el contenedor de la lista",
          en: "Custom styles for the list container",
        },
      },
      {
        name: "type",
        type: "'disc' | 'circle' | 'square' | 'decimal' | 'lower-alpha' | 'upper-alpha' | 'lower-roman' | 'upper-roman'",
        required: false,
        description: {
          es: "Tipo de marcador de la lista",
          en: "Type of list marker",
        },
      },
      {
        name: "start",
        type: "number",
        required: false,
        default: "1",
        description: {
          es: "Número de inicio para listas ordenadas",
          en: "Starting number for ordered lists",
        },
      },
    ],
    examples: [
      {
        title: {
          es: "Lista No Ordenada",
          en: "Unordered List",
        },
        description: {
          es: "Lista simple con viñetas",
          en: "Simple bullet list",
        },
        code: `import { UL, LI } from 'react-pdf-levelup'

<UL type="disc">
  <LI>First item</LI>
  <LI>Second item</LI>
  <LI>Third item</LI>
</UL>`,
      },
      {
        title: {
          es: "Lista Ordenada",
          en: "Ordered List",
        },
        description: {
          es: "Lista numerada con número de inicio personalizado",
          en: "Numbered list with custom start",
        },
        code: `import { OL, LI } from 'react-pdf-levelup'

<OL type="decimal" start={5}>
  <LI>Fifth item</LI>
  <LI>Sixth item</LI>
  <LI>Seventh item</LI>
</OL>`,
      },
      {
        title: {
          es: "Numeración en Romanos",
          en: "Roman Numerals",
        },
        description: {
          es: "Lista con marcadores en números romanos",
          en: "List with roman numeral markers",
        },
        code: `<OL type="upper-roman">
  <LI>Introduction</LI>
  <LI>Methodology</LI>
  <LI>Results</LI>
  <LI>Conclusion</LI>
</OL>`,
      },
    ],
    usage: {
      es: `
      <h4>Tipos de Lista:</h4>
      <ul>
        <li><strong>UL (No ordenada):</strong> disc (•), circle (○), square (■)</li>
        <li><strong>OL (Ordenada):</strong> decimal (1,2,3), lower-alpha (a,b,c), upper-alpha (A,B,C)</li>
        <li><strong>Roman:</strong> lower-roman (i,ii,iii), upper-roman (I,II,III)</li>
      </ul>
      <h4>Componentes:</h4>
      <ul>
        <li><strong>UL:</strong> Contenedor de lista no ordenada</li>
        <li><strong>OL:</strong> Contenedor de lista ordenada</li>
        <li><strong>LI:</strong> Elemento de lista (funciona con UL y OL)</li>
      </ul>
    `,
      en: `
      <h4>List Types:</h4>
      <ul>
        <li><strong>UL (Unordered):</strong> disc (•), circle (○), square (■)</li>
        <li><strong>OL (Ordered):</strong> decimal (1,2,3), lower-alpha (a,b,c), upper-alpha (A,B,C)</li>
        <li><strong>LI:</strong> List item (works with both UL and OL)</li>
      </ul>
      <h4>Components:</h4>
      <ul>
        <li><strong>UL:</strong> Unordered list container</li>
        <li><strong>OL:</strong> Ordered list container</li>
        <li><strong>LI:</strong> List item (works with both UL and OL)</li>
      </ul>
    `,
    },
  },
  {
    id: "etiquetas",
    name: "Text Elements",
    description: {
      es: "Conjunto completo de componentes de texto que incluyen encabezados, párrafos, enlaces y elementos de formato",
      en: "Complete set of text components including headings, paragraphs, links, and formatting elements",
    },
    category: "Content",
    tags: ["text", "typography", "headings", "links", "formatting"],
    overview: {
      es: "Colección completa de elementos de texto para documentos PDF, que incluye todos los niveles de encabezado, párrafos, enlaces y componentes de formato de texto.",
      en: "Comprehensive collection of text elements for PDF documents, including all heading levels, paragraphs, links, and text formatting components.",
    },
    features: {
      es: [
        "Todos los niveles de encabezado (H1-H6)",
        "Elementos de párrafo y span",
        "Componente de enlace con soporte de href (solo componente A)",
        "Formato de texto (Strong, Em, U, Small)",
        "Blockquote para citas",
        "Mark para resaltar",
        "Saltos de línea y encabezados",
        "Escala de tipografía consistente",
      ],
      en: [
        "All heading levels (H1-H6)",
        "Paragraph and span elements",
        "Link component with href support",
        "Text formatting (Strong, Em, U, Small)",
        "Blockquote for citations",
        "Line breaks and headers",
        "Consistent typography scaling",
      ],
    },
    props: [
      {
        name: "children",
        type: "ReactNode",
        required: true,
        description: {
          es: "Contenido de texto a mostrar",
          en: "Text content to display",
        },
      },
      {
        name: "style",
        type: "Style",
        required: false,
        description: {
          es: "Estilos personalizados para el elemento de texto",
          en: "Custom styles for the text element",
        },
      },
      {
        name: "href",
        type: "string",
        required: false,
        description: {
          es: "URL para componentes de enlace (solo componente A)",
          en: "URL for link components (A component only)",
        },
      },
      {
        name: "fixed",
        type: "boolean",
        required: false,
        description: {
          es: "Indica si el encabezado debe estar fijo en todas las páginas (solo componente Header)",
          en: "Whether header should be fixed on all pages (Header component only)",
        },
      },
    ],
    examples: [
      {
        title: {
          es: "Jerarquía de Encabezados",
          en: "Headings Hierarchy",
        },
        description: {
          es: "Todos los niveles de encabezado",
          en: "All heading levels",
        },
        code: `import { H1, H2, H3, H4, H5, H6 } from 'react-pdf-levelup'

<H1>Main Title</H1>
<H2>Section Title</H2>
<H3>Subsection</H3>
<H4>Sub-subsection</H4>
<H5>Minor Heading</H5>
<H6>Smallest Heading</H6>`,
      },
      {
        title: {
          es: "Formato de Texto",
          en: "Text Formatting",
        },
        description: {
          es: "Diversas opciones de formato de texto",
          en: "Various text formatting options",
        },
        code: `import { P, Strong, Em, U, Small, Mark } from 'react-pdf-levelup'

<P>
  This is a paragraph with <Strong>bold text</Strong>, 
  <Em>italic text</Em>, <U>underlined text</U>, 
  <Small>small text</Small>, and <Mark>highlighted text</Mark>.
</P>`,
      },
      {
        title: {
          es: "Enlaces y Citas",
          en: "Links and Quotes",
        },
        description: {
          es: "Enlaces y citas",
          en: "Links and blockquotes",
        },
        code: `import { A, Blockquote, P } from 'react-pdf-levelup'

<P>
  Visit our <A href="https://example.com">website</A> for more info.
</P>

<Blockquote>
  "This is an important quote that stands out from the main text."
</Blockquote>`,
      },
      {
        title: {
          es: "Encabezado Fijo",
          en: "Fixed Header",
        },
        description: {
          es: "Encabezado que aparece en todas las páginas",
          en: "Header that appears on all pages",
        },
        code: `import { Header } from 'react-pdf-levelup'

<Header fixed={true}>
  Company Name - Confidential Document
</Header>`,
      },
    ],
    usage: {
      es: `
      <h4>Componentes Disponibles:</h4>
      <ul>
        <li><strong>Encabezados:</strong> H1 (24px), H2 (20px), H3 (18px), H4 (16px), H5 (14px), H6 (12px)</li>
        <li><strong>Texto:</strong> P (párrafo), Span (texto en línea)</li>
        <li><strong>Formato:</strong> Strong (negrita), Em (cursiva), U (subrayado), Small (10px)</li>
        <li><strong>Especiales:</strong> A (enlaces), Blockquote (citas), Mark (resaltar), BR (salto de línea)</li>
        <li><strong>Diseño:</strong> Header (encabezados de página con opción fija)</li>
      </ul>
      <h4>Escala de Tipografía:</h4>
      <ul>
        <li>Tamaño de fuente base: 12px con altura de línea 1.2</li>
        <li>Margen inferior consistente para espaciado</li>
        <li>Color de enlace: #3d65fd (azul)</li>
        <li>Color de resaltado: fondo amarillo</li>
      </ul>
    `,
      en: `
      <h4>Available Components:</h4>
      <ul>
        <li><strong>Headings:</strong> H1 (24px), H2 (20px), H3 (18px), H4 (16px), H5 (14px), H6 (12px)</li>
        <li><strong>Text:</strong> P (paragraph), Span (inline text)</li>
        <li><strong>Formatting:</strong> Strong (bold), Em (italic), U (underline), Small (10px)</li>
        <li><strong>Special:</strong> A (links), Blockquote (quotes), Mark (highlight), BR (line break)</li>
        <li><strong>Layout:</strong> Header (page headers with fixed option)</li>
      </ul>
      <h4>Typography Scale:</h4>
      <ul>
        <li>Base font size: 12px with 1.2 line height</li>
        <li>Consistent margin bottom for spacing</li>
        <li>Link color: #3d65fd (blue)</li>
        <li>Highlight color: yellow background</li>
      </ul>
    `,
    },
  },
  {
    id: "img-bg",
    name: "ImgBg",
    description: {
      es: "Componente para agregar imágenes de fondo a elementos de PDF",
      en: "Component for adding background images to PDF elements",
    },
    category: "Media",
    tags: ["image", "background", "media"],
    overview: {
      es: "ImgBg permite establecer imágenes de fondo para elementos de PDF con diversas opciones de posicionamiento y tamaño.",
      en: "ImgBg allows you to set background images for PDF elements with various positioning and sizing options.",
    },
    props: [
      {
        name: "src",
        type: "string",
        required: true,
        description: {
          es: "URL o ruta a la imagen de fondo",
          en: "Source URL or path to the background image",
        },
      },
      {
        name: "children",
        type: "ReactNode",
        required: false,
        description: {
          es: "Contenido a mostrar sobre la imagen de fondo",
          en: "Content to display over the background image",
        },
      },
      {
        name: "style",
        type: "Style",
        required: false,
        description: {
          es: "Estilos personalizados para el contenedor",
          en: "Custom styles for the container",
        },
      },
    ],
    examples: [
      {
        title: {
          es: "Imagen de Fondo Básica",
          en: "Basic Background Image",
        },
        description: {
          es: "Imagen de fondo simple con superposición de contenido",
          en: "Simple background image with content overlay",
        },
        code: `<ImgBg src="/path/to/image.jpg">
  <Text style={{ color: 'white', fontSize: 24 }}>
    Content over background
  </Text>
</ImgBg>`,
      },
    ],
    usage: {
      es: `
      <h4>Casos de Uso:</h4>
      <ul>
        <li>Agregar marcas de agua a documentos</li>
        <li>Crear fondos con marca registrada</li>
        <li>Elementos decorativos</li>
      </ul>
    `,
      en: `
      <h4>Use cases:</h4>
      <ul>
        <li>Adding watermarks to documents</li>
        <li>Creating branded backgrounds</li>
        <li>Decorative elements</li>
      </ul>
    `,
    },
  },
  {
    id: "position",
    name: "Position",
    description: {
      es: "Componente envolvente de posicionamiento para control preciso de ubicación de elementos en PDF",
      en: "Positioning wrapper component for precise element location control in PDF",
    },
    category: "Layout",
    tags: ["position", "wrapper", "layout", "absolute", "relative"],
    overview: {
      es: "Position es un componente envolvente que permite posicionamiento absoluto y relativo de elementos dentro de documentos PDF, proporcionando control preciso sobre la ubicación de contenido.",
      en: "Position is a wrapper component that enables absolute and relative positioning of elements within PDF documents, providing precise control over content placement.",
    },
    features: {
      es: [
        "Posicionamiento absoluto y relativo",
        "Control preciso de coordenadas (top, left, right, bottom)",
        "Soporte para z-index y capas",
        "Contenedor flexible para cualquier elemento",
        "Integración perfecta con otros componentes",
        "Soporte para dimensiones personalizadas",
      ],
      en: [
        "Absolute and relative positioning",
        "Precise coordinate control (top, left, right, bottom)",
        "Z-index and layering support",
        "Flexible container for any element",
        "Seamless integration with other components",
        "Custom dimensions support",
      ],
    },
    props: [
      {
        name: "children",
        type: "ReactNode",
        required: true,
        description: {
          es: "Contenido a posicionar dentro del wrapper",
          en: "Content to position within the wrapper",
        },
      },
      {
        name: "style",
        type: "Style",
        required: false,
        description: {
          es: "Estilos de posicionamiento y dimensiones",
          en: "Positioning styles and dimensions",
        },
      },
      {
        name: "top",
        type: "number | string",
        required: false,
        description: {
          es: "Distancia desde el borde superior",
          en: "Distance from top edge",
        },
      },
      {
        name: "left",
        type: "number | string",
        required: false,
        description: {
          es: "Distancia desde el borde izquierdo",
          en: "Distance from left edge",
        },
      },
      {
        name: "right",
        type: "number | string",
        required: false,
        description: {
          es: "Distancia desde el borde derecho",
          en: "Distance from right edge",
        },
      },
      {
        name: "bottom",
        type: "number | string",
        required: false,
        description: {
          es: "Distancia desde el borde inferior",
          en: "Distance from bottom edge",
        },
      },
    ],
    examples: [
      {
        title: {
          es: "Posicionamiento Absoluto",
          en: "Absolute Positioning",
        },
        description: {
          es: "Elemento posicionado en coordenadas específicas",
          en: "Element positioned at specific coordinates",
        },
        code: `import Position from "react-pdf-levelup"

<Position 
  style={{ 
    position: 'absolute',
    top: 50,
    left: 100,
    width: 200,
    height: 100
  }}
>
  <Text>Positioned content</Text>
</Position>`,
      },
      {
        title: {
          es: "Marca de Agua",
          en: "Watermark",
        },
        description: {
          es: "Texto de marca de agua posicionado en el centro",
          en: "Watermark text positioned in center",
        },
        code: `<Position 
  style={{ 
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    opacity: 0.1,
    zIndex: -1
  }}
>
  <Text style={{ fontSize: 48, color: '#666' }}>
    CONFIDENCIAL
  </Text>
</Position>`,
      },
      {
        title: {
          es: "Elementos Superpuestos",
          en: "Overlapping Elements",
        },
        description: {
          es: "Múltiples elementos con diferentes z-index",
          en: "Multiple elements with different z-index",
        },
        code: `<View>
  <Position style={{ position: 'relative', zIndex: 1 }}>
    <Text>Background element</Text>
  </Position>
  
  <Position 
    style={{ 
      position: 'absolute',
      top: 10,
      left: 10,
      zIndex: 2
    }}
  >
    <Text style={{ color: 'red' }}>Overlay element</Text>
  </Position>
</View>`,
      },
      {
        title: {
          es: "Esquinas del Documento",
          en: "Document Corners",
        },
        description: {
          es: "Elementos posicionados en las esquinas",
          en: "Elements positioned at corners",
        },
        code: `{/* Esquina superior izquierda */}
<Position style={{ position: 'absolute', top: 20, left: 20 }}>
  <Text>Top Left</Text>
</Position>

{/* Esquina superior derecha */}
<Position style={{ position: 'absolute', top: 20, right: 20 }}>
  <Text>Top Right</Text>
</Position>

{/* Esquina inferior izquierda */}
<Position style={{ position: 'absolute', bottom: 20, left: 20 }}>
  <Text>Bottom Left</Text>
</Position>

{/* Esquina inferior derecha */}
<Position style={{ position: 'absolute', bottom: 20, right: 20 }}>
  <Text>Bottom Right</Text>
</Position>`,
      },
    ],
    usage: {
      es: `
      <h4>Tipos de Posicionamiento:</h4>
      <ul>
        <li><strong>Absolute:</strong> Posición fija relativa al documento</li>
        <li><strong>Relative:</strong> Posición relativa al flujo normal</li>
        <li><strong>Fixed:</strong> Posición fija en todas las páginas</li>
      </ul>
      <h4>Casos de Uso Comunes:</h4>
      <ul>
        <li>Marcas de agua y elementos de fondo</li>
        <li>Encabezados y pies de página personalizados</li>
        <li>Elementos decorativos y logos</li>
        <li>Superposiciones y callouts</li>
        <li>Numeración de páginas personalizada</li>
      </ul>
      <h4>Mejores Prácticas:</h4>
      <ul>
        <li>Usar unidades consistentes (px o porcentajes)</li>
        <li>Considerar el z-index para elementos superpuestos</li>
        <li>Probar en diferentes tamaños de página</li>
        <li>Usar transform para centrado preciso</li>
      </ul>
    `,
      en: `
      <h4>Positioning Types:</h4>
      <ul>
        <li><strong>Absolute:</strong> Fixed position relative to document</li>
        <li><strong>Relative:</strong> Position relative to normal flow</li>
        <li><strong>Fixed:</strong> Fixed position on all pages</li>
      </ul>
      <h4>Common Use Cases:</h4>
      <ul>
        <li>Watermarks and background elements</li>
        <li>Custom headers and footers</li>
        <li>Decorative elements and logos</li>
        <li>Overlays and callouts</li>
        <li>Custom page numbering</li>
      </ul>
      <h4>Best Practices:</h4>
      <ul>
        <li>Use consistent units (px or percentages)</li>
        <li>Consider z-index for overlapping elements</li>
        <li>Test across different page sizes</li>
        <li>Use transform for precise centering</li>
      </ul>
    `,
    },
  },
  {
    id: "layoutpdf",
    name: "LayoutPDF",
    description: {
      es: "Componente de diseño principal para estructurar documentos PDF completos",
      en: "Main layout component for structuring complete PDF documents",
    },
    category: "Layout",
    tags: ["layout", "pdf", "document", "structure", "page"],
    overview: {
      es: "LayoutPDF es el componente fundamental para crear la estructura base de documentos PDF, proporcionando configuración de página, márgenes, encabezados, pies de página y gestión de contenido.",
      en: "LayoutPDF is the fundamental component for creating the base structure of PDF documents, providing page configuration, margins, headers, footers, and content management.",
    },
    features: {
      es: [
        "Configuración completa de página (tamaño, orientación, márgenes)",
        "Soporte para encabezados y pies de página",
        "Gestión automática de saltos de página",
        "Numeración de páginas personalizable",
        "Soporte para múltiples formatos de página",
        "Configuración de metadatos del documento",
        "Gestión de fuentes y estilos globales",
      ],
      en: [
        "Complete page configuration (size, orientation, margins)",
        "Header and footer support",
        "Automatic page break management",
        "Customizable page numbering",
        "Multiple page format support",
        "Document metadata configuration",
        "Global font and style management",
      ],
    },
    props: [
      {
        name: "children",
        type: "ReactNode",
        required: true,
        description: {
          es: "Contenido principal del documento PDF",
          en: "Main content of the PDF document",
        },
      },
      {
        name: "pageSize",
        type: "'A4' | 'A3' | 'A5' | 'LETTER' | 'LEGAL' | [width, height]",
        required: false,
        default: "A4",
        description: {
          es: "Tamaño de página del documento",
          en: "Document page size",
        },
      },
      {
        name: "orientation",
        type: "'portrait' | 'landscape'",
        required: false,
        default: "portrait",
        description: {
          es: "Orientación de la página",
          en: "Page orientation",
        },
      },
      {
        name: "margins",
        type: "{ top?: number, right?: number, bottom?: number, left?: number }",
        required: false,
        default: "{ top: 40, right: 40, bottom: 40, left: 40 }",
        description: {
          es: "Márgenes de la página en puntos",
          en: "Page margins in points",
        },
      },
      {
        name: "header",
        type: "ReactNode",
        required: false,
        description: {
          es: "Contenido del encabezado (aparece en todas las páginas)",
          en: "Header content (appears on all pages)",
        },
      },
      {
        name: "footer",
        type: "ReactNode",
        required: false,
        description: {
          es: "Contenido del pie de página (aparece en todas las páginas)",
          en: "Footer content (appears on all pages)",
        },
      },
    ],
    examples: [
      {
        title: {
          es: "Documento Básico",
          en: "Basic Document",
        },
        description: {
          es: "Estructura básica de documento PDF",
          en: "Basic PDF document structure",
        },
        code: `import LayoutPDF from "react-pdf-levelup"

<LayoutPDF 
  pageSize="A4"
  orientation="portrait"
  margins={{ top: 50, right: 40, bottom: 50, left: 40 }}
>
  <Text style={{ fontSize: 24, marginBottom: 20 }}>
    Document Title
  </Text>
  <Text>
    This is the main content of the document.
  </Text>
</LayoutPDF>`,
      },
      {
        title: {
          es: "Documento con Encabezado y Pie",
          en: "Document with Header and Footer",
        },
        description: {
          es: "Documento con encabezado y pie de página personalizados",
          en: "Document with custom header and footer",
        },
        code: `<LayoutPDF 
  pageSize="A4"
  header={
    <View style={{ 
      flexDirection: 'row', 
      justifyContent: 'space-between',
      borderBottom: '1px solid #ccc',
      paddingBottom: 10,
      marginBottom: 20
    }}>
      <Text>Company Name</Text>
      <Text>Confidential Report</Text>
    </View>
  }
  footer={
    <View style={{ 
      flexDirection: 'row', 
      justifyContent: 'center',
      borderTop: '1px solid #ccc',
      paddingTop: 10,
      marginTop: 20
    }}>
      <Text>Page {pageNumber} of {totalPages}</Text>
    </View>
  }
>
  <Text>Main document content goes here...</Text>
</LayoutPDF>`,
      },
      {
        title: {
          es: "Documento Horizontal",
          en: "Landscape Document",
        },
        description: {
          es: "Documento en orientación horizontal para tablas anchas",
          en: "Landscape orientation document for wide tables",
        },
        code: `<LayoutPDF 
  pageSize="A4"
  orientation="landscape"
  margins={{ top: 30, right: 30, bottom: 30, left: 30 }}
>
  <Text style={{ fontSize: 18, marginBottom: 15 }}>
    Wide Data Report
  </Text>
  
  <Table cellHeight={25}>
    <Thead>
      <Tr>
        <Th>Col 1</Th>
        <Th>Col 2</Th>
        <Th>Col 3</Th>
        <Th>Col 4</Th>
        <Th>Col 5</Th>
        <Th>Col 6</Th>
      </Tr>
    </Thead>
    <Tbody>
      <Tr>
        <Td>Data</Td>
        <Td>Data</Td>
        <Td>Data</Td>
        <Td>Data</Td>
        <Td>Data</Td>
        <Td>Data</Td>
      </Tr>
    </Tbody>
  </Table>
</LayoutPDF>`,
      },
      {
        title: {
          es: "Documento Personalizado",
          en: "Custom Document",
        },
        description: {
          es: "Documento con tamaño personalizado y configuración avanzada",
          en: "Document with custom size and advanced configuration",
        },
        code: `<LayoutPDF 
  pageSize={[600, 800]} // Tamaño personalizado en puntos
  margins={{ 
    top: 60, 
    right: 50, 
    bottom: 60, 
    left: 50 
  }}
  header={
    <View style={{ textAlign: 'center' }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
        Custom Report Format
      </Text>
    </View>
  }
  footer={
    <View style={{ 
      flexDirection: 'row', 
      justifyContent: 'space-between',
      fontSize: 10,
      color: '#666'
    }}>
      <Text>Generated: {new Date().toLocaleDateString()}</Text>
      <Text>Page {pageNumber}</Text>
    </View>
  }
>
  <Text>Content for custom-sized document...</Text>
</LayoutPDF>`,
      },
    ],
    usage: {
      es: `
      <h4>Tamaños de Página Estándar:</h4>
      <ul>
        <li><strong>A4:</strong> 210 × 297 mm (más común)</li>
        <li><strong>A3:</strong> 297 × 420 mm (doble de A4)</li>
        <li><strong>A5:</strong> 148 × 210 mm (mitad de A4)</li>
        <li><strong>LETTER:</strong> 8.5 × 11 pulgadas (estándar US)</li>
        <li><strong>LEGAL:</strong> 8.5 × 14 pulgadas (legal US)</li>
      </ul>
      <h4>Configuración de Márgenes:</h4>
      <ul>
        <li>Unidades en puntos (1 punto = 1/72 pulgada)</li>
        <li>Márgenes típicos: 40-60 puntos</li>
        <li>Considerar espacio para encabezados/pies</li>
      </ul>
      <h4>Mejores Prácticas:</h4>
      <ul>
        <li>Usar A4 portrait para documentos estándar</li>
        <li>Landscape para tablas anchas o gráficos</li>
        <li>Márgenes consistentes en todo el documento</li>
        <li>Encabezados/pies concisos y útiles</li>
        <li>Considerar la impresión al configurar márgenes</li>
      </ul>
    `,
      en: `
      <h4>Standard Page Sizes:</h4>
      <ul>
        <li><strong>A4:</strong> 210 × 297 mm (most common)</li>
        <li><strong>A3:</strong> 297 × 420 mm (double A4)</li>
        <li><strong>A5:</strong> 148 × 210 mm (half A4)</li>
        <li><strong>LETTER:</strong> 8.5 × 11 inches (US standard)</li>
        <li><strong>LEGAL:</strong> 8.5 × 14 inches (US legal)</li>
      </ul>
      <h4>Margin Configuration:</h4>
      <ul>
        <li>Units in points (1 point = 1/72 inch)</li>
        <li>Typical margins: 40-60 points</li>
        <li>Consider space for headers/footers</li>
      </ul>
      <h4>Best Practices:</h4>
      <ul>
        <li>Use A4 portrait for standard documents</li>
        <li>Landscape for wide tables or charts</li>
        <li>Consistent margins throughout document</li>
        <li>Concise and useful headers/footers</li>
        <li>Consider printing when setting margins</li>
      </ul>
    `,
    },
  },
  {
    id: "layout",
    name: "Layout",
    description: {
      es: "Componentes básicos de diseño y estructura para organizar contenido en documentos PDF",
      en: "Basic layout and structure components for organizing content in PDF documents",
    },
    category: "Layout",
    tags: ["layout", "structure", "container", "spacing", "alignment"],
    overview: {
      es: "Los componentes de Layout proporcionan las herramientas fundamentales para estructurar y organizar contenido en documentos PDF, incluyendo contenedores, espaciado, alineación y elementos de diseño básicos.",
      en: "Layout components provide fundamental tools for structuring and organizing content in PDF documents, including containers, spacing, alignment, and basic design elements.",
    },
    features: {
      es: [
        "Contenedores flexibles para agrupar contenido",
        "Control de espaciado y márgenes",
        "Alineación horizontal y vertical",
        "Elementos de separación y divisores",
        "Estructuras de diseño responsivo",
        "Componentes de wrapper y contenedor",
      ],
      en: [
        "Flexible containers for grouping content",
        "Spacing and margin control",
        "Horizontal and vertical alignment",
        "Separation elements and dividers",
        "Responsive design structures",
        "Wrapper and container components",
      ],
    },
    props: [
      {
        name: "Container",
        type: "Component",
        description: {
          es: "Contenedor principal para agrupar elementos",
          en: "Main container for grouping elements",
        },
      },
      {
        name: "Spacer",
        type: "Component",
        description: {
          es: "Elemento para crear espacios en blanco",
          en: "Element for creating white space",
        },
      },
      {
        name: "Divider",
        type: "Component",
        description: {
          es: "Línea divisoria para separar contenido",
          en: "Divider line for separating content",
        },
      },
      {
        name: "Flex",
        type: "Component",
        description: {
          es: "Contenedor flexible con propiedades flexbox",
          en: "Flexible container with flexbox properties",
        },
      },
    ],
    examples: {
      es: [
        {
          title: "Contenedor Básico",
          description: "Ejemplo de contenedor simple para agrupar elementos",
          code: `import { Container, Text } from "react-pdf-levelup";

<Container style={{ padding: 20, backgroundColor: '#f5f5f5' }}>
  <Text>Contenido dentro del contenedor</Text>
  <Text>Más contenido agrupado</Text>
</Container>`,
        },
        {
          title: "Espaciado con Spacer",
          description: "Uso de Spacer para crear espacios controlados",
          code: `import { Container, Text, Spacer } from "react-pdf-levelup";

<Container>
  <Text>Primer elemento</Text>
  <Spacer height={20} />
  <Text>Segundo elemento con espacio arriba</Text>
  <Spacer height={40} />
  <Text>Tercer elemento con más espacio</Text>
</Container>`,
        },
        {
          title: "Layout con Flex",
          description: "Contenedor flexible para alineación avanzada",
          code: `import { Flex, Text } from "react-pdf-levelup";

<Flex direction="row" justify="space-between" align="center">
  <Text>Izquierda</Text>
  <Text>Centro</Text>
  <Text>Derecha</Text>
</Flex>

<Flex direction="column" align="center" style={{ marginTop: 20 }}>
  <Text>Elemento centrado</Text>
  <Text>Otro elemento centrado</Text>
</Flex>`,
        },
        {
          title: "Divisores",
          description: "Líneas divisorias para separar secciones",
          code: `import { Container, Text, Divider } from "react-pdf-levelup";

<Container>
  <Text>Sección 1</Text>
  <Divider style={{ margin: '10 0', borderColor: '#ccc' }} />
  <Text>Sección 2</Text>
  <Divider style={{ margin: '10 0', borderColor: '#999', borderWidth: 2 }} />
  <Text>Sección 3</Text>
</Container>`,
        },
      ],
      en: [
        {
          title: "Basic Container",
          description: "Simple container example for grouping elements",
          code: `import { Container, Text } from "react-pdf-levelup";

<Container style={{ padding: 20, backgroundColor: '#f5f5f5' }}>
  <Text>Content inside container</Text>
  <Text>More grouped content</Text>
</Container>`,
        },
        {
          title: "Spacing with Spacer",
          description: "Using Spacer to create controlled spaces",
          code: `import { Container, Text, Spacer } from "react-pdf-levelup";

<Container>
  <Text>First element</Text>
  <Spacer height={20} />
  <Text>Second element with space above</Text>
  <Spacer height={40} />
  <Text>Third element with more space</Text>
</Container>`,
        },
        {
          title: "Flex Layout",
          description: "Flexible container for advanced alignment",
          code: `import { Flex, Text } from "react-pdf-levelup";

<Flex direction="row" justify="space-between" align="center">
  <Text>Left</Text>
  <Text>Center</Text>
  <Text>Right</Text>
</Flex>

<Flex direction="column" align="center" style={{ marginTop: 20 }}>
  <Text>Centered element</Text>
  <Text>Another centered element</Text>
</Flex>`,
        },
        {
          title: "Dividers",
          description: "Divider lines for separating sections",
          code: `import { Container, Text, Divider } from "react-pdf-levelup";

<Container>
  <Text>Section 1</Text>
  <Divider style={{ margin: '10 0', borderColor: '#ccc' }} />
  <Text>Section 2</Text>
  <Divider style={{ margin: '10 0', borderColor: '#999', borderWidth: 2 }} />
  <Text>Section 3</Text>
</Container>`,
        },
      ],
    },
    usage: {
      es: {
        title: "Guías de Uso",
        subtitle: "Mejores prácticas y notas de implementación",
        content: `
**Componentes Disponibles:**
**Contenedores:** Container (contenedor básico), Flex (contenedor flexible)
**Espaciado:** Spacer (espacios en blanco), Margin (márgenes controlados)
**Separadores:** Divider (líneas divisorias), HR (línea horizontal)
**Alineación:** Center (centrado), Align (alineación personalizada)

**Mejores Prácticas:**
• Usa Container para agrupar elementos relacionados
• Spacer es ideal para espaciado vertical consistente
• Flex proporciona control avanzado de alineación
• Los divisores ayudan a separar visualmente las secciones
• Combina componentes para crear layouts complejos

**Propiedades de Estilo:**
• **padding:** Espaciado interno del contenedor
• **margin:** Espaciado externo del elemento
• **backgroundColor:** Color de fondo del contenedor
• **borderRadius:** Bordes redondeados
• **flexDirection:** Dirección del layout flex (row, column)
• **justifyContent:** Alineación horizontal (flex-start, center, flex-end, space-between)
• **alignItems:** Alineación vertical (flex-start, center, flex-end, stretch)

**Espaciado Consistente:**
• Usa múltiplos de 4 para espaciado (4, 8, 12, 16, 20, 24)
• Mantén consistencia en márgenes y padding
• Considera el flujo de lectura al organizar elementos
        `,
      },
      en: {
        title: "Usage Guide",
        subtitle: "Best practices and implementation notes",
        content: `
**Available Components:**
**Containers:** Container (basic container), Flex (flexible container)
**Spacing:** Spacer (white space), Margin (controlled margins)
**Separators:** Divider (divider lines), HR (horizontal rule)
**Alignment:** Center (centering), Align (custom alignment)

**Best Practices:**
• Use Container to group related elements
• Spacer is ideal for consistent vertical spacing
• Flex provides advanced alignment control
• Dividers help visually separate sections
• Combine components to create complex layouts

**Style Properties:**
• **padding:** Internal spacing of container
• **margin:** External spacing of element
• **backgroundColor:** Container background color
• **borderRadius:** Rounded borders
• **flexDirection:** Flex layout direction (row, column)
• **justifyContent:** Horizontal alignment (flex-start, center, flex-end, space-between)
• **alignItems:** Vertical alignment (flex-start, center, flex-end, stretch)

**Consistent Spacing:**
• Use multiples of 4 for spacing (4, 8, 12, 16, 20, 24)
• Maintain consistency in margins and padding
• Consider reading flow when organizing elements
        `,
      },
    },
  },
]

const ComponentContext = createContext<{
  getComponent: (id: string) => ComponentData | undefined
}>({
  getComponent: () => undefined,
})

export function ComponentProvider({ children }: { children: ReactNode }) {
  const getComponent = (id: string) => {
    return componentsData.find((comp) => comp.id === id)
  }

  return <ComponentContext.Provider value={{ getComponent }}>{children}</ComponentContext.Provider>
}

export function useComponent(id: string) {
  const { getComponent } = useContext(ComponentContext)
  return getComponent(id)
}
