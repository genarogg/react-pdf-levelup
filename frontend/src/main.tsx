import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./components/viewer/home"
import PdfViewer from "./components/viewer/PdfViewer"
import App from "./components/viewer/playground"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/playground" element={<App />} />
        <Route path="/playground/template/:templateId" element={<App />} />
        <Route path="/viewer" element={<PdfViewer />} />  {/*  BETA */}
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

