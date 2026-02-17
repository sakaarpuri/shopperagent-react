'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InspirationBoards } from '@/components/inspiration-boards';
import { BrandPicker } from '@/components/brand-picker';
import { CURATED_PRODUCTS, matchProducts, generateMatchExplanation } from '@/lib/catalog';
import { STYLE_OPTIONS } from '@/lib/catalog';
import { cn, formatPrice } from '@/lib/utils';
import { 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Check,
  ExternalLink,
  RefreshCw,
  Heart
} from 'lucide-react';
import type { StyleInspiration, Product } from '@/types';

type Step = 'inspiration' | 'brands' | 'preferences' | 'results';

export default function Home() {
  const [step, setStep] = useState<Step>('inspiration');
  const [selectedInspiration, setSelectedInspiration] = useState<StyleInspiration | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [strictBrands, setStrictBrands] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [budget, setBudget] = useState(500);
  const [gender, setGender] = useState<'womens' | 'mens' | 'unisex'>('womens');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<Product[]>([]);

  // Pre-populate from inspiration selection
  const handleInspirationSelect = (inspiration: StyleInspiration) => {
    setSelectedInspiration(inspiration);
    
    if (inspiration.id !== 'custom') {
      // Pre-fill from inspiration
      setSelectedStyles(inspiration.tags);
      setSelectedBrands(inspiration.brands);
    }
    
    setStep('brands');
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Simulate processing time for effect
    setTimeout(() => {
      const matched = matchProducts(CURATED_PRODUCTS, {
        styles: selectedStyles,
        brands: selectedBrands,
        budget,
        gender,
        categories: [], // All categories
        strictBrands: strictBrands && selectedBrands.length > 0
      });
      
      setResults(matched.slice(0, 8)); // Top 8 results
      setIsGenerating(false);
      setStep('results');
    }, 1500);
  };

  const canProceed = useMemo(() => {
    if (step === 'brands') return true; // Can skip brands
    if (step === 'preferences') return selectedStyles.length > 0;
    return true;
  }, [step, selectedStyles]);

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-surface-hover">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-background" />
            </div>
            <span className="font-semibold text-lg tracking-tight">ShopperAgent</span>
          </div>
          
          {/* Progress Steps */}
          <div className="hidden md:flex items-center gap-2">
            {[
              { id: 'inspiration', label: 'Inspiration' },
              { id: 'brands', label: 'Brands' },
              { id: 'preferences', label: 'Style' },
              { id: 'results', label: 'Cart' }
            ].map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  step === s.id ? "bg-accent text-background" :
                  ['results', 'preferences', 'brands'].includes(step) && i < ['inspiration', 'brands', 'preferences', 'results'].indexOf(step) 
                    ? "bg-accent/20 text-accent" 
                    : "bg-surface text-muted"
                )}>
                  {i + 1}
                </div>
                {i < 3 && <div className="w-8 h-px bg-surface-hover mx-2" />}
              </div>
            ))}
          </div>

          <button className="luxury-button text-sm py-2 px-4">
            Sign In
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-16">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <AnimatePresence mode="wait">
            {/* Inspiration Step */}
            {step === 'inspiration' && (
              <motion.div
                key="inspiration"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <InspirationBoards 
                  onSelect={handleInspirationSelect}
                  selectedId={selectedInspiration?.id}
                />
              </motion.div>
            )}

            {/* Brands Step */}
            {step === 'brands' && (
              <motion.div
                key="brands"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => setStep('inspiration')}
                    className="flex items-center gap-2 text-muted hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                </div>

                <BrandPicker
                  selectedBrands={selectedBrands}
                  strictMode={strictBrands}
                  onBrandsChange={setSelectedBrands}
                  onStrictModeChange={setStrictBrands}
                />

                <div className="flex justify-end">
                  <button
                    onClick={() => setStep('preferences')}
                    className="luxury-button flex items-center gap-2"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Preferences Step */}
            {step === 'preferences' && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => setStep('brands')}
                    className="flex items-center gap-2 text-muted hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Style Selection */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Select Your Style</h3>
                      <p className="text-muted text-sm">Choose one or more aesthetics</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {STYLE_OPTIONS.map((style) => {
                        const isSelected = selectedStyles.includes(style.id);
                        return (
                          <button
                            key={style.id}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedStyles(selectedStyles.filter(s => s !== style.id));
                              } else {
                                setSelectedStyles([...selectedStyles, style.id]);
                              }
                            }}
                            className={cn(
                              "p-4 rounded-xl border text-left transition-all duration-300",
                              isSelected
                                ? "border-accent bg-accent/10"
                                : "border-surface-hover hover:border-accent/30 bg-surface/30"
                            )}
                          >
                            <span className="text-2xl mb-2 block">{style.icon}</span>
                            <h4 className="font-medium text-sm mb-1">{style.label}</h4>
                            <p className="text-xs text-muted">{style.description}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Budget & Gender */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Budget & Preferences</h3>
                      <p className="text-muted text-sm">Set your parameters</p>
                    </div>

                    {/* Gender */}
                    <div className="glass-panel p-6">
                      <label className="text-sm text-muted uppercase tracking-wider mb-4 block">
                        Gender
                      </label>
                      <div className="flex gap-2">
                        {(['womens', 'mens', 'unisex'] as const).map((g) => (
                          <button
                            key={g}
                            onClick={() => setGender(g)}
                            className={cn(
                              "flex-1 py-3 rounded-xl text-sm font-medium transition-all",
                              gender === g
                                ? "bg-accent text-background"
                                : "bg-surface text-muted hover:text-foreground"
                            )}
                          >
                            {g.charAt(0).toUpperCase() + g.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Budget */}
                    <div className="glass-panel p-6">
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm text-muted uppercase tracking-wider">
                          Budget
                        </label>
                        <span className="text-2xl font-semibold text-accent">
                          {formatPrice(budget)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="3000"
                        step="50"
                        value={budget}
                        onChange={(e) => setBudget(parseInt(e.target.value))}
                        className="w-full h-2 bg-surface rounded-full appearance-none cursor-pointer accent-accent"
                      />
                      <div className="flex justify-between mt-2 text-xs text-muted">
                        <span>$50</span>
                        <span>$3,000+</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleGenerate}
                    disabled={selectedStyles.length === 0 || isGenerating}
                    className={cn(
                      "luxury-button flex items-center gap-3 text-lg px-12 py-5",
                      (selectedStyles.length === 0 || isGenerating) && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Curating Your Cart...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate Cart
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Results Step */}
            {step === 'results' && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-semibold mb-2">Your Curated Cart</h2>
                    <p className="text-muted">
                      {results.length} items selected based on your preferences
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setStep('inspiration');
                      setResults([]);
                      setSelectedInspiration(null);
                    }}
                    className="flex items-center gap-2 text-muted hover:text-foreground transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Start Over
                  </button>
                </div>

                {/* Results Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {results.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-panel overflow-hidden group card-hover"
                    >
                      <div className="flex">
                        <div className="w-32 h-32 bg-surface flex-shrink-0 overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <div className="p-5 flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="text-xs text-accent uppercase tracking-wider mb-1">
                                {product.brand}
                              </p>
                              <h3 className="font-medium mb-1 truncate">{product.name}</h3>
                              <p className="text-sm text-muted truncate">{product.retailer}</p>
                            </div>
                            <span className="font-semibold flex-shrink-0">
                              {formatPrice(product.price)}
                            </span>
                          </div>
                          
                          {/* Match explanation */}
                          <p className="mt-3 text-xs text-muted">
                            {generateMatchExplanation(product, { styles: selectedStyles, brands: selectedBrands })}
                          </p>
                          
                          {/* Actions */}
                          <div className="mt-4 flex items-center gap-3">
                            <a
                              href={product.productUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sm text-accent hover:underline"
                            >
                              View
                              <ExternalLink className="w-3 h-3" />
                            </a>
                            <button className="p-2 rounded-full hover:bg-surface transition-colors ml-auto">
                              <Heart className="w-4 h-4 text-muted" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Summary */}
                <div className="glass-panel p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted mb-1">Total Estimate</p>
                      <p className="text-3xl font-semibold">
                        {formatPrice(results.reduce((acc, p) => acc + p.price, 0))}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button className="px-6 py-3 rounded-full border border-surface-hover hover:bg-surface transition-colors">
                        Save Cart
                      </button>
                      <button className="luxury-button">
                        Checkout All
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}