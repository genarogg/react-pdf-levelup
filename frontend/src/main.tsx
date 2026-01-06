import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./components/home"

import App from "./components/editor"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/playground" element={<App />} />
        <Route path="/playground/template/:templateId" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

