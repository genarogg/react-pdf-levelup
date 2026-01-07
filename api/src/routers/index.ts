import { FastifyInstance } from 'fastify';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { generatePdfController } from '@/controllers';

const controller = (request: FastifyRequest, reply: FastifyReply) => {
    return reply.view("home");
}

const router = async (fastify: FastifyInstance) => {
    fastify.get('/', controller);
    fastify.post('/api/pdf', generatePdfController);
}

export default router;
