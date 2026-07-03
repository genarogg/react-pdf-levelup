import { useState, useEffect } from "react"
import PDFPreview from "./PDFPreview"
import CodeEditor from "./CodeEditor"
import ToolBar from "./toolbar/ToolBar"
import { loadTemplateFile } from "./utils/templateLoader"
import { useMobileDetection } from "./hooks/useMobileDetection"
import { MobileWarning } from "./MobileWarning"

import Header from '@/components/viewer/layout/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type TemplateMeta = {
  id: string
  name: string
  path: string
}

type EditorProps = {
  studio?: boolean
  templateId?: string
}

function Editor({ studio = false, templateId }: EditorProps) {
  const [code, setCode] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [templates, setTemplates] = useState<TemplateMeta[]>([])
  const [templatesLoaded, setTemplatesLoaded] = useState(false)
  const [showMobileWarning, setShowMobileWarning] = useState(true)
  const [isStudioMode, setIsStudioMode] = useState(studio)
  const [currentTemplateFilename, setCurrentTemplateFilename] = useState<string | null>(null)
  const [newTemplateName, setNewTemplateName] = useState("")
  const isMobile = useMobileDetection()

  // Clave para localStorage
  const STORAGE_KEY = "react-pdf-levelup-code"

  // Detectar modo Studio y cargar templates juntos
  useEffect(() => {
    const init = async () => {
      try {
        if (studio) {
          // Si la propiedad studio es true, usamos directamente el studio mode
          setIsStudioMode(true)
          const studioRes = await fetch("/api/templates")
          if (studioRes.ok) {
            const data = await studioRes.json()
            setTemplates(data.templates.map((filename: string) => ({
              id: filename,
              name: filename,
              path: `/api/templates/${encodeURIComponent(filename)}`
            })))
          }
        } else {
          // Si no es studio, comprobamos como antes
          const studioRes = await fetch("/api/templates")
          if (studioRes.ok) {
            setIsStudioMode(true)
            const data = await studioRes.json()
            setTemplates(data.templates.map((filename: string) => ({
              id: filename,
              name: filename,
              path: `/api/templates/${encodeURIComponent(filename)}`
            })))
          } else {
            // Si no es Studio, cargar templates normales
            setIsStudioMode(false)
            const res = await fetch("/templates/index.json")
            const data = await res.json()
            setTemplates(data)
          }
        }
      } catch {
        // Fallback
        if (studio) {
          setIsStudioMode(true)
        } else {
          setIsStudioMode(false)
        }
        setTemplates([])
      } finally {
        setTemplatesLoaded(true)
      }
    }
    init()
  }, [studio])

  // Template por defecto para Studio
  const defaultStudioTemplate = `import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: { flexDirection: 'row', backgroundColor: '#E4E4E4' },
  section: { margin: 10, padding: 10, flexGrow: 1 }
})

const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>¡Bienvenido a React PDF LevelUp Studio!</Text>
      </View>
    </Page>
  </Document>
)

export default MyDocument`

  // Cargar template seleccionado
  useEffect(() => {
    const loadByUrlOrDefault = async () => {
      if (!templatesLoaded) return
      try {
        setIsLoading(true)

        if (templateId) {
          const selected = templates.find((t) => t.id === templateId)
          if (selected) {
            let templateContent
            if (isStudioMode) {
              const res = await fetch(selected.path)
              const data = await res.json()
              templateContent = data.content
              setCurrentTemplateFilename(selected.id)
            } else {
              templateContent = await loadTemplateFile(selected.path)
            }
            setCode(templateContent)
            return
          } else {
            console.warn(`Template no encontrado: ${templateId}`)
          }
        }

        const savedCode = localStorage.getItem(STORAGE_KEY)
        if (savedCode && !isStudioMode) {
          setCode(savedCode)
          return
        }

        const defaultTemplate = templates.find((t) => t.id === "default" || t.id.endsWith("Default.tsx"))
        if (defaultTemplate) {
          let templateContent
          if (isStudioMode) {
            const res = await fetch(defaultTemplate.path)
            const data = await res.json()
            templateContent = data.content
            setCurrentTemplateFilename(defaultTemplate.id)
          } else {
            templateContent = await loadTemplateFile(defaultTemplate.path)
          }
          setCode(templateContent)
        } else if (isStudioMode) {
          // Si es Studio y no hay templates, usar el template por defecto
          setCode(defaultStudioTemplate)
        } else {
          setCode("")
        }
      } catch (error) {
        console.error("Error al cargar template:", error)
        // Si hay error en Studio, usar el template por defecto
        if (isStudioMode) {
          setCode(defaultStudioTemplate)
        } else {
          setCode("")
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadByUrlOrDefault()
  }, [templateId, templatesLoaded, templates, isStudioMode, studio])

  // Guardar cambios en localStorage (solo si no es Studio mode)
  useEffect(() => {
    if (!isStudioMode && !isLoading) {
      localStorage.setItem(STORAGE_KEY, code)
    }
  }, [code, isLoading, isStudioMode])

  // Función para guardar template en Studio mode
  const saveTemplate = async () => {
    if (!isStudioMode || !currentTemplateFilename) return
    try {
      await fetch(`/api/templates/${encodeURIComponent(currentTemplateFilename)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: code })
      })
      alert("Plantilla guardada correctamente!")
    } catch (err) {
      console.error("Error al guardar:", err)
      alert("Error al guardar la plantilla")
    }
  }

  // Función para crear nuevo template
  const createNewTemplate = async () => {
    if (!isStudioMode || !newTemplateName) return
    const filename = newTemplateName.endsWith(".tsx") ? newTemplateName : `${newTemplateName}.tsx`
    try {
      const defaultCode = `import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: { flexDirection: 'row', backgroundColor: '#E4E4E4' },
  section: { margin: 10, padding: 10, flexGrow: 1 }
})

const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>New Template</Text>
      </View>
    </Page>
  </Document>
)

export default MyDocument`
      
      await fetch(`/api/templates/${encodeURIComponent(filename)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: defaultCode })
      })
      
      // Recargar templates
      const res = await fetch("/api/templates")
      const data = await res.json()
      setTemplates(data.templates.map((f: string) => ({
        id: f,
        name: f,
        path: `/api/templates/${encodeURIComponent(f)}`
      })))
      
      setNewTemplateName("")
      alert("Plantilla creada!")
    } catch (err) {
      console.error("Error al crear:", err)
      alert("Error al crear la plantilla")
    }
  }

  // Show mobile warning for mobile devices
  if (isMobile && showMobileWarning) {
    return <MobileWarning onContinue={() => setShowMobileWarning(false)} />
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
     
      <Header code={code} context="playgroud" studio={studio} />
      
 

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

