import React from "react"
import { Routes, Route } from "react-router-dom"
import Layout from "../../../../layout"
import SectionIndex from "../tablas/SectionIndex"
import ComponentView from "../tablas/ComponentView"

const SECTION = "list"
const BASE_PATH = "/templates/list"

/**
 * Sección "/templates/list". Rutas propias (relativas al padre, ver
 * main.tsx donde se monta con path="list/*"):
 *   /templates/list               -> grilla de componentes
 *   /templates/list/:componentSlug -> detalle con los 3 tabs
 */
const ListSection: React.FC = () => {
  return (
    <Layout context="templates">
      <Routes>
        <Route
          index
          element={
            <SectionIndex
              section={SECTION}
              basePath={BASE_PATH}
              title="Listas"
              description="Componentes de lista listos para usar, con su resultado renderizado y el código fuente en react-pdf-levelup y en @react-pdf/renderer."
            />
          }
        />
        <Route
          path=":componentSlug"
          element={
            <ComponentView
              section={SECTION}
              sectionBasePath={BASE_PATH}
              sectionLabel="Listas"
            />
          }
        />
      </Routes>
    </Layout>
  )
}

export default ListSection
