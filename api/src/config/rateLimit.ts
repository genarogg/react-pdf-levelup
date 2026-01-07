import type { FastifyInstance } from "fastify"
import rateLimit from '@fastify/rate-limit';

const rateLimite = (server: FastifyInstance) => {
    return server.register(rateLimit, {
        max: 100,
        timeWindow: '1 minute',
        errorResponseBuilder: (req: any, context: any) => {
            console.log(context)
            return {
                code: 429,
                error: 'Too Many Requests',
                message: 'Has alcanzado el límite de solicitudes. Por favor, inténtalo de nuevo más tarde.'
            }
        }
    });
}

export default rateLimite;