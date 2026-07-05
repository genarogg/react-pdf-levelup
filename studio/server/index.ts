import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import fastifyCors from '@fastify/cors'
import path from 'node:path'

const isProduction = process.env.NODE_ENV === 'production'
const PORT = Number(process.env.SERVER_PORT) || 8000

const app = Fastify({})

if (!isProduction) {
  await app.register(fastifyCors, { origin: 'http://localhost:8500' })
}

// ---- Rutas de la API ----
app.get('/api/hello', async () => {
  return { mensaje: '¡Hola desde Fastify + TypeScript!' }
})

// ---- Servir el build de React en producción ----
if (isProduction) {

  const clientDist = path.join(process.cwd(), 'dist', 'client')

  await app.register(fastifyStatic, {
    root: clientDist,
    index: false 
  })

  app.setNotFoundHandler((request, reply) => {
    if (request.raw.url?.startsWith('/api')) {
      reply.code(404).send({ error: 'Not found' })
      return
    }
    reply.sendFile('index.html', clientDist)
  })
}

app
  .listen({ port: PORT, host: '0.0.0.0' })
  .then(() => {
    app.log.info(
      isProduction
        ? `Servidor de producción en http://localhost:${PORT}`
        : `API de desarrollo en http://localhost:${PORT} (frontend en http://localhost:5173)`
    )
  })
  .catch((err) => {
    app.log.error(err)
    process.exit(1)
  })