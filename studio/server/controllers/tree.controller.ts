import type { FastifyReply, FastifyRequest } from 'fastify'
import * as stateModel from '../models/state.model.js'
import * as treeModel from '../models/tree.model.js'
import type { GetTreeResponse } from '../types/index.js'

export async function getTree(_req: FastifyRequest, reply: FastifyReply) {
  const [state, tree] = await Promise.all([stateModel.readState(), treeModel.buildTree()])

  const response: GetTreeResponse = { mainFile: state.mainFile, tree }
  return reply.send(response)
}
