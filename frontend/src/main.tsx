import { StrictMode, useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom"
import "./styles/index.css"
import "./i18n"

// Importar componentes
import Home from "./components/viewer/home"
import PdfViewer from "./components/viewer/pdfViewer"
import Playground from "./components/viewer/playground"

// Wrapper para Playground con parámetros
function PlaygroundWrapper() {
  const { templateId } = useParams()
  return <Playground />
}

// Función para detectar modo Studio
async function isStudioMode(): Promise<boolean> {
  try {
    const res = await fetch("/api/templates")
    return res.ok
  } catch {
    return false
  }
}

// Componente wrapper para manejar la lógica de rutas
function AppRouter() {
  const [isStudio, setIsStudio] = useState<boolean | null>(null)

  useEffect(() => {
    isStudioMode().then(setIsStudio)
  }, [])

  if (isStudio === null) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        Cargando...
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        {isStudio ? (
          // Modo Studio: TODAS las rutas renderizan el Playground
          <>
            <Route path="/" element={<Playground />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/playground/template/:templateId" element={<PlaygroundWrapper />} />
            <Route path="*" element={<Playground />} />
          </>
        ) : (
          // Modo normal: rutas originales
          <>
            <Route path="/" element={<Home />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/playground/template/:templateId" element={<PlaygroundWrapper />} />
            <Route path="/viewer" element={<PdfViewer />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  )
}

const root = document.getElementById("root")
if (!root) {
  throw new Error("Root element not found!")
}

createRoot(root).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
)

