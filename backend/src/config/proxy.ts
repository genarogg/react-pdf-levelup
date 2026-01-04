import type { FastifyInstance } from "fastify"
import httpProxy from "@fastify/http-proxy";

const NEXT_PORT = Number(process.env.NEXT_PORT) || 3000;
const DOCS_PORT = Number(process.env.DOCS_PORT) || 4321;

const proxy = async (server: FastifyInstance) => {

    await server.register(httpProxy, {
        upstream: `http://localhost:${DOCS_PORT}`,
        prefix: "/docs",
        rewritePrefix: "/docs",
    });

    // Otros proxys pueden declararse aquí si es necesario
}

export default proxy;
