import React from "react"
import { Routes, Route } from "react-router-dom"
import Layout from "../../../../layout"
import SectionIndex from "../tablas/SectionIndex"
import ComponentView from "../tablas/ComponentView"

const SECTION = "qr"
const BASE_PATH = "/templates/qr"

const QrSection: React.FC = () => {
  return (
    <Layout context="templates">
      <Routes>
        <Route
          index
          element={
            <SectionIndex
              section={SECTION}
              basePath={BASE_PATH}
              title="QR"
              description="Componentes de QR listos para usar, con su resultado renderizado y el código fuente en react-pdf-levelup y en @react-pdf/renderer."
            />
          }
        />
        <Route
          path=":componentSlug"
          element={
            <ComponentView
              section={SECTION}
              sectionBasePath={BASE_PATH}
              sectionLabel="QR"
            />
          }
        />
      </Routes>
    </Layout>
  )
}

export default QrSection
