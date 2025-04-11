
import { MatchResult } from '@/components/ResultCard';
import { generateFingerprint } from './audio/fingerprintGenerator';
import { queryAcoustid } from './api/acoustidProcessor';

export const analyzeAudioFile = async (file: File): Promise<MatchResult[]> => {
  try {
    console.log(`Analizando archivo: ${file.name} (${file.size} bytes)`);
    
    // Step 1: Generate audio fingerprint
    const { fingerprint, duration } = await generateFingerprint(file);
    
    // Step 2: Query database with fingerprint
    const results = await queryAcoustid(fingerprint, duration, file.name);
    
    console.log(`Análisis completado. Encontrados ${results.length} coincidencias`);
    return results;
  } catch (error) {
    console.error('Error al analizar el archivo de audio:', error);
    throw error;
  }
};
