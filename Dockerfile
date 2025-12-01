# ---------- STAGE 1: Dependencies ----------
FROM node:20-alpine AS dependencies
WORKDIR /usr/src/app

# Copiar solo archivos de dependencias primero (mejor cache)
COPY package*.json ./
COPY prisma ./prisma

# Instalar todas las dependencias
RUN npm ci

# Generar el cliente Prisma
RUN npx prisma generate

# ---------- STAGE 2: Build ----------
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Copiar dependencias del stage anterior
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=dependencies /usr/src/app/prisma ./prisma

# Copiar código fuente
COPY src ./src

# Compilar el proyecto NestJS
RUN npm run build

# Limpiar archivos innecesarios
RUN rm -rf src

# ---------- STAGE 3: Production ----------
FROM node:20-alpine AS production
WORKDIR /usr/src/app

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

# Instalar Python, C, C++, Java para ejecutar código de usuarios
RUN apk add --no-cache \
    python3 \
    py3-pip \
    gcc \
    g++ \
    openjdk17-jdk \
    make

# Copiar package files con ownership correcto
COPY --chown=nestjs:nodejs package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --omit=dev && npm cache clean --force

# Copiar el esquema Prisma con ownership correcto
COPY --chown=nestjs:nodejs prisma ./prisma

# Generar el cliente Prisma en producción
RUN npx prisma generate

# Copiar el código compilado con ownership correcto
COPY --chown=nestjs:nodejs --from=builder /usr/src/app/dist ./dist

# Cambiar a usuario no-root
USER nestjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

EXPOSE 3000
CMD ["node", "dist/main"]