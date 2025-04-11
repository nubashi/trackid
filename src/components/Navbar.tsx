
import React from 'react';
import { Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <nav className="w-full border-b border-border py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-beat-vibrantPurple rounded-lg flex items-center justify-center">
            <Headphones className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">Beat Detective</span>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cómo Funciona</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Acerca De</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contacto</a>
          </div>
          <Button className="bg-beat-vibrantPurple hover:bg-beat-vibrantPurple/90 text-white">
            Iniciar
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
