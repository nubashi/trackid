
import React, { useEffect, useState } from 'react';

interface WaveformProps {
  isAnimating: boolean;
}

const Waveform: React.FC<WaveformProps> = ({ isAnimating }) => {
  const [bars, setBars] = useState<number[]>([]);
  
  useEffect(() => {
    // Generate random heights for the waveform bars
    const generateBars = () => {
      const numberOfBars = 40;
      const newBars = [];
      for (let i = 0; i < numberOfBars; i++) {
        newBars.push(Math.random());
      }
      setBars(newBars);
    };
    
    generateBars();
    
    // Regenerate bars periodically if animation is active
    let interval: NodeJS.Timeout;
    if (isAnimating) {
      interval = setInterval(() => {
        generateBars();
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAnimating]);
  
  return (
    <div className="flex items-end justify-center h-32 my-8">
      {bars.map((height, index) => (
        <div
          key={index}
          className={`waveform-bar ${isAnimating ? 'animate-wave' : ''}`}
          style={{ 
            height: `${Math.max(10, height * 100)}%`,
            animationDelay: `${index * 0.05}s`
          }}
        />
      ))}
    </div>
  );
};

export default Waveform;
