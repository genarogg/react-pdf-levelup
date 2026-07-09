import type { FastifyReply, FastifyRequest } from 'fastify'
import * as workspaceModel from '../models/workspace.model.js'
import * as stateModel from '../models/state.model.js'
import { resolveSafe } from '../lib/fsSafe.js'
import { inferLanguage } from '../lib/language.js'
import type {
  DeleteFileQuery,
  GetFileQuery,
  GetFileResponse,
  PatchFileBody,
  PostFileBody,
  PutFileBody,
} from '../types/index.js'

export async function getFile(
  req: FastifyRequest<{ Querystring: GetFileQuery }>,
  reply: FastifyReply
) {
  const { path: relPath } = req.query

  if (!(await workspaceModel.exists(relPath))) {
    const err = new Error(`No existe: ${relPath}`) as NodeJS.ErrnoException
    err.code = 'ENOENT'
    throw err
  }

  const absPath = resolveSafe(relPath)

  // Las imágenes son binarias: se leen con fs.readFile crudo y se devuelven
  // como data URL, en vez de forzar utf-8 (que corrompería los bytes).
  const mime = workspaceModel.imageMimeType(relPath)
  const content = mime
    ? await workspaceModel.readFileAsDataUrl(relPath, mime)
    : await workspaceModel.readFile(relPath)

  const response: GetFileResponse = {
    path: relPath,
    content,
    language: inferLanguage(absPath),
  }
  return reply.send(response)
}

export async function putFile(
  req: FastifyRequest<{ Body: PutFileBody }>,
  reply: FastifyReply
) {
  const { path: relPath, content } = req.body
  await workspaceModel.writeFile(relPath, content)
  return reply.send({ ok: true })
}

export async function postFile(
  req: FastifyRequest<{ Body: PostFileBody }>,
  reply: FastifyReply
) {
  const { path: relPath, type } = req.body
  await workspaceModel.createEntry(relPath, type)
  return reply.code(201).send({ ok: true, path: relPath, type })
}

export async function patchFile(
  req: FastifyRequest<{ Body: PatchFileBody }>,
  reply: FastifyReply
) {
  const { path: relPath, newPath } = req.body
  await workspaceModel.renameEntry(relPath, newPath)
  await stateModel.updateMainIfMatches(relPath, newPath)
  return reply.send({ ok: true, path: newPath })
}

export async function deleteFile(
  req: FastifyRequest<{ Querystring: DeleteFileQuery }>,
  reply: FastifyReply
) {
  const { path: relPath } = req.query
  await workspaceModel.deleteEntry(relPath)
  await stateModel.clearMainIfMatches(relPath)
  return reply.send({ ok: true })
}
