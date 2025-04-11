
import React from 'react';
import { ExternalLink, Music, User, Disc, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export interface MatchResult {
  id: string;
  score: number;
  title: string;
  artist: string;
  album?: string;
  releaseDate?: string;
  streamingLinks?: {
    spotify?: string;
    apple?: string;
    youtube?: string;
    [key: string]: string | undefined;
  };
}

interface ResultCardProps {
  result: MatchResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const { title, artist, album, score, releaseDate, streamingLinks } = result;
  
  const matchPercentage = Math.round(score * 100);
  
  return (
    <div className="result-card">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="flex items-center text-muted-foreground">
            <User className="h-3.5 w-3.5 mr-1" />
            <span className="text-sm">{artist}</span>
          </div>
        </div>
        <div className="px-2 py-1 bg-beat-purple/10 rounded text-beat-purple text-sm font-medium">
          {matchPercentage}% coincidencia
        </div>
      </div>
      
      <div className="space-y-3">
        {album && (
          <div className="flex items-center text-sm">
            <Disc className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{album}</span>
            {releaseDate && <span className="text-muted-foreground ml-2">({releaseDate})</span>}
          </div>
        )}
      </div>
      
      {streamingLinks && Object.keys(streamingLinks).length > 0 && (
        <>
          <Separator className="my-4" />
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Disponible en</h4>
            <div className="flex flex-wrap gap-2">
              {streamingLinks.spotify && (
                <a href={streamingLinks.spotify} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="h-8">
                    <Music className="h-3.5 w-3.5 mr-2" />
                    Spotify
                  </Button>
                </a>
              )}
              {streamingLinks.apple && (
                <a href={streamingLinks.apple} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="h-8">
                    <Music className="h-3.5 w-3.5 mr-2" />
                    Apple
                  </Button>
                </a>
              )}
              {streamingLinks.youtube && (
                <a href={streamingLinks.youtube} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="h-8">
                    <ExternalLink className="h-3.5 w-3.5 mr-2" />
                    YouTube
                  </Button>
                </a>
              )}
            </div>
          </div>
        </>
      )}
      
      <div className="mt-4 flex justify-end">
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <Share2 className="h-4 w-4 mr-2" />
          Compartir
        </Button>
      </div>
    </div>
  );
};

export default ResultCard;
