import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { existsSync } from 'node:fs'

export interface ReactPdfLevelupConfig {
  productionPort: number
  templatesDir: string
  // Se usa solo del lado del cliente (Playground/Studio, ver
  // @react-pdf-levelup/user-config); el server no la necesita, pero
  // queda tipada acá para que el shape sea consistente end-to-end.
  npmModules?: Record<string, unknown>
  // Paso 6 del plan de migración (rediseno-render-servidor.md, sección 5):
  // modo estricto OPCIONAL para /api/render. Ausente/undefined (default) =
  // comportamiento "single-user" ya implementado: cualquier paquete
  // instalado en node_modules se resuelve dinámicamente sin whitelist.
  // Si se define (aunque sea []), server/lib/serverCompileWorkspace.ts
  // pasa a modo estricto: solo los specifiers listados acá se resuelven;
  // cualquier import npm fuera de esta lista corta con 422 antes de
  // intentar el `import()` dinámico. Pensado para el día en que el Studio
  // se exponga a más de un usuario (ver huecos de seguridad en
  // MIGRACION-STATUS.md, sección "Huecos que quedan abiertos").
  //
  // Nota deliberada: es un campo DISTINTO de `npmModules` de arriba, no lo
  // reutiliza. `npmModules` ya está documentado como "solo cliente" (mapa
  // specifier -> módulo ya cargado por Vite); esta lista es servidor,
  // specifiers puros, y se resuelve con `import()` real en cada request.
  // Mezclar ambos shapes bajo el mismo campo hubiera sido confuso.
  serverNpmWhitelist?: string[]
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
