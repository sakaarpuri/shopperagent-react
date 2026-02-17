import { Product, Brand, StyleInspiration } from '@/types';

export const LUXURY_BRANDS: Brand[] = [
  {
    id: 'the-row',
    name: 'The Row',
    aesthetic: 'minimalist',
    priceRange: 'luxury',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop',
    description: 'Quiet luxury, impeccable tailoring. Investment pieces that last decades.',
    website: 'https://therow.com'
  },
  {
    id: 'toteme',
    name: 'Totême',
    aesthetic: 'minimalist',
    priceRange: 'luxury',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop',
    description: 'Scandinavian minimalism with architectural silhouettes.',
    website: 'https://toteme-studio.com'
  },
  {
    id: 'cos',
    name: 'COS',
    aesthetic: 'minimalist',
    priceRange: 'mid',
    image: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=400&h=400&fit=crop',
    description: 'Modern, functional design with thoughtful details.',
    website: 'https://cos.com'
  },
  {
    id: 'acne-studios',
    name: 'Acne Studios',
    aesthetic: 'contemporary',
    priceRange: 'luxury',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=400&fit=crop',
    description: 'Swedish contemporary with playful proportions.',
    website: 'https://acnestudios.com'
  },
  {
    id: 'jil-sander',
    name: 'Jil Sander',
    aesthetic: 'minimalist',
    priceRange: 'luxury',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=400&fit=crop',
    description: 'Purist luxury. The original minimalist.',
    website: 'https://jilsander.com'
  },
  {
    id: 'maison-margiela',
    name: 'Maison Margiela',
    aesthetic: 'avant-garde',
    priceRange: 'luxury',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop',
    description: 'Deconstructed elegance and artisanal craft.',
    website: 'https://maisonmargiela.com'
  },
  {
    id: 'everlane',
    name: 'Everlane',
    aesthetic: 'minimalist',
    priceRange: 'mid',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop',
    description: 'Transparent pricing, essential wardrobe building blocks.',
    website: 'https://everlane.com'
  },
  {
    id: 'ssense',
    name: 'SSENSE Private Label',
    aesthetic: 'streetwear-luxury',
    priceRange: 'mid',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop',
    description: 'Contemporary streetwear meets luxury sensibility.',
    website: 'https://ssense.com'
  },
  {
    id: 'auralee',
    name: 'Auralee',
    aesthetic: 'minimalist',
    priceRange: 'luxury',
    image: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&h=400&fit=crop',
    description: 'Japanese craftsmanship with luxurious materials.',
    website: 'https://auralee.jp'
  },
  {
    id: 'lemaire',
    name: 'Lemaire',
    aesthetic: 'romantic-minimalist',
    priceRange: 'luxury',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
    description: 'Fluid silhouettes with Parisian nonchalance.',
    website: 'https://lemaire.fr'
  },
  {
    id: 'studio-nicholson',
    name: 'Studio Nicholson',
    aesthetic: 'minimalist',
    priceRange: 'luxury',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop',
    description: 'British tailoring precision with Japanese fabric sensibility.',
    website: 'https://studionicholson.com'
  },
  {
    id: 'our-legacy',
    name: 'Our Legacy',
    aesthetic: 'contemporary',
    priceRange: 'mid',
    image: 'https://images.unsplash.com/photo-1515347619252-60a6bf4fffce?w=400&h=400&fit=crop',
    description: 'Swedish contemporary with subtle experimentation.',
    website: 'https://ourlegacy.com'
  }
];

export const STYLE_OPTIONS = [
  { id: 'minimalist', label: 'Minimalist', description: 'Clean lines, neutral palettes, timeless', icon: '◯' },
  { id: 'business', label: 'Business', description: 'Professional, tailored, polished', icon: '◆' },
  { id: 'casual', label: 'Casual', description: 'Relaxed, comfortable, everyday', icon: '●' },
  { id: 'luxury', label: 'Luxury', description: 'Premium materials, refined details', icon: '✦' },
  { id: 'streetwear', label: 'Streetwear', description: 'Urban, bold, contemporary', icon: '▲' },
  { id: 'avant-garde', label: 'Avant-Garde', description: 'Experimental, architectural, artistic', icon: '◐' },
  { id: 'romantic', label: 'Romantic', description: 'Soft, flowing, feminine details', icon: '◇' },
  { id: 'androgynous', label: 'Androgynous', description: 'Gender-fluid, versatile, modern', icon: '◎' }
];

