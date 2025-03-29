import React from 'react'
import { useState, useEffect } from "react"
import CodeEditor from "./components/CodeEditor"
import PDFPreview from "./components/PDFPreview"
import TemplateSelector from "./components/TemplateSelector"
import QuickHelp from "./components/QuickHelp"
import ColorPicker from "./components/ColorPicker"
import { loadTemplateFile } from "./utils/templateLoader"
import { templates } from "./data/templates"
//@ts-ignore
import "./App.css"

function App() {
  const [code, setCode] = useState<string>("")
  // const [selectedColor, setSelectedColor] = useState("#3366cc")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load the default template on component mount
    const loadDefaultTemplate = async () => {
      try {
        setIsLoading(true)
        const defaultTemplate = templates.find((t) => t.id === "default")
        if (defaultTemplate) {
          const templateContent = await loadTemplateFile(defaultTemplate.path)
          setCode(templateContent)
        } else {
          // Fallback to hardcoded template if file loading fails
          setCode(`
// Este es un ejemplo de un componente para generar un reporte financiero en PDF
// En una aplicación real, importarías los componentes así:
// import React from "react";
// import {
//     LayoutPDF,
//     Table,
//     Thead,
//     Tbody,
//     Tr,
//     Th,
//     Td,
//     Center,
//     P,
//     Strong,
//     Right,
//     Span,
//     Col6,
//     Container,
//     Row,
// } from "react-pdf-levelup";
//
// import Header from "./components/Header";
// import Title from "./components/Title";
// import Detalles from "./components/Detalles";

// Datos de ejemplo para el reporte
const reporteData = {
  periodo: "Enero - Marzo 2024",
  departamento: "Finanzas",
  responsable: "Juan Pérez",
  costoTotal: "15,750.00",
  documentos: {
    "Certificados": {
      totalCantidad: 250,
      tipoPapel: {
        SIMPLE: 150,
        SEGURIDAD: 100
      },
      totalCosto: "5,250.00"
    },
    "Diplomas": {
      totalCantidad: 120,
      tipoPapel: {
        SIMPLE: 20,
        SEGURIDAD: 100
      },
      totalCosto: "4,200.00"
    },
    "Constancias": {
      totalCantidad: 300,
      tipoPapel: {
        SIMPLE: 200,
        SEGURIDAD: 100
      },
      totalCosto: "6,300.00"
    }
  }
};

// Componente principal
const Component = ({ data }) => {
  return (
    <LayoutPDF size="A4" padding={20} showPageNumbers={false}>

      <Table style={{ borderBottom: 0, borderRight: 0 }}>
        <Thead>
          <Tr>
            <Th style={{ backgroundColor: "#b6d4ff", width: "50%" }}>
              Documento
            </Th>
            <Th style={{ backgroundColor: "#b6d4ff", width: "30%" }}>
              Tipo de papel
            </Th>
            <Th style={{ backgroundColor: "#b6d4ff", width: "20%" }}>
              SubTotal
            </Th>
          </Tr>
          <Tr>
            <Th style={{ backgroundColor: "#b6d4ff", width: "40%" }}>
              Nombre
            </Th>
            <Th style={{ backgroundColor: "#b6d4ff", width: "10%" }}>
              Cantidad
            </Th>
            <Th style={{ backgroundColor: "#b6d4ff", width: "15%" }}>
              Simple
            </Th>
            <Th style={{ backgroundColor: "#b6d4ff", width: "15%" }}>
              Seguridad
            </Th>
            <Th style={{ backgroundColor: "#b6d4ff", width: "20%" }}></Th>
          </Tr>
        </Thead>

        <Tbody>
          {Object.entries(data.documentos).map(([nombreDoc, detalles]) => (
            <Tr key={nombreDoc}>
              <Td style={{ width: "40%" }}>{nombreDoc}</Td>
              <Td style={{ width: "10%", textAlign: "right" }}>
                {detalles.totalCantidad}
              </Td>
              <Td style={{ width: "15%", textAlign: "right" }}>
                {detalles.tipoPapel.SIMPLE}
              </Td>
              <Td style={{ width: "15%", textAlign: "right" }}>
                {detalles.tipoPapel.SEGURIDAD}
              </Td>
              <Td style={{ width: "20%", textAlign: "right" }}>{detalles.totalCosto}Bs</Td>
            </Tr>
          ))}
          <Tr>
            <Td style={{ width: "40%" }}>Total</Td>
            <Td style={{ width: "10%" }}></Td>
            <Td style={{ width: "15%" }}></Td>
            <Td style={{ width: "15%" }}></Td>
            <Td style={{ width: "20%", textAlign: "right", backgroundColor: "#b6d4ff" }}>{data.costoTotal}Bs</Td>
          </Tr>
        </Tbody>
      </Table>
    </LayoutPDF>
  );
};
`)
        }
      } catch (error) {
        console.error("Failed to load default template:", error)
        // Fallback to empty code if loading fails
        setCode("")
      } finally {
        setIsLoading(false)
      }
    }

    loadDefaultTemplate()
  }, [])

  const handleColorSelect = (color: string) => {
    // setSelectedColor(color)
    console.log("Color seleccionado:", color)
  }

  const downloadTemplate = (templateCode: string) => {
    // Add necessary imports to the template
    const importsSection = `import React from "react";
import { 
      LayoutPDF, 
      Container, 
      Row, 
      Col1, Col2, Col3, Col4, Col5, Col6, Col7, Col8, Col9, Col10, Col11, Col12,
      P, H1, H2, H3, H4, H5, H6, Strong, Em, U, Small, Blockquote, Mark, Span, BR, A,
      Table, Thead, Tbody, Tr, Th, Td,
      Left, Right, Center,
      Img, QR,
      Header, Footer,
      UL, OL, LI
    } from "react-pdf-levelup";
import { View, Text, StyleSheet, Image } from "@react-pdf/renderer";

`

    // Create the full template content with imports
    const fullTemplateContent = importsSection + templateCode

    // Create a blob with the content
    const blob = new Blob([fullTemplateContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    // Create a temporary link element to trigger the download
    const a = document.createElement("a")
    a.href = url
    a.download = "template.tsx"
    document.body.appendChild(a)
    a.click()

    // Clean up
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app-container">
      <header>
        <h1>Editor de PDF con React</h1>
        <div className="header-controls">
          <button className="download-button" onClick={() => downloadTemplate(code)}>
            Descargar Template
          </button>
          <ColorPicker onColorSelect={handleColorSelect} />
          <TemplateSelector />
        </div>
      </header>
      <main>
        <div className="editor-container">
          {isLoading ? (
            <div className="loading">Cargando plantilla...</div>
          ) : (
            <CodeEditor value={code} onChange={setCode as any} />
          )}
          <QuickHelp />
        </div>
        <div className="preview-container">
          <PDFPreview code={code} />
        </div>
      </main>
    </div>
  )
}

export default App

