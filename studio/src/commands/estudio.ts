import { Command } from "commander";
import { createServer, type IncomingMessage, type ServerResponse } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";
import open from "open";
import mime from "mime-types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// tsup bundlea todo a un único archivo dist/bin.js (bundle=true por defecto),
// así que en runtime __dirname = studio/dist/ (no studio/dist/commands/).
// La carpeta playground vive como hermana de src/ y dist/, en studio/playground
//
// IMPORTANTE: esta ruta relativa asume que SIEMPRE se corre el binario ya
// compilado (dist/bin.js), nunca este archivo .ts directo con tsx/ts-node.
// Si en algún momento se necesita correr en dev sin buildear, esta cuenta
// rompe (resolvería a studio/src/playground en vez de studio/playground).
const PUBLIC_DIR = path.resolve(__dirname, "../playground");

async function serveStaticFile(reqUrl: string, res: ServerResponse) {
  let filePath = path.join(PUBLIC_DIR, reqUrl === "/" ? "studio.html" : reqUrl);
  
  try {
    await fs.access(filePath);
  } catch {
    // If file doesn't exist, serve studio.html
    filePath = path.join(PUBLIC_DIR, "studio.html");
  }

  try {
    const content = await fs.readFile(filePath);
    const contentType = mime.lookup(filePath) || "application/octet-stream";
    res.setHeader("Content-Type", contentType);
    res.writeHead(200);
    res.end(content);
  } catch (err) {
    console.error(err);
    res.writeHead(404);
    res.end("Not Found");
  }
}

export const estudioCommand = new Command()
  .name("estudio")
  .description("Lanza el Studio playground para administrar plantillas PDF")
  .option("-p, --port <port>", "Puerto para el servidor", "9000")
  .action(async (options) => {
    const port = parseInt(options.port);

    const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      // Servir archivos estáticos o studio.html por defecto
      await serveStaticFile(req.url || "/", res);
    });

    server.listen(port, () => {
      console.log(`\n🚀 Studio está corriendo en http://localhost:${port}`);
      console.log(`\nAbriendo navegador...\n`);
      open(`http://localhost:${port}`);
    });
  });