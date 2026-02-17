'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Lock, Unlock, Search, X } from 'lucide-react';
import { LUXURY_BRANDS } from '@/lib/catalog';
import { cn } from '@/lib/utils';
import type { Brand } from '@/types';

interface BrandPickerProps {
  selectedBrands: string[];
  strictMode: boolean;
  onBrandsChange: (brands: string[]) => void;
  onStrictModeChange: (strict: boolean) => void;
}

export function BrandPicker({
  selectedBrands,
  strictMode,
  onBrandsChange,
  onStrictModeChange
}: BrandPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);

  const toggleBrand = (brandId: string) => {
    if (selectedBrands.includes(brandId)) {
      onBrandsChange(selectedBrands.filter((id) => id !== brandId));
    } else {
      onBrandsChange([...selectedBrands, brandId]);
    }
  };

  const filteredBrands = LUXURY_BRANDS.filter(
    (brand) =>
      brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.aesthetic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedBrandObjects = LUXURY_BRANDS.filter((b) =>
    selectedBrands.includes(b.id)
  );

  return (
    <div className="space-y-6">
      {/* Header with Strict Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold mb-1">Choose Your Brands</h3>
          <p className="text-muted text-sm">
            Select favorites, or skip to see options across all brands
          </p>
        </div>

        {/* Strict Mode Toggle */}
        <div className="flex items-center gap-3 bg-surface/50 rounded-full p-1">
          <button
            onClick={() => onStrictModeChange(false)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
              !strictMode
                ? "bg-accent text-background"
                : "text-muted hover:text-foreground"
            )}
          >
            <Unlock className="w-4 h-4" />
            Flexible
          </button>
          <button
            onClick={() => onStrictModeChange(true)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
              strictMode
                ? "bg-accent text-background"
                : "text-muted hover:text-foreground"
            )}
          >
            <Lock className="w-4 h-4" />
            Strict
          </button>
        </div>
      </div>

      {/* Mode Explanation */}
      <div className="glass-panel p-4">
        <p className={cn("text-sm", strictMode ? "text-accent" : "text-muted")}>
          {strictMode ? (
            <>
              <span className="font-medium">Strict mode:</span> Only showing items from your selected brands. 
              {selectedBrands.length === 0 && " Select at least one brand to see results."}
            </>
          ) : (
            <>
              <span className="font-medium">Flexible mode:</span> Prioritizing your selected brands, 
              but may include similar items from other brands when needed.
            </>
          )}
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
        <input
          type="text"
          placeholder="Search brands or aesthetics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-surface border border-surface-hover rounded-xl 
                     text-foreground placeholder:text-muted
                     focus:outline-none focus:border-accent/50 transition-colors"
        />
      </div>

      {/* Selected Brands Chips */}
      <AnimatePresence>
        {selectedBrands.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2"
          >
            {selectedBrandObjects.map((brand) => (
              <motion.button
                key={brand.id}
                layout
                onClick={() => toggleBrand(brand.id)}
                className="flex items-center gap-2 px-3 py-1.5 bg-accent/20 text-accent 
                           rounded-full text-sm font-medium hover:bg-accent/30 transition-colors"
              >
                <span>{brand.name}</span>
                <X className="w-3 h-3" />
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Brand Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBrands.map((brand, index) => {
          const isSelected = selectedBrands.includes(brand.id);
          const isHovered = hoveredBrand === brand.id;

          return (
            <motion.button
              key={brand.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => toggleBrand(brand.id)}
              onMouseEnter={() => setHoveredBrand(brand.id)}
              onMouseLeave={() => setHoveredBrand(null)}
              className={cn(
                "relative overflow-hidden rounded-xl text-left transition-all duration-300 group",
                "aspect-square",
                isSelected
                  ? "ring-2 ring-accent shadow-lg"
                  : "ring-1 ring-surface-hover hover:ring-accent/30"
              )}
            >
              {/* Background */}
              <img
                src={brand.image}
                alt={brand.name}
                className={cn(
                  "absolute inset-0 w-full h-full object-cover transition-all duration-500",
                  isSelected ? "opacity-60" : "opacity-40",
                  isHovered && "scale-105 opacity-50"
                )}
              />

              {/* Overlay */}
              <div
                className={cn(
                  "absolute inset-0 transition-colors duration-300",
                  isSelected
                    ? "bg-gradient-to-t from-background via-background/80 to-background/40"
                    : "bg-gradient-to-t from-background via-background/90 to-background/60"
                )}
              />

              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-accent 
                             flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-background" />
                </motion.div>
              )}

              {/* Content */}
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <span className="text-xs text-accent uppercase tracking-wider mb-1">
                  {brand.aesthetic}
                </span>
                <h4 className="font-semibold text-sm mb-1">{brand.name}</h4>
                <p className="text-xs text-muted line-clamp-2">{brand.description}</p>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium",
                    brand.priceRange === 'luxury' && "text-accent",
                    brand.priceRange === 'mid' && "text-foreground/70",
                    brand.priceRange === 'budget' && "text-muted"
                  )}
                >
                  {brand.priceRange === 'luxury' && '$$$'}
                  {brand.priceRange === 'mid' && '$$'}
                  {brand.priceRange === 'budget' && '$'}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredBrands.length === 0 && (
        <div className="text-center py-12 text-muted">
          <p>No brands match &ldquo;{searchQuery}&rdquo;</p>
        </div>
      )}
    </div>
  );
}