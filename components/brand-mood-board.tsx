'use client';

import { useState } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { LUXURY_BRANDS } from '@/lib/catalog';
import { cn } from '@/lib/utils';
import { GripVertical, Plus, X } from 'lucide-react';

interface BrandMoodBoardProps {
  mode: 'pure' | 'mix';
  selectedBrands: string[];
  onChange: (brands: string[]) => void;
  mixRatios?: Record<string, number>;
  onRatiosChange?: (ratios: Record<string, number>) => void;
}

export function BrandMoodBoard({ 
  mode, 
  selectedBrands, 
  onChange,
  mixRatios = {},
  onRatiosChange
}: BrandMoodBoardProps) {
  const [isDragging, setIsDragging] = useState<string | null>(null);

  const toggleBrand = (brandId: string) => {
    if (mode === 'pure') {
      // Pure mode: single select
      onChange(selectedBrands.includes(brandId) ? [] : [brandId]);
    } else {
      // Mix mode: multi select up to 3
      if (selectedBrands.includes(brandId)) {
        onChange(selectedBrands.filter(id => id !== brandId));
      } else if (selectedBrands.length < 3) {
        const newBrands = [...selectedBrands, brandId];
        onChange(newBrands);
        // Initialize equal ratios
        if (onRatiosChange) {
          const equalRatio = Math.floor(100 / newBrands.length);
          const ratios: Record<string, number> = {};
          newBrands.forEach((id, i) => {
            ratios[id] = i === newBrands.length - 1 
              ? 100 - (equalRatio * (newBrands.length - 1))
              : equalRatio;
          });
          onRatiosChange(ratios);
        }
      }
    }
  };

  const updateRatio = (brandId: string, value: number) => {
    if (!onRatiosChange) return;
    
    const otherBrands = selectedBrands.filter(id => id !== brandId);
    const remaining = 100 - value;
    
    if (otherBrands.length === 0) {
      onRatiosChange({ [brandId]: 100 });
      return;
    }
    
    const newRatios: Record<string, number> = { [brandId]: value };
    const sharePerBrand = Math.floor(remaining / otherBrands.length);
    
    otherBrands.forEach((id, i) => {
      newRatios[id] = i === otherBrands.length - 1
        ? remaining - (sharePerBrand * (otherBrands.length - 1))
        : sharePerBrand;
    });
    
    onRatiosChange(newRatios);
  };

  return (
    <div className="space-y-6">
      {/* Mode indicator */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <span className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            mode === 'pure' ? "bg-accent text-background" : "bg-surface text-muted"
          )}>
            Pure Aesthetic
          </span>
          <span className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            mode === 'mix' ? "bg-accent text-background" : "bg-surface text-muted"
          )}>
            Mix & Blend
          </span>
        </div>
        {mode === 'mix' && selectedBrands.length > 0 && (
          <span className="text-sm text-muted">
            {selectedBrands.length}/3 brands
          </span>
        )}
      </div>

      {/* Brand Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {LUXURY_BRANDS.map((brand) => {
          const isSelected = selectedBrands.includes(brand.id);
          const ratio = mixRatios[brand.id] || 0;
          
          return (
            <motion.button
              key={brand.id}
              onClick={() => toggleBrand(brand.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "relative overflow-hidden rounded-2xl text-left transition-all duration-500",
                "aspect-[4/5] group",
                isSelected 
                  ? "ring-2 ring-accent shadow-[0_0_30px_rgba(196,167,125,0.2)]" 
                  : "ring-1 ring-surface-hover hover:ring-surface-hover/50"
              )}
            >
              {/* Background Image */}
              <img
                src={brand.image}
                alt={brand.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Overlay */}
              <div className={cn(
                "absolute inset-0 transition-colors duration-500",
                isSelected 
                  ? "bg-gradient-to-t from-background/90 via-background/50 to-transparent" 
                  : "bg-gradient-to-t from-background/80 via-background/40 to-transparent group-hover:from-background/70"
              )} />
              
              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 w-6 h-6 rounded-full bg-accent flex items-center justify-center"
                >
                  <span className="text-background text-sm">✓</span>
                </motion.div>
              )}
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-xs text-accent uppercase tracking-wider mb-1">{brand.aesthetic}</p>
                <h3 className="text-lg font-semibold mb-1">{brand.name}</h3>
                <p className="text-xs text-muted line-clamp-2">{brand.description}</p>
                
                {mode === 'mix' && isSelected && ratio > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted">Blend</span>
                      <span className="text-accent">{ratio}%</span>
                    </div>
                    <div className="h-1 bg-surface rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${ratio}%` }}
                        className="h-full bg-accent"
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Mix ratio sliders */}
      {mode === 'mix' && selectedBrands.length > 1 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass-panel p-6 space-y-4"
        >
          <h4 className="text-sm font-medium text-muted uppercase tracking-wider">Adjust Blend</h4>
          {selectedBrands.map(brandId => {
            const brand = LUXURY_BRANDS.find(b => b.id === brandId);
            if (!brand) return null;
            
            return (
              <div key={brandId} className="flex items-center gap-4">
                <span className="w-24 text-sm font-medium">{brand.name}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={mixRatios[brandId] || 0}
                  onChange={(e) => updateRatio(brandId, parseInt(e.target.value))}
                  className="flex-1 h-1 bg-surface rounded-full appearance-none cursor-pointer accent-accent"
                />
                <span className="w-12 text-right text-sm text-accent">{mixRatios[brandId] || 0}%</span>
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}