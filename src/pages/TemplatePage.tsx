"use client"

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

  return (
    <div className="app-container">
      <header>
        <h1>Editor de PDF con React - {templateName}</h1>
        <div className="header-controls">
          <button className="back-button" onClick={handleGoBack}>
            Volver
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

