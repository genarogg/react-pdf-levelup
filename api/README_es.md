# API – React PDF LevelUp

Generador de PDFs dinámicos con React. Esta herramienta te permite crear plantillas PDF con componentes JSX personalizados y previsualizarlas en tiempo real dentro de una aplicación web. Ideal para facturas, reportes, certificados y más.

<p align="center">
  <img src="https://genarogg.github.io/media/react-pdf-levelup/logo-de-react-pdf-levelup.png" alt="react-pdf-levelup logo" width="160" />
</p>


## Qué incluye

- Servidor Fastify con CORS, Helmet y compresión.
- Plugins de producción opcionales: rate limit, caching y under-pressure.
- Endpoint POST que recibe:
  - `template`: componente React en TSX codificado en Base64.
  - `data`: objeto opcional que se inyecta en el componente.
- Script de demo que realiza una petición y guarda el PDF de ejemplo.

## Requisitos

- Node.js 22
- pnpm, npm o yarn

## Instalación

1. Entra en la carpeta `api` e instala dependencias:

   ```bash
   cd api
   npm install
   ```

2. Copia el archivo de ejemplo de variables de entorno y ajusta valores según tu entorno:

   ```bash
   cp example.env .env
   ```

## Variables de entorno

- `BACKEND_PORT`: puerto del servidor (por defecto `4000`).
- `PRODUCTION`: controla plugins de producción. Si es `"true"` se activan rate limit, caching y under-pressure.
- `MAX_FILE_SIZE`: tamaño máx. por archivo para multipart en MB (por defecto `10`).
- `ENDPOINT_API`: URL base pública del API (usado por el script de demo).

Notas:
- El repositorio incluye otras variables (p. ej. `VITE_API_URL`) usadas en el frontend.
- El ejemplo define `API_PORT`, pero el servidor usa `BACKEND_PORT`. Si quieres cambiar el puerto del API, usa `BACKEND_PORT`.

## Ejecución

- Desarrollo (auto-reload):

  ```bash
  npm run dev
  ```

- Compilar y ejecutar:

  ```bash
  npm run build
  # Por defecto el script start establece PRODUCTION=false
  npm run start
  ```

  Si deseas habilitar los plugins de producción al ejecutar el build:

  ```bash
  # Windows (PowerShell/CMD)
  set PRODUCTION=true && node dist/index.js
  ```

El servidor escucha en `http://localhost:<BACKEND_PORT>` (por defecto `4000`). También monta las rutas bajo `/api`.

## Endpoints

- `GET /` y `GET /api`  
  Respuesta de salud:
  ```json
  { "message": "Hello from the API!" }
  ```

- `POST /` y `POST /api`  
  Cuerpo JSON:
  ```json
  {
    "template": "<TSX_BASE64>",
    "data": { /* opcional */ }
  }
  ```

  Respuesta exitosa:
  ```json
  {
    "type": "success",
    "data": {
      "pdf": "<PDF_BASE64>"
    }
  }
  ```

  Respuesta de error:
  ```json
  {
    "type": "error",
    "message": "Descripción del problema"
  }
  ```

## Ejemplos de uso

### 1) Script de demo incluido

Hay un script que realiza una petición al API y guarda un PDF en `src/useExample/example.pdf`.

1. Asegura que `ENDPOINT_API` en tu `.env` apunta al servidor (por ejemplo `http://localhost:4000`).
2. Ejecuta:

   ```bash
   npm run demo
   ```

### 2) Petición desde Node/Fetch

```js
import fs from "fs";

const tsx = `
  import { Layout, H1 } from "@react-pdf-levelup/core";
  export default function Template({ data }) {
    return <Layout padding={40}><H1>Hola {data?.nombre || "Mundo"}</H1></Layout>;
  }
`;

const templateBase64 = Buffer.from(tsx, "utf-8").toString("base64");

const res = await fetch("http://localhost:4000/api", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ template: templateBase64, data: { nombre: "Ada" } }),
});

if (!res.ok) {
  throw new Error(await res.text());
}

const json = await res.json();
const pdfB64 = json?.data?.pdf || "";
fs.writeFileSync("salida.pdf", Buffer.from(pdfB64, "base64"));
```

## Seguridad y rendimiento

- CORS abierto (`*`) para facilitar pruebas. Ajusta orígenes en producción.
- Helmet aplicado globalmente con cabeceras seguras.
- Compresión habilitada.
- En producción (`PRODUCTION=true`):
  - Rate limit por minuto.
  - Cache de respuestas para assets públicos.
  - Protección de carga con under-pressure.

## Estructura relevante

- `index.ts`: arranque del servidor y registro de plugins/rutas.
- `src/routers/index.ts`: define rutas `GET /` y `POST /` (y bajo `/api`).
- `src/controllers/index.ts`: lógica para compilar TSX, importar el componente y generar el PDF.
- `src/useExample/*`: ejemplo de uso y plantilla TSX.

