FROM node:18-alpine

# Instalar dependencias necesarias para Prisma y SQLite en Alpine Linux
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./

# Instalar las dependencias
RUN npm ci

# Copiar el resto del código del proyecto
COPY . .

# Generar el cliente de Prisma (necesario para la base de datos)
RUN npx prisma generate

# Construir la aplicación de Next.js para producción
RUN npm run build

# Variables de entorno para producción
ENV NODE_ENV=production
ENV PORT=3000

# Exponer el puerto 3000
EXPOSE 3000

# Comando para arrancar el servidor
CMD ["npm", "start"]
