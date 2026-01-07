import type { FastifyInstance } from "fastify"
import underPressure from '@fastify/under-pressure';

const underPressureFastify = (server: FastifyInstance) => {
    return server.register(underPressure, {
        maxEventLoopDelay: 1500,
        message: 'Under pressure!',
        retryAfter: 50
    });
}

export default underPressureFastify;