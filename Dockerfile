# ---------- STAGE 1: Development / Build ----------
FROM node:20-alpine AS development
WORKDIR /usr/src/app

# Copiar archivos base de configuración
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Copiar el código fuente y el esquema Prisma
COPY src ./src
COPY prisma ./prisma

# Instalar dependencias
RUN npm install

# Generar el cliente Prisma
RUN npx prisma generate --schema=prisma/schema.prisma

# Compilar el proyecto NestJS
RUN npx nest build

# ---------- STAGE 2: Production ----------
FROM node:20-alpine AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app

# Copiar package files e instalar dependencias de producción
COPY --from=development /usr/src/app/package*.json ./
RUN npm install --omit=dev

# Copiar el código compilado
COPY --from=development /usr/src/app/dist ./dist

# Copiar el cliente Prisma generado
COPY --from=development /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Copiar el esquema Prisma (por si se usa en runtime)
COPY --from=development /usr/src/app/prisma ./prisma

EXPOSE 3000
CMD ["node", "dist/main.js"]
