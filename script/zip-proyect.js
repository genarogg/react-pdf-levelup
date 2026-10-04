#!/usr/bin/env node
/**
 * zip-project.mjs — Crea un .zip del proyecto excluyendo todo lo que
 * esté ignorado por .gitignore.
 *
 * Recorre el árbol de archivos a mano y usa el paquete `ignore` para
 * aplicar las reglas de .gitignore con el mismo comportamiento que git
 * (negaciones tipo "!archivo", wildcards, patrones anidados, etc.) sin
 * depender de tener `git` instalado.
 *
 * Pensado para vivir en <raiz-del-proyecto>/script/zip-project.mjs: sin
 * argumentos, comprime la CARPETA PADRE del script (la raíz del
 * proyecto), no el directorio desde donde se lo invoque ni la carpeta
 * script/ misma.
 *
 * Uso:
 *   node script/zip-project.mjs [carpeta-proyecto] [archivo-salida.zip]
 *
 * Ejemplos:
 *   node script/zip-project.mjs
 *     → comprime la raíz del proyecto (padre de script/) en project.zip,
 *       en la raíz del proyecto.
 *   node script/zip-project.mjs ./otra-carpeta
 *     → comprime ./otra-carpeta en vez de la raíz del proyecto.
 *   node script/zip-project.mjs . salida.zip
 *     → carpeta explícita (directorio actual) + nombre de salida custom.
 *
 * Dependencias (instalar antes de usar, parado en la raíz del proyecto):
 *   npm install archiver@^7 ignore
 *
 * (Se fija archiver en la serie 7.x a propósito: la 8.x pasó a ser un
 * paquete ESM con una API distinta (Archiver/ZipArchive) en vez del
 * factory clásico `archiver('zip', ...)` que usa este script.)
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

// archiver e ignore son paquetes CommonJS clásicos (`module.exports = fn`,
// sin `exports.default`). Importarlos con `import x from '...'` depende de
// que Node adivine bien el interop CJS→ESM, y esa detección puede fallar
// según plataforma/versión (falla típica en Windows: "does not provide an
// export named 'default'"). Usar createRequire evita depender de esa
// detección: es el mismo mecanismo que usaría un archivo .cjs, así que
// funciona igual en cualquier SO.
const require = createRequire(import.meta.url)
const archiver = require('archiver')
const ignoreLib = require('ignore')

// --- Rutas base ---
// __dirname equivalente en ESM: carpeta donde vive ESTE archivo (script/).
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// Raíz del proyecto = carpeta padre de script/, sin importar desde dónde
// se haya invocado "node" (a diferencia de usar process.cwd()).
const projectRoot = path.resolve(__dirname, '..')

// --- Args ---
// Si no se pasa carpeta, comprimimos la raíz del proyecto (no cwd, no script/).
const projectDirArg = process.argv[2]
const projectDir = projectDirArg ? path.resolve(process.cwd(), projectDirArg) : projectRoot
const projectName = path.basename(projectDir)
// Si no se pasa nombre de salida, el zip se escribe en la raíz del
// proyecto (no en script/ ni en cwd), como <nombre-proyecto>.zip.
const outputArg = process.argv[3]
const outputZip = outputArg
  ? (path.isAbsolute(outputArg) ? outputArg : path.resolve(process.cwd(), outputArg))
  : path.join(projectRoot, `${projectName}.zip`)

if (!fs.existsSync(projectDir) || !fs.statSync(projectDir).isDirectory()) {
  console.error(`Error: "${projectDir}" no existe o no es una carpeta.`)
  process.exit(1)
}

// .git siempre se excluye, exista o no .gitignore (nunca tiene sentido empaquetarlo)
const ALWAYS_IGNORE = ['.git']

/**
 * Junta TODOS los .gitignore del árbol (raíz + subcarpetas), igual que
 * git: cada .gitignore aplica sus reglas de forma relativa a la carpeta
 * donde vive, y afecta también a las subcarpetas por debajo.
 *
 * Para simplificar, usamos una sola instancia de `ignore` por proyecto,
 * pero registrando cada patrón con su ruta relativa a la RAÍZ DEL
 * REPOSITORIO (projectRoot), así cuando zipeamos una subcarpeta tipo
 * ./backend todas las reglas (incluyendo node_modules del .gitignore
 * raíz) siguen aplicando correctamente.
 */
