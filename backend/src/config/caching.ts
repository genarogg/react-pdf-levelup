import type { FastifyInstance } from "fastify"
import fastifyCaching from '@fastify/caching';

const caching = (server: FastifyInstance) => {
    return server.register(fastifyCaching, {
        privacy: fastifyCaching.privacy.PUBLIC,
        expiresIn: 3600
    });
}

export default caching;