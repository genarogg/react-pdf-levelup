import { useState, useEffect } from "react"
import PDFPreview from "./PDFPreview"
import CodeEditor from "./CodeEditor"
import ToolBar from "./toolbar/ToolBar"
import { loadTemplateFile } from "./utils/templateLoader"
import { useMobileDetection } from "./hooks/useMobileDetection"
import { MobileWarning } from "./MobileWarning"
import StudioSidebar from "./StudioSidebar"

import Header from '@/components/viewer/layout/Header'

type FileTreeItem = {
  name: string
  path: string
  type: "file" | "directory"
  children?: FileTreeItem[]
}

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
  const [fileTree, setFileTree] = useState<FileTreeItem[]>([])
  const [templatesLoaded, setTemplatesLoaded] = useState(false)
  const [showMobileWarning, setShowMobileWarning] = useState(true)
  const [isStudioMode, setIsStudioMode] = useState(studio)
  const [currentTemplatePath, setCurrentTemplatePath] = useState<string | null>(null)
  const isMobile = useMobileDetection()

  // Clave para localStorage
  const STORAGE_KEY = "react-pdf-levelup-code"

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

  const loadFileTree = async () => {
    if (!isStudioMode) return
    try {
      const res = await fetch("/api/templates")
      if (res.ok) {
        const data = await res.json()
        setFileTree(data.tree || [])
      }
    } catch (err) {
      console.error("Error al cargar árbol de archivos:", err)
    }
  }

  // Detectar modo Studio y cargar templates juntos
  useEffect(() => {
    const init = async () => {
      try {
        if (studio) {
          // Si la propiedad studio es true, usamos directamente el studio mode
          setIsStudioMode(true)
          await loadFileTree()
        } else {
          // Si no es studio, cargar templates normales directamente
          setIsStudioMode(false)
          const res = await fetch("/templates/index.json")
          const data = await res.json()
          setTemplates(data)
        }
      } catch (err) {
        // Fallback
        console.error("Error al inicializar:", err)
        if (studio) {
          setIsStudioMode(true)
        } else {
          setIsStudioMode(false)
        }
        setTemplates([])
        setFileTree([])
      } finally {
        setTemplatesLoaded(true)
      }
    }
    init()
  }, [studio])

  // Cargar archivo seleccionado en studio mode
  const loadFile = async (filePath: string) => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/templates/${encodeURIComponent(filePath)}`)
      if (res.ok) {
        const data = await res.json()
        setCode(data.content)
        setCurrentTemplatePath(filePath)
      }
    } catch (err) {
      console.error("Error al cargar archivo:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Guardar template en Studio mode
  const saveTemplate = async () => {
    if (!isStudioMode || !currentTemplatePath) return
    try {
      await fetch(`/api/templates/${encodeURIComponent(currentTemplatePath)}`, {
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

  // Crear nuevo template
  const createNewTemplate = async () => {
    if (!isStudioMode) return
    const name = prompt("Nombre de la nueva plantilla:")
    if (!name) return
    const filename = name.endsWith(".tsx") ? name : `${name}.tsx`
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
      
      await loadFileTree()
      await loadFile(filename)
      alert("Plantilla creada!")
    } catch (err) {
      console.error("Error al crear:", err)
      alert("Error al crear la plantilla")
    }
  }

  // Cargar template seleccionado en modo normal
  useEffect(() => {
    if (isStudioMode) return
    
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
          }
        }

        const savedCode = localStorage.getItem(STORAGE_KEY)
        if (savedCode) {
          setCode(savedCode)
          return
        }

        const defaultTemplate = templates.find((t) => t.id === "default" || t.id.endsWith("Default.tsx"))
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
  }, [templateId, templatesLoaded, templates, isStudioMode, studio])

  // Guardar cambios en localStorage (solo si no es Studio mode)
  useEffect(() => {
    if (!isStudioMode && !isLoading) {
      localStorage.setItem(STORAGE_KEY, code)
    }
  }, [code, isLoading, isStudioMode])

  // Cargar primer archivo o template por defecto en studio mode
  useEffect(() => {
    if (!isStudioMode || !templatesLoaded) return
    
    const loadFirstFile = async () => {
      const findFirstFile = (items: FileTreeItem[]): FileTreeItem | null => {
        for (const item of items) {
          if (item.type === "file") return item
          if (item.children && item.children.length > 0) {
            const found = findFirstFile(item.children)
            if (found) return found
          }
        }
        return null
      }

      const firstFile = findFirstFile(fileTree)
      if (firstFile) {
        await loadFile(firstFile.path)
      } else {
        setCode(defaultStudioTemplate)
        setIsLoading(false)
      }
    }

    if (!currentTemplatePath) {
      loadFirstFile()
    }
  }, [isStudioMode, templatesLoaded, fileTree])

  // Show mobile warning for mobile devices
  if (isMobile && showMobileWarning) {
    return <MobileWarning onContinue={() => setShowMobileWarning(false)} />
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
     
      <Header code={code} context="playgroud" studio={studio} />
      

      <main className="flex flex-1 overflow-hidden">
        {isStudioMode && (
          <StudioSidebar
            tree={fileTree}
            selectedPath={currentTemplatePath}
            onSelectFile={loadFile}
            onCreateFile={createNewTemplate}
            onRefresh={loadFileTree}
          />
        )}
        <div className={`flex flex-col ${isStudioMode ? "flex-1" : "w-1/2"} border-r border-gray-700`}>
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
          <ToolBar 
            code={code} 
            onSave={isStudioMode ? saveTemplate : undefined}
            onNew={isStudioMode ? createNewTemplate : undefined}
          />
        </div>
        <div className={`${isStudioMode ? "flex-1" : "w-1/2"} bg-gray-100`}>
          <PDFPreview code={code} />
        </div>
      </main>
    </div>
  )
}

export default Editor