function collectGitignoreRules(rootDir) {
  const ig = ignoreLib()
  ig.add(ALWAYS_IGNORE)

  function walkForGitignores(dir) {
    const gitignorePath = path.join(dir, '.gitignore')
    if (fs.existsSync(gitignorePath)) {
      const relDir = path.relative(rootDir, dir)
      const content = fs.readFileSync(gitignorePath, 'utf8')
      const lines = content.split('\n')

      for (const rawLine of lines) {
        const line = rawLine.replace(/\r$/, '')
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) continue

        if (!relDir) {
          ig.add(line)
          continue
        }

        const negated = trimmed.startsWith('!')
        const pattern = negated ? trimmed.slice(1) : trimmed
        const prefixed = `${relDir}/${pattern}`.replace(/\\/g, '/')
        ig.add(negated ? `!${prefixed}` : prefixed)
      }
    }

    let entries
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      if (entry.name === '.git' || entry.name === 'node_modules') continue
      walkForGitignores(path.join(dir, entry.name))
    }
  }

  walkForGitignores(rootDir)
  return ig
}

/**
 * Recorre el árbol y devuelve la lista de rutas de ARCHIVOS (no
 * carpetas) que sobreviven al filtro de .gitignore.
 *
 * - scanDir: carpeta que se quiere zipear (ej: ./backend)
 * - ig: instancia de ignore con reglas relativas a ignoreRoot
 * - ignoreRoot: carpeta raíz respecto a la cual están las reglas de
 *   ignore (normalmente la raíz del repo). Usamos esta para comprobar
 *   si el archivo está ignorado.
 *
 * Devuelve rutas RELATIVAS A scanDir (las que irán dentro del zip).
 */
function collectFiles(scanDir, ig, ignoreRoot) {
  const results = []

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const abs = path.join(dir, entry.name)
      const relToIgnoreRoot = path.relative(ignoreRoot, abs).replace(/\\/g, '/')

      if (entry.name === '.git') continue

      const relForCheck = entry.isDirectory() ? `${relToIgnoreRoot}/` : relToIgnoreRoot
      if (ig.ignores(relForCheck)) continue

      if (entry.isDirectory()) {
        walk(abs)
      } else if (entry.isFile() || entry.isSymbolicLink()) {
        const relToScan = path.relative(scanDir, abs).replace(/\\/g, '/')
        results.push(relToScan)
      }
    }
  }

  walk(scanDir)
  return results
}

async function main() {
  const ig = collectGitignoreRules(projectRoot)
  let files = collectFiles(projectDir, ig, projectRoot)

  const outputRelToProject = path.relative(projectDir, outputZip).replace(/\\/g, '/')
  if (!outputRelToProject.startsWith('..')) {
    files = files.filter((f) => f !== outputRelToProject)
  }

  if (files.length === 0) {
    console.warn('Advertencia: no se encontró ningún archivo para incluir en el zip.')
  }

  await fs.promises.rm(outputZip, { force: true })

  await new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputZip)
    const archive = archiver('zip', { zlib: { level: 9 } })

    output.on('close', resolve)
    archive.on('error', reject)
    archive.on('warning', (err) => {
      if (err.code !== 'ENOENT') reject(err)
    })

    archive.pipe(output)
    for (const relFile of files) {
      archive.file(path.join(projectDir, relFile), { name: relFile })
    }
    archive.finalize()
  })

  console.log(`Listo: ${outputZip} (${files.length} archivos incluidos)`)
}

// Equivalente ESM de `if (require.main === module)`: solo corre main()
// si este archivo se ejecutó directamente (node zip-project.mjs), no si
// se importó desde otro módulo.
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
if (isMain) {
  main().catch((err) => {
    console.error('Error al crear el zip:', err.message)
    process.exit(1)
  })
}

export { collectGitignoreRules, collectFiles, main }
