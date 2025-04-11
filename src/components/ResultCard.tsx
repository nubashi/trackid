
import React from 'react';
import { ExternalLink, Music, User, Disc, Calendar, Share2, PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  
  // Function to generate match status text and color
  const getMatchStatus = () => {
    if (matchPercentage >= 90) {
      return {
        text: "Coincidencia muy alta",
        color: "text-red-500",
        bgColor: "bg-red-500/20"
      };
    } else if (matchPercentage >= 80) {
      return {
        text: "Coincidencia alta",
        color: "text-amber-500",
        bgColor: "bg-amber-500/20"
      };
    } else {
      return {
        text: "Posible coincidencia",
        color: "text-beat-vibrantPurple",
        bgColor: "bg-beat-vibrantPurple/20"
      };
    }
  };
  
  const matchStatus = getMatchStatus();
  
  return (
    <div className="result-card border border-border rounded-xl p-5 hover:shadow-lg transition-shadow duration-300 hover:shadow-beat-vibrantPurple/5 bg-background">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="flex items-center text-muted-foreground">
            <User className="h-3.5 w-3.5 mr-1" />
            <span className="text-sm">{artist}</span>
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`px-3 py-1.5 ${matchStatus.bgColor} rounded-lg ${matchStatus.color} text-sm font-medium flex items-center gap-1`}>
                <PieChart className="h-3.5 w-3.5" />
                {matchPercentage}%
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{matchStatus.text}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="space-y-3">
        {album && (
          <div className="flex items-center text-sm">
            <Disc className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{album}</span>
          </div>
        )}
        
        {releaseDate && (
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{releaseDate}</span>
          </div>
        )}
      </div>
      
      {streamingLinks && Object.keys(streamingLinks).length > 0 && (
        <>
          <Separator className="my-4" />
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Escuchar en plataformas</h4>
            <div className="flex flex-wrap gap-2">
              {streamingLinks.spotify && (
                <a href={streamingLinks.spotify} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="h-8 rounded-xl border-beat-vibrantPurple/30 text-beat-vibrantPurple hover:bg-beat-vibrantPurple/10">
                    <Music className="h-3.5 w-3.5 mr-2" />
                    Spotify
                  </Button>
                </a>
              )}
              {streamingLinks.apple && (
                <a href={streamingLinks.apple} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="h-8 rounded-xl border-beat-vibrantPurple/30 text-beat-vibrantPurple hover:bg-beat-vibrantPurple/10">
                    <Music className="h-3.5 w-3.5 mr-2" />
                    Apple Music
                  </Button>
                </a>
              )}
              {streamingLinks.youtube && (
                <a href={streamingLinks.youtube} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="h-8 rounded-xl border-beat-vibrantPurple/30 text-beat-vibrantPurple hover:bg-beat-vibrantPurple/10">
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
