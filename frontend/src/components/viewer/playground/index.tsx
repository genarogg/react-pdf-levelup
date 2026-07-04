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

// Tipo para manejar múltiples archivos
type FileMap = {
  [path: string]: string
}

function Editor({ studio = false, templateId }: EditorProps) {
  const [files, setFiles] = useState<FileMap>({}) 
  const [currentTemplatePath, setCurrentTemplatePath] = useState<string | null>(null)
  const [mainFile, setMainFile] = useState<string | null>(null) // Path del documento raíz de referencia
  const [code, setCode] = useState<string>("") // Para modo normal
  const [isLoading, setIsLoading] = useState(true)
  const [templates, setTemplates] = useState<TemplateMeta[]>([])
  const [fileTree, setFileTree] = useState<FileTreeItem[]>([])
  const [templatesLoaded, setTemplatesLoaded] = useState(false)
  const [showMobileWarning, setShowMobileWarning] = useState(true)
  const [isStudioMode, setIsStudioMode] = useState(studio)
  const isMobile = useMobileDetection()

  // Clave para localStorage
  const STORAGE_KEY = "react-pdf-levelup-code"

  // Template por defecto para Studio
  const defaultStudioMainTemplate = `import { Document, Page, View, StyleSheet } from "@react-pdf/renderer"
import Header from "./Header"
import Content from "./Content"

const styles = StyleSheet.create({
  page: { flexDirection: 'column', backgroundColor: '#ffffff' },
})

const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Header />
      <Content />
    </Page>
  </Document>
)

export default MyDocument`

  const defaultStudioHeaderTemplate = `import { Text, View, StyleSheet } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#3b82f6',
    padding: 20,
    marginBottom: 20,
  },
  text: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  }
})

const Header = () => (
  <View style={styles.header}>
    <Text style={styles.text}>Mi PDF</Text>
  </View>
)

export default Header`

  const defaultStudioContentTemplate = `import { Text, View, StyleSheet } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  text: {
    fontSize: 12,
    lineHeight: 1.5,
    marginBottom: 10,
  }
})

const Content = () => (
  <View style={styles.content}>
    <Text style={styles.text}>¡Este es el contenido del documento!</Text>
    <Text style={styles.text}>Puedes editar este componente o importar más.</Text>
  </View>
)

export default Content`

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

  // Actualizar un solo archivo en el estado
  const updateFileContent = (filePath: string, content: string) => {
    setFiles(prev => ({
      ...prev,
      [filePath]: content
    }))
  }

  // Cargar archivo seleccionado en studio mode
  const loadFile = async (filePath: string) => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/templates/${encodeURIComponent(filePath)}`)
      if (res.ok) {
        const data = await res.json()
        updateFileContent(filePath, data.content)
        setCurrentTemplatePath(filePath)
        // Si es el primer archivo o el único, lo establecemos como documento raíz
        if (!mainFile) setMainFile(filePath)
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
        body: JSON.stringify({ content: files[currentTemplatePath] || "" })
      })
      alert("Archivo guardado correctamente!")
    } catch (err) {
      console.error("Error al guardar:", err)
      alert("Error al guardar el archivo")
    }
  }

  // Crear nuevo template/componente
  const createNewTemplate = async () => {
    if (!isStudioMode) return
    const name = prompt("Nombre del nuevo componente/plantilla:")
    if (!name) return
    const filename = name.endsWith(".tsx") ? name : `${name}.tsx`
    try {
      const defaultCode = `import { Text, View, StyleSheet } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  container: { padding: 10 }
})

const ${name.replace(/[^a-zA-Z0-9]/g, '')} = () => (
  <View style={styles.container}>
    <Text>${name}</Text>
  </View>
)

export default ${name.replace(/[^a-zA-Z0-9]/g, '')}`
      
      await fetch(`/api/templates/${encodeURIComponent(filename)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: defaultCode })
      })
      
      await loadFileTree()
      await loadFile(filename)
      alert("Archivo creado!")
    } catch (err) {
      console.error("Error al crear:", err)
      alert("Error al crear el archivo")
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
  }, [templateId, templatesLoaded, templates, isStudioMode])

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
        // No hay archivos, creamos plantillas por defecto
        const defaultFiles: FileMap = {
          "Main.tsx": defaultStudioMainTemplate,
          "Header.tsx": defaultStudioHeaderTemplate,
          "Content.tsx": defaultStudioContentTemplate,
        }
        setFiles(defaultFiles)
        setMainFile("Main.tsx")
        setCurrentTemplatePath("Main.tsx")
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
            mainFile={mainFile}
            onSelectFile={loadFile}
            onCreateFile={createNewTemplate}
            onRefresh={loadFileTree}
            onSetMainFile={setMainFile}
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
              <CodeEditor 
                value={isStudioMode && currentTemplatePath ? files[currentTemplatePath] || "" : code} 
                onChange={(value) => {
                  if (isStudioMode && currentTemplatePath) {
                    updateFileContent(currentTemplatePath, value || "")
                  } else {
                    setCode(value as string)
                  }
                }} 
                studio={isStudioMode} 
              />
            </div>
          )}
          <ToolBar 
            code={isStudioMode && currentTemplatePath ? files[currentTemplatePath] || "" : code} 
            onSave={isStudioMode ? saveTemplate : undefined}
            onNew={isStudioMode ? createNewTemplate : undefined}
          />
        </div>
        <div className={`${isStudioMode ? "flex-1" : "w-1/2"} bg-gray-100`}>
          <PDFPreview 
            files={isStudioMode ? files : {}} 
            mainFile={isStudioMode ? mainFile : null} 
            studio={isStudioMode} 
            code={code} 
          />
        </div>
      </main>
    </div>
  )
}

export default Editor