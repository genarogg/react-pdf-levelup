import Fastify, { FastifyInstance } from 'fastify'
import Table from 'cli-table3';
import clear from "console-clear";
import colors from "colors";
import dotenv from 'dotenv';

dotenv.config({ debug: false });

const { BACKEND_PORT, PRODUCTION } = process.env;
const server: FastifyInstance = Fastify()

import {
  dbConection,
  staticFiles,
  caching,
  helmet,
  rateLimit,
  underPressureFastify,
  corsFastify,
  compressFastify,
  // proxy,
  multipart,
  graphql,
  viewEJS,
} from "./src/config"

const PRODUCTIONS = PRODUCTION !== "false"

const registerPlugins = async () => {
  // Plugins de rendimiento (en producción)
  if (PRODUCTIONS) {

    await underPressureFastify(server);
    await caching(server);
    await rateLimit(server);
  }

  // Plugins de configuración básica primero
  await viewEJS(server);
  await helmet(server);
  await corsFastify(server);
  await compressFastify(server);

  // Plugins de parsing
  await multipart(server);

  // Plugins de vista y archivos estáticos
  await staticFiles(server);
  // await proxy(server);
  // Plugins de funcionalidad
  await graphql(server);
}

import tack from "@/tasks"
import seed from "@/seed"
import router from '@/routers';

(async () => {
  clear();
  try {
    await registerPlugins()
    server.register(router, { prefix: '/' })
    const port = Number(BACKEND_PORT) || 3500
    const dbStatus = await dbConection() || "";
    await server.listen({ port, host: '0.0.0.0' });

    const tableURL = new Table({
      head: ['Servicio', 'URL'],
      colWidths: [20, 50]
    });

    const tableInfo = new Table({
      head: ['nombre', 'Status'],
      colWidths: [20, 50]
    });

    /* ejecutar tareas programadas */
    tack()
    const semilla = await seed()

    tableURL.push(
      ['Servidor', colors.green(`http://localhost:${port}`)],
      ['Graphql', colors.green(`http://localhost:${port}/graphql`)],
      ["Rest API", colors.green(`http://localhost:${port}/api`)],
      ['Documentacion', colors.cyan(`http://localhost:${port}/docs`)],
    );

    tableInfo.push(
      ["db estatus", colors.cyan(dbStatus)],
      ["semilla", colors.cyan(semilla as string)],
      ["PRODUCTION", colors.cyan(PRODUCTIONS + "")],
    )

    console.log(tableURL.toString());
    console.log(tableInfo.toString());
  } catch (err) {
    console.log(err)
  }
})();

export default server;