export const INSPIRATION_BOARDS: StyleInspiration[] = [
  {
    id: 'quiet-luxury',
    name: 'Quiet Luxury',
    description: 'Understated elegance. Investment pieces that whisper wealth.',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=600&fit=crop',
    tags: ['minimalist', 'luxury', 'business'],
    brands: ['the-row', 'toteme', 'jil-sander'],
    products: ['toteme-camel-coat', 'the-row-straight-leg', 'auralee-cashmere']
  },
  {
    id: 'scandi-minimal',
    name: 'Scandi Minimal',
    description: 'Functional beauty. Clean lines meet cozy textures.',
    image: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=800&h=600&fit=crop',
    tags: ['minimalist', 'casual'],
    brands: ['cos', 'toteme', 'studio-nicholson'],
    products: ['cos-knit-sweater', 'toteme-ribbed-tee', 'studio-nicholson-trousers']
  },
  {
    id: 'contemporary-edge',
    name: 'Contemporary Edge',
    description: 'Modern silhouettes with attitude. Street meets studio.',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&h=600&fit=crop',
    tags: ['contemporary', 'streetwear'],
    brands: ['acne-studios', 'our-legacy', 'ssense'],
    products: ['acne-musubi-bag', 'our-legacy-camo-shirt', 'acne-studios-sneakers']
  },
  {
    id: 'romantic-minimal',
    name: 'Romantic Minimal',
    description: 'Soft structure. Fluid lines with poetic sensibility.',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=600&fit=crop',
    tags: ['romantic', 'minimalist', 'luxury'],
    brands: ['lemaire', 'auralee', 'the-row'],
    products: ['lemaire-croissant-bag', 'auralee-silk-shirt', 'lemaire-pleated-trousers']
  },
  {
    id: 'avant-garde-artist',
    name: 'Avant-Garde Artist',
    description: 'Deconstructed elegance. Wearable art for the bold.',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=600&fit=crop',
    tags: ['avant-garde', 'luxury', 'androgynous'],
    brands: ['maison-margiela', 'acne-studios', 'our-legacy'],
    products: ['margiela-tabis', 'margiela-deconstructed-blazer', 'acne-distressed-denim']
  },
  {
    id: 'essentials-edit',
    name: 'The Essentials Edit',
    description: 'Curated basics. Quality over quantity capsule wardrobe.',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=600&fit=crop',
    tags: ['minimalist', 'casual', 'business'],
    brands: ['everlane', 'cos', 'auralee'],
    products: ['everlane-organic-cotton-crew', 'cos-relaxed-trousers', 'auralee-bright-tee']
  }
];

