import fastifyStatic from '@fastify/static';
import path from 'path';

const staticFiles = (server: any) => {
    return server.register(fastifyStatic, {
        root: path.join(process.cwd(), "public"),
        prefix: '/static',
        cacheControl: true,
        maxAge: 86400000,
        etag: true
    });
}

export default staticFiles;