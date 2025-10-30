# ---------- STAGE 1: Build ----------
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Copiar código fuente y esquema Prisma
COPY src ./src
COPY prisma ./prisma

# Instalar todas las dependencias (incluyendo devDependencies)
RUN npm ci

# Generar el cliente Prisma
RUN npx prisma generate

# Compilar el proyecto NestJS
RUN npm run build

# Verificar que dist se creó correctamente
RUN ls -la dist/

# ---------- STAGE 2: Production ----------
FROM node:20-alpine AS production
WORKDIR /usr/src/app

# Instalar Python, C, C++, Java para ejecutar código de usuarios
RUN apk add --no-cache python3 py3-pip gcc g++ openjdk17-jdk

# Copiar package files
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --omit=dev

# Copiar el esquema Prisma
COPY prisma ./prisma

# Generar el cliente Prisma en producción
RUN npx prisma generate

# Copiar el código compilado desde el stage de build
COPY --from=builder /usr/src/app/dist ./dist

# Verificar que dist se copió correctamente
RUN ls -la dist/ && test -f dist/main.js || (echo "ERROR: dist/main.js not found!" && exit 1)

EXPOSE 3000
CMD ["node", "dist/main.js"]