import app from './app.js'
import { PORT, isProduction } from './config.js'
import { ensureWorkspace } from './seed/ensureWorkspace.js'

await ensureWorkspace()

app
  .listen({ port: PORT, host: '0.0.0.0' })
  .then(() => {
    app.log.info(
      isProduction
        ? `Servidor de producción en http://localhost:${PORT}`
        : `API de desarrollo en http://localhost:${PORT} (frontend en http://localhost:8000)`
    )
  })
  .catch((err) => {
    app.log.error(err)
    process.exit(1)
  })
