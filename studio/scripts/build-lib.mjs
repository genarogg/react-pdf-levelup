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
const libStudioRoot = path.join(monorepoRoot, 'lib', "mod", 'studio')

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
//    (dist/server queda plano: dist/server/index.js, sin anidar otro
//    "server/" adicional, gracias a rootDir: "server" en tsconfig.server.json)
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

// 4b. Copiar dist/shared -> lib/studio/dist/shared
//     (nuevo: server/ ahora importa código compartido de shared/compiler/
//     vía rutas relativas del tipo "../../shared/compiler/xxx.js"; esas
//     rutas relativas compiladas solo resuelven si dist/shared queda
//     hermano de dist/server, tal como quedan en studio/dist/ antes de
//     esta copia. Ver tsconfig.server.json.)
const sharedSrc = path.join(studioRoot, 'dist', 'shared')
if (existsSync(sharedSrc)) {
  cpSync(sharedSrc, path.join(destDist, 'shared'), { recursive: true })
}

// 5. Copiar el .d.ts del config del usuario (generado por
//    tsconfig.config-types.json en studio/dist/, fuera de dist/server)
//    para que el consumidor pueda tipar su react-pdf-levelup-config.ts
//    importando "react-pdf-levelup/dist/react-pdf-levelup-config"
for (const ext of ['.d.ts', '.d.ts.map']) {
  const file = `react-pdf-levelup-config${ext}`
  const src = path.join(studioRoot, 'dist', file)
  if (existsSync(src)) {
    cpSync(src, path.join(destDist, file))
  }
}

console.log(`\n✔ Paquete listo en ${libStudioRoot}`)
