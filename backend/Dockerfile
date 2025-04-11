
FROM node:18-slim

# Instalar dependencias necesarias para fpcalc (chromaprint)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libchromaprint-dev \
    libchromaprint-tools \
    && apt-get clean

# Crear directorio de trabajo
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar archivos del proyecto
COPY . .

# Crear directorio para uploads
RUN mkdir -p uploads

# Exponer el puerto
EXPOSE 3001

# Comando para iniciar la aplicación
CMD ["node", "server.js"]
