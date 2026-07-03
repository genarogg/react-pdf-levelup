import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./styles/index.css"
import "./i18n"

import Playground from "./components/viewer/playground"

const root = document.getElementById("root")
if (!root) {
  throw new Error("Root element not found!")
}

createRoot(root).render(
  <StrictMode>
    <Playground studio={true} />
  </StrictMode>,
)