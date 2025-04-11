const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { promisify } = require('util');
const execAsync = promisify(exec);

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage, 
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max size
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/') || 
        file.originalname.endsWith('.mp3') || 
        file.originalname.endsWith('.wav') || 
        file.originalname.endsWith('.m4a')) {
      cb(null, true);
    } else {
      cb(new Error('Formato de archivo no soportado. Por favor sube un archivo de audio.'));
    }
  }
});

// Environment variables
const ACOUSTID_API_KEY = process.env.ACOUSTID_API_KEY || 'EIr8RJoY9K';
const ACOUSTID_API_URL = process.env.ACOUSTID_API_URL || 'https://api.acoustid.org/v2/lookup';
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || '430058562e93497fb745cebe4eb87790';
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || '';
const SPOTIFY_API_URL = process.env.SPOTIFY_API_URL || 'https://api.spotify.com/v1';

// Helper function to generate fingerprint
async function generateFingerprint(filePath) {
  try {
    const { stdout } = await execAsync(`fpcalc -json "${filePath}"`);
    return JSON.parse(stdout);
  } catch (error) {
    console.error('Error running fpcalc:', error);
    throw new Error('Error al generar la huella digital del audio');
  }
}

// Helper function to query AcoustID
async function queryAcoustid(fingerprint, duration) {
  const params = new URLSearchParams({
    client: ACOUSTID_API_KEY,
    meta: 'recordings recordingids releaseids releases tracks',
    duration: duration.toString(),
    fingerprint: fingerprint,
    format: 'json'
  });

  const response = await axios.get(`${ACOUSTID_API_URL}?${params}`);
  return response.data;
}

// Helper function to process results
function processAcoustidResults(results) {
  const processedResults = [];

  results.forEach((result, index) => {
    if (result.recordings && result.recordings.length > 0) {
      const recording = result.recordings[0];

      processedResults.push({
        id: recording.id || `recording-${index}`,
        score: parseFloat(result.score.toFixed(2)) || 0.7,
        title: recording.title || 'Título desconocido',
        artist: recording.artists ? recording.artists[0].name : 'Artista desconocido',
        album: recording.releases && recording.releases.length > 0 ?
          recording.releases[0].title : 'Álbum desconocido',
        releaseDate: recording.releases && recording.releases.length > 0 && recording.releases[0].date ?
          recording.releases[0].date.year?.toString() || 'Desconocido' : 'Desconocido',
        streamingLinks: generateStreamingLinks(recording)
      });
    }
  });

  return processedResults;
}

// Helper function to generate streaming links
function generateStreamingLinks(recording) {
  const title = recording.title || '';
  const artist = recording.artists ? recording.artists[0].name : '';
  const searchTerm = encodeURIComponent(`${title} ${artist}`.trim());

  return {
    spotify: `https://open.spotify.com/search/${searchTerm}`,
    apple: `https://music.apple.com/search?term=${searchTerm}`,
    youtube: `https://www.youtube.com/results?search_query=${searchTerm}`
  };
}

const handleAudioAnalysis = async (req, res) => {
  console.log('🧾 Archivos recibidos:', req.files);
  console.log('📦 Body:', req.body);

  const file = req.files?.[0] || req.file;
  if (!file) {
    return res.status(400).json({ error: 'No se subió ningún archivo' });
  }

  try {
    const filePath = file.path;
    console.log(`🎧 Generando huella digital para: ${file.originalname}`);
    const fpData = await generateFingerprint(filePath);
    console.log(`🔍 Consultando AcoustID con duración: ${fpData.duration}s`);
    const acoustidResponse = await queryAcoustid(fpData.fingerprint, fpData.duration);

    let results = [];
    if (acoustidResponse.status === 'ok' && acoustidResponse.results && acoustidResponse.results.length > 0) {
      results = processAcoustidResults(acoustidResponse.results);
    }

    fs.unlinkSync(filePath);

    return res.json(results);
  } catch (error) {
    console.error('❌ Error al procesar el archivo:', error);
    return res.status(500).json({ error: 'Error al procesar el archivo de audio', message: error.message });
  }
};

// Endpoint original
app.post('/api/analyze', upload.any(), handleAudioAnalysis);

// Alias para Lovable
app.post('/fingerprint', upload.any(), handleAudioAnalysis);


// Iniciar el servidor
app.listen(port, () => {
  console.log(`🚀 Servidor backend ejecutándose en http://localhost:${port}`);
});
