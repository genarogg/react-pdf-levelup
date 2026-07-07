import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { existsSync } from 'node:fs'

export interface ReactPdfLevelupConfig {
  productionPort: number
  templatesDir: string
}

const DEFAULT_CONFIG: ReactPdfLevelupConfig = {
  productionPort: 8000,
  templatesDir: 'templates',
}

const CANDIDATE_FILENAMES = [
  'react-pdf-levelup-config.ts',
  'react-pdf-levelup-config.mts',
  'react-pdf-levelup-config.mjs',
  'react-pdf-levelup-config.cjs',
  'react-pdf-levelup-config.js',
]

/**
 * Busca react-pdf-levelup-config.(ts|mts|mjs|cjs|js) en la raíz del proyecto
 * consumidor (process.cwd()). Si es un archivo .ts/.mts, requiere que el
 * proceso ya esté corriendo bajo un loader capaz de transpilar TS en runtime
 * (tsx/ts-node registrado como loader). Si esa transpilación falla, se
 * intenta con las variantes .js/.mjs/.cjs como fallback antes de rendirse.
 */
export async function loadUserConfig(
  cwd: string = process.cwd()
): Promise<ReactPdfLevelupConfig> {
  for (const filename of CANDIDATE_FILENAMES) {
    const fullPath = path.join(cwd, filename)

    if (!existsSync(fullPath)) continue

    try {
      const mod = await import(pathToFileURL(fullPath).href)
      const userConfig = (mod.default ?? mod) as Partial<ReactPdfLevelupConfig>

      return {
        ...DEFAULT_CONFIG,
        ...userConfig,
      }
    } catch (err) {
      // Si falló un .ts/.mts (por ejemplo, no hay loader de TS registrado),
      // seguimos probando el resto de candidatos en vez de abortar.
      const isTsFile = filename.endsWith('.ts') || filename.endsWith('.mts')
      if (!isTsFile) throw err
      continue
    }
  }

  return DEFAULT_CONFIG
}
