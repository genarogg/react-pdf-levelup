import React from "react"
import { Routes, Route } from "react-router-dom"
import Layout from "../../../../layout"
import SectionIndex from "../tablas/SectionIndex"
import ComponentView from "../tablas/ComponentView"

const SECTION = "catalog"
const BASE_PATH = "/templates/catalog"

const CatalogSection: React.FC = () => {
  return (
    <Layout context="templates">
      <Routes>
        <Route
          index
          element={
            <SectionIndex
              section={SECTION}
              basePath={BASE_PATH}
              title="Catálogo"
              description="Componentes de catálogo listos para usar, con su resultado renderizado y el código fuente en react-pdf-levelup y en @react-pdf/renderer."
            />
          }
        />
        <Route
          path=":componentSlug"
          element={
            <ComponentView
              section={SECTION}
              sectionBasePath={BASE_PATH}
              sectionLabel="Catálogo"
            />
          }
        />
      </Routes>
    </Layout>
  )
}

export default CatalogSection
