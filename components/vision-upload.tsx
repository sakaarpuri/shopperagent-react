'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnalysisResult {
  items: Array<{ type: string; color: string; style: string }>;
  overallStyle: string[];
  colorPalette: string[];
}

interface VisionUploadProps {
  onAnalysis: (analysis: AnalysisResult) => void;
}

export function VisionUpload({ onAnalysis }: VisionUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    }
  }, []);

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    analyzeImage();
  };

  const analyzeImage = async () => {
    setIsAnalyzing(true);
    
    // Simulate API call - in production this would call OpenAI Vision
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockAnalysis = {
      items: [
        { type: 'Wool coat', color: 'Camel', style: 'minimalist' },
        { type: 'Trousers', color: 'Black', style: 'business' },
        { type: 'Leather boots', color: 'Brown', style: 'classic' }
      ],
      overallStyle: ['minimalist', 'business', 'luxury'],
      colorPalette: ['#c4a77d', '#1a1a1a', '#4a4a4a', '#8b7355']
    };
    
    setAnalysis(mockAnalysis);
    onAnalysis(mockAnalysis);
    setIsAnalyzing(false);
  };

  const clearImage = () => {
    setPreview(null);
    setAnalysis(null);
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={cn(
              "relative border-2 border-dashed rounded-3xl p-16 text-center transition-all duration-500 cursor-pointer",
              "bg-surface/30 hover:bg-surface/50",
              isDragging ? "border-accent bg-accent/5" : "border-surface-hover"
            )}
          >
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-accent" />
              </div>
              <div>
                <p className="text-lg font-medium mb-1">Drop a photo or click to upload</p>
                <p className="text-muted text-sm">JPG, PNG up to 10MB</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-3xl overflow-hidden"
          >
            <img
              src={preview}
              alt="Uploaded style"
              className="w-full h-80 object-cover"
            />
            <button
              onClick={clearImage}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            {isAnalyzing && (
              <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-accent" />
                  <p className="text-sm font-medium">Analyzing your style...</p>
                </div>
              </div>
            )}
            
            {analysis && !isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background/90 to-transparent"
              >
                <div className="flex flex-wrap gap-2 mb-3">
                  {analysis.overallStyle.map(style => (
                    <span key={style} className="px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-medium uppercase tracking-wider">
                      {style}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  {analysis.colorPalette.map((color, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-surface-hover"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}