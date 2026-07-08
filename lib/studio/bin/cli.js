#!/usr/bin/env node
import path from 'node:path'
import { existsSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { spawn } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(__dirname, '..')
const serverEntry = path.join(packageRoot, 'dist', 'server', 'index.js')
const serverEntryURL = pathToFileURL(serverEntry).href

/**
 * Busca un binario (node_modules/.bin/<name>) subiendo por el árbol de
 * directorios desde `fromDir` hasta la raíz del filesystem. Es el mismo
 * mecanismo (symlinks en node_modules/.bin) que usan npm/yarn/pnpm para
 * exponer binarios, incluso en monorepos/workspaces con hoisting: el
 * gestor de paquetes ya resuelve esos symlinks correctamente, así que
 * subir el árbol de carpetas es suficiente y evita reimplementar a mano
 * la resolución de node_modules.
 *
 * @param {string} binName
 * @param {string} fromDir
 * @returns {string|null}
 */
function findBinUpwards(binName, fromDir) {
  let dir = fromDir
  const binFile = process.platform === 'win32' ? `${binName}.cmd` : binName
  while (true) {
    const candidate = path.join(dir, 'node_modules', '.bin', binFile)
    if (existsSync(candidate)) return candidate
    const parent = path.dirname(dir)
    if (parent === dir) return null
    dir = parent
  }
}

const [, , command, ...rest] = process.argv

function printUsage() {
  console.log(`
Uso: npx react-pdf-levelup studio [opciones]

Opciones:
  --runtime <nombre>    Runtime a usar (node, bun, tsx, ts-node). Predeterminado: node
  --loader <ruta>       Ruta a un loader ESM personalizado (ej: tsx/loader.mjs, ts-node/esm)
  --no-ts-auto          No usar auto-detección de TypeScript, ejecutar directamente sin loader

Ejemplos:
  npx react-pdf-levelup studio
  npx react-pdf-levelup studio --runtime bun
  npx react-pdf-levelup studio --loader ts-node/esm
  npx react-pdf-levelup studio --no-ts-auto
`)
}

if (command !== 'studio') {
  printUsage()
  process.exit(command ? 1 : 0)
}

let runtime = 'node'
let customLoader = null
let noTsAuto = false

// Parsear argumentos
const args = []
for (let i = 0; i < rest.length; i++) {
  const arg = rest[i]
  if (arg === '--runtime' && rest[i + 1]) {
    runtime = rest[i + 1]
    i++
  } else if (arg === '--loader' && rest[i + 1]) {
    customLoader = rest[i + 1]
    i++
  } else if (arg === '--no-ts-auto') {
    noTsAuto = true
  } else if (arg === '--help' || arg === '-h') {
    printUsage()
    process.exit(0)
  } else {
    args.push(arg)
  }
}

const cwd = process.cwd()

const TS_CONFIG_CANDIDATES = [
  'react-pdf-levelup-config.ts',
  'react-pdf-levelup-config.mts',
]

const needsTsRuntime = !noTsAuto && TS_CONFIG_CANDIDATES.some((filename) =>
  existsSync(path.join(cwd, filename))
)

/**
 * Resolver runtime y loader
 */
let execPath = process.execPath
let execArgs = []

// Si se detectó que se necesita TypeScript y no se pidió un runtime
// explícito, adoptamos el mismo patrón que usa Prisma para "prisma db seed":
// en vez de resolver manualmente un archivo interno del paquete tsx y
// cargarlo con `node --import <ruta>`, delegamos la ejecución completa al
// binario `tsx` (`node_modules/.bin/tsx`), igual que si el usuario hubiera
// corrido `tsx server.js` a mano. Ventajas sobre resolver el loader:
//   1. Nunca choca con el "exports" map del paquete tsx (no se pide
//      ninguna ruta interna tipo "tsx/dist/loader.mjs").
//   2. Es exactamente el mismo mecanismo que ya usa Node para cualquier
//      CLI (PATH / node_modules/.bin), probado y estable.
//   3. Funciona igual en monorepos, porque node_modules/.bin ya contiene
//      symlinks resueltos correctamente por el gestor de paquetes
//      (npm/yarn/pnpm), sin que nosotros tengamos que reimplementar su
//      lógica de resolución.
if (runtime === 'node' && needsTsRuntime && !customLoader) {
  runtime = 'tsx'
}

if (runtime === 'bun') {
  // Para bun, simplemente ejecutar con bun directamente
  execPath = 'bun'
} else if (runtime === 'tsx') {
  // Para tsx, ejecutar el binario de tsx.
  // Se busca ascendiendo desde cwd (soporta monorepos/workspaces donde
  // node_modules/.bin vive en un directorio superior por hoisting) y,
  // si no aparece, se cae al node_modules propio del paquete.
  const tsxBinPath =
    findBinUpwards('tsx', cwd) ??
    findBinUpwards('tsx', packageRoot) ??
    path.join(packageRoot, 'node_modules', '.bin', 'tsx')

  if (!existsSync(tsxBinPath)) {
    console.error(
      'No se encontró el binario de "tsx" (node_modules/.bin/tsx).\n' +
        'Instálalo en tu proyecto para poder usar react-pdf-levelup-config.ts:\n' +
        '  npm install --save-dev tsx\n' +
        'Alternativamente, usa react-pdf-levelup-config.js o .mjs, o pasa\n' +
        '--no-ts-auto si no necesitas el archivo de config en TypeScript.'
    )
    process.exit(1)
  }
  execPath = tsxBinPath
} else if (runtime === 'ts-node') {
  // Para ts-node, usar el binario de ts-node (misma lógica ascendente)
  const tsNodeBinPath =
    findBinUpwards('ts-node', cwd) ??
    findBinUpwards('ts-node', packageRoot) ??
    path.join(cwd, 'node_modules', '.bin', 'ts-node')
  execPath = tsNodeBinPath
}

// Si usamos node "puro" a este punto, solo queda el caso de --loader
// explícito proporcionado por el usuario (no auto-detección de tsx).
if (runtime === 'node') {
  if (customLoader) {
    // Loader personalizado proporcionado por el usuario
    let loaderURL
    if (customLoader.startsWith('file://') || customLoader.startsWith('node:')) {
      loaderURL = customLoader
    } else {
      // Si es una ruta relativa, resolverla
      const loaderPath = path.isAbsolute(customLoader)
        ? customLoader
        : path.resolve(cwd, customLoader)
      loaderURL = pathToFileURL(loaderPath).href
    }
    execArgs.push('--import', loaderURL)
  }
}

// IMPORTANTE: `node` sabe resolver una URL "file://" pasada como entry
// point, pero los CLIs de `tsx`/`bun`/`ts-node` la reciben como si fuera
// un module specifier relativo (no reconocen el prefijo "file://" como
// ruta absoluta) y terminan concatenándola con el cwd, produciendo un
// ERR_MODULE_NOT_FOUND con una ruta duplicada sin sentido. Por eso solo
// usamos la URL cuando el ejecutor final es "node" puro; para cualquier
// otro runtime externo se pasa la ruta de archivo normal del sistema.
const serverEntryArg = runtime === 'node' ? serverEntryURL : serverEntry

execArgs.push(serverEntryArg, ...args)

const childEnv = { ...process.env, NODE_ENV: 'production' }

// Desde Node 18.20.2 / 20.12.2 / 21.7.2 (parche de seguridad
// CVE-2024-27980), spawn() en Windows lanza `EINVAL` si el ejecutable es
// un .bat o .cmd (como node_modules\.bin\tsx.cmd) y no se pasa la opción
// `shell: true` explícitamente. Sin esto, cualquier binario resuelto vía
// node_modules/.bin en Windows (tsx, ts-node, etc.) falla directamente,
// incluso si la ruta es correcta.
// Referencia: https://nodejs.org/en/blog/vulnerability/april-2024-security-releases-2
const isWindowsScript =
  process.platform === 'win32' && /\.(cmd|bat)$/i.test(execPath)

// Cuando se usa shell:true en Windows, spawn() NO cita automáticamente el
// ejecutable por nosotros (a diferencia del caso sin shell). Si la ruta
// contiene espacios (común en "Program Files", o en cualquier monorepo
// bajo una carpeta con espacios) hay que envolverla en comillas dobles a
// mano, o cmd.exe la partirá en varios tokens y fallará con
// "no se reconoce como un comando".
const spawnExecPath =
  isWindowsScript && !/^".*"$/.test(execPath) ? `"${execPath}"` : execPath

const child = spawn(spawnExecPath, execArgs, {
  stdio: 'inherit',
  cwd,
  env: childEnv,
  shell: isWindowsScript,
})

child.on('exit', (code) => {
  if (needsTsRuntime && code !== 0) {
    console.error(
      '\nSi el error anterior menciona el paquete "tsx", instálalo para poder\n' +
        'usar react-pdf-levelup-config.ts en tu proyecto:\n' +
        '  npm install --save-dev tsx\n' +
        'Alternativamente, usa react-pdf-levelup-config.js o .mjs.'
    )
  }
  process.exit(code ?? 0)
})

child.on('error', (err) => {
  if (needsTsRuntime && err.code === 'ENOENT') {
    console.error(
      'No se encontró "tsx". Para usar react-pdf-levelup-config.ts instala tsx como dependencia:\n' +
        '  npm install --save-dev tsx'
    )
  } else {
    console.error(err)
  }
  process.exit(1)
})