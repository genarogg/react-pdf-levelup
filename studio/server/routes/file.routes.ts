import type { FastifyPluginAsync } from 'fastify'
import * as fileController from '../controllers/file.controller.js'
import type {
  DeleteFileQuery,
  GetFileQuery,
  PatchFileBody,
  PostFileBody,
  PutFileBody,
} from '../types/index.js'

const fileRoutes: FastifyPluginAsync = async (app) => {
  app.get<{ Querystring: GetFileQuery }>('/file', fileController.getFile)
  app.put<{ Body: PutFileBody }>('/file', fileController.putFile)
  app.post<{ Body: PostFileBody }>('/file', fileController.postFile)
  app.patch<{ Body: PatchFileBody }>('/file', fileController.patchFile)
  app.delete<{ Querystring: DeleteFileQuery }>('/file', fileController.deleteFile)
}

export default fileRoutes
