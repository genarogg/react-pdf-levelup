import type { FastifyPluginAsync } from 'fastify'
import * as mainController from '../controllers/main.controller.js'
import type { PutMainBody } from '../types/index.js'

const mainRoutes: FastifyPluginAsync = async (app) => {
  app.put<{ Body: PutMainBody }>('/main', mainController.putMain)
}

export default mainRoutes
