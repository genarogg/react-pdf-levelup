import { StrictMode, Suspense, lazy } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./styles/index.css"
import "./i18n"

// Importar componentes de forma perezosa: cada ruta es un chunk aparte, así
// una visita a "/" no descarga Monaco (Playground) ni Shiki (Templates).
const Home = lazy(() => import("./components/viewer/home"))
const PdfViewer = lazy(() => import("./components/viewer/pdfViewer"))
const Playground = lazy(() => import("./components/viewer/playground"))
const Templates = lazy(() => import("./components/viewer/templates"))
const TablasSection = lazy(() => import("./components/viewer/templates/components/sections/tablas"))

const root = document.getElementById("root")
if (!root) {
  throw new Error("Root element not found!")
}

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/playground/template/:templateId" element={<Playground />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/templates/tablas/*" element={<TablasSection />} />
          {/* <Route path="/viewer" element={<PdfViewer />} /> */}
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)

