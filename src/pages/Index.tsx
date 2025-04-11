
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import FileUpload from '@/components/FileUpload';
import Waveform from '@/components/Waveform';
import ResultsList from '@/components/ResultsList';
import { MatchResult } from '@/components/ResultCard';
import { analyzeAudioFile } from '@/services/acoustidService';
import { toast } from 'sonner';
import { Search, FileAudio, Shield } from 'lucide-react';

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const handleFileSelected = async (file: File) => {
    try {
      setIsAnalyzing(true);
      setHasSearched(false);
      setAudioFile(file);
      
      // Comprobamos el tamaño del archivo (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("El archivo es demasiado grande. El tamaño máximo es 10MB.");
        setIsAnalyzing(false);
        return;
      }
      
      // Reiniciamos los resultados previos
      setResults([]);
      
      // Analizamos el archivo
      toast.info("Analizando tu beat, esto puede tardar unos segundos...");
      const matchResults = await analyzeAudioFile(file);
      
      // Actualizamos los resultados
      setResults(matchResults);
      setHasSearched(true);
      
      // Mostramos el toast adecuado
      if (matchResults.length > 0) {
        toast.success(`Se encontraron ${matchResults.length} coincidencias para tu beat.`);
      } else {
        toast.info("No se encontraron coincidencias para este beat.");
      }
    } catch (error) {
      console.error('Error al analizar el archivo:', error);
      toast.error("Hubo un error al analizar el archivo. Por favor, inténtalo de nuevo.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3 text-foreground">Beat Detective</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Descubre si tu beat ha sido utilizado en plataformas de streaming mediante tecnología de huellas digitales de audio
            </p>
          </div>
          
          <div className="space-y-12">
            <FileUpload 
              onFileSelected={handleFileSelected} 
              isLoading={isAnalyzing}
            />
            
            {isAnalyzing && (
              <div className="text-center">
                <Waveform isAnimating={true} />
                <p className="text-muted-foreground animate-pulse">Analizando tu beat...</p>
              </div>
            )}
            
            {hasSearched && results.length === 0 && !isAnalyzing && (
              <div className="text-center py-10">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 rounded-full bg-green-500/20">
                    <Shield className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="text-xl font-medium">¡Beat original!</h3>
                  <p className="text-muted-foreground max-w-md">
                    No hemos detectado que tu beat "{audioFile?.name}" haya sido utilizado en plataformas de streaming.
                  </p>
                </div>
              </div>
            )}
            
            {!isAnalyzing && results.length > 0 && (
              <ResultsList results={results} />
            )}
            
            {!isAnalyzing && !hasSearched && (
              <div className="glassmorphism p-6 text-center max-w-xl mx-auto mt-12">
                <div className="flex items-center justify-center mb-4">
                  <FileAudio className="h-6 w-6 text-beat-purple mr-2" />
                  <h2 className="text-lg font-medium">¿Cómo funciona?</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Beat Detective utiliza tecnología de huellas digitales de audio para comparar tu beat con 
                  millones de canciones en plataformas de streaming. Simplemente sube tu archivo 
                  de audio y nuestra herramienta te mostrará si ha sido utilizado y dónde.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="py-6 border-t border-border mt-12">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 Beat Detective | Desarrollado para proteger la propiedad intelectual de productores musicales
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