// Curated product catalog (~180 items)
export const CURATED_PRODUCTS: Product[] = [
  // TOPS
  {
    id: 'toteme-camel-coat',
    name: 'Signature Wool-Cashmere Coat',
    brand: 'Totême',
    retailer: 'Totême',
    price: 990,
    category: 'outerwear',
    gender: 'womens',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop',
    productUrl: 'https://toteme-studio.com/wool-cashmere-coat',
    inStock: true,
    sizes: ['XS', 'S', 'M', 'L'],
    tags: ['outerwear', 'camel', 'wool', 'winter'],
    scores: { minimalist: 98, business: 85, casual: 60, luxury: 95, streetwear: 30, avantgarde: 40, romantic: 50, androgynous: 60 }
  },
  {
    id: 'cos-knit-sweater',
    name: 'Relaxed Merino Knit',
    brand: 'COS',
    retailer: 'COS',
    price: 89,
    category: 'tops',
    gender: 'womens',
    image: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=400&h=400&fit=crop',
    productUrl: 'https://cos.com/relaxed-merino-knit',
    inStock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    tags: ['knitwear', 'merino', 'relaxed', 'layering'],
    scores: { minimalist: 92, business: 65, casual: 90, luxury: 70, streetwear: 40, avantgarde: 30, romantic: 55, androgynous: 70 }
  },
  {
    id: 'the-row-straight-leg',
    name: 'Ginza Straight-Leg Trousers',
    brand: 'The Row',
    retailer: 'Net-a-Porter',
    price: 990,
    category: 'bottoms',
    gender: 'womens',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop',
    productUrl: 'https://net-a-porter.com/the-row-ginza-trousers',
    inStock: true,
    sizes: ['0', '2', '4', '6', '8', '10'],
    tags: ['trousers', 'straight-leg', 'tailored', 'wool'],
    scores: { minimalist: 98, business: 95, casual: 40, luxury: 98, streetwear: 20, avantgarde: 35, romantic: 30, androgynous: 70 }
  },
  {
    id: 'acne-musubi-bag',
    name: 'Musubi Mini Leather Bag',
    brand: 'Acne Studios',
    retailer: 'SSENSE',
    price: 680,
    category: 'accessories',
    gender: 'unisex',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
    productUrl: 'https://ssense.com/acne-studios-musubi-bag',
    inStock: true,
    sizes: ['ONE SIZE'],
    tags: ['bag', 'leather', 'knot', 'mini'],
    scores: { minimalist: 80, business: 70, casual: 85, luxury: 88, streetwear: 90, avantgarde: 85, romantic: 40, androgynous: 75 }
  },
  {
    id: 'margiela-tabis',
    name: 'Tabi Ankle Boots',
    brand: 'Maison Margiela',
    retailer: 'Farfetch',
    price: 1080,
    category: 'shoes',
    gender: 'womens',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop',
    productUrl: 'https://farfetch.com/margiela-tabi-boots',
    inStock: true,
    sizes: ['36', '37', '38', '39', '40', '41'],
    tags: ['boots', 'leather', 'split-toe', 'iconic'],
    scores: { minimalist: 70, business: 65, casual: 80, luxury: 95, streetwear: 90, avantgarde: 98, romantic: 45, androgynous: 80 }
  },
  {
    id: 'auralee-cashmere',
    name: 'Super Fine Cashmere Turtleneck',
    brand: 'Auralee',
    retailer: 'Mr Porter',
    price: 485,
    category: 'tops',
    gender: 'womens',
    image: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&h=400&fit=crop',
    productUrl: 'https://mrporter.com/auralee-cashmere-turtleneck',
    inStock: true,
    sizes: ['1', '2', '3', '4'],
    tags: ['knitwear', 'cashmere', 'turtleneck', 'japanese'],
    scores: { minimalist: 95, business: 80, casual: 75, luxury: 95, streetwear: 30, avantgarde: 40, romantic: 60, androgynous: 65 }
  },
  {
    id: 'jil-sander-shirt',
    name: 'Oversized Cotton-Poplin Shirt',
    brand: 'Jil Sander',
    retailer: 'Mytheresa',
    price: 750,
    category: 'tops',
    gender: 'womens',
    image: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=400&h=400&fit=crop',
    productUrl: 'https://mytheresa.com/jil-sander-oversized-shirt',
    inStock: true,
    sizes: ['34', '36', '38', '40', '42'],
    tags: ['shirt', 'cotton', 'oversized', 'tailored'],
    scores: { minimalist: 98, business: 85, casual: 70, luxury: 92, streetwear: 45, avantgarde: 50, romantic: 40, androgynous: 80 }
  },
  {
    id: 'lemaire-croissant-bag',
    name: 'Croissant Small Leather Bag',
    brand: 'Lemaire',
    retailer: 'SSENSE',
    price: 890,
    category: 'accessories',
    gender: 'unisex',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
    productUrl: 'https://ssense.com/lemaire-croissant-bag',
    inStock: true,
    sizes: ['ONE SIZE'],
    tags: ['bag', 'leather', 'croissant', 'crossbody'],
    scores: { minimalist: 90, business: 70, casual: 85, luxury: 90, streetwear: 60, avantgarde: 70, romantic: 80, androgynous: 75 }
  },
  {
    id: 'everlane-organic-cotton-crew',
    name: 'The Organic Cotton Crew',
    brand: 'Everlane',
    retailer: 'Everlane',
    price: 38,
    category: 'tops',
    gender: 'womens',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    productUrl: 'https://everlane.com/organic-cotton-crew',
    inStock: true,
    sizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
    tags: ['t-shirt', 'cotton', 'basic', 'essential'],
    scores: { minimalist: 88, business: 45, casual: 95, luxury: 40, streetwear: 50, avantgarde: 20, romantic: 30, androgynous: 70 }
  },
  {
    id: 'toteme-ribbed-tee',
    name: 'Ribbed Modal T-Shirt',
    brand: 'Totême',
    retailer: 'Totême',
    price: 150,
    category: 'tops',
    gender: 'womens',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop',
    productUrl: 'https://toteme-studio.com/ribbed-modal-tee',
    inStock: true,
    sizes: ['XS', 'S', 'M', 'L'],
    tags: ['t-shirt', 'modal', 'ribbed', 'layering'],
    scores: { minimalist: 95, business: 55, casual: 90, luxury: 75, streetwear: 35, avantgarde: 30, romantic: 50, androgynous: 65 }
  },
  {
    id: 'studio-nicholson-trousers',
    name: 'Volume Pleat Trousers',
    brand: 'Studio Nicholson',
    retailer: 'Matches Fashion',
    price: 395,
    category: 'bottoms',
    gender: 'womens',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop',
    productUrl: 'https://matchesfashion.com/studio-nicholson-trousers',
    inStock: true,
    sizes: ['UK6', 'UK8', 'UK10', 'UK12', 'UK14'],
    tags: ['trousers', 'pleated', 'volume', 'japanese-wool'],
    scores: { minimalist: 95, business: 75, casual: 80, luxury: 85, streetwear: 50, avantgarde: 65, romantic: 45, androgynous: 80 }
  },
  {
    id: 'our-legacy-camo-shirt',
    name: 'Camo Print Box Shirt',
    brand: 'Our Legacy',
    retailer: 'END.',
    price: 245,
    category: 'tops',
    gender: 'unisex',
    image: 'https://images.unsplash.com/photo-1515347619252-60a6bf4fffce?w=400&h=400&fit=crop',
    productUrl: 'https://endclothing.com/our-legacy-camo-shirt',
    inStock: true,
    sizes: ['44', '46', '48', '50', '52', '54'],
    tags: ['shirt', 'camo', 'boxy', 'print'],
    scores: { minimalist: 60, business: 30, casual: 90, luxury: 55, streetwear: 85, avantgarde: 70, romantic: 25, androgynous: 85 }
  },
  // More products truncated for brevity - add ~168 more following same pattern
];

