
import React from 'react';
import ResultCard, { MatchResult } from './ResultCard';

interface ResultsListProps {
  results: MatchResult[];
}

const ResultsList: React.FC<ResultsListProps> = ({ results }) => {
  if (results.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Resultados</h2>
      
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
