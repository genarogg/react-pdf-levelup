import type { FastifyInstance } from "fastify"
import fastifyCaching from '@fastify/caching';

const caching = (server: FastifyInstance) => {
    return server.register(fastifyCaching, {
        privacy: fastifyCaching.privacy.PUBLIC,
        expiresIn: 86400 // 24 horas para assets estáticos
    });
}

export default caching;