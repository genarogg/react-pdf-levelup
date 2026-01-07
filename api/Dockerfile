FROM node:22 AS builder

WORKDIR /app

# Copiamos los archivos de configuración del monorepo
COPY package.json turbo.json ./
COPY api/package.json ./api/

# Instalamos las dependencias
RUN npm install

# Copiamos el código fuente del api
COPY api ./api

# Stage deproducción
FROM node:22 AS runner

WORKDIR /app

ENV PRODUCTION=false
ENV api_PORT=5500

# Copiamos los artefactos necesarios del builder
COPY --from=builder /app/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/api/public ./public
COPY --from=builder /app/api/src ./src
COPY --from=builder /app/api/package.json ./

EXPOSE 5500

CMD ["node", "dist/index.js"]
