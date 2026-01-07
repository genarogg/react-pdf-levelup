import type { FastifyInstance } from "fastify"
import multipart from '@fastify/multipart';

const multipar = async (server: FastifyInstance) => {
    const { MAX_FILE_SIZE } = process.env;

    return await server.register(multipart, {
        limits: {
            fileSize: Number(MAX_FILE_SIZE || 10) * 1024 * 1024, // valor por defecto
            files: 1000,
        },
    });
}

export default multipar;