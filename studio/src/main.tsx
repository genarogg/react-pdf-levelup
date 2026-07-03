import { StrictMode, useEffect, useState } from "react"
import { createRoot } from "react-dom/client"


import Playground from "../../frontend/components/viewer/playground"


createRoot(root).render(
  <StrictMode>
    <Playground />
  </StrictMode>,
)

