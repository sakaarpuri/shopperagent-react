'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CURATED_PRODUCTS, matchProducts, generateMatchExplanation, POPULAR_BRANDS } from '@/lib/catalog';
import { STYLE_OPTIONS } from '@/lib/catalog';
import { cn, formatPrice } from '@/lib/utils';
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Heart,
  Search,
  Zap,
  Bot,
  GalleryVerticalEnd,
  Loader2
} from 'lucide-react';
import type { Product, UserPreferences } from '@/types';

type Step = 'landing' | 'gender' | 'categories' | 'style' | 'budget' | 'brands' | 'results';

type CategoryId = 'tops' | 'bottoms' | 'outerwear' | 'shoes' | 'accessories' | 'dresses';
type SizeCategory = 'tops' | 'bottoms' | 'outerwear' | 'shoes' | 'dresses';
type Occasion = 'everyday' | 'work' | 'date-night' | 'event' | 'travel' | 'workout';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1520975943522-8e2f1d3b9d2f?w=400&h=400&fit=crop';

const CATEGORIES: Array<{ id: CategoryId; label: string; icon: string }> = [
  { id: 'tops', label: 'Tops', icon: '👕' },
  { id: 'bottoms', label: 'Bottoms', icon: '👖' },
  { id: 'outerwear', label: 'Outerwear', icon: '🧥' },
  { id: 'shoes', label: 'Shoes', icon: '👟' },
  { id: 'accessories', label: 'Accessories', icon: '👜' },
  { id: 'dresses', label: 'Dresses', icon: '👗' }
];

const SIZE_OPTIONS: Record<SizeCategory, string[]> = {
  tops: ['XS', 'S', 'M', 'L', 'XL'],
  bottoms: ['24', '26', '28', '30', '32', '34', '36'],
  outerwear: ['XS', 'S', 'M', 'L', 'XL'],
  shoes: ['6', '7', '8', '9', '10', '11', '12'],
  dresses: ['XS', 'S', 'M', 'L', 'XL']
};

const OCCASIONS: Array<{ id: Occasion; label: string; hint: string }> = [
  { id: 'everyday', label: 'Everyday', hint: 'Versatile staples' },
  { id: 'work', label: 'Work', hint: 'Polished and practical' },
  { id: 'date-night', label: 'Date Night', hint: 'Elevated and expressive' },
  { id: 'event', label: 'Event', hint: 'Statement-ready looks' },
  { id: 'travel', label: 'Travel', hint: 'Comfort + mix-and-match' },
  { id: 'workout', label: 'Workout', hint: 'Performance first' }
];

const SCAN_STAGES = [
  'Parsing your preferences',
  'Analyzing style compatibility vectors',
  'Filtering by fit, category, and budget',
  'Balancing brand, quality, and versatility',
  'Building your cart'
];

const INSPIRATION_BOARDS = [
  {
    id: 'city-minimal',
    title: 'City Minimal',
    description: 'Clean silhouettes, quiet neutrals, polished basics.',
    styles: ['minimalist', 'classic'],
    categories: ['tops', 'bottoms', 'outerwear', 'shoes'],
    brands: ['cos', 'everlane'],
    budget: 220,
    gender: 'womens' as const,
    occasion: 'everyday' as Occasion
  },
  {
    id: 'off-duty',
    title: 'Off-Duty Sport',
    description: 'Athleisure-driven layers with casual comfort.',
    styles: ['athleisure', 'casual'],
    categories: ['tops', 'bottoms', 'shoes', 'outerwear'],
    brands: ['nike', 'lululemon'],
    budget: 180,
    gender: 'unisex' as const,
    occasion: 'workout' as Occasion
  },
  {
    id: 'modern-romantic',
    title: 'Modern Romantic',
    description: 'Soft textures and dress-forward styling.',
    styles: ['romantic', 'trendy'],
    categories: ['dresses', 'shoes', 'accessories', 'outerwear'],
    brands: ['reformation', 'shopbop'],
    budget: 260,
    gender: 'womens' as const,
    occasion: 'date-night' as Occasion
  }
];

