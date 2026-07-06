import fs from 'node:fs/promises'
import path from 'node:path'
import { WORKSPACE_DIR } from '../config.js'
import { writeState, readState } from '../models/state.model.js'

const SEED_INDEX_TSX = `import React from 'react'
import { Document, Page, Text } from '@react-pdf/renderer'

export default function MyDocument() {
  return (
    <Document>
      <Page size="A4" style={{ padding: 32 }}>
        <Text>¡Hola desde react-pdf-levelup!</Text>
      </Page>
    </Document>
  )
}
`

export async function ensureWorkspace(): Promise<void> {
  await fs.mkdir(WORKSPACE_DIR, { recursive: true })

  const entries = await fs.readdir(WORKSPACE_DIR)
  const isEmpty = entries.length === 0

  if (isEmpty) {
    const indexPath = path.join(WORKSPACE_DIR, 'index.tsx')
    await fs.writeFile(indexPath, SEED_INDEX_TSX, 'utf-8')
    await writeState({ mainFile: 'index.tsx' })
    return
  }

  // Si el workspace ya tenía contenido pero falta el state, lo creamos vacío.
  const state = await readState()
  if (state.mainFile === undefined) {
    await writeState({ mainFile: null })
  }
}
