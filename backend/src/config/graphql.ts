import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { gql } from 'graphql-tag'
import { processRequest } from 'graphql-upload-minimal'
import { ApolloServer } from '@apollo/server'
import fastifyApollo, { fastifyApolloDrainPlugin } from '@as-integrations/fastify'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import type { FastifyInstance } from 'fastify'
import { createReadStream, existsSync } from 'node:fs'
import resolvers from '@/graphql/resolvers'


import generateEnumsSchema from '@/graphql/schema/enums'

function loadTypeDefs() {
    const dir = join(process.cwd(), 'src', 'graphql', 'schema')
    const files = readdirSync(dir).filter((f) => f.endsWith('.graphql'))
    let sdl = files
        .map((f) => readFileSync(join(dir, f), 'utf8'))
        .join('\n')
    
    // Inyectar enums dinámicos
    const enumsSdl = generateEnumsSchema();
    sdl += '\n' + enumsSdl;

    return gql(sdl)
}

export async function registerGraphQL(app: FastifyInstance) {
    const typeDefs = loadTypeDefs()
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [fastifyApolloDrainPlugin(app), ApolloServerPluginLandingPageLocalDefault()],
    })
    await server.start()
    app.addHook('preValidation', async (request, reply) => {
        const isGraphql = request.url.startsWith('/graphql')
        const ct = request.headers['content-type'] || ''
        if (isGraphql && ct.includes('multipart/form-data')) {
            const body = await processRequest(request.raw, reply.raw)
                ; (request as any).body = body
        }
    })
    await app.register(fastifyApollo(server), { path: '/graphql' })
    app.get('/uploads/:file', async (req, reply) => {
        const file = (req.params as any).file
        const filePath = join(process.cwd(), 'uploads', file)
        if (!existsSync(filePath)) {
            reply.code(404).send({ error: 'Not found' })
            return
        }
        reply.type('application/octet-stream').send(createReadStream(filePath))
    })
}
