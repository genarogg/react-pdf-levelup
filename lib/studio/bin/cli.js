#!/usr/bin/env node
import path from 'node:path'
import { existsSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { spawn } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(__dirname, '..')
const serverEntry = path.join(packageRoot, 'dist', 'server', 'index.js')
const serverEntryURL = pathToFileURL(serverEntry).href

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

if (runtime === 'bun') {
  // Para bun, simplemente ejecutar con bun directamente
  execPath = 'bun'
} else if (runtime === 'tsx') {
  // Para tsx, ejecutar el binario de tsx
  const tsxBinPath = path.join(packageRoot, 'node_modules', '.bin', 'tsx')
  execPath = tsxBinPath
} else if (runtime === 'ts-node') {
  // Para ts-node, usar el binario de ts-node
  const tsNodeBinPath = path.join(cwd, 'node_modules', '.bin', 'ts-node')
  execPath = tsNodeBinPath
}

// Si usamos node, manejar loaders
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
  } else if (needsTsRuntime) {
    // Usar tsx loader por defecto
    const tsxLoaderPath = path.join(
      packageRoot,
      'node_modules',
      'tsx',
      'dist',
      'loader.mjs'
    )
    const tsxLoaderURL = pathToFileURL(tsxLoaderPath).href
    execArgs.push('--import', tsxLoaderURL)
  }
}

execArgs.push(serverEntryURL, ...args)

const childEnv = { ...process.env, NODE_ENV: 'production' }

const child = spawn(execPath, execArgs, {
  stdio: 'inherit',
  cwd,
  env: childEnv,
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
