import path from 'node:path'

const LANGUAGE_BY_EXT: Record<string, string> = {
  '.tsx': 'typescript',
  '.ts': 'typescript',
  '.jsx': 'javascript',
  '.js': 'javascript',
  '.json': 'json',
}

export function inferLanguage(absPath: string): string {
  const ext = path.extname(absPath).toLowerCase()
  return LANGUAGE_BY_EXT[ext] ?? 'plaintext'
}
