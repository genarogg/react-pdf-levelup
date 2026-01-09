import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { generatePdfController } from '../controllers/index';


const controller = (request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({ message: "Hello from the API!" });
}

const router = async (fastify: FastifyInstance) => {
    fastify.get('/', controller);
    fastify.post('/', generatePdfController);
}

export default router;
