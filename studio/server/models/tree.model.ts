import fs from 'node:fs/promises'
import path from 'node:path'
import { WORKSPACE_DIR } from '../config.js'
import type { Node } from '../types/index.js'

const IGNORED_ENTRIES = new Set(['.playground', 'node_modules', '.git'])

export async function buildTree(dir: string = WORKSPACE_DIR): Promise<Node[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true })

  const nodes: Node[] = []

  for (const entry of entries) {
    if (IGNORED_ENTRIES.has(entry.name)) continue

    const absPath = path.join(dir, entry.name)
    const relPath = path.relative(WORKSPACE_DIR, absPath)

    if (entry.isDirectory()) {
      nodes.push({
        path: relPath,
        name: entry.name,
        type: 'folder',
        children: await buildTree(absPath),
      })
    } else {
      nodes.push({
        path: relPath,
        name: entry.name,
        type: 'file',
      })
    }
  }

  return nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1
    return a.name.localeCompare(b.name)
  })
}
