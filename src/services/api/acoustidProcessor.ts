
import { MatchResult } from '@/components/ResultCard';
import { generateStreamingLinks } from '../utils/streamingLinks';
import { ACOUSTID_API_KEY, ACOUSTID_API_URL } from './config';
import { getBeatUsageResults } from '../database/beatUsageAnalyzer';

// Query AcoustID API with fingerprint
export const queryAcoustid = async (fingerprint: string, duration: number, fileName: string): Promise<MatchResult[]> => {
  try {
    console.log(`Consultando base de datos de huellas de audio. Duración: ${duration}s`);
    
    const params = new URLSearchParams({
      client: ACOUSTID_API_KEY,
      meta: 'recordings recordingids releaseids releases tracks',
      duration: duration.toString(),
      fingerprint: fingerprint,
      format: 'json'
    });

    // Try to make a real API call
    const response = await fetch(`${ACOUSTID_API_URL}?${params}`);
    
    if (!response.ok) {
      console.log(`No se pudo conectar con el servicio de huellas: ${response.status}`);
      console.log('Usando sistema TrackID local');
      return getBeatUsageResults(fileName, fingerprint, duration);
    }
    
    const data = await response.json();
    console.log('Respuesta del servicio de huellas:', data);
    
    // Process real results
    if (data.status === 'ok' && data.results && data.results.length > 0) {
      return processAcoustidResults(data.results);
    } else {
      console.log('No se encontraron coincidencias externas, usando base de datos local');
      return getBeatUsageResults(fileName, fingerprint, duration);
    }
  } catch (error) {
    console.error('Error al consultar servicio de huellas:', error);
    // Generate results based on file attributes
    return getBeatUsageResults(fileName, fingerprint, duration);
  }
};

// Process real AcoustID results
export const processAcoustidResults = (results: any[]): MatchResult[] => {
  try {
    const processedResults: MatchResult[] = [];
    
    results.forEach((result, index) => {
      if (result.recordings && result.recordings.length > 0) {
        const recording = result.recordings[0];
        
        // Create MatchResult object for each recording
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
