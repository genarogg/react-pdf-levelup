import type { FastifyReply, FastifyRequest } from 'fastify'
import * as workspaceModel from '../models/workspace.model.js'
import * as stateModel from '../models/state.model.js'
import type { PutMainBody } from '../types/index.js'

export async function putMain(
  req: FastifyRequest<{ Body: PutMainBody }>,
  reply: FastifyReply
) {
  const { path: relPath } = req.body

  if (!(await workspaceModel.exists(relPath))) {
    return reply.code(400).send({ error: `Path inválido, no existe: ${relPath}` })
  }

  const stat = await workspaceModel.statFile(relPath)
  if (!stat.isFile()) {
    return reply.code(400).send({ error: `Path inválido, no es un archivo: ${relPath}` })
  }

  const state = await stateModel.writeState({ mainFile: relPath })
  return reply.send({ ok: true, mainFile: state.mainFile })
}
