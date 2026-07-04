import { Command } from "commander";
import { createServer, type IncomingMessage, type ServerResponse } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";
import open from "open";
import mime from "mime-types";
import { loadConfig, resolveTemplatesDir, resolvePort } from "../config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, "../playground");
const DEFAULT_TEMPLATES_DIR = path.resolve(process.cwd(), "templates");
const DEFAULT_PORT = "9000";

// Helper to build a file tree
async function buildFileTree(dir: string, baseDir: string = dir): Promise<any[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const tree = [];
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);
    
    if (entry.isDirectory()) {
      tree.push({
        name: entry.name,
        path: relativePath,
        type: "directory",
        children: await buildFileTree(fullPath, baseDir)
      });
    } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".jsx") || entry.name.endsWith(".js") || entry.name.endsWith(".ts")) {
      tree.push({
        name: entry.name,
        path: relativePath,
        type: "file"
      });
    }
  }
  
  return tree;
}

// Helper to read JSON body
async function readBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
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
  .option("-p, --port <port>", "Puerto para el servidor", DEFAULT_PORT)
  .option("-d, --dir <directory>", "Directorio de plantillas", DEFAULT_TEMPLATES_DIR)
  .action(async (options) => {
    const rootDir = process.cwd();

    // Busca y carga react-pdf-levelup.config.{js,ts,...} en la raíz del proyecto
    // (junto a node_modules). Si no existe, config queda como {}.
    const config = await loadConfig(rootDir);

    // Prioridad: flag de CLI explícito > config file > valor por defecto.
    const port = resolvePort(options.port, DEFAULT_PORT, config);
    const templatesDir = resolveTemplatesDir(
      options.dir,
      DEFAULT_TEMPLATES_DIR,
      config,
      rootDir
    );

    // Ensure templates directory exists
    await fs.mkdir(templatesDir, { recursive: true });
    
    // Check if templates dir is empty, add default files if so
    try {
      const entries = await fs.readdir(templatesDir);
      if (entries.length === 0) {
        const defaultFiles = {
          "Main.tsx": `import { Document, Page, View, StyleSheet } from "@react-pdf/renderer";
import Header from "./Header";
import Content from "./Content";

const styles = StyleSheet.create({
  page: { flexDirection: "column", backgroundColor: "#ffffff" },
});

const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Header />
      <Content />
    </Page>
  </Document>
);

export default MyDocument;`,
          "Header.tsx": `import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#3b82f6",
    padding: 20,
    marginBottom: 20,
  },
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});

const Header = () => (
  <View style={styles.header}>
    <Text style={styles.text}>Mi PDF</Text>
  </View>
);

export default Header;`,
          "Content.tsx": `import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  text: {
    fontSize: 12,
    lineHeight: 1.5,
    marginBottom: 10,
  },
});

const Content = () => (
  <View style={styles.content}>
    <Text style={styles.text}>¡Este es el contenido del documento!</Text>
    <Text style={styles.text}>Puedes editar este componente o importar más.</Text>
  </View>
);

export default Content;`
        };
        
        for (const [filename, content] of Object.entries(defaultFiles)) {
          await fs.writeFile(path.join(templatesDir, filename), content, "utf8");
        }
      }
    } catch (err) {
      console.error("Error initializing templates:", err);
    }

    const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      const url = req.url || "/";
      const method = req.method || "GET";
      
      // Add CORS headers
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      
      if (method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
      }

      if (url === "/api/templates" && method === "GET") {
        // List files
        try {
          const tree = await buildFileTree(templatesDir);
          res.setHeader("Content-Type", "application/json");
          res.writeHead(200);
          res.end(JSON.stringify({ tree }));
        } catch (err) {
          console.error(err);
          res.writeHead(500);
          res.end(JSON.stringify({ error: "Failed to read directory" }));
        }
        return;
      }
      
      if (url?.startsWith("/api/templates/") && method === "GET") {
        // Read file
        const filePath = decodeURIComponent(url.slice("/api/templates/".length));
        const fullPath = path.join(templatesDir, filePath);
        try {
          const content = await fs.readFile(fullPath, "utf8");
          res.setHeader("Content-Type", "application/json");
          res.writeHead(200);
          res.end(JSON.stringify({ content }));
        } catch (err) {
          console.error(err);
          res.writeHead(404);
          res.end(JSON.stringify({ error: "File not found" }));
        }
        return;
      }
      
      if (url?.startsWith("/api/templates/") && method === "POST") {
        // Write file
        const filePath = decodeURIComponent(url.slice("/api/templates/".length));
        const fullPath = path.join(templatesDir, filePath);
        
        // Ensure directory exists
        await fs.mkdir(path.dirname(fullPath), { recursive: true });
        
        try {
          const body = await readBody(req);
          await fs.writeFile(fullPath, body.content, "utf8");
          res.setHeader("Content-Type", "application/json");
          res.writeHead(200);
          res.end(JSON.stringify({ success: true }));
        } catch (err) {
          console.error(err);
          res.writeHead(500);
          res.end(JSON.stringify({ error: "Failed to write file" }));
        }
        return;
      }

      // Otherwise serve static files
      await serveStaticFile(url, res);
    });

    server.listen(port, () => {
      console.log(`\n🚀 Studio está corriendo en http://localhost:${port}`);
      console.log(`   📂 Directorio de plantillas: ${templatesDir}`);
      console.log(`\nAbriendo navegador...\n`);
      open(`http://localhost:${port}`);
    });
  });