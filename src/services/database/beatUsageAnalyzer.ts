
import { MatchResult } from '@/components/ResultCard';
import { trackDatabase } from './trackDatabase';
import { generateStreamingLinksFromNames } from '../utils/streamingLinks';

// Generate realistic beat usage results
export const getBeatUsageResults = (fileName: string, fingerprint: string, duration: number): MatchResult[] => {
  // Analyze filename and fingerprint to select appropriate results
  const lowerFileName = fileName.toLowerCase();
  const fingerprintValue = parseInt(fingerprint.substring(0, 8), 16);
  const durationFactor = duration / 60; // Duration in minutes
  
  // Determine track genre based on filename
  let relevantGenres: string[] = [];
  
  if (lowerFileName.includes('afro') || lowerFileName.includes('dancehall')) {
    relevantGenres.push('afrobeats');
  } else if (lowerFileName.includes('trap') || lowerFileName.includes('hip') || lowerFileName.includes('rap')) {
    relevantGenres.push('hip-hop');
  } else if (lowerFileName.includes('pop') || lowerFileName.includes('edm') || lowerFileName.includes('electro')) {
    relevantGenres.push('pop');
  } else if (lowerFileName.includes('rnb') || lowerFileName.includes('soul') || lowerFileName.includes('piano')) {
    relevantGenres.push('r&b');
  } else if (lowerFileName.includes('latin') || lowerFileName.includes('reggaeton')) {
    relevantGenres.push('latin');
  } else {
    // If no specific genre in filename, choose based on fingerprint
    const allGenres = ['hip-hop', 'afrobeats', 'pop', 'r&b', 'latin'];
    relevantGenres.push(allGenres[fingerprintValue % allGenres.length]);
    
    // Add a second genre for variety
    const secondGenreIndex = (fingerprintValue + 2) % allGenres.length;
    if (allGenres[secondGenreIndex] !== relevantGenres[0]) {
      relevantGenres.push(allGenres[secondGenreIndex]);
    }
  }
  
  // Filter tracks by relevant genres
  let relevantTracks = trackDatabase.filter(track => 
    relevantGenres.includes(track.genre)
  );
  
  // If no tracks found, use random selection
  if (relevantTracks.length === 0) {
    const randomIndexes = [
      fingerprintValue % trackDatabase.length,
      (fingerprintValue + 3) % trackDatabase.length,
      (fingerprintValue + 7) % trackDatabase.length
    ];
    
    relevantTracks = [...new Set(randomIndexes)].map(index => trackDatabase[index]);
  }
  
  // Determine how many tracks to return (1-5 based on file characteristics)
  const seedValue = fingerprintValue + fileName.length + Math.floor(duration);
  const numResults = 1 + (seedValue % 4); // 1 to 4 results
  
  // Take a subset of the relevant tracks
  relevantTracks = relevantTracks.slice(0, numResults);
  
  // Convert to MatchResult format and add some variability to scores
  return relevantTracks.map((track, index) => {
    // Calculate a more realistic score based on multiple factors
    const baseScore = 0.75 + (index * 0.05);
    const nameInfluence = 0.01 * (fileName.length % 10);
    const durationInfluence = 0.01 * (Math.min(Math.floor(durationFactor * 10), 5));
    const randomFactor = 0.01 * ((fingerprintValue + index) % 10);
    
    // Calculate final score with slight randomness, higher for first results
    const score = Math.min(0.98, Math.max(0.70, baseScore - nameInfluence - durationInfluence + randomFactor));
    
    // Generate streaming links
    const streamingLinks = generateStreamingLinksFromNames(track.title, track.artist);
    
    return {
      id: track.id,
      score: parseFloat(score.toFixed(2)),
      title: track.title,
      artist: track.artist,
      album: track.album,
      releaseDate: track.releaseDate,
      streamingLinks: streamingLinks
    };
  });
};
