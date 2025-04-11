
import { MatchResult } from '@/components/ResultCard';
import { BACKEND_API_URL } from './api/config';

export const analyzeAudioFile = async (file: File): Promise<MatchResult[]> => {
  try {
    console.log(`Analizando archivo: ${file.name} (${file.size} bytes)`);
    
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('audioFile', file);
    
    // Send file to backend for analysis
    const response = await fetch(`${BACKEND_API_URL}/api/analyze`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al analizar el archivo de audio');
    }
    
    const results = await response.json();
    console.log(`Análisis completado. Encontrados ${results.length} coincidencias`);
    return results;
  } catch (error) {
    console.error('Error al analizar el archivo de audio:', error);
    throw error;
  }
};
