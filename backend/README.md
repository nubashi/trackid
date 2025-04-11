
# TrackID Backend

Backend para la aplicación TrackID que proporciona detección de audio real utilizando fpcalc (Chromaprint) y la API de AcoustID.

## Requisitos previos

- Node.js (v16 o superior)
- fpcalc (Chromaprint)

## Instalación local

### 1. Instalar fpcalc (Chromaprint)

#### En Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install libchromaprint-tools
```

#### En MacOS:
```bash
brew install chromaprint
```

#### En Windows:
Descarga el binario desde [https://acoustid.org/chromaprint](https://acoustid.org/chromaprint) y añádelo al PATH.

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar el servidor en modo desarrollo
```bash
npm run dev
```

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
PORT=3001
ACOUSTID_API_KEY=EIr8RJoY9K
SPOTIFY_CLIENT_ID=430058562e93497fb745cebe4eb87790
SPOTIFY_CLIENT_SECRET=tu_client_secret_aquí
```

## Despliegue en Railway

1. Crea una cuenta en [Railway](https://railway.app/)
2. Conecta tu repositorio de GitHub
3. Crea un nuevo proyecto y selecciona el repositorio
4. Railway detectará automáticamente el Dockerfile
5. Configura las variables de entorno en la pestaña "Variables"
6. Haz clic en "Deploy"

## Despliegue en Render

1. Crea una cuenta en [Render](https://render.com/)
2. Crea un nuevo "Web Service"
3. Conecta tu repositorio de GitHub
4. Configura las siguientes opciones:
   - Runtime: Docker
   - Build Command: `docker build -t trackid-backend .`
   - Start Command: `docker run -p 3001:3001 trackid-backend`
5. Configura las variables de entorno
6. Haz clic en "Create Web Service"

## Endpoints API

### POST /api/analyze
Analiza un archivo de audio y devuelve coincidencias encontradas.

**Request:**
- Content-Type: multipart/form-data
- Body: archivo de audio (campo: audioFile)

**Response:**
```json
[
  {
    "id": "string",
    "score": 0.95,
    "title": "Nombre de la canción",
    "artist": "Nombre del artista",
    "album": "Nombre del álbum",
    "releaseDate": "2023",
    "streamingLinks": {
      "spotify": "https://spotify.com/...",
      "apple": "https://music.apple.com/...",
      "youtube": "https://youtube.com/..."
    }
  }
]
```