// Matching engine - deterministic scoring
export function matchProducts(
  products: Product[],
  preferences: {
    styles: string[];
    brands: string[];
    budget: number;
    gender: string;
    categories: string[];
    strictBrands: boolean;
  }
): Product[] {
  let scored = products.map(product => {
    // Base score
    let score = 0;
    
    // Style matching (weighted heavily)
    if (preferences.styles.length > 0) {
      const styleScore = preferences.styles.reduce((acc, style) => {
        return acc + (product.scores[style as keyof typeof product.scores] || 50);
      }, 0) / preferences.styles.length;
      score += styleScore * 0.5; // 50% weight
    }
    
    // Brand matching
    if (preferences.brands.length > 0) {
      const brandMatch = preferences.brands.includes(product.brand.toLowerCase().replace(/\s+/g, '-'));
      if (preferences.strictBrands && !brandMatch) {
        return { ...product, matchScore: -1 }; // Filter out
      }
      if (brandMatch) {
        score += 30; // 30% weight for brand match
      }
    }
    
    // Budget proximity (prefer items at 70-100% of budget, not way under)
    const budgetRatio = product.price / preferences.budget;
    if (budgetRatio <= 1) {
      score += (budgetRatio * 20); // Up to 20% for max budget utilization
    }
    
    // Gender match
    if (preferences.gender && product.gender !== preferences.gender && product.gender !== 'unisex') {
      return { ...product, matchScore: -1 }; // Filter out
    }
    
    // Category match
    if (preferences.categories.length > 0) {
      const categoryMatch = preferences.categories.includes(product.category);
      if (!categoryMatch) {
        return { ...product, matchScore: -1 }; // Filter out
      }
      score += 15; // Bonus for category match
    }
    
    return { ...product, matchScore: Math.round(score) };
  });
  
  // Filter out rejected items and sort by score
  return scored
    .filter((p: Product & { matchScore: number }) => p.matchScore > 0)
    .sort((a: Product & { matchScore: number }, b: Product & { matchScore: number }) => b.matchScore - a.matchScore) as Product[];
}

// Generate explanation for why items were selected
export function generateMatchExplanation(
  product: Product,
  preferences: { styles: string[]; brands: string[] }
): string {
  const reasons: string[] = [];
  
  // Check style alignment
  const topStyles = preferences.styles
    .filter(s => product.scores[s as keyof typeof product.scores] > 70)
    .slice(0, 2);
  if (topStyles.length > 0) {
    reasons.push(`Perfect for ${topStyles.join(' and ')} style`);
  }
  
  // Check brand match
  if (preferences.brands.includes(product.brand.toLowerCase().replace(/\s+/g, '-'))) {
    reasons.push(`From your preferred brand ${product.brand}`);
  }
  
  // Quality/fabric notes
  if (product.tags.includes('cashmere')) reasons.push('Luxurious cashmere fabric');
  if (product.tags.includes('wool')) reasons.push('Premium wool construction');
  if (product.tags.includes('silk')) reasons.push('Elegant silk material');
  
  // Versatility
  const versatilityScore = Object.values(product.scores).filter(s => s > 60).length;
  if (versatilityScore >= 4) {
    reasons.push('Highly versatile across occasions');
  }
  
  return reasons[0] || 'Curated for your preferences';
}