#!/usr/bin/env node
import path from 'node:path'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(__dirname, '..')
const serverEntry = path.join(packageRoot, 'dist', 'server', 'index.js')

const [, , command, ...rest] = process.argv

function printUsage() {
  console.log('Uso: npx react-pdf-levelup studio')
}

if (command !== 'studio') {
  printUsage()
  process.exit(command ? 1 : 0)
}

const cwd = process.cwd()

const TS_CONFIG_CANDIDATES = [
  'react-pdf-levelup-config.ts',
  'react-pdf-levelup-config.mts',
]

const needsTsRuntime = TS_CONFIG_CANDIDATES.some((filename) =>
  existsSync(path.join(cwd, filename))
)

/**
 * Si el consumidor tiene su config en .ts/.mts, necesitamos un loader de
 * TypeScript activo en el proceso del server (loadUserConfig hace un
 * import() dinámico de ese archivo). Reejecutamos el entry del server bajo
 * `tsx` en ese caso; si el config es .js/.mjs/.cjs, Node puro alcanza.
 */
// Resolvemos el loader de tsx de forma absoluta, relativo a ESTE paquete
// (no al cwd del consumidor), porque tsx vive en los node_modules de
// react-pdf-levelup y no necesariamente en los del proyecto que lo instala.
const tsxLoaderPath = path.join(
  packageRoot,
  'node_modules',
  'tsx',
  'dist',
  'loader.mjs'
)

const childEnv = { ...process.env, NODE_ENV: 'production' }

const child = needsTsRuntime
  ? spawn(
      process.execPath,
      ['--import', tsxLoaderPath, serverEntry, ...rest],
      { stdio: 'inherit', cwd, env: childEnv }
    )
  : spawn(process.execPath, [serverEntry, ...rest], {
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
