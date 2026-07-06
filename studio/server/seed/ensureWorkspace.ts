import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { WORKSPACE_DIR } from '../config.js'
import { writeState, readState } from '../models/state.model.js'

// __dirname no existe en ESM; lo reconstruimos para que la ruta a
// templatesExample sea relativa a ESTE archivo (server/seed/) y no a
// process.cwd(), que puede variar según desde dónde se arranque el server.
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const TEMPLATES_EXAMPLE_DIR = path.resolve(__dirname, '../templatesExample')

// Archivo "principal" dentro de templatesExample que debe quedar seteado
// como mainFile tras el seed. Debe coincidir con el nombre real del archivo
// (case-sensitive) copiado a la raíz del workspace.
const SEED_MAIN_FILE = 'Index.tsx'

export async function ensureWorkspace(): Promise<void> {
  await fs.mkdir(WORKSPACE_DIR, { recursive: true })

  const entries = await fs.readdir(WORKSPACE_DIR)
  const isEmpty = entries.length === 0

  if (isEmpty) {
    await fs.cp(TEMPLATES_EXAMPLE_DIR, WORKSPACE_DIR, { recursive: true })
    await writeState({ mainFile: SEED_MAIN_FILE })
    return
  }

  // Si el workspace ya tenía contenido pero falta el state, lo creamos vacío.
  const state = await readState()
  if (state.mainFile === undefined) {
    await writeState({ mainFile: null })
  }
}
