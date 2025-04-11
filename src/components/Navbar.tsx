
import React from 'react';
import { Headphones } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="w-full border-b border-border py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Headphones className="h-6 w-6 text-beat-purple" />
          <span className="text-xl font-bold">Beat Detective</span>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cómo Funciona</a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Acerca De</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
