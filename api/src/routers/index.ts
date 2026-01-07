import { FastifyInstance } from 'fastify';
import type { FastifyRequest, FastifyReply } from 'fastify';

const controller = (request: FastifyRequest, reply: FastifyReply) => {
    return reply.view("home");
}

const router = async (fastify: FastifyInstance) => {
    fastify.get('/', controller);
}

export default router;