# ---------- STAGE 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Instala dependencias necesarias para Prisma y compilación
RUN apk add --no-cache openssl

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos dependencias (sin devDependencies aún)
RUN npm ci

# Copiamos el código fuente
COPY . .

# Genera el cliente de Prisma
RUN npx prisma generate

# Compila el proyecto NestJS
RUN npm run build

# ---------- STAGE 2: Run ----------
FROM node:20-alpine AS production

WORKDIR /usr/src/app

RUN apk add --no-cache openssl

# Copia los archivos necesarios desde la etapa de build
COPY package*.json ./
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/prisma ./prisma

# Expone el puerto donde corre NestJS
EXPOSE 3000

# Comando de inicio
CMD ["node", "dist/main.js"]
