import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const targets = [
  ['api', '.astro'],
  ['api', '.turbo'],
  ['api', 'dist'],
  ['frontend', '.turbo'],
  ['frontend', 'dist'],
]

function removeDirSafe(dirPath) {
  try {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true })
      console.log(`Deleted: ${dirPath}`)
    } else {
      console.log(`Skip (not found): ${dirPath}`)
    }
  } catch (e) {
    console.error(`Failed to delete ${dirPath}:`, e.message)
  }
}

function main() {
  console.log('Starting pre-build cleanup...')
  for (const parts of targets) {
    const targetPath = path.join(rootDir, ...parts)
    removeDirSafe(targetPath)
  }
  console.log('Pre-build cleanup complete.')
}

main()
