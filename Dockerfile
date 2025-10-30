# ---------- STAGE 1: Development / Build ----------
FROM node:20-alpine AS development
WORKDIR /usr/src/app

# Instalar Python, C, C++, Java y Node.js
RUN apk add --no-cache python3 py3-pip gcc g++ openjdk17-jdk nodejs npm

# Copiar archivos base de configuración
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Copiar el código fuente, esquema Prisma y scripts del runner
COPY src ./src
COPY prisma ./prisma
COPY runner-scripts ./runner-scripts

# Instalar dependencias
RUN npm install

# Generar el cliente Prisma
RUN npx prisma generate --schema=prisma/schema.prisma

# Asegurar que el runner sea ejecutable en el build stage
RUN chmod +x ./runner-scripts/runner.sh

# Compilar el proyecto NestJS
RUN npx nest build

# ---------- STAGE 2: Production ----------
FROM node:20-alpine AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app

# Instalar Python, C, C++, Java y Node.js
RUN apk add --no-cache python3 py3-pip gcc g++ openjdk17-jdk nodejs npm

# Copiar package files e instalar dependencias de producción
COPY --from=development /usr/src/app/package*.json ./
RUN npm install --omit=dev

# Copiar el código compilado
COPY --from=development /usr/src/app/dist ./dist

# Copiar el cliente Prisma generado
COPY --from=development /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Copiar el esquema Prisma (por si se usa en runtime)
COPY --from=development /usr/src/app/prisma ./prisma

# Copiar runner-scripts dentro de la app y también exponerlo en /runner-scripts
COPY --from=development /usr/src/app/runner-scripts ./runner-scripts
RUN mkdir -p /runner-scripts
COPY --from=development /usr/src/app/runner-scripts/runner.sh /runner-scripts/runner.sh
RUN chmod +x /runner-scripts/runner.sh /usr/src/app/runner-scripts/runner.sh

EXPOSE 3000
CMD ["node", "dist/main.js"]