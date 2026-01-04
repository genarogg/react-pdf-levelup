# Monorepo: Backend, Frontend, Docs y Lib

Monorepo administrado con Turborepo que reúne:
- Backend: API Fastify con GraphQL y Prisma
- Frontend: React + TypeScript con Vite
- Docs: sitio de documentación con Astro Starlight
- Lib: librería TypeScript publicada con tsup

Incluye Docker para todos los servicios y un `docker-compose.yaml` listo para levantar el entorno completo.

## Tecnologías
- Node.js 22, npm 10
- Turborepo para orquestación de workspaces
- Backend: Fastify, Apollo Server (GraphQL), Prisma (SQLite por defecto), EJS para emails, Nodemailer, cron jobs, generación de PDF
- Frontend: React 19, Vite, TypeScript
- Docs: Astro + Starlight
- Lib: tsup para build (CJS y ESM)
- Docker y Docker Compose

## Prerrequisitos
- Node.js 22 (ver `.nvmrc`) y npm 10.9.4
- Docker y Docker Compose
- Opcional: SQLite (usado por defecto vía Prisma)

## Estructura de carpetas
- backend: API y servicios del servidor (Fastify, GraphQL, Prisma, emails, tareas y PDFs)
- frontend: aplicación cliente en React + Vite
- docs: documentación con Astro Starlight
- lib: librería TypeScript empaquetada con tsup
- docker-compose.yaml: orquestación de contenedores
- turbo.json: configuración de Turborepo

## Instalación

```bash
npm install
```

Esto instalará las dependencias de todos los workspaces: `backend`, `frontend`, `docs` y `lib`.

## Desarrollo local
- Ejecutar todo en paralelo:

```bash
npm run dev
```

- Ejecutar solo backend:

```bash
npm run dev:server
```

- Ejecutar solo frontend:

```bash
npm run dev:client
```

- Ejecutar solo docs:

```bash
npm run dev -w docs
```

Puertos típicos en desarrollo local:
- Backend: http://localhost:5500
- Frontend (Vite dev): http://localhost:5173
- Docs (Astro dev): http://localhost:4321

Nota frontend (Vite):
- Variables deben empezar con `VITE_` (p. ej., `VITE_API_URL`)
- Desarrollo local: `VITE_API_URL=http://localhost:5500`

## Producción local (sin Docker)

```bash
npm run build
npm run start
```

Esto ejecuta los comandos `build` y `start` de cada workspace vía Turborepo.

## Docker

Levantar todo con un solo comando:

```bash
docker compose up --build
```

Servicios y puertos:
- Backend: http://localhost:${BACKEND_PORT}
- Frontend (preview): http://localhost:${FRONTEND_PORT}
- Docs (Nginx): http://localhost:${DOCS_HOST_PORT}

Detener y limpiar:

```bash
docker compose down
```

Persistencia:
- El backend usa SQLite por defecto y monta volumen para `backend/prisma` dentro del contenedor.

## Base de datos (Prisma)
Scripts disponibles desde el root:

```bash
# Generar cliente Prisma
npm run prismaGenerate

# Inicializar/migrar la base de datos (modo dev)
npm run prismaInit

# Aplicar migraciones
npm run prismaMigrate

# Resetear base de datos y re-aplicar migraciones
npm run prismaReset
```

Además, el backend ejecuta `npx prisma generate` automáticamente en `dev` y `start`.

## Scripts útiles
- Lint: `npm run lint` (orquesta lint de cada workspace)
- Clean: `npm run clean`
- Docs en dev: `npm run docs`
- Publicar lib: `npm run publicar` (desde `lib`)

## Función de cada carpeta en detalle
- backend
  - Servidor Fastify con middlewares de seguridad, compresión, CORS, rate-limit y otros
  - GraphQL con Apollo Server y resolvers
  - Prisma para acceso a datos (SQLite por defecto, soporta otros proveedores)
  - Emails con EJS + Nodemailer
  - Tareas programadas con `node-cron`
  - Generación de PDFs
  - Scripts de base de datos y utilidades
- frontend
  - App React + TypeScript
  - Vite para desarrollo y build
  - ESLint configurado
- docs
  - Astro + Starlight para documentación
  - Se sirve con Nginx en producción dentro de Docker
- lib
  - Librería TypeScript con build a `dist` (CJS y ESM)
  - Empaquetado con `tsup`
  - Script de publicación

## Variables de entorno
- Usa `.env` en el root para parametrizar puertos y variables de los contenedores.
- Compose carga `.env` automáticamente al ejecutar `docker compose up`.
- Backend:
  - `BACKEND_PORT` (por defecto 5500)
  - `DATABASE_URL` (por defecto `file:./dev.db`)
  - Cargar desde `.env` si se requiere
- Frontend:
  - `VITE_API_URL` para llamadas al backend (aplica en build)
- Docs:
  - No requiere variables para funcionamiento básico

Producción:
- Backend y Docs toman variables en runtime desde el entorno del servidor.
- Frontend (build estático) requiere que `VITE_API_URL` esté definido en build; se pasa como build arg desde `docker-compose` (ya configurado).

## Notas
- Node 22 es requisito en todos los workspaces
- Evita comprometer secretos en el repositorio (`.env` está ignorado)
- Usa Turborepo para ejecutar tareas coordinadas entre workspaces
