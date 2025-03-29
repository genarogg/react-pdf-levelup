import React from 'react'
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import CodeEditor from "../components/CodeEditor"
import PDFPreview from "../components/PDFPreview"
import QuickHelp from "../components/QuickHelp"
import ColorPicker from "../components/ColorPicker"
import { templates } from "../data/templates"
import { loadTemplateFile } from "../utils/templateLoader"

const TemplatePage = () => {
  const { templateId } = useParams<{ templateId: string }>()
  const [code, setCode] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState("#3366cc")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Find the template by ID
        const template = templates.find((t) => t.id === templateId)
        if (!template) {
          throw new Error(`Template with ID ${templateId} not found`)
        }

        // Load the template file content
        const templateContent = await loadTemplateFile(template.path)
        setCode(templateContent)
      } catch (err) {
        console.error("Error loading template:", err)
        setError(err instanceof Error ? err.message : "Error desconocido al cargar la plantilla")

        // Fallback to empty code if loading fails
        setCode("")
      } finally {
        setIsLoading(false)
      }
    }

    if (templateId) {
      loadTemplate()
    }
  }, [templateId])

  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
    console.log("Color seleccionado:", color)
  }

  const handleGoBack = () => {
    window.location.href = "/"
  }

  const templateName = templates.find((t) => t.id === templateId)?.name || "Plantilla"

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
    a.download = `${templateId || "template"}.tsx`
    document.body.appendChild(a)
    a.click()

    // Clean up
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app-container">
      <header>
        <h1>Editor de PDF con React - {templateName}</h1>
        <div className="header-controls">
          <button className="back-button" onClick={handleGoBack}>
            Volver
          </button>
          <button className="download-button" onClick={() => downloadTemplate(code)}>
            Descargar Template
          </button>
          <ColorPicker onColorSelect={handleColorSelect} />
        </div>
      </header>
      <main>
        <div className="editor-container">
          {isLoading ? (
            <div className="loading">Cargando plantilla...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
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

export default TemplatePage

