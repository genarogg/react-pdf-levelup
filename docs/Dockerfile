FROM node:22 AS builder

WORKDIR /app

# Copiamos archivos de configuración
COPY package.json turbo.json ./
COPY docs/package.json ./docs/

# Instalamos dependencias
RUN npm install

# Copiamos código fuente Y archivos de configuración
COPY docs ./docs

# Construimos la aplicación
WORKDIR /app/docs
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage de producción
FROM node:22 AS runner

WORKDIR /app

ENV PRODUCTION=false
ENV PORT=4321

# Copiamos los artefactos necesarios del builder
COPY --from=builder /app/docs/dist ./dist
COPY --from=builder /app/docs/package.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start", "--", "--host", "0.0.0.0", "--port", "4321"]