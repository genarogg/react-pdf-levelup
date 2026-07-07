import path from 'node:path'
import { loadUserConfig } from './lib/loadUserConfig.js'

const isProduction = process.env.NODE_ENV === 'production'

const reactPdfLevelupConfig = await loadUserConfig(process.cwd())

export const PORT = isProduction
  ? Number(process.env.PORT) || reactPdfLevelupConfig.productionPort
  : Number(process.env.SERVER_PORT) || 3001

export const WORKSPACE_DIR = path.resolve(
  process.cwd(),
  process.env.TEMPLATES_DIR || reactPdfLevelupConfig.templatesDir
)

export { isProduction }
