import type { FastifyInstance } from "fastify"
import slowDown from 'fastify-slow-down';

const slowDownFastify = (server: FastifyInstance) => {
    return server.register(slowDown, {
        delayAfter: 50,
        delay: 500
    });
}

export default slowDownFastify;