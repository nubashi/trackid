
// Este archivo ya no se utiliza, la generación de fingerprints se hace en el backend
export const generateFingerprint = async (file: File): Promise<{ fingerprint: string, duration: number }> => {
  throw new Error('Esta función ya no está en uso. La generación de fingerprints ahora se realiza en el backend.');
};
