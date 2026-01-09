import { FastifyInstance } from 'fastify';
import { generatePdfController } from '../controllers/index';

const router = async (fastify: FastifyInstance) => {
    fastify.post('/', generatePdfController);
}

export default router;
