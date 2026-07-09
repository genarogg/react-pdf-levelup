import app from './app.js'
import { PORT, isProduction } from './config.js'
import { ensureWorkspace } from './seed/ensureWorkspace.js'
import { exec } from 'node:child_process'

await ensureWorkspace()

function openBrowser(url: string) {
  const platform = process.platform
  if (platform === 'win32') {
    exec(`start "" "${url}"`)
  } else if (platform === 'darwin') {
    exec(`open "${url}"`)
  } else {
    exec(`xdg-open "${url}"`)
  }
}

app
  .listen({ port: PORT, host: '0.0.0.0' })
  .then(() => {
    const url = `http://localhost:${PORT}`
    const message = isProduction
      ? `React PDF Levelup Studio está corriendo en ${url}`
      : `API de desarrollo en ${url} (frontend en http://localhost:8000)`
    app.log.info(message)
    console.log(message) // Also log directly to console to ensure visibility
    if (isProduction) {
      openBrowser(url)
    }
  })
  .catch((err) => {
    app.log.error(err)
    console.error(err)
    process.exit(1)
  })
