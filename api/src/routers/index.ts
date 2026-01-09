import { FastifyInstance } from 'fastify';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { generatePdfController } from '../controllers/index';

const controller = (request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({ message: "Hello from the API!" });
}

const router = async (fastify: FastifyInstance) => {
    fastify.post('/', generatePdfController);
    // fastify.post('/api/pdf', controller);
}

export default router;
