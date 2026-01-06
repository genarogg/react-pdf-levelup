import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import App from "./components/editor"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/playground" element={<App />} />
        <Route path="/playground/template/:templateId" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

