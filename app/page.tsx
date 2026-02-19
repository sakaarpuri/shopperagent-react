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
  Loader2,
  ChevronDown,
  ChevronUp,
  CheckCircle2
} from 'lucide-react';
import type { Product, UserPreferences, FeedbackModel } from '@/types';

type Step = 'landing' | 'preferences' | 'occasion' | 'brands' | 'results';

type CategoryId = 'tops' | 'bottoms' | 'outerwear' | 'shoes' | 'accessories' | 'dresses';
type SizeCategory = 'tops' | 'bottoms' | 'outerwear' | 'shoes' | 'dresses';
type Occasion = 'everyday' | 'work' | 'date-night' | 'event' | 'travel' | 'workout';

type RerankCandidate = {
  id: string;
  text: string;
  ruleScore: number;
};

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

const BUDGET_PRESETS = [
  { value: 45, label: 'Under $50' },
  { value: 100, label: 'Around $100' },
  { value: 200, label: 'Around $200' }
];

const NEGATIVE_OPTIONS: Array<{
  id: 'no-bright-colors' | 'no-slim-fit';
  label: string;
}> = [
  { id: 'no-bright-colors', label: 'No bright colors' },
  { id: 'no-slim-fit', label: 'Avoid slim fit' }
];

const INSPIRATION_BOARDS = [
  {
    id: 'city-minimal',
    title: 'City Minimal',
    description: 'Clean silhouettes, quiet neutrals, polished basics.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=500&fit=crop',
    styles: ['minimalist', 'classic'],
    categories: ['tops', 'bottoms', 'outerwear', 'shoes'],
    brands: ['everlane', 'reformation'],
    budget: 220,
    gender: 'womens' as const,
    occasion: 'everyday' as Occasion
  },
  {
    id: 'off-duty',
    title: 'Off-Duty Sport',
    description: 'Athleisure-driven layers with casual comfort.',
    image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=800&h=500&fit=crop',
    styles: ['athleisure', 'casual'],
    categories: ['tops', 'bottoms', 'shoes', 'outerwear'],
    brands: ['lululemon', 'aloyoga'],
    budget: 180,
    gender: 'unisex' as const,
    occasion: 'workout' as Occasion
  },
  {
    id: 'modern-romantic',
    title: 'Modern Romantic',
    description: 'Soft textures and dress-forward styling.',
    image: 'https://images.unsplash.com/photo-1464863979621-258859e62245?w=800&h=500&fit=crop',
    styles: ['romantic', 'trendy'],
    categories: ['dresses', 'shoes', 'accessories', 'outerwear'],
    brands: ['reformation', 'everlane'],
    budget: 260,
    gender: 'womens' as const,
    occasion: 'date-night' as Occasion
  }
];

