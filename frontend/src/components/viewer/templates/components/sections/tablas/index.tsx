import React from "react"
import { Routes, Route } from "react-router-dom"
import Layout from "../../../../layout"
import SectionIndex from "./SectionIndex"
import ComponentView from "./ComponentView"

const SECTION = "tablas"
const BASE_PATH = "/templates/tablas"

/**
 * Sección "/templates/tablas". Rutas propias (relativas al padre, ver
 * main.tsx donde se monta con path="tablas/*"):
 *   /templates/tablas               -> grilla de componentes
 *   /templates/tablas/:componentSlug -> detalle con los 3 tabs
 */
const TablasSection: React.FC = () => {
  return (
    <Layout context="templates">
      <Routes>
        <Route
          index
          element={
            <SectionIndex
              section={SECTION}
              basePath={BASE_PATH}
              title="Tablas"
              description="Componentes de tabla listos para usar, con su resultado renderizado y el código fuente en react-pdf-levelup y en @react-pdf/renderer."
            />
          }
        />
        <Route
          path=":componentSlug"
          element={
            <ComponentView
              section={SECTION}
              sectionBasePath={BASE_PATH}
              sectionLabel="Tablas"
            />
          }
        />
      </Routes>
    </Layout>
  )
}

export default TablasSection
