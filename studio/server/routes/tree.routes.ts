import type { FastifyPluginAsync } from 'fastify'
import * as treeController from '../controllers/tree.controller.js'

const treeRoutes: FastifyPluginAsync = async (app) => {
  app.get('/tree', treeController.getTree)
}

export default treeRoutes
