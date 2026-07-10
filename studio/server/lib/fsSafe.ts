import path from 'node:path'
import { WORKSPACE_DIR } from '../config.js'

export class UnsafePathError extends Error {
  constructor(relPath: string) {
    super(`Ruta fuera del workspace: ${relPath}`)
    this.name = 'UnsafePathError'
  }
}

/**
 * Resuelve `relPath` contra WORKSPACE_DIR y garantiza que el resultado
 * quede dentro del jail. Si la ruta intenta salir (path traversal,
 * ruta absoluta fuera del workspace, etc.), lanza UnsafePathError.
 */
export function resolveSafe(relPath: string): string {
  const normalized = path.normalize(relPath).replace(/^([/\\])+/, '')
  const absPath = path.resolve(WORKSPACE_DIR, normalized)

  const relativeToWorkspace = path.relative(WORKSPACE_DIR, absPath)
  const isInsideWorkspace =
    relativeToWorkspace === '' ||
    (!relativeToWorkspace.startsWith('..') && !path.isAbsolute(relativeToWorkspace))

  if (!isInsideWorkspace) {
    throw new UnsafePathError(relPath)
  }

  return absPath
}
