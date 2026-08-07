import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { generateSinglePdf, generatePdfOnWorker } from '../controllers';


const controller = (request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({ message: "Hello from the API!" });
}

const router = async (fastify: FastifyInstance) => {
    fastify.get('/', controller);
    fastify.post('/single', generateSinglePdf);
    fastify.post('/worker', generatePdfOnWorker);
}

export default router;
