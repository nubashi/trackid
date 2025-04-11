
import React from 'react';
import ResultCard, { MatchResult } from './ResultCard';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResultsListProps {
  results: MatchResult[];
}

const ResultsList: React.FC<ResultsListProps> = ({ results }) => {
  if (results.length === 0) {
    return null;
  }
  
  const handleGenerateReport = () => {
    // Generar un reporte en formato de texto
    let reportText = "INFORME DE ANÁLISIS DE BEAT DETECTIVE\n\n";
    reportText += `Fecha: ${new Date().toLocaleDateString()}\n`;
    reportText += `Hora: ${new Date().toLocaleTimeString()}\n\n`;
    reportText += `Se encontraron ${results.length} coincidencias:\n\n`;
    
    results.forEach((result, index) => {
      reportText += `${index + 1}. Título: ${result.title}\n`;
      reportText += `   Artista: ${result.artist}\n`;
      reportText += `   Álbum: ${result.album}\n`;
      reportText += `   Año: ${result.releaseDate}\n`;
      reportText += `   Coincidencia: ${(result.score * 100).toFixed(0)}%\n\n`;
    });
    
    reportText += "\nGenerado por Beat Detective - Protegiendo la propiedad intelectual de productores musicales";
    
    // Crear un blob y un enlace de descarga
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `beat-detective-informe-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Resultados</h2>
        <Button 
          variant="outline" 
          onClick={handleGenerateReport}
          className="flex items-center gap-2"
        >
          <ExternalLink size={16} />
          Generar Informe
        </Button>
      </div>
      
      {results.length > 0 ? (
        <div className="space-y-4">
          {results.map((result) => (
            <ResultCard key={result.id} result={result} />
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border border-border rounded-xl">
          <p className="text-muted-foreground">No se encontraron coincidencias para este beat.</p>
        </div>
      )}
    </div>
  );
};

export default ResultsList;
