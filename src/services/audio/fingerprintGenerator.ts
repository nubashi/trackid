
// Function to generate audio fingerprint
export const generateFingerprint = async (file: File): Promise<{ fingerprint: string, duration: number }> => {
  return new Promise((resolve) => {
    // Create audio object to get real duration
    const audio = new Audio();
    const objectUrl = URL.createObjectURL(file);
    
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl);
      
      // Calculate duration in seconds
      const duration = Math.round(audio.duration);
      
      // In a real implementation, we would use a proper audio fingerprinting library
      // For now, we create a more sophisticated mock fingerprint based on audio characteristics
      let mockFingerprint = '';
      const fileNameSum = file.name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const fileSizeBytes = file.size;
      
      // Generate a unique fingerprint pattern based on file attributes
      for (let i = 0; i < 32; i++) {
        const value = ((fileNameSum * (i + 1) + fileSizeBytes) % 256) ^ (duration % 256);
        mockFingerprint += value.toString(16).padStart(2, '0');
      }
      
      console.log(`Duración detectada: ${duration} segundos`);
      console.log(`Huella digital generada: ${mockFingerprint.substring(0, 20)}...`);
      
      resolve({
        fingerprint: mockFingerprint,
        duration: duration || 180 // Use 180s as fallback if not detected
      });
    };
    
    audio.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      console.warn('No se pudo cargar el audio para metadata, usando valores estimados');
      
      // Default values in case of error
      const mockFingerprint = Array.from(new Array(32))
        .map((_, i) => ((file.name.length * i) % 255).toString(16).padStart(2, '0'))
        .join('');
      
      resolve({
        fingerprint: mockFingerprint,
        duration: 180
      });
    };
    
    audio.src = objectUrl;
  });
};
