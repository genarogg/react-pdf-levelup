import type { FastifyInstance } from "fastify"
import cors from '@fastify/cors';

const corsFastify = (server: FastifyInstance) => {
    return server.register(cors, {
        origin: 'https://tudocs.com',
        allowedHeaders: ['Content-Type', 'Authorization'],
        // credentials: true
    });
}

export default corsFastify;