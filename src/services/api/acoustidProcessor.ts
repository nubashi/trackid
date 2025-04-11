
import { MatchResult } from '@/components/ResultCard';
import { generateStreamingLinks } from '../utils/streamingLinks';

// Esta función ya no se utiliza directamente, el backend se encarga de consultar la API de AcoustID
export const queryAcoustid = async (fingerprint: string, duration: number, fileName: string): Promise<MatchResult[]> => {
  throw new Error('Esta función ya no está en uso. El análisis de audio ahora se realiza a través del backend.');
};

// Esta función aún es útil para procesar datos de la API en caso de integración futura
export const processAcoustidResults = (results: any[]): MatchResult[] => {
  try {
    const processedResults: MatchResult[] = [];
    
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
  } catch (error) {
    console.error('Error al procesar los resultados:', error);
    return [];
  }
};
