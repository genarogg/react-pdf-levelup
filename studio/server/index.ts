import app from './app.js'
import { PORT, isProduction } from './config.js'
import { ensureWorkspace } from './seed/ensureWorkspace.js'

await ensureWorkspace()

app
  .listen({ port: PORT, host: '0.0.0.0' })
  .then(() => {
    const message = isProduction
      ? `React PDF Levelup Studio está corriendo en http://localhost:${PORT}`
      : `API de desarrollo en http://localhost:${PORT} (frontend en http://localhost:8000)`
    app.log.info(message)
    console.log(message) // Also log directly to console to ensure visibility
  })
  .catch((err) => {
    app.log.error(err)
    console.error(err)
    process.exit(1)
  })
