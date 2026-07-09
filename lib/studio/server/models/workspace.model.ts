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

const IMAGE_MIME_BY_EXT: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
}

export function imageMimeType(relPath: string): string | null {
  const ext = path.extname(relPath).toLowerCase()
  return IMAGE_MIME_BY_EXT[ext] ?? null
}

/**
 * Lee un archivo binario (imagen) y lo devuelve como data URL base64, para
 * poder transportarlo dentro del mismo JSON que usa /api/file sin corromper
 * los bytes (a diferencia de readFile, que fuerza utf-8).
 */
export async function readFileAsDataUrl(relPath: string, mime: string): Promise<string> {
  const absPath = resolveSafe(relPath)
  const buffer = await fs.readFile(absPath)
  return `data:${mime};base64,${buffer.toString('base64')}`
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
