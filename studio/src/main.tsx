import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import "../../frontend/src/i18n"

import Playground from "../../frontend/src/components/viewer/playground"


const root = document.getElementById("root")
if (!root) {
  throw new Error("Root element not found!")
}

createRoot(root).render(
  <StrictMode>
    <Playground studio={true} />
  </StrictMode>,
)