export default function Home() {
  const [step, setStep] = useState<Step>('landing');
  const [skipBrands, setSkipBrands] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [brandSearch, setBrandSearch] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [memberPreset, setMemberPreset] = useState<UserPreferences | null>(null);
  const [feedbackModel, setFeedbackModel] = useState<FeedbackModel>({});
  const [storeProgress, setStoreProgress] = useState<Record<string, boolean>>({});
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
    sizes: {},
    negatives: []
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
    const savedMemberProfile = window.localStorage.getItem('sa_member_profile');
    if (savedMemberProfile) {
      try {
        const parsed = JSON.parse(savedMemberProfile) as UserPreferences;
        setMemberPreset(parsed);
        setIsMember(true);
      } catch {
        window.localStorage.removeItem('sa_member_profile');
      }
    }
    const savedEvents = window.localStorage.getItem('sa_feedback_events');
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents) as Array<{
          productId: string;
          brand: string;
          storeId: string;
          category: string;
          topStyles: string[];
          type: 'view' | 'save' | 'purchase' | 'handoff-open';
          ts: number;
        }>;
        setFeedbackModel(buildFeedbackModel(parsedEvents));
      } catch {
        window.localStorage.removeItem('sa_feedback_events');
      }
    }
    return () => clearGenerationTimers();
  }, []);

  const buildFeedbackModel = (events: Array<{
    productId: string;
    brand: string;
    storeId: string;
    category: string;
    topStyles: string[];
    type: 'view' | 'save' | 'purchase' | 'handoff-open';
    ts: number;
  }>): FeedbackModel => {
    const typeWeight: Record<string, number> = {
      view: 0.2,
      save: 1.2,
      purchase: 2.5,
      'handoff-open': 0.8
    };
    const model: FeedbackModel = {
      styleAffinity: {},
      brandAffinity: {},
      storeAffinity: {},
      categoryAffinity: {}
    };
    events.forEach(event => {
      const weight = typeWeight[event.type] || 0;
      model.brandAffinity![event.brand] = (model.brandAffinity![event.brand] || 0) + weight;
      model.storeAffinity![event.storeId] = (model.storeAffinity![event.storeId] || 0) + weight;
      model.categoryAffinity![event.category] = (model.categoryAffinity![event.category] || 0) + weight;
      event.topStyles.forEach(style => {
        model.styleAffinity![style] = (model.styleAffinity![style] || 0) + weight;
      });
    });
    return model;
  };

  const trackInteraction = (product: Product, type: 'view' | 'save' | 'purchase' | 'handoff-open') => {
    const nextEvent = {
      productId: product.id,
      brand: product.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      storeId: product.store.id,
      category: product.category,
      topStyles: Object.entries(product.scores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(entry => entry[0]),
      type,
      ts: Date.now()
    };
    const saved = window.localStorage.getItem('sa_feedback_events');
    const existing = saved ? JSON.parse(saved) : [];
    const events = [nextEvent, ...existing].slice(0, 400);
    window.localStorage.setItem('sa_feedback_events', JSON.stringify(events));
    setFeedbackModel(buildFeedbackModel(events));
  };

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

  const buildUserTasteText = (snapshot: UserPreferences): string => {
    const parts = [
      `gender: ${snapshot.gender || 'any'}`,
      `categories: ${snapshot.categories.join(', ') || 'any'}`,
      `styles: ${snapshot.styles.join(', ') || 'any'}`,
      `occasion: ${snapshot.occasion || 'any'}`,
      `budget: ${snapshot.budget}`,
      `brands: ${snapshot.brands.join(', ') || 'none'}`,
      `negatives: ${(snapshot.negatives || []).join(', ') || 'none'}`
    ];
    return parts.join(' | ');
  };

  const buildProductRerankText = (product: Product): string => {
    const topStyleTags = Object.entries(product.scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([style]) => style)
      .join(', ');

    return [
      `name: ${product.name}`,
      `brand: ${product.brand}`,
      `store: ${product.store.name}`,
      `category: ${product.category}`,
      `price: ${product.price}`,
      `styles: ${topStyleTags}`,
      `occasion_tags: ${product.metadata.occasionTags.join(', ')}`,
      `fit_tags: ${product.metadata.fitTags.join(', ')}`,
      `silhouette_tags: ${product.metadata.silhouetteTags.join(', ')}`
    ].join(' | ');
  };

  const rerankCandidates = async (candidates: Product[], snapshot: UserPreferences): Promise<Product[]> => {
    if (candidates.length <= 1) return candidates;

    const payload: {
      userText: string;
      candidates: RerankCandidate[];
    } = {
      userText: buildUserTasteText(snapshot),
      candidates: candidates.map(product => ({
        id: product.id,
        text: buildProductRerankText(product),
        ruleScore: product.matchScore || 0
      }))
    };

    try {
      const response = await fetch('/api/rerank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) return candidates;
      const data = await response.json() as { orderedIds?: string[] };
      if (!data.orderedIds || data.orderedIds.length === 0) return candidates;
      const map = new Map(candidates.map(candidate => [candidate.id, candidate]));
      const ordered = data.orderedIds
        .map(id => map.get(id))
        .filter((item): item is Product => Boolean(item));
      return ordered.length > 0 ? ordered : candidates;
    } catch {
      return candidates;
    }
  };

  const runGeneration = (snapshot: UserPreferences) => {
    clearGenerationTimers();
    setIsGenerating(true);
    setScanStepIndex(0);

    scanIntervalRef.current = window.setInterval(() => {
      setScanStepIndex(prev => (prev < SCAN_STAGES.length - 1 ? prev + 1 : prev));
    }, 850);

    scanTimeoutRef.current = window.setTimeout(() => {
      void (async () => {
        const matched = matchProducts(CURATED_PRODUCTS, {
          styles: snapshot.styles,
          brands: snapshot.brands,
          budget: snapshot.budget,
          gender: snapshot.gender,
          categories: snapshot.categories,
          strictBrands: snapshot.strictBrands && snapshot.brands.length > 0,
          occasion: snapshot.occasion,
          sizes: snapshot.sizes || {},
          maxStores: 3,
          negatives: snapshot.negatives || [],
          feedbackModel
        });

        const preRerank = matched.slice(0, 30);
        const reranked = await rerankCandidates(preRerank, snapshot);

        setResults(reranked.slice(0, 8));
        setIsGenerating(false);
        clearGenerationTimers();
        window.localStorage.setItem('sa_member_profile', JSON.stringify(snapshot));
        setMemberPreset(snapshot);
        setIsMember(true);
        setStep('results');
      })();
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
      setStep('preferences');
    }
  };

  const openMemberPrecurated = () => {
    if (!memberPreset) return;
    setPreferences(memberPreset);
    handleGenerate(memberPreset);
  };

  const budgetSignal = useMemo(() => {
    if (preferences.budget < 50) {
      return { label: 'Under $50', hint: 'Fewer options, mostly basics and sale-driven picks.' };
    }
    if (preferences.budget <= 100) {
      return { label: '$50-$100', hint: 'Many options across everyday staples and trend items.' };
    }
    if (preferences.budget <= 200) {
      return { label: '$100-$200', hint: 'Many options with stronger quality and brand variety.' };
    }
    return { label: '$200+', hint: 'Curated options, including premium and luxury pieces.' };
  }, [preferences.budget]);

  const filteredBrands = useMemo(() => {
    const query = brandSearch.trim().toLowerCase();
    if (!query) return POPULAR_BRANDS;
    return POPULAR_BRANDS.filter(brand => brand.name.toLowerCase().includes(query));
  }, [brandSearch]);

  const visibleBrands = useMemo(() => {
    return showAllBrands ? filteredBrands : filteredBrands.slice(0, 10);
  }, [filteredBrands, showAllBrands]);

  const checkoutGroups = useMemo(() => {
    const byStore = new Map<string, { store: Product['store']; items: Product[]; subtotal: number }>();
    results.forEach(product => {
      const existing = byStore.get(product.store.id);
      if (existing) {
        existing.items.push(product);
        existing.subtotal += product.price;
      } else {
        byStore.set(product.store.id, { store: product.store, items: [product], subtotal: product.price });
      }
    });
    return Array.from(byStore.values()).sort((a, b) => b.subtotal - a.subtotal);
  }, [results]);

  const openStoreHandoff = (group: { store: Product['store']; items: Product[]; subtotal: number }) => {
    group.items.forEach((item, index) => {
      window.setTimeout(() => {
        window.open(item.productUrl, '_blank', 'noopener,noreferrer');
      }, index * 180);
      trackInteraction(item, 'handoff-open');
    });
    setStoreProgress(prev => ({ ...prev, [group.store.id]: true }));
  };

  const openAllStoreHandoffs = () => {
    checkoutGroups.forEach((group, idx) => {
      window.setTimeout(() => openStoreHandoff(group), idx * 600);
    });
  };

  const canProceed = useMemo(() => {
    if (step === 'preferences') {
      return !!preferences.gender && preferences.categories.length > 0 && missingSizeCategories.length === 0 && preferences.styles.length > 0;
    }
    if (step === 'occasion') return !!preferences.occasion;
    return true;
  }, [step, preferences, missingSizeCategories]);

  const nextStep = () => {
    const steps: Step[] = ['landing', 'preferences', 'occasion', 'brands', 'results'];
    const currentIdx = steps.indexOf(step);
    if (currentIdx < steps.length - 1) {
      setStep(steps[currentIdx + 1]);
    }
  };

  const prevStep = () => {
    const steps: Step[] = ['landing', 'preferences', 'occasion', 'brands', 'results'];
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
                    AI agent that <span className="text-accent">SHOPS</span> clothes for you.
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl text-muted mb-8 max-w-3xl"
                  >
                    Save Hours of searching. Guided preferences, inspiration boards, and scan-time transparency for higher-quality matches.
                  </motion.p>

                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <motion.button
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      onClick={() => setStep('preferences')}
                      className="luxury-button flex items-center gap-3 text-lg px-10 py-5"
                    >
                      <Zap className="w-5 h-5" />
                      Start Guided Matching
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
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
                        <div className="relative rounded-lg overflow-hidden border border-surface-hover">
                          <img src={board.image} alt={board.title} className="w-full h-28 object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                        </div>
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
                      <h3 className="text-xl font-semibold">Member Pre-Curated Carts</h3>
                      <p className="text-sm text-muted">
                        {isMember
                          ? 'Ready from your previous preferences so next checkout is faster.'
                          : 'Unlock by completing one match. Your next session starts from your saved taste.'}
                      </p>
                    </div>
                    {isMember ? (
                      <button onClick={openMemberPrecurated} className="luxury-button px-5 py-3 text-sm">
                        Open My Saved Cart
                      </button>
                    ) : (
                      <button onClick={() => setStep('preferences')} className="px-5 py-3 rounded-full border border-surface-hover text-sm">
                        Start to Unlock
                      </button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    {demoProducts.slice(0, 3).map((product, index) => (
                      <div key={`member-${product.id}`} className="relative rounded-xl overflow-hidden border border-surface-hover">
                        <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/35 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="text-xs text-accent uppercase tracking-wider">Saved Look {index + 1}</p>
                          <p className="text-sm">{product.name}</p>
                        </div>
                        {!isMember && (
                          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[2px]">
                            <p className="text-xs uppercase tracking-[0.2em] text-accent">Members Only</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

              </motion.div>
            )}

            {step === 'preferences' && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 max-w-4xl mx-auto"
              >
                <div className="text-center">
                  <span className="text-sm text-muted uppercase tracking-wider">Step 1 of 3</span>
                  <h2 className="text-3xl font-semibold mt-2 mb-3">Set your core preferences</h2>
                  <p className="text-muted">Gender, product categories, style taste, sizes, and budget in one place.</p>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-muted">Who are we shopping for?</p>
                  <div className="grid grid-cols-3 gap-4">
                    {(['womens', 'mens', 'unisex'] as const).map(g => (
                      <button
                        key={g}
                        onClick={() => setPreferences(prev => ({ ...prev, gender: g }))}
                        className={cn(
                          'p-6 rounded-2xl border text-center transition-all',
                          preferences.gender === g
                            ? 'border-accent bg-accent/10'
                            : 'border-surface-hover hover:border-accent/30 bg-surface/30'
                        )}
                      >
                        <span className="text-3xl mb-2 block">
                          {g === 'womens' && '👩'}
                          {g === 'mens' && '👨'}
                          {g === 'unisex' && '👤'}
                        </span>
                        <span className="font-medium capitalize">{g}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-muted">What do you need?</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {CATEGORIES.map(cat => {
                      const isSelected = preferences.categories.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          onClick={() => toggleCategory(cat.id)}
                          className={cn(
                            'p-5 rounded-xl border text-center transition-all',
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
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-muted">Style taste</p>
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
                            'p-4 rounded-xl border text-left transition-all',
                            isSelected
                              ? 'border-accent bg-accent/10'
                              : 'border-surface-hover hover:border-accent/30 bg-surface/30'
                          )}
                        >
                          <span className="text-2xl mb-2 block">{style.icon}</span>
                          <h4 className="font-medium text-sm">{style.label}</h4>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-muted">Avoid in recommendations</p>
                  <div className="flex flex-wrap gap-2">
                    {NEGATIVE_OPTIONS.map(option => {
                      const selected = preferences.negatives?.includes(option.id) || false;
                      return (
                        <button
                          key={option.id}
                          onClick={() =>
                            setPreferences(prev => {
                              const current = prev.negatives || [];
                              return {
                                ...prev,
                                negatives: selected
                                  ? current.filter(item => item !== option.id)
                                  : [...current, option.id]
                              };
                            })
                          }
                          className={cn(
                            'px-3 py-2 rounded-full text-sm border transition-colors',
                            selected
                              ? 'border-accent bg-accent/10 text-foreground'
                              : 'border-surface-hover hover:border-accent/30 text-muted'
                          )}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
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

                <div className="glass-panel p-6 md:p-8">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <p className="text-sm text-muted">Budget target</p>
                      <p className="text-4xl font-semibold text-accent">{formatPrice(preferences.budget)}</p>
                    </div>
                    <div className="text-sm text-right">
                      <p className="text-muted">{budgetSignal.label}</p>
                      <p className="text-accent">{budgetSignal.hint}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-5 flex-wrap">
                    {BUDGET_PRESETS.map(preset => (
                      <button
                        key={preset.label}
                        onClick={() => setPreferences(prev => ({ ...prev, budget: preset.value }))}
                        className={cn(
                          'px-3 py-2 rounded-full text-xs border transition-colors',
                          Math.abs(preferences.budget - preset.value) < 20
                            ? 'border-accent bg-accent/10'
                            : 'border-surface-hover hover:border-accent/30'
                        )}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  <input
                    type="range"
                    min="25"
                    max="400"
                    step="5"
                    value={preferences.budget}
                    onChange={e => setPreferences(prev => ({ ...prev, budget: parseInt(e.target.value, 10) }))}
                    className="w-full mt-6 h-2 bg-surface rounded-full appearance-none cursor-pointer accent-accent"
                  />

                  <div className="flex justify-between mt-3 text-xs text-muted">
                    <span>Under $50</span>
                    <span>$100</span>
                    <span>$200</span>
                    <span>$200+</span>
                  </div>
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

            {step === 'occasion' && (
              <motion.div
                key="occasion"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 max-w-3xl mx-auto"
              >
                <div className="text-center">
                  <span className="text-sm text-muted uppercase tracking-wider">Step 2 of 3</span>
                  <h2 className="text-3xl font-semibold mt-2 mb-3">Pick your mood or occasion</h2>
                  <p className="text-muted">This sets context, while your taste was captured in preferences.</p>
                </div>

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

            {step === 'brands' && (
              <motion.div
                key="brands"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 max-w-4xl mx-auto"
              >
                <div className="text-center">
                  <span className="text-sm text-muted uppercase tracking-wider">Step 3 of 3</span>
                  <h2 className="text-3xl font-semibold mt-2 mb-3">Preferred brands (optional)</h2>
                  <p className="text-muted">Choose up to a few favorites or skip this step for faster matching.</p>
                </div>

                <div className="glass-panel p-5 space-y-4">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="relative flex-1 min-w-[220px]">
                      <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        value={brandSearch}
                        onChange={e => setBrandSearch(e.target.value)}
                        placeholder="Search brands"
                        className="w-full bg-surface/40 border border-surface-hover rounded-full py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:border-accent/50"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
                      <input
                        type="checkbox"
                        checked={skipBrands}
                        onChange={e => setSkipBrands(e.target.checked)}
                        className="rounded border-surface-hover"
                      />
                      Skip brands
                    </label>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {visibleBrands.map(brand => {
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

                  {filteredBrands.length > 10 && (
                    <button
                      onClick={() => setShowAllBrands(prev => !prev)}
                      className="text-sm text-accent inline-flex items-center gap-2"
                    >
                      {showAllBrands ? (
                        <>
                          Show fewer brands
                          <ChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Show all brands ({filteredBrands.length})
                          <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>

                {preferences.brands.length > 0 && !skipBrands && (
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
                    onClick={() => {
                      if (skipBrands) {
                        const withoutBrands: UserPreferences = { ...preferences, brands: [], strictBrands: false };
                        setPreferences(withoutBrands);
                        handleGenerate(withoutBrands);
                        return;
                      }
                      handleGenerate();
                    }}
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
                                  onClick={() => trackInteraction(product, 'view')}
                                  className="flex items-center gap-1 text-sm text-accent hover:underline"
                                >
                                  View Item
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                                <button
                                  onClick={() => trackInteraction(product, 'save')}
                                  className="p-2 rounded-full hover:bg-surface transition-colors ml-auto"
                                >
                                  <Heart className="w-4 h-4 text-muted" />
                                </button>
                                <button
                                  onClick={() => trackInteraction(product, 'purchase')}
                                  className="text-xs px-2 py-1 rounded-full border border-surface-hover hover:border-accent/40"
                                >
                                  Bought
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="glass-panel p-6">
                      {checkoutGroups.length > 0 && (
                        <div className="mb-6">
                          <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                            <p className="text-sm text-muted">Retailer Handoff Plan (checkout at retailer sites)</p>
                            <button onClick={openAllStoreHandoffs} className="luxury-button px-4 py-2 text-sm">
                              Open All Store Carts
                            </button>
                          </div>
                          <div className="space-y-3">
                            {checkoutGroups.map(group => (
                              <div key={group.store.id} className="border border-surface-hover rounded-xl p-3 bg-surface/30">
                                <div className="flex items-center justify-between gap-3 flex-wrap">
                                  <div>
                                    <p className="font-medium">{group.store.name}</p>
                                    <p className="text-xs text-muted">
                                      {group.items.length} item{group.items.length > 1 ? 's' : ''} · {formatPrice(group.subtotal)}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => openStoreHandoff(group)}
                                    className="px-4 py-2 rounded-full border border-surface-hover hover:border-accent/40 text-sm inline-flex items-center gap-2"
                                  >
                                    {storeProgress[group.store.id] ? <CheckCircle2 className="w-4 h-4 text-accent" /> : null}
                                    Open {group.store.capability === 'prefill' ? 'Prefill Cart' : 'Store Items'}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
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
                          <button onClick={openAllStoreHandoffs} className="luxury-button">Proceed to Retailer Checkout</button>
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
                    <button onClick={() => setStep('preferences')} className="luxury-button">
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
