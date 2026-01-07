FROM node:22 AS builder

WORKDIR /app

# Copiamos los archivos de configuración del monorepo
COPY package.json turbo.json ./
COPY backend/package.json ./backend/

# Instalamos las dependencias
RUN npm install

# Copiamos el código fuente del backend
COPY backend ./backend

# Stage deproducción
FROM node:22 AS runner

WORKDIR /app

ENV PRODUCTION=false
ENV BACKEND_PORT=5500

# Copiamos los artefactos necesarios del builder
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend/public ./public
COPY --from=builder /app/backend/src ./src
COPY --from=builder /app/backend/package.json ./

EXPOSE 5500

CMD ["node", "dist/index.js"]
