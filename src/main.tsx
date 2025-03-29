import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import App from "./App.tsx"
import TemplatePage from "./pages/TemplatePage.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/template/:templateId" element={<TemplatePage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

