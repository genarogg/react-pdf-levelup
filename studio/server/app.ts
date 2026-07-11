import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import fastifyCors from '@fastify/cors'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { isProduction } from './config.js'
import { errorHandler } from './middlewares/errorHandler.js'
import routes from './routes/index.js'

// __dirname no existe en ESM; lo reconstruimos para que la ruta al build
// del cliente sea relativa a ESTE archivo (dist/server/app.js dentro del
// paquete instalado), y no a process.cwd(), que es el proyecto del
// consumidor y nunca contiene dist/client. Mismo criterio que
// server/seed/ensureWorkspace.ts.
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = Fastify({ 
  // logger: !isProduction
})

if (!isProduction) {
  await app.register(fastifyCors, { origin: 'http://localhost:8000' })
}

app.setErrorHandler(errorHandler)

await app.register(routes, { prefix: '/api' })

if (isProduction) {
  const clientDist = path.join(__dirname, '..', 'client')

  await app.register(fastifyStatic, {
    root: clientDist,
  })

  app.setNotFoundHandler((request, reply) => {
    if (request.raw.url?.startsWith('/api')) {
      reply.code(404).send({ error: 'Not found' })
      return
    }
    reply.sendFile('index.html', clientDist)
  })
}

export default app
