'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CURATED_PRODUCTS, matchProducts, generateMatchExplanation, POPULAR_BRANDS } from '@/lib/catalog';
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
  Heart,
  Search,
  User,
  Zap,
  Bot
} from 'lucide-react';
import type { Product, UserPreferences } from '@/types';

type Step = 'landing' | 'gender' | 'categories' | 'style' | 'budget' | 'brands' | 'results';

export default function Home() {
  const [step, setStep] = useState<Step>('landing');
  const [skipBrands, setSkipBrands] = useState(false);
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    gender: '',
    categories: [],
    styles: [],
    brands: [],
    budget: 300,
    strictBrands: false,
    mode: 'pure'
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<Product[]>([]);

  const CATEGORIES = [
    { id: 'tops', label: 'Tops', icon: '👕' },
    { id: 'bottoms', label: 'Bottoms', icon: '👖' },
    { id: 'outerwear', label: 'Outerwear', icon: '🧥' },
    { id: 'shoes', label: 'Shoes', icon: '👟' },
    { id: 'accessories', label: 'Accessories', icon: '👜' },
    { id: 'dresses', label: 'Dresses', icon: '👗' }
  ];

  const toggleCategory = (catId: string) => {
    setPreferences(prev => ({
      ...prev,
      categories: prev.categories.includes(catId)
        ? prev.categories.filter(c => c !== catId)
        : [...prev.categories, catId]
    }));
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const matched = matchProducts(CURATED_PRODUCTS, {
        styles: preferences.styles,
        brands: preferences.brands,
        budget: preferences.budget,
        gender: preferences.gender,
        categories: preferences.categories,
        strictBrands: preferences.strictBrands && preferences.brands.length > 0
      });
      
      setResults(matched.slice(0, 8));
      setIsGenerating(false);
      setStep('results');
    }, 1500);
  };

  const canProceed = useMemo(() => {
    if (step === 'gender') return !!preferences.gender;
    if (step === 'categories') return preferences.categories.length > 0;
    if (step === 'style') return preferences.styles.length > 0;
    return true;
  }, [step, preferences]);

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
      {/* Header */}
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

      {/* Main Content */}
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <AnimatePresence mode="wait">
            
            {/* LANDING */}
            {step === 'landing' && (
              <motion.div
                key="landing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center text-center"
              >
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
                  <span className="text-gradient">& Orders</span> For You
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl text-muted mb-6 max-w-2xl"
                >
                  Tell ShopperAgent what you need. Our AI finds perfect pieces across 
                  <span className="text-foreground"> all brands and budgets</span>, 
                  then builds your cart for easy checkout.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="text-sm text-muted mb-12"
                >
                  From $25 basics to $2000+ investment pieces · All genders · All styles
                </motion.p>
                
                <motion.button
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  onClick={() => setStep('gender')}
                  className="luxury-button flex items-center gap-3 text-lg px-10 py-5"
                >
                  <Zap className="w-5 h-5" />
                  Start Shopping
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}

            {/* GENDER */}
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
                  {(['womens', 'mens', 'unisex'] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => setPreferences(prev => ({ ...prev, gender: g }))}
                      className={cn(
                        "p-8 rounded-2xl border text-center transition-all",
                        preferences.gender === g
                          ? "border-accent bg-accent/10"
                          : "border-surface-hover hover:border-accent/30 bg-surface/30"
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
                    disabled={!preferences.gender}
                    className={cn(
                      "luxury-button flex items-center gap-2",
                      !preferences.gender && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* CATEGORIES */}
            {step === 'categories' && (
              <motion.div
                key="categories"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 max-w-2xl mx-auto"
              >
                <div className="text-center">
                  <span className="text-sm text-muted uppercase tracking-wider">Step 2 of 5</span>
                  <h2 className="text-3xl font-semibold mt-2 mb-3">What do you need?</h2>
                  <p className="text-muted">Select all that apply</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {CATEGORIES.map((cat) => {
                    const isSelected = preferences.categories.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className={cn(
                          "p-6 rounded-xl border text-center transition-all",
                          isSelected
                            ? "border-accent bg-accent/10"
                            : "border-surface-hover hover:border-accent/30 bg-surface/30"
                        )}
                      >
                        <span className="text-3xl mb-2 block">{cat.icon}</span>
                        <span className="font-medium">{cat.label}</span>
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
                    disabled={preferences.categories.length === 0}
                    className={cn(
                      "luxury-button flex items-center gap-2",
                      preferences.categories.length === 0 && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STYLE */}
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
                  <h2 className="text-3xl font-semibold mt-2 mb-3">What's your style?</h2>
                  <p className="text-muted">Select one or more</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {STYLE_OPTIONS.map((style) => {
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
                          "p-5 rounded-xl border text-left transition-all",
                          isSelected
                            ? "border-accent bg-accent/10"
                            : "border-surface-hover hover:border-accent/30 bg-surface/30"
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
                    disabled={preferences.styles.length === 0}
                    className={cn(
                      "luxury-button flex items-center gap-2",
                      preferences.styles.length === 0 && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* BUDGET */}
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
                  <p className="text-muted">Per item average</p>
                </div>

                <div className="glass-panel p-8 text-center">
                  <span className="text-5xl font-semibold text-accent">
                    {formatPrice(preferences.budget)}
                  </span>
                  <p className="text-muted mt-2">per item</p>
                  
                  <input
                    type="range"
                    min="50"
                    max="2000"
                    step="50"
                    value={preferences.budget}
                    onChange={(e) => setPreferences(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
                    className="w-full mt-8 h-2 bg-surface rounded-full appearance-none cursor-pointer accent-accent"
                  />
                  
                  <div className="flex justify-between mt-4 text-sm text-muted">
                    <span>$50</span>
                    <span>$500</span>
                    <span>$1000</span>
                    <span>$2000+</span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button onClick={prevStep} className="flex items-center gap-2 text-muted hover:text-foreground">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="luxury-button flex items-center gap-2"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* OPTIONAL BRANDS */}
            {step === 'brands' && (
              <motion.div
                key="brands"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 max-w-3xl mx-auto"
              >
                <div className="text-center">
                  <span className="text-sm text-muted uppercase tracking-wider">Step 5 of 5 (Optional)</span>
                  <h2 className="text-3xl font-semibold mt-2 mb-3">Any specific brands?</h2>
                  <p className="text-muted">Or skip to see options across all brands</p>
                </div>

                {/* Quick Skip */}
                <button
                  onClick={() => {
                    setSkipBrands(true);
                    handleGenerate();
                  }}
                  className="w-full py-4 rounded-xl border-2 border-dashed border-surface-hover hover:border-accent/50 hover:bg-accent/5 transition-all text-muted hover:text-foreground"
                >
                  <span className="font-medium">No preference — show me all brands</span>
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-surface-hover"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-background text-muted">Or choose from popular brands</span>
                  </div>
                </div>

                {/* Popular Brands Grid */}
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {POPULAR_BRANDS.map((brand) => {
                    const isSelected = preferences.brands.includes(brand.id);
                    return (
                      <button
                        key={brand.id}
                        onClick={() => {
                          if (isSelected) {
                            setPreferences(prev => ({
                              ...prev,
                              brands: prev.brands.filter(b => b !== brand.id)
                            }));
                          } else {
                            setPreferences(prev => ({
                              ...prev,
                              brands: [...prev.brands, brand.id]
                            }));
                          }
                        }}
                        className={cn(
                          "p-4 rounded-xl border text-center transition-all",
                          isSelected
                            ? "border-accent bg-accent/10"
                            : "border-surface-hover hover:border-accent/30 bg-surface/30"
                        )}
                      >
                        <span className="font-medium text-sm">{brand.name}</span>
                        <span className="block text-xs text-muted mt-1">{brand.priceRange}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Count */}
                {preferences.brands.length > 0 && (
                  <div className="text-center">
                    <p className="text-sm text-accent mb-2">
                      {preferences.brands.length} brand{preferences.brands.length > 1 ? 's' : ''} selected
                    </p>
                    <label className="flex items-center justify-center gap-2 text-sm text-muted cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.strictBrands}
                        onChange={(e) => setPreferences(prev => ({ ...prev, strictBrands: e.target.checked }))}
                        className="rounded border-surface-hover"
                      />
                      Only show these brands (strict mode)
                    </label>
                  </div>
                )}

                <div className="flex justify-between">
                  <button onClick={prevStep} className="flex items-center gap-2 text-muted hover:text-foreground">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className={cn(
                      "luxury-button flex items-center gap-2",
                      isGenerating && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Finding matches...
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

            {/* RESULTS */}
            {step === 'results' && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-semibold mb-2">Your AI-Curated Cart</h2>
                  <p className="text-muted">
                    {results.length > 0 
                      ? `${results.length} items matched your preferences`
                      : 'No matches found — try adjusting your filters'
                    }
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
                                  <p className="text-sm text-muted">{product.category}</p>
                                </div>
                                <span className="font-semibold flex-shrink-0">
                                  {formatPrice(product.price)}
                                </span>
                              </div>
                              
                              <p className="mt-3 text-xs text-muted">
                                {generateMatchExplanation(product, { styles: preferences.styles, brands: preferences.brands })}
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
                      <div className="flex items-center justify-between">
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
                          <button className="luxury-button">
                            Proceed to Checkout
                          </button>
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
                    <p className="text-muted mb-6">
                      Try adjusting your budget or style preferences
                    </p>
                    <button
                      onClick={() => setStep('budget')}
                      className="luxury-button"
                    >
                      Adjust Preferences
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}