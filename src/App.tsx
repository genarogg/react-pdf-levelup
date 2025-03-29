import React from 'react'
import { useState, useEffect } from "react"
// import CodeEditor from "./components/CodeEditor"
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
          setCode(``)
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
            <div className="loading">Cargando plantilla...</div>
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

