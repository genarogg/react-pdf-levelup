#!/usr/bin/env node
/**
 * Compila studio/ (server + client) y copia los artefactos resultantes
 * hacia lib/studio/dist, que es el paquete publicable (react-pdf-levelup).
 *
 * Uso: node scripts/build-lib.mjs
 * (se invoca normalmente vía `npm run build:lib`)
 */
import { execSync } from 'node:child_process'
import { cpSync, rmSync, existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const studioRoot = path.resolve(__dirname, '..')
const monorepoRoot = path.resolve(studioRoot, '..')
const libStudioRoot = path.join(monorepoRoot, 'lib', 'studio')

function run(cmd) {
  console.log(`$ ${cmd}`)
  execSync(cmd, { cwd: studioRoot, stdio: 'inherit' })
}

// 1. Build completo (server + client) en studio/dist
run('npm run build')

// 2. Preparar destino en lib/studio/dist
const destDist = path.join(libStudioRoot, 'dist')
if (existsSync(destDist)) {
  rmSync(destDist, { recursive: true, force: true })
}
mkdirSync(destDist, { recursive: true })

// 3. Copiar dist/server -> lib/studio/dist/server
//    (queda anidado como dist/server/server/index.js por rootDir: "."
//    del tsconfig.server.json; el CLI ya apunta a esa ruta)
cpSync(
  path.join(studioRoot, 'dist', 'server'),
  path.join(destDist, 'server'),
  { recursive: true }
)

// 4. Copiar dist/client -> lib/studio/dist/client
cpSync(
  path.join(studioRoot, 'dist', 'client'),
  path.join(destDist, 'client'),
  { recursive: true }
)

console.log(`\n✔ Paquete listo en ${libStudioRoot}`)
