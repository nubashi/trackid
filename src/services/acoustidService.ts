
import { MatchResult } from '@/components/ResultCard';

// AcoustID API Key provided
const API_KEY = 'EIr8RJoY9K';
const API_URL = 'https://api.acoustid.org/v2/lookup';

// Helper function to generate a fingerprint from the audio file
// In a real implementation, this would use fpcalc via a backend service
// For this demo, we're mocking the fingerprint generation
const mockGenerateFingerprint = (file: File): Promise<{ fingerprint: string, duration: number }> => {
  return new Promise((resolve) => {
    // Simulate processing time
    setTimeout(() => {
      // This is just a mock fingerprint for demonstration purposes
      const mockFingerprint = Array.from({ length: 100 }, () => 
        Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
      ).join('');
      
      // Mock duration between 1-5 minutes (60-300 seconds)
      const mockDuration = Math.floor(Math.random() * 240) + 60;
      
      resolve({
        fingerprint: mockFingerprint,
        duration: mockDuration
      });
    }, 2000); // Simulate a 2 second processing time
  });
};

// Function to query the AcoustID API with the fingerprint
const queryAcoustid = async (fingerprint: string, duration: number): Promise<MatchResult[]> => {
  try {
    const params = new URLSearchParams({
      client: API_KEY,
      meta: 'recordings recordingids releaseids releases tracks',
      duration: duration.toString(),
      fingerprint: fingerprint,
      format: 'json'
    });

    // In a real implementation, we would make the actual API call:
    // const response = await fetch(`${API_URL}?${params}`);
    // const data = await response.json();
    
    // For this demo, we'll return mock results
    return mockAcoustidResults();
  } catch (error) {
    console.error('Error querying AcoustID:', error);
    throw new Error('Hubo un error al consultar la base de datos de AcoustID');
  }
};

// Mock function to return simulated results for demonstration
const mockAcoustidResults = (): MatchResult[] => {
  // Randomly decide if we return matches or not
  if (Math.random() > 0.3) { // 70% chance of finding matches
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
    // Return empty array if no matches found
    return [];
  }
};

export const analyzeAudioFile = async (file: File): Promise<MatchResult[]> => {
  try {
    // Step 1: Generate fingerprint (mocked for this demo)
    const { fingerprint, duration } = await mockGenerateFingerprint(file);
    
    // Step 2: Query AcoustID with the fingerprint
    const results = await queryAcoustid(fingerprint, duration);
    
    return results;
  } catch (error) {
    console.error('Error analyzing audio file:', error);
    throw error;
  }
};
