import { Command } from "commander";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";
import open from "open";
import mime from "mime-types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, "../public");

async function ensureTemplatesDir(dir: string) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function getTemplates(dir: string) {
  try {
    const files = await fs.readdir(dir);
    return files.filter(f => f.endsWith(".tsx") || f.endsWith(".jsx") || f.endsWith(".json"));
  } catch {
    return [];
  }
}

async function getTemplateContent(dir: string, filename: string) {
  const filePath = path.join(dir, filename);
  return await fs.readFile(filePath, "utf-8");
}

async function saveTemplateContent(dir: string, filename: string, content: string) {
  const filePath = path.join(dir, filename);
  await fs.writeFile(filePath, content, "utf-8");
}

async function serveStaticFile(reqUrl: string, res: any) {
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
  .option("-p, --port <port>", "Puerto para el servidor", "3333")
  .option("-d, --dir <directory>", "Directorio de plantillas PDF", "./pdf")
  .action(async (options) => {
    const port = parseInt(options.port);
    const templatesDir = path.resolve(process.cwd(), options.dir);
    
    await ensureTemplatesDir(templatesDir);

    const server = createServer(async (req, res) => {
      if (req.url?.startsWith("/api/templates")) {
        // API endpoints para manejar plantillas
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Access-Control-Allow-Origin", "*");

        if (req.method === "GET" && req.url === "/api/templates") {
          const templates = await getTemplates(templatesDir);
          res.writeHead(200);
          res.end(JSON.stringify({ templates }));
          return;
        }

        if (req.method === "GET" && req.url?.startsWith("/api/templates/")) {
          const filename = decodeURIComponent(req.url.replace("/api/templates/", ""));
          try {
            const content = await getTemplateContent(templatesDir, filename);
            res.writeHead(200);
            res.end(JSON.stringify({ filename, content }));
          } catch (err) {
            res.writeHead(404);
            res.end(JSON.stringify({ error: "Template not found" }));
          }
          return;
        }

        if (req.method === "POST" && req.url?.startsWith("/api/templates/")) {
          const filename = decodeURIComponent(req.url.replace("/api/templates/", ""));
          let body = "";
          req.on("data", (chunk) => body += chunk);
          req.on("end", async () => {
            try {
              const { content } = JSON.parse(body);
              await saveTemplateContent(templatesDir, filename, content);
              res.writeHead(200);
              res.end(JSON.stringify({ success: true }));
            } catch (err) {
              res.writeHead(400);
              res.end(JSON.stringify({ error: "Invalid request" }));
            }
          });
          return;
        }
      }

      // Servir archivos estáticos o index.html por defecto
      await serveStaticFile(req.url || "/", res);
    });

    server.listen(port, () => {
      console.log(`\n🚀 Studio está corriendo en http://localhost:${port}`);
      console.log(`📁 Directorio de plantillas: ${templatesDir}`);
      console.log(`\nAbriendo navegador...\n`);
      open(`http://localhost:${port}`);
    });
  });
