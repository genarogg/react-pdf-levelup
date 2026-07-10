import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { UnsafePathError } from '../lib/fsSafe.js'

export function errorHandler(
  error: FastifyError | NodeJS.ErrnoException,
  _req: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof UnsafePathError) {
    return reply.code(400).send({ error: error.message })
  }

  const code = (error as NodeJS.ErrnoException).code

  if (code === 'ENOENT') {
    return reply.code(404).send({ error: 'No encontrado' })
  }

  if (code === 'EEXIST') {
    return reply.code(409).send({ error: 'Ya existe' })
  }

  reply.log?.error?.(error)
  return reply.code(500).send({ error: error.message ?? 'Error interno' })
}
