import type { FastifyInstance } from "fastify"
import compress from '@fastify/compress';

const compressFastify = (server: FastifyInstance) => {
    return server.register(compress, { global: true });
}

export default compressFastify;