FROM node:22 AS builder

WORKDIR /app

# Copiamos archivos de configuración
COPY package.json turbo.json ./
COPY docs/package.json ./docs/

# Instalamos dependencias
RUN npm install

# Copiamos código fuente
COPY docs ./docs

# Construimos el sitio estático
WORKDIR /app/docs
RUN npm run build

# Servimos con Nginx
FROM nginx:alpine AS runner

# Copiamos los archivos estáticos generados al directorio de Nginx
COPY --from=builder /app/docs/dist /usr/share/nginx/html

# Exponemos el puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
