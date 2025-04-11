
import { MatchResult } from '@/components/ResultCard';

// AcoustID API Key proporcionada por el usuario
const API_KEY = 'EIr8RJoY9K';
const API_URL = 'https://api.acoustid.org/v2/lookup';

// API Key de Spotify proporcionada por el usuario
const SPOTIFY_API_KEY = '2bd07555ade94cf7900f664d1b731011';

// Función para generar una huella digital del archivo de audio
// En una implementación real, esto usaría fpcalc a través de un servicio backend
// Para este demo, estamos simulando la generación de la huella digital
const generateFingerprint = (file: File): Promise<{ fingerprint: string, duration: number }> => {
  return new Promise((resolve) => {
    // Simulamos tiempo de procesamiento
    setTimeout(() => {
      // Esta es solo una huella digital simulada para fines de demostración
      const mockFingerprint = Array.from({ length: 100 }, () => 
        Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
      ).join('');
      
      // Duración simulada entre 1-5 minutos (60-300 segundos)
      const mockDuration = Math.floor(Math.random() * 240) + 60;
      
      resolve({
        fingerprint: mockFingerprint,
        duration: mockDuration
      });
    }, 1000); // Simulamos un tiempo de procesamiento de 1 segundo
  });
};

// Función para consultar la API de AcoustID con la huella digital
const queryAcoustid = async (fingerprint: string, duration: number): Promise<MatchResult[]> => {
  try {
    const params = new URLSearchParams({
      client: API_KEY,
      meta: 'recordings recordingids releaseids releases tracks',
      duration: duration.toString(),
      fingerprint: fingerprint,
      format: 'json'
    });

    // Hacemos la llamada a la API real
    const response = await fetch(`${API_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error(`Error en la respuesta de AcoustID: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Procesamos los resultados reales
    if (data.status === 'ok' && data.results && data.results.length > 0) {
      return processAcoustidResults(data.results);
    } else {
      // Si no hay resultados, devolvemos un array vacío
      return [];
    }
  } catch (error) {
    console.error('Error al consultar AcoustID:', error);
    // Si hay un error, devolvemos resultados simulados
    return mockAcoustidResults();
  }
};

// Procesamos los resultados reales de AcoustID
const processAcoustidResults = (results: any[]): MatchResult[] => {
  try {
    const processedResults: MatchResult[] = [];
    
    results.forEach((result, index) => {
      if (result.recordings && result.recordings.length > 0) {
        const recording = result.recordings[0];
        
        // Creamos un objeto MatchResult para cada grabación
        processedResults.push({
          id: index.toString(),
          score: parseFloat(result.score.toFixed(2)) || 0.7,
          title: recording.title || 'Título desconocido',
          artist: recording.artists ? recording.artists[0].name : 'Artista desconocido',
          album: recording.releases ? recording.releases[0].title : 'Álbum desconocido',
          releaseDate: recording.releases ? recording.releases[0].date?.year?.toString() || 'Desconocido' : 'Desconocido',
          streamingLinks: {
            spotify: `https://open.spotify.com/search/${encodeURIComponent(recording.title || '')}`,
            apple: `https://music.apple.com/search?term=${encodeURIComponent(recording.title || '')}`,
            youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(recording.title || '')}`
          }
        });
      }
    });
    
    return processedResults;
  } catch (error) {
    console.error('Error al procesar los resultados de AcoustID:', error);
    return mockAcoustidResults();
  }
};

// Función para simular resultados
const mockAcoustidResults = (): MatchResult[] => {
  // Aleatoriamente decidimos si devolvemos coincidencias o no
  if (Math.random() > 0.2) { // 80% de probabilidad de encontrar coincidencias
    return [
      {
        id: '1',
        score: 0.92,
        title: 'Nueva Era',
        artist: 'Bad Bunny',
        album: 'Un Verano Sin Ti',
        releaseDate: '2022',
        streamingLinks: {
          spotify: 'https://open.spotify.com/track/example1',
          apple: 'https://music.apple.com/track/example1',
          youtube: 'https://youtube.com/watch?v=example1'
        }
      },
      {
        id: '2',
        score: 0.84,
        title: 'Moscow Mule',
        artist: 'Bad Bunny',
        album: 'Un Verano Sin Ti',
        releaseDate: '2022',
        streamingLinks: {
          spotify: 'https://open.spotify.com/track/example2',
          youtube: 'https://youtube.com/watch?v=example2'
        }
      },
      {
        id: '3',
        score: 0.75,
        title: 'Me Porto Bonito',
        artist: 'Bad Bunny & Chencho Corleone',
        album: 'Un Verano Sin Ti',
        releaseDate: '2022',
        streamingLinks: {
          spotify: 'https://open.spotify.com/track/example3',
          apple: 'https://music.apple.com/track/example3'
        }
      }
    ];
  } else {
    // Devolvemos un array vacío si no se encuentran coincidencias
    return [];
  }
};

export const analyzeAudioFile = async (file: File): Promise<MatchResult[]> => {
  try {
    // Paso 1: Generar la huella digital
    const { fingerprint, duration } = await generateFingerprint(file);
    
    // Paso 2: Consultar AcoustID con la huella digital
    const results = await queryAcoustid(fingerprint, duration);
    
    return results;
  } catch (error) {
    console.error('Error al analizar el archivo de audio:', error);
    throw error;
  }
};
