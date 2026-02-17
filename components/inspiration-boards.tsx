'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { INSPIRATION_BOARDS } from '@/lib/catalog';
import { cn } from '@/lib/utils';
import type { StyleInspiration } from '@/types';

interface InspirationBoardsProps {
  onSelect: (inspiration: StyleInspiration) => void;
  selectedId?: string;
}

export function InspirationBoards({ onSelect, selectedId }: InspirationBoardsProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm mb-6">
          <Sparkles className="w-4 h-4" />
          <span>Curated Collections</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold mb-4 tracking-tight">
          Find Your <span className="text-gradient">Aesthetic</span>
        </h2>
        <p className="text-muted text-lg">
          Start with a curated mood board, or build your own from scratch
        </p>
      </div>

      {/* Boards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INSPIRATION_BOARDS.map((board, index) => {
          const isSelected = selectedId === board.id;
          const isHovered = hoveredId === board.id;

          return (
            <motion.button
              key={board.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelect(board)}
              onMouseEnter={() => setHoveredId(board.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={cn(
                "relative overflow-hidden rounded-2xl text-left transition-all duration-500 group",
                "aspect-[4/5]",
                isSelected
                  ? "ring-2 ring-accent shadow-[0_0_40px_rgba(196,167,125,0.3)]"
                  : "ring-1 ring-surface-hover hover:ring-accent/50"
              )}
            >
              {/* Background Image */}
              <img
                src={board.image}
                alt={board.name}
                className={cn(
                  "absolute inset-0 w-full h-full object-cover transition-transform duration-700",
                  isHovered && "scale-105"
                )}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {board.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full text-xs font-medium text-foreground/90 capitalize"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-semibold mb-2 text-white">
                  {board.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-white/70 mb-4 line-clamp-2">
                  {board.description}
                </p>

                {/* Action */}
                <div
                  className={cn(
                    "flex items-center gap-2 text-accent font-medium text-sm transition-all duration-300",
                    isHovered ? "translate-x-2" : ""
                  )}
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Selected Indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-accent flex items-center justify-center"
                >
                  <svg className="w-5 h-5 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}

              {/* Hover Glow */}
              <div
                className={cn(
                  "absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none",
                  isHovered && "opacity-100"
                )}
                style={{
                  background: 'radial-gradient(circle at 50% 100%, rgba(196,167,125,0.15) 0%, transparent 70%)'
                }}
              />
            </motion.button>
          );
        })}
      </div>

      {/* Custom Option */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        onClick={() => onSelect({ id: 'custom', name: 'Custom', description: '', image: '', tags: [], brands: [], products: [] })}
        className={cn(
          "w-full py-6 rounded-2xl border-2 border-dashed transition-all duration-300",
          "border-surface-hover hover:border-accent/50 hover:bg-accent/5",
          selectedId === 'custom' && "border-accent bg-accent/10"
        )}
      >
        <span className="text-muted hover:text-foreground font-medium">
          Or build your own look from scratch →
        </span>
      </motion.button>
    </div>
  );
}