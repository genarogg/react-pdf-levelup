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

type FileTreeItem = {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileTreeItem[];
};

async function findTemplatesDir() {
  const cwd = process.cwd();
  const possibleDirs = [
    path.resolve(cwd, "./pdf"),
    path.resolve(cwd, "./src/pdf"),
  ];

  for (const dir of possibleDirs) {
    try {
      await fs.access(dir);
      return dir;
    } catch {
      // continue
    }
  }

  // Si no existe ninguno, usamos ./pdf y lo creamos
  const defaultDir = possibleDirs[0];
  await fs.mkdir(defaultDir, { recursive: true });
  return defaultDir;
}

async function getFileTree(dir: string, basePath: string = ""): Promise<FileTreeItem[]> {
  try {
    const items = await fs.readdir(dir, { withFileTypes: true });
    const tree: FileTreeItem[] = [];

    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      const relativePath = basePath ? path.join(basePath, item.name) : item.name;

      if (item.isDirectory()) {
        const children = await getFileTree(fullPath, relativePath);
        tree.push({
          name: item.name,
          path: relativePath,
          type: "directory",
          children,
        });
      } else if (item.isFile() && (item.name.endsWith(".tsx") || item.name.endsWith(".jsx") || item.name.endsWith(".json"))) {
        tree.push({
          name: item.name,
          path: relativePath,
          type: "file",
        });
      }
    }

    return tree.sort((a, b) => {
      if (a.type === "directory" && b.type === "file") return -1;
      if (a.type === "file" && b.type === "directory") return 1;
      return a.name.localeCompare(b.name);
    });
  } catch {
    return [];
  }
}

async function getTemplateContent(dir: string, filePath: string) {
  const fullPath = path.join(dir, filePath);
  return await fs.readFile(fullPath, "utf-8");
}

async function saveTemplateContent(dir: string, filePath: string, content: string) {
  const fullPath = path.join(dir, filePath);
  const dirPath = path.dirname(fullPath);
  await fs.mkdir(dirPath, { recursive: true });
  await fs.writeFile(fullPath, content, "utf-8");
}

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
  .option("-p, --port <port>", "Puerto para el servidor", "3333")
  .option("-d, --dir <directory>", "Directorio de plantillas PDF")
  .action(async (options) => {
    const port = parseInt(options.port);
    let templatesDir: string;
    
    if (options.dir) {
      templatesDir = path.resolve(process.cwd(), options.dir);
      try {
        await fs.access(templatesDir);
      } catch {
        await fs.mkdir(templatesDir, { recursive: true });
      }
    } else {
      templatesDir = await findTemplatesDir();
    }

    const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      if (req.url?.startsWith("/api/templates")) {
        // API endpoints para manejar plantillas
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Access-Control-Allow-Origin", "*");

        if (req.method === "GET" && req.url === "/api/templates") {
          const tree = await getFileTree(templatesDir);
          res.writeHead(200);
          res.end(JSON.stringify({ tree }));
          return;
        }

        if (req.method === "GET" && req.url?.startsWith("/api/templates/")) {
          const filePath = decodeURIComponent(req.url.replace("/api/templates/", ""));
          try {
            const content = await getTemplateContent(templatesDir, filePath);
            res.writeHead(200);
            res.end(JSON.stringify({ path: filePath, content }));
          } catch (err) {
            res.writeHead(404);
            res.end(JSON.stringify({ error: "Template not found" }));
          }
          return;
        }

        if (req.method === "POST" && req.url?.startsWith("/api/templates/")) {
          const filePath = decodeURIComponent(req.url.replace("/api/templates/", ""));
          let body = "";
          req.on("data", (chunk: Buffer) => body += chunk);
          req.on("end", async () => {
            try {
              const { content } = JSON.parse(body);
              await saveTemplateContent(templatesDir, filePath, content);
              res.writeHead(200);
              res.end(JSON.stringify({ success: true }));
            } catch (err) {
              console.error(err);
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