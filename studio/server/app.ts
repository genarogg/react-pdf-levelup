import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import fastifyCors from '@fastify/cors'
import path from 'node:path'
import { isProduction } from './config.js'
import { errorHandler } from './middlewares/errorHandler.js'
import routes from './routes/index.js'

const app = Fastify({})

if (!isProduction) {
  await app.register(fastifyCors, { origin: 'http://localhost:8500' })
}

app.setErrorHandler(errorHandler)

await app.register(routes, { prefix: '/api' })

if (isProduction) {
  const clientDist = path.join(process.cwd(), 'dist', 'client')

  await app.register(fastifyStatic, {
    root: clientDist,
    index: false,
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
