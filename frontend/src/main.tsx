import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./styles/index.css"

// Importar componentes
import Home from "./components/viewer/home"
import PdfViewer from "./components/viewer/pdfViewer"
import App from "./components/viewer/playground"

const root = document.getElementById("root")
if (!root) {
  throw new Error("Root element not found!")
}

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/playground" element={<App />} />
        <Route path="/playground/template/:templateId" element={<App />} />
        <Route path="/viewer" element={<PdfViewer />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

