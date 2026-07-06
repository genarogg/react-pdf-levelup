import fs from 'node:fs/promises'
import path from 'node:path'
import { resolveSafe } from '../lib/fsSafe.js'

export async function exists(relPath: string): Promise<boolean> {
  const absPath = resolveSafe(relPath)
  try {
    await fs.access(absPath)
    return true
  } catch {
    return false
  }
}

export async function statFile(relPath: string) {
  const absPath = resolveSafe(relPath)
  return fs.stat(absPath)
}

export async function readFile(relPath: string): Promise<string> {
  const absPath = resolveSafe(relPath)
  return fs.readFile(absPath, 'utf-8')
}

export async function writeFile(relPath: string, content: string): Promise<void> {
  const absPath = resolveSafe(relPath)
  await fs.mkdir(path.dirname(absPath), { recursive: true })
  await fs.writeFile(absPath, content, 'utf-8')
}

export async function createEntry(relPath: string, type: 'file' | 'folder'): Promise<void> {
  const absPath = resolveSafe(relPath)

  if (await exists(relPath)) {
    const err = new Error(`Ya existe: ${relPath}`) as NodeJS.ErrnoException
    err.code = 'EEXIST'
    throw err
  }

  if (type === 'folder') {
    await fs.mkdir(absPath, { recursive: true })
  } else {
    await fs.mkdir(path.dirname(absPath), { recursive: true })
    await fs.writeFile(absPath, '', 'utf-8')
  }
}

export async function renameEntry(relPath: string, newRelPath: string): Promise<void> {
  const absPath = resolveSafe(relPath)
  const newAbsPath = resolveSafe(newRelPath)
  await fs.mkdir(path.dirname(newAbsPath), { recursive: true })
  await fs.rename(absPath, newAbsPath)
}

export async function deleteEntry(relPath: string): Promise<void> {
  const absPath = resolveSafe(relPath)
  await fs.rm(absPath, { recursive: true, force: false })
}
