import * as React from 'react'
import * as ReactPdfRenderer from '@react-pdf/renderer'
import * as ReactPdfLevelupCore from '@react-pdf-levelup/core'
import * as ReactPdfLevelupQr from '@react-pdf-levelup/qr'
import * as ReactPdfLevelupChart from '@react-pdf-levelup/chart'
// Para agregar un módulo nuevo (ej. "supermoney"): instalarlo primero
// (npm i supermoney), importarlo acá, y añadirlo a npmModules abajo.
// import * as SuperMoney from 'supermoney'

// Registro de módulos npm disponibles para el código del usuario dentro
// del Playground/Studio. La key es el specifier que el usuario escribe
// en su `import`, el value es el módulo real ya cargado por el bundle.
export type NpmModuleRegistry = Record<string, unknown>

export interface ReactPdfLevelupConfig {
  productionPort: number
  templatesDir: string
  npmModules: NpmModuleRegistry
}

const reactPdfLevelupConfig: ReactPdfLevelupConfig = {
  productionPort: 8000,
  templatesDir: 'templates',
  npmModules: {
    react: React,
    '@react-pdf/renderer': ReactPdfRenderer,
    '@react-pdf-levelup/core': ReactPdfLevelupCore,
    // 'supermoney': SuperMoney,
  },
}

export default reactPdfLevelupConfig