export default function Home() {
  const [step, setStep] = useState<Step>('landing');
  const [skipBrands, setSkipBrands] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);

  const [preferences, setPreferences] = useState<UserPreferences>({
    gender: '',
    categories: [],
    styles: [],
    brands: [],
    budget: 300,
    strictBrands: false,
    mode: 'pure',
    occasion: '',
    sizes: {}
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<Product[]>([]);

  const scanIntervalRef = useRef<number | null>(null);
  const scanTimeoutRef = useRef<number | null>(null);

  const clearGenerationTimers = () => {
    if (scanIntervalRef.current !== null) {
      window.clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (scanTimeoutRef.current !== null) {
      window.clearTimeout(scanTimeoutRef.current);
      scanTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearGenerationTimers();
  }, []);

  const sizeRequiredCategories = useMemo(() => {
    return preferences.categories.filter((cat): cat is SizeCategory => cat in SIZE_OPTIONS);
  }, [preferences.categories]);

  const missingSizeCategories = useMemo(() => {
    return sizeRequiredCategories.filter(cat => !preferences.sizes?.[cat]);
  }, [sizeRequiredCategories, preferences.sizes]);

  const demoProducts = useMemo(() => CURATED_PRODUCTS.slice(0, 4), []);

  const toggleCategory = (catId: CategoryId) => {
    setPreferences(prev => {
      const exists = prev.categories.includes(catId);
      const nextCategories = exists
        ? prev.categories.filter(c => c !== catId)
        : [...prev.categories, catId];
      const nextSizes = { ...(prev.sizes || {}) };
      if (exists && catId in SIZE_OPTIONS) {
        delete nextSizes[catId as SizeCategory];
      }
      return {
        ...prev,
        categories: nextCategories,
        sizes: nextSizes
      };
    });
  };

  const setCategorySize = (category: SizeCategory, size: string) => {
    setPreferences(prev => ({
      ...prev,
      sizes: {
        ...(prev.sizes || {}),
        [category]: size
      }
    }));
  };

  const runGeneration = (snapshot: UserPreferences) => {
    clearGenerationTimers();
    setIsGenerating(true);
    setScanStepIndex(0);

    scanIntervalRef.current = window.setInterval(() => {
      setScanStepIndex(prev => (prev < SCAN_STAGES.length - 1 ? prev + 1 : prev));
    }, 850);

    scanTimeoutRef.current = window.setTimeout(() => {
      const matched = matchProducts(CURATED_PRODUCTS, {
        styles: snapshot.styles,
        brands: snapshot.brands,
        budget: snapshot.budget,
        gender: snapshot.gender,
        categories: snapshot.categories,
        strictBrands: snapshot.strictBrands && snapshot.brands.length > 0,
        occasion: snapshot.occasion,
        sizes: snapshot.sizes || {}
      });

      setResults(matched.slice(0, 8));
      setIsGenerating(false);
      clearGenerationTimers();
      setStep('results');
    }, 4300);
  };

  const handleGenerate = (snapshot?: UserPreferences) => {
    const source = snapshot || preferences;
    runGeneration(source);
  };

  const applyInspirationBoard = (boardId: string, instantGenerate: boolean) => {
    const board = INSPIRATION_BOARDS.find(item => item.id === boardId);
    if (!board) return;

    const boardPrefs: UserPreferences = {
      ...preferences,
      gender: board.gender,
      categories: board.categories,
      styles: board.styles,
      budget: board.budget,
      brands: board.brands,
      strictBrands: false,
      mode: 'mix',
      occasion: board.occasion,
      sizes: {}
    };

    setPreferences(boardPrefs);
    setSkipBrands(false);

    if (instantGenerate) {
      handleGenerate(boardPrefs);
    } else {
      setStep('categories');
    }
  };

  const runStarterCart = () => {
    const starter: UserPreferences = {
      ...preferences,
      gender: 'womens',
      categories: ['tops', 'bottoms', 'shoes', 'outerwear'],
      styles: ['minimalist', 'casual'],
      brands: [],
      budget: 200,
      strictBrands: false,
      mode: 'pure',
      occasion: 'everyday',
      sizes: {}
    };
    setPreferences(starter);
    handleGenerate(starter);
  };

  const canProceed = useMemo(() => {
    if (step === 'gender') return !!preferences.gender;
    if (step === 'categories') return preferences.categories.length > 0 && missingSizeCategories.length === 0;
    if (step === 'style') return preferences.styles.length > 0 && !!preferences.occasion;
    return true;
  }, [step, preferences, missingSizeCategories]);

  const nextStep = () => {
    const steps: Step[] = ['landing', 'gender', 'categories', 'style', 'budget', 'brands', 'results'];
    const currentIdx = steps.indexOf(step);
    if (step === 'budget' && skipBrands) {
      handleGenerate();
    } else if (currentIdx < steps.length - 1) {
      setStep(steps[currentIdx + 1]);
    }
  };

  const prevStep = () => {
    const steps: Step[] = ['landing', 'gender', 'categories', 'style', 'budget', 'brands', 'results'];
    const currentIdx = steps.indexOf(step);
    if (currentIdx > 0) {
      setStep(steps[currentIdx - 1]);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-surface-hover">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Bot className="w-4 h-4 text-background" />
            </div>
            <span className="font-semibold text-lg tracking-tight">ShopperAgent</span>
          </div>

          {step !== 'landing' && (
            <button
              onClick={() => setStep('landing')}
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              Start Over
            </button>
          )}
        </div>
      </header>

      <div className="pt-16">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <AnimatePresence mode="wait">
            {step === 'landing' && (
              <motion.div
                key="landing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-12"
              >
                <div className="min-h-[40vh] flex flex-col items-center justify-center text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm mb-8"
                  >
                    <Bot className="w-4 h-4" />
                    <span>AI Personal Shopper</span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl md:text-6xl font-semibold tracking-tight mb-6"
                  >
                    Your AI Shops<br />
                    <span className="text-gradient">With Better Matching</span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl text-muted mb-8 max-w-3xl"
                  >
                    Guided preferences, inspiration boards, and scan-time transparency for higher-quality matches.
                  </motion.p>

                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <motion.button
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      onClick={() => setStep('gender')}
                      className="luxury-button flex items-center gap-3 text-lg px-10 py-5"
                    >
                      <Zap className="w-5 h-5" />
                      Start Guided Matching
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                    <button
                      onClick={runStarterCart}
                      className="px-6 py-4 rounded-full border border-surface-hover hover:border-accent/40 transition-colors"
                    >
                      Quick Demo Cart
                    </button>
                  </div>
                </div>

                <section className="glass-panel p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-5">
                    <GalleryVerticalEnd className="w-4 h-4 text-accent" />
                    <h3 className="text-xl font-semibold">Inspiration Boards</h3>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    {INSPIRATION_BOARDS.map(board => (
                      <div key={board.id} className="rounded-xl border border-surface-hover bg-surface/50 p-5 space-y-4">
                        <div>
                          <h4 className="font-medium mb-1">{board.title}</h4>
                          <p className="text-sm text-muted">{board.description}</p>
                        </div>
                        <div className="text-xs text-muted">
                          Styles: {board.styles.join(', ')}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => applyInspirationBoard(board.id, false)}
                            className="flex-1 px-3 py-2 rounded-full border border-surface-hover hover:border-accent/40 text-sm transition-colors"
                          >
                            Use Board
                          </button>
                          <button
                            onClick={() => applyInspirationBoard(board.id, true)}
                            className="flex-1 px-3 py-2 rounded-full bg-accent text-background text-sm font-medium"
                          >
                            Instant Match
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="glass-panel p-6 md:p-8">
                  <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
                    <div>
                      <h3 className="text-xl font-semibold">Starter Cart Preview</h3>
                      <p className="text-sm text-muted">A pre-curated set you can generate instantly.</p>
                    </div>
                    <button onClick={runStarterCart} className="luxury-button px-5 py-3 text-sm">
                      Try This Cart
                    </button>
                  </div>
                  <div className="grid md:grid-cols-4 gap-4">
                    {demoProducts.map(product => (
                      <div key={product.id} className="rounded-xl overflow-hidden border border-surface-hover bg-surface/50">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-36 object-cover"
                          onError={e => {
                            const target = e.currentTarget;
                            if (target.src !== FALLBACK_IMAGE) target.src = FALLBACK_IMAGE;
                          }}
                        />
                        <div className="p-3">
                          <p className="text-xs text-accent uppercase tracking-wider">{product.brand}</p>
                          <p className="text-sm truncate">{product.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </motion.div>
            )}

            {step === 'gender' && (
              <motion.div
                key="gender"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 max-w-xl mx-auto"
              >
                <div className="text-center">
                  <span className="text-sm text-muted uppercase tracking-wider">Step 1 of 5</span>
                  <h2 className="text-3xl font-semibold mt-2 mb-3">Who are we shopping for?</h2>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {(['womens', 'mens', 'unisex'] as const).map(g => (
                    <button
                      key={g}
                      onClick={() => setPreferences(prev => ({ ...prev, gender: g }))}
                      className={cn(
                        'p-8 rounded-2xl border text-center transition-all',
                        preferences.gender === g
                          ? 'border-accent bg-accent/10'
                          : 'border-surface-hover hover:border-accent/30 bg-surface/30'
                      )}
                    >
                      <span className="text-4xl mb-3 block">
                        {g === 'womens' && '👩'}
                        {g === 'mens' && '👨'}
                        {g === 'unisex' && '👤'}
                      </span>
                      <span className="font-medium capitalize">{g}</span>
                    </button>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={nextStep}
                    disabled={!canProceed}
                    className={cn('luxury-button flex items-center gap-2', !canProceed && 'opacity-50 cursor-not-allowed')}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'categories' && (
              <motion.div
                key="categories"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 max-w-3xl mx-auto"
              >
                <div className="text-center">
                  <span className="text-sm text-muted uppercase tracking-wider">Step 2 of 5</span>
                  <h2 className="text-3xl font-semibold mt-2 mb-3">What do you need?</h2>
                  <p className="text-muted">Choose categories, then set size for each selected category.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {CATEGORIES.map(cat => {
                    const isSelected = preferences.categories.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className={cn(
                          'p-6 rounded-xl border text-center transition-all',
                          isSelected
                            ? 'border-accent bg-accent/10'
                            : 'border-surface-hover hover:border-accent/30 bg-surface/30'
                        )}
                      >
                        <span className="text-3xl mb-2 block">{cat.icon}</span>
                        <span className="font-medium">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>

                {sizeRequiredCategories.length > 0 && (
                  <div className="glass-panel p-6 space-y-5">
                    <h3 className="font-semibold">Size Details</h3>
                    {sizeRequiredCategories.map(cat => (
                      <div key={cat} className="space-y-2">
                        <p className="text-sm text-muted capitalize">{cat} size</p>
                        <div className="flex flex-wrap gap-2">
                          {SIZE_OPTIONS[cat].map(size => {
                            const selected = preferences.sizes?.[cat] === size;
                            return (
                              <button
                                key={`${cat}-${size}`}
                                onClick={() => setCategorySize(cat, size)}
                                className={cn(
                                  'px-3 py-2 rounded-full text-sm border transition-colors',
                                  selected
                                    ? 'border-accent bg-accent/10 text-foreground'
                                    : 'border-surface-hover hover:border-accent/40 text-muted'
                                )}
                              >
                                {size}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                    {missingSizeCategories.length > 0 && (
                      <p className="text-sm text-accent">Add size for: {missingSizeCategories.join(', ')}</p>
                    )}
                  </div>
                )}

                <div className="flex justify-between">
                  <button onClick={prevStep} className="flex items-center gap-2 text-muted hover:text-foreground">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!canProceed}
                    className={cn('luxury-button flex items-center gap-2', !canProceed && 'opacity-50 cursor-not-allowed')}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'style' && (
              <motion.div
                key="style"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 max-w-3xl mx-auto"
              >
                <div className="text-center">
                  <span className="text-sm text-muted uppercase tracking-wider">Step 3 of 5</span>
                  <h2 className="text-3xl font-semibold mt-2 mb-3">Refine taste and context</h2>
                  <p className="text-muted">Choose the occasion plus one or more style directions.</p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-muted">Occasion</p>
                  <div className="grid md:grid-cols-3 gap-3">
                    {OCCASIONS.map(item => {
                      const selected = preferences.occasion === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setPreferences(prev => ({ ...prev, occasion: item.id }))}
                          className={cn(
                            'p-4 rounded-xl border text-left transition-all',
                            selected
                              ? 'border-accent bg-accent/10'
                              : 'border-surface-hover hover:border-accent/30 bg-surface/30'
                          )}
                        >
                          <p className="font-medium">{item.label}</p>
                          <p className="text-xs text-muted mt-1">{item.hint}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {STYLE_OPTIONS.map(style => {
                    const isSelected = preferences.styles.includes(style.id);
                    return (
                      <button
                        key={style.id}
                        onClick={() => {
                          if (isSelected) {
                            setPreferences(prev => ({
                              ...prev,
                              styles: prev.styles.filter(s => s !== style.id)
                            }));
                          } else {
                            setPreferences(prev => ({
                              ...prev,
                              styles: [...prev.styles, style.id]
                            }));
                          }
                        }}
                        className={cn(
                          'p-5 rounded-xl border text-left transition-all',
                          isSelected
                            ? 'border-accent bg-accent/10'
                            : 'border-surface-hover hover:border-accent/30 bg-surface/30'
                        )}
                      >
                        <span className="text-2xl mb-2 block">{style.icon}</span>
                        <h4 className="font-medium text-sm">{style.label}</h4>
                        <p className="text-xs text-muted mt-1">{style.description}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between">
                  <button onClick={prevStep} className="flex items-center gap-2 text-muted hover:text-foreground">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!canProceed}
                    className={cn('luxury-button flex items-center gap-2', !canProceed && 'opacity-50 cursor-not-allowed')}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'budget' && (
              <motion.div
                key="budget"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 max-w-xl mx-auto"
              >
                <div className="text-center">
                  <span className="text-sm text-muted uppercase tracking-wider">Step 4 of 5</span>
                  <h2 className="text-3xl font-semibold mt-2 mb-3">What's your budget?</h2>
                  <p className="text-muted">Average per item budget target</p>
                </div>

                <div className="glass-panel p-8 text-center">
                  <span className="text-5xl font-semibold text-accent">{formatPrice(preferences.budget)}</span>
                  <p className="text-muted mt-2">per item</p>

                  <input
                    type="range"
                    min="50"
                    max="2000"
                    step="50"
                    value={preferences.budget}
                    onChange={e => setPreferences(prev => ({ ...prev, budget: parseInt(e.target.value, 10) }))}
                    className="w-full mt-8 h-2 bg-surface rounded-full appearance-none cursor-pointer accent-accent"
                  />

                  <div className="flex justify-between mt-4 text-sm text-muted">
                    <span>$50</span>
                    <span>$2000+</span>
                  </div>
                </div>

                <label className="flex items-center gap-3 justify-center text-sm text-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={skipBrands}
                    onChange={e => setSkipBrands(e.target.checked)}
                    className="rounded border-surface-hover"
                  />
                  Skip brand step and generate immediately
                </label>

                <div className="flex justify-between">
                  <button onClick={prevStep} className="flex items-center gap-2 text-muted hover:text-foreground">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button onClick={nextStep} className="luxury-button flex items-center gap-2">
                    {skipBrands ? 'Generate Cart' : 'Continue'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'brands' && (
              <motion.div
                key="brands"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 max-w-4xl mx-auto"
              >
                <div className="text-center">
                  <span className="text-sm text-muted uppercase tracking-wider">Step 5 of 5</span>
                  <h2 className="text-3xl font-semibold mt-2 mb-3">Preferred brands (optional)</h2>
                  <p className="text-muted">Leave blank for broader discovery, or choose favorites.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {POPULAR_BRANDS.map(brand => {
                    const isSelected = preferences.brands.includes(brand.id);
                    return (
                      <button
                        key={brand.id}
                        onClick={() => {
                          if (isSelected) {
                            setPreferences(prev => ({ ...prev, brands: prev.brands.filter(b => b !== brand.id) }));
                          } else {
                            setPreferences(prev => ({ ...prev, brands: [...prev.brands, brand.id] }));
                          }
                        }}
                        className={cn(
                          'p-3 rounded-xl border text-left transition-all',
                          isSelected
                            ? 'border-accent bg-accent/10'
                            : 'border-surface-hover hover:border-accent/30 bg-surface/30'
                        )}
                      >
                        <span className="font-medium text-sm">{brand.name}</span>
                        <span className="block text-xs text-muted mt-1">{brand.priceRange}</span>
                      </button>
                    );
                  })}
                </div>

                {preferences.brands.length > 0 && (
                  <div className="text-center">
                    <p className="text-sm text-accent mb-2">
                      {preferences.brands.length} brand{preferences.brands.length > 1 ? 's' : ''} selected
                    </p>
                    <label className="flex items-center justify-center gap-2 text-sm text-muted cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.strictBrands}
                        onChange={e => setPreferences(prev => ({ ...prev, strictBrands: e.target.checked }))}
                        className="rounded border-surface-hover"
                      />
                      Only show selected brands (strict)
                    </label>
                  </div>
                )}

                <div className="flex justify-between">
                  <button onClick={prevStep} className="flex items-center gap-2 text-muted hover:text-foreground">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    onClick={() => handleGenerate()}
                    disabled={isGenerating}
                    className={cn('luxury-button flex items-center gap-2', isGenerating && 'opacity-50 cursor-not-allowed')}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Cart
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'results' && (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-semibold mb-2">Your AI-Curated Cart</h2>
                  <p className="text-muted">
                    {results.length > 0
                      ? `${results.length} items matched your preferences`
                      : 'No matches found — try adjusting your filters'}
                  </p>
                </div>

                {results.length > 0 ? (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      {results.map((product, i) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className="glass-panel overflow-hidden group card-hover"
                        >
                          <div className="flex">
                            <div className="w-32 h-32 bg-surface flex-shrink-0 overflow-hidden">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                onError={e => {
                                  const target = e.currentTarget;
                                  if (target.src !== FALLBACK_IMAGE) target.src = FALLBACK_IMAGE;
                                }}
                              />
                            </div>
                            <div className="p-5 flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                  <p className="text-xs text-accent uppercase tracking-wider mb-1">{product.brand}</p>
                                  <h3 className="font-medium mb-1 truncate">{product.name}</h3>
                                  <p className="text-sm text-muted">{product.category}</p>
                                </div>
                                <span className="font-semibold flex-shrink-0">{formatPrice(product.price)}</span>
                              </div>

                              <p className="mt-3 text-xs text-muted">
                                {generateMatchExplanation(product, {
                                  styles: preferences.styles,
                                  brands: preferences.brands,
                                  occasion: preferences.occasion || undefined
                                })}
                              </p>

                              <div className="mt-4 flex items-center gap-3">
                                <a
                                  href={product.productUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-sm text-accent hover:underline"
                                >
                                  View Item
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

                    <div className="glass-panel p-6">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                          <p className="text-sm text-muted mb-1">Cart Total</p>
                          <p className="text-3xl font-semibold">
                            {formatPrice(results.reduce((acc, p) => acc + p.price, 0))}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => setStep('landing')}
                            className="px-6 py-3 rounded-full border border-surface-hover hover:bg-surface transition-colors"
                          >
                            Start New Search
                          </button>
                          <button className="luxury-button">Proceed to Checkout</button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="glass-panel p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                      <Search className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">No matches found</h3>
                    <p className="text-muted mb-6">Try adjusting your budget, occasion, or style preferences.</p>
                    <button onClick={() => setStep('budget')} className="luxury-button">
                      Adjust Preferences
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {isGenerating && (
        <div className="fixed inset-0 z-[60] bg-background/85 backdrop-blur-md flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-xl glass-panel p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-accent animate-spin" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-wider text-muted">AI Matching In Progress</p>
                <p className="text-lg font-semibold">Scanning your style profile</p>
              </div>
            </div>

            <div className="space-y-3 mt-6">
              {SCAN_STAGES.map((item, index) => {
                const active = index === scanStepIndex;
                const complete = index < scanStepIndex;
                return (
                  <div key={item} className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-2.5 h-2.5 rounded-full transition-colors',
                        complete ? 'bg-accent' : active ? 'bg-accent animate-pulse' : 'bg-surface-hover'
                      )}
                    />
                    <p className={cn('text-sm', active || complete ? 'text-foreground' : 'text-muted')}>
                      {item}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 h-2 rounded-full bg-surface overflow-hidden">
              <motion.div
                className="h-full bg-accent"
                initial={{ width: '0%' }}
                animate={{ width: `${((scanStepIndex + 1) / SCAN_STAGES.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <p className="text-xs text-muted mt-3">Prioritizing match accuracy over speed.</p>
          </motion.div>
        </div>
      )}
    </main>
  );
}
