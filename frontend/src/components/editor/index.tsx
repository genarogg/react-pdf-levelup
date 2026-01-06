
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

import PDFPreview from "./PDFPreview"

import CodeEditor from "./CodeEditor"
import ToolBar from "../toolbar/ToolBar"
import { loadTemplateFile } from "../../utils/templateLoader"



import Header from '../header'

type TemplateMeta = {
  id: string
  name: string
  path: string
}

function Editor() {
  const [code, setCode] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const { templateId } = useParams<{ templateId: string }>()
  const [templates, setTemplates] = useState<TemplateMeta[]>([])
  const [templatesLoaded, setTemplatesLoaded] = useState(false)

  // Clave para localStorage
  const STORAGE_KEY = "react-pdf-levelup-code"

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const res = await fetch("/templates/index.json")
        if (!res.ok) throw new Error("Failed to fetch templates")
        const data = await res.json()
        setTemplates(data)
      } catch {
        setTemplates([])
      } finally {
        setTemplatesLoaded(true)
      }
    }
    loadTemplates()
  }, [])

  useEffect(() => {
    const loadByUrlOrDefault = async () => {
      if (!templatesLoaded) return
      try {
        setIsLoading(true)

        if (templateId) {
          const selected = templates.find((t) => t.id === templateId)
          if (selected) {
            const templateContent = await loadTemplateFile(selected.path)
            setCode(templateContent)
            return
          } else {
            console.warn(`Template no encontrado: ${templateId}`)
            setCode("")
            return
          }
        }

        const savedCode = localStorage.getItem(STORAGE_KEY)
        if (savedCode) {
          setCode(savedCode)
          return
        }

        const defaultTemplate = templates.find((t) => t.id === "default")
        if (defaultTemplate) {
          const templateContent = await loadTemplateFile(defaultTemplate.path)
          setCode(templateContent)
        } else {
          setCode("")
        }
      } catch (error) {
        console.error("Error al cargar template:", error)
        setCode("")
      } finally {
        setIsLoading(false)
      }
    }

    loadByUrlOrDefault()
  }, [templateId, templatesLoaded, templates])

  // Guardar cambios en localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, code)
    }
  }, [code, isLoading])



  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">

      <Header code={code} context="playgroud" />

      <main className="flex flex-1 overflow-hidden">
        <div className="w-1/2 border-r border-gray-700 flex flex-col">
          {isLoading ? (
            <div className="flex items-center justify-center h-full bg-gray-800">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent animate-spin"></div>
                <p className="mt-4 text-gray-400">Loading template...</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden">
              <CodeEditor value={code} onChange={setCode as any} />
            </div>
          )}
          <ToolBar code={code} />
        </div>
        <div className="w-1/2 bg-gray-100">
          <PDFPreview code={code} />
        </div>
      </main>
    </div>
  )
}

export default Editor

