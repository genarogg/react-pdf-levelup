# API – React PDF LevelUp

Dynamic PDF generator built with React. This tool allows you to create PDF templates using custom JSX components and preview them in real time within a web application. Ideal for invoices, reports, certificates, and more.

<p align="center">
  <img src="https://genarogg.github.io/media/react-pdf-levelup/logo-de-react-pdf-levelup.png" alt="react-pdf-levelup logo" width="160" />
</p>

## What’s Included

- Fastify server with CORS, Helmet, and compression.
- Optional production plugins: rate limit, caching, and under-pressure.
- POST endpoint that receives:
  - `template`: React component in TSX encoded in Base64.
  - `data`: optional object injected into the component.
- Demo script that performs a request and saves a sample PDF.

## Requirements

- Node.js 22
- pnpm, npm, or yarn

## Installation

1. Enter the `api` folder and install dependencies:

   ```bash
   cd api
   npm install
   ```

2. Copy the example environment file and adjust values according to your environment:

   ```bash
   cp example.env .env
   ```

## Environment Variables

- `BACKEND_PORT`: server port (default `4000`).
- `PRODUCTION`: controls production plugins. If set to `"true"`, rate limit, caching, and under-pressure are enabled.
- `MAX_FILE_SIZE`: max file size for multipart uploads in MB (default `10`).
- `ENDPOINT_API`: public base URL of the API (used by the demo script).

Notes:
- The repository includes other variables (e.g., `VITE_API_URL`) used in the frontend.
- The example defines `API_PORT`, but the server uses `BACKEND_PORT`. If you want to change the API port, use `BACKEND_PORT`.

## Running the Server

- Development (auto-reload):

  ```bash
  npm run dev
  ```

- Build and run:

  ```bash
  npm run build
  # By default the start script sets PRODUCTION=false
  npm run start
  ```

  To enable production plugins when running the build:

  ```bash
  # Windows (PowerShell/CMD)
  set PRODUCTION=true && node dist/index.js
  ```

The server listens on `http://localhost:<BACKEND_PORT>` (default `4000`).  
Routes are also mounted under `/api`.

## Endpoints

- `GET /` and `GET /api`  
  Health check response:
  ```json
  { "message": "Hello from the API!" }
  ```

- `POST /` and `POST /api`  
  JSON body:
  ```json
  {
    "template": "<TSX_BASE64>",
    "data": { /* optional */ }
  }
  ```

  Success response:
  ```json
  {
    "type": "success",
    "data": {
      "pdf": "<PDF_BASE64>"
    }
  }
  ```

  Error response:
  ```json
  {
    "type": "error",
    "message": "Problem description"
  }
  ```

## Usage Examples

### 1) Included Demo Script

There is a script that sends a request to the API and saves a PDF to `src/useExample/example.pdf`.

1. Make sure `ENDPOINT_API` in your `.env` points to the server (e.g., `http://localhost:4000`).
2. Run:

   ```bash
   npm run demo
   ```

### 2) Request from Node/Fetch

```js
import fs from "fs";

const tsx = `
  import { Layout, H1 } from "@react-pdf-levelup/core";
  export default function Template({ data }) {
    return <Layout padding={40}><H1>Hello {data?.name || "World"}</H1></Layout>;
  }
`;

const templateBase64 = Buffer.from(tsx, "utf-8").toString("base64");

const res = await fetch("http://localhost:4000/api", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ template: templateBase64, data: { name: "Ada" } }),
});

if (!res.ok) {
  throw new Error(await res.text());
}

const json = await res.json();
const pdfB64 = json?.data?.pdf || "";
fs.writeFileSync("output.pdf", Buffer.from(pdfB64, "base64"));
```

## Security & Performance

- Open CORS (`*`) for easier testing. Adjust origins in production.
- Helmet applied globally with secure headers.
- Compression enabled.
- In production (`PRODUCTION=true`):
  - Rate limiting per minute.
  - Response caching for public assets.
  - Load protection with under-pressure.

## Relevant Structure

- `index.ts`: server bootstrap and plugin/route registration.
- `src/routers/index.ts`: defines `GET /` and `POST /` routes (and under `/api`).
- `src/controllers/index.ts`: logic to compile TSX, import the component, and generate the PDF.
- `src/useExample/*`: usage example and TSX template.