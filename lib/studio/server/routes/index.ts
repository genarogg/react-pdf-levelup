import type { FastifyPluginAsync } from 'fastify'
import treeRoutes from './tree.routes.js'
import fileRoutes from './file.routes.js'
import mainRoutes from './main.routes.js'
import renderRoutes from './render.routes.js'

const routes: FastifyPluginAsync = async (app) => {
  await app.register(treeRoutes)
  await app.register(fileRoutes)
  await app.register(mainRoutes)
  await app.register(renderRoutes)
}

export default routes
