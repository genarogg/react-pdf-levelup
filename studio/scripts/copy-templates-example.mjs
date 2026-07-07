#!/usr/bin/env node
/**
 * ensureWorkspace.ts resuelve TEMPLATES_EXAMPLE_DIR como
 * `../templatesExample` relativo a sí mismo (server/seed/), y esa carpeta
 * debe existir FÍSICAMENTE junto al .js compilado en tiempo de ejecución.
 *
 * server/templatesExample contiene plantillas de ejemplo (.tsx, assets)
 * que son CONTENIDO a copiar tal cual al workspace del usuario, no código
 * fuente del servidor — por eso tsconfig.server.json las excluye
 * explícitamente del type-check/emit. Este script las copia como estáticos
 * después del build de tsc, igual que Vite copia assets estáticos del
 * cliente.
 *
 * Uso: node scripts/copy-templates-example.mjs
 * (se invoca automáticamente como parte de `npm run build:server`)
 */
import { cpSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')

const source = path.join(projectRoot, 'server', 'templatesExample')

// Debe coincidir con dist/server/server/... (rootDir: "." en
// tsconfig.server.json anida un "server/" extra dentro de dist/server).
const destination = path.join(
  projectRoot,
  'dist',
  'server',
  'server',
  'templatesExample'
)

if (!existsSync(source)) {
  console.error(`✘ No existe ${source}`)
  process.exit(1)
}

cpSync(source, destination, { recursive: true })
console.log(`✔ templatesExample copiado a ${destination}`)
