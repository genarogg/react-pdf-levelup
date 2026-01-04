import fastifyView from '@fastify/view';
import ejs from 'ejs';
import path from 'path';

const viewEJS = (server: any) => {

    return server.register(fastifyView, {
        engine: { ejs },
        root: path.join(process.cwd(), 'src', 'views'),
        viewExt: 'ejs',
    });
}

export default viewEJS;