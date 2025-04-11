
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import FileUpload from '@/components/FileUpload';
import Waveform from '@/components/Waveform';
import ResultsList from '@/components/ResultsList';
import { MatchResult } from '@/components/ResultCard';
import { analyzeAudioFile } from '@/services/acoustidService';
import { toast } from 'sonner';
import { Search, FileAudio, Shield, Music, Sparkles, AlertTriangle } from 'lucide-react';

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
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("El archivo es demasiado grande. El tamaño máximo es 10MB.");
        setIsAnalyzing(false);
        return;
      }
      
      // Reset previous results
      setResults([]);
      
      // Analyze file
      toast.info("Analizando tu beat en nuestra base de datos, esto puede tardar unos segundos...");
      
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const matchResults = await analyzeAudioFile(file);
      
      // Update results
      setResults(matchResults);
      setHasSearched(true);
      
      // Show appropriate toast
      if (matchResults.length > 0) {
        const highMatch = matchResults.some(result => result.score >= 0.9);
        
        if (highMatch) {
          toast.error(`¡Alerta! Se encontraron ${matchResults.length} coincidencias con alta probabilidad de uso no autorizado.`);
        } else {
          toast.success(`Se encontraron ${matchResults.length} coincidencias para tu beat.`);
        }
      } else {
        toast.info("No se encontraron coincidencias para este beat. Parece ser original.");
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
            <h1 className="text-5xl font-bold mb-3 text-foreground">
              <span className="text-beat-brightPurple">Track</span>ID
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Descubre si tu beat ha sido utilizado en canciones comerciales mediante tecnología avanzada de huellas digitales de audio
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
                <p className="text-muted-foreground animate-pulse">Analizando tu beat en nuestra base de datos...</p>
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
              <div className="space-y-8 mt-16">
                <div className="border border-border rounded-xl p-6 bg-card/50">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-yellow-500/20 shrink-0">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">¿Cómo funciona TrackID?</h3>
                      <p className="text-muted-foreground mb-4">
                        TrackID analiza la huella digital única de tu beat y la compara con nuestra base de datos de millones de canciones comerciales. A diferencia de otros servicios que solo hacen coincidencias exactas, nuestra tecnología puede detectar:
                      </p>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                        <li>Beats que han sido reproducidos a diferentes velocidades (BPM)</li>
                        <li>Samples utilizados en producciones comerciales</li>
                        <li>Melodías o progresiones de acordes similares</li>
                        <li>Canciones que incorporan solo fragmentos de tu beat</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="purple-card">
                    <div className="flex items-center mb-4">
                      <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                        <FileAudio className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">Análisis Avanzado</h3>
                    </div>
                    <p className="text-sm text-white/80">
                      Tecnología de reconocimiento de audio para identificar si tu beat aparece en canciones publicadas.
                    </p>
                  </div>
                  
                  <div className="yellow-card">
                    <div className="flex items-center mb-4">
                      <div className="h-10 w-10 rounded-full bg-black/20 flex items-center justify-center mr-3">
                        <Search className="h-5 w-5 text-black" />
                      </div>
                      <h3 className="text-lg font-semibold text-black">Base de Datos Global</h3>
                    </div>
                    <p className="text-sm text-black/80">
                      Comparación con millones de canciones de múltiples plataformas y mercados internacionales.
                    </p>
                  </div>
                  
                  <div className="mint-card">
                    <div className="flex items-center mb-4">
                      <div className="h-10 w-10 rounded-full bg-black/20 flex items-center justify-center mr-3">
                        <Music className="h-5 w-5 text-black" />
                      </div>
                      <h3 className="text-lg font-semibold text-black">Protección Legal</h3>
                    </div>
                    <p className="text-sm text-black/80">
                      Genera informes detallados para reclamar derechos de autor o licencias no autorizadas.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="py-6 border-t border-border mt-12">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 TrackID | Desarrollado para proteger la propiedad intelectual de productores musicales
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
