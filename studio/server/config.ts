import path from 'node:path'
import reactPdfLevelupConfig from '../react-pdf-levelup-config.js'

const isProduction = process.env.NODE_ENV === 'production'

export const PORT = isProduction
  ? Number(process.env.PORT) || reactPdfLevelupConfig.productionPort
  : Number(process.env.SERVER_PORT) || 3001

export const WORKSPACE_DIR = path.resolve(
  process.cwd(),
  process.env.TEMPLATES_DIR || reactPdfLevelupConfig.templatesDir
)

export { isProduction }
