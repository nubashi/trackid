
import React, { useState } from 'react';
import { Upload, FileAudio, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelected, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    if (files.length) {
      const file = files[0];
      const validTypes = ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/wave', 'audio/x-m4a', 'audio/mp3'];
      
      if (validTypes.includes(file.type)) {
        setSelectedFile(file);
        onFileSelected(file);
      } else {
        toast.error("Por favor selecciona un archivo de audio válido (MP3, WAV, M4A)");
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${
          dragActive ? "border-beat-purple bg-beat-purple/5" : "border-border"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          {selectedFile ? (
            <div className="flex items-center justify-center mb-4 w-16 h-16 rounded-full bg-beat-purple/20">
              <FileAudio className="h-8 w-8 text-beat-purple" />
            </div>
          ) : (
            <div className="flex items-center justify-center mb-4 w-16 h-16 rounded-full bg-muted">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          
          <h3 className="text-lg font-medium">
            {selectedFile ? selectedFile.name : "Arrastra o selecciona tu beat"}
          </h3>
          
          {selectedFile ? (
            <p className="text-sm text-muted-foreground">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          ) : (
            <p className="text-sm text-muted-foreground max-w-md">
              Sube tu archivo de audio (MP3, WAV, M4A) para verificar si está siendo utilizado en plataformas de streaming
            </p>
          )}
          
          <div className="flex gap-3 mt-4">
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="audio/mpeg, audio/wav, audio/x-wav, audio/wave, audio/x-m4a"
                onChange={handleChange}
                disabled={isLoading}
              />
              <Button 
                variant={selectedFile ? "outline" : "default"} 
                disabled={isLoading}
              >
                {selectedFile ? "Cambiar archivo" : "Seleccionar archivo"}
              </Button>
            </label>
            
            {selectedFile && (
              <Button 
                variant="default" 
                onClick={() => onFileSelected(selectedFile)}
                disabled={isLoading}
              >
                {isLoading ? "Analizando..." : "Analizar beat"}
              </Button>
            )}
          </div>
          
          {!selectedFile && (
            <div className="flex items-center mt-6 text-xs text-muted-foreground">
              <AlertCircle className="h-3 w-3 mr-1" />
              <span>Archivos soportados: MP3, WAV, M4A (máximo 10MB)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
