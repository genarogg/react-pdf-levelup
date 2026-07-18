import React from "react"
import { Routes, Route } from "react-router-dom"
import Layout from "../../../../layout"
import SectionIndex from "../tablas/SectionIndex"
import ComponentView from "../tablas/ComponentView"

const SECTION = "codebar"
const BASE_PATH = "/templates/codebar"

const CodebarSection: React.FC = () => {
  return (
    <Layout context="templates">
      <Routes>
        <Route
          index
          element={
            <SectionIndex
              section={SECTION}
              basePath={BASE_PATH}
              title="Codebar"
              description="Componentes de codebar listos para usar, con su resultado renderizado y el código fuente en react-pdf-levelup y en @react-pdf/renderer."
            />
          }
        />
        <Route
          path=":componentSlug"
          element={
            <ComponentView
              section={SECTION}
              sectionBasePath={BASE_PATH}
              sectionLabel="Codebar"
            />
          }
        />
      </Routes>
    </Layout>
  )
}

export default CodebarSection
