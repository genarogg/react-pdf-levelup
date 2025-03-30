
import React from 'react'
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import App from "./App.tsx"
import TemplatePage from "./pages/TemplatePage"
import Instructions from "./pages/Instructions"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/template/:templateId" element={<TemplatePage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

