import type { FastifyInstance } from "fastify"
import helmet from '@fastify/helmet';

const helmetSecure = (server: FastifyInstance) => {
    return server.register(helmet, {
        global: true,
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
        frameguard: { action: 'deny' },
        hidePoweredBy: true,
    });
}

export default helmetSecure;