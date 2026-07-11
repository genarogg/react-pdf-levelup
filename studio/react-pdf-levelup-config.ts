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
    '@react-pdf-levelup/qr': ReactPdfLevelupQr,
    '@react-pdf-levelup/chart': ReactPdfLevelupChart,
    // 'supermoney': SuperMoney,
  },
  // Opcional, sin definir por default: si se descomenta, GET /api/render/file
  // pasa a modo estricto y SOLO estos specifiers se resuelven — cualquier
  // otro import npm en el código del usuario corta con 422 antes de
  // intentar cargarlo. Sin esta línea, el comportamiento actual sigue
  // siendo "single-user": cualquier paquete instalado en node_modules se
  // resuelve dinámicamente. Activar esto tiene sentido recién cuando el
  // Studio se exponga a más de un usuario (ver MIGRACION-STATUS.md).
  // serverNpmWhitelist: [
  //   '@react-pdf/renderer',
  //   '@react-pdf-levelup/core',
  //   '@react-pdf-levelup/chart',
  //   '@react-pdf-levelup/qr',
  // ],
}

export default reactPdfLevelupConfig
