import fs from 'node:fs/promises'
import path from 'node:path'
import { WORKSPACE_DIR } from '../config.js'
import type { StudioState } from '../types/index.js'

const STATE_DIR = path.join(WORKSPACE_DIR, '.playground')
const STATE_FILE = path.join(STATE_DIR, 'state.json')

export async function readState(): Promise<StudioState> {
  try {
    const raw = await fs.readFile(STATE_FILE, 'utf-8')
    return JSON.parse(raw) as StudioState
  } catch {
    return { mainFile: null }
  }
}

export async function writeState(partial: Partial<StudioState>): Promise<StudioState> {
  const current = await readState()
  const next: StudioState = { ...current, ...partial }
  await fs.mkdir(STATE_DIR, { recursive: true })
  await fs.writeFile(STATE_FILE, JSON.stringify(next, null, 2), 'utf-8')
  return next
}

export async function clearMainIfMatches(relPath: string): Promise<void> {
  const state = await readState()
  if (state.mainFile === relPath) {
    await writeState({ mainFile: null })
  }
}

export async function updateMainIfMatches(oldRelPath: string, newRelPath: string): Promise<void> {
  const state = await readState()
  if (state.mainFile === oldRelPath) {
    await writeState({ mainFile: newRelPath })
  }
}
