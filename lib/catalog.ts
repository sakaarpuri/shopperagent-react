import { Product, Brand, FeedbackModel } from '@/types';

// Popular brands across ALL price ranges
export const POPULAR_BRANDS: Brand[] = [
  // Budget ($-$$)
  { id: 'uniqlo', name: 'Uniqlo', priceRange: '$', aesthetic: 'basics' },
  { id: 'zara', name: 'Zara', priceRange: '$$', aesthetic: 'trendy' },
  { id: 'hm', name: 'H&M', priceRange: '$', aesthetic: 'fast-fashion' },
  { id: 'muji', name: 'Muji', priceRange: '$$', aesthetic: 'minimalist' },
  { id: 'target', name: 'Target', priceRange: '$', aesthetic: 'casual' },
  
  // Mid-Range ($$)
  { id: 'everlane', name: 'Everlane', priceRange: '$$', aesthetic: 'transparent' },
  { id: 'cos', name: 'COS', priceRange: '$$', aesthetic: 'minimalist' },
  { id: 'aritzia', name: 'Aritzia', priceRange: '$$', aesthetic: 'contemporary' },
  { id: 'reformation', name: 'Reformation', priceRange: '$$$', aesthetic: 'sustainable' },
  { id: 'madewell', name: 'Madewell', priceRange: '$$', aesthetic: 'casual' },
  { id: 'jcrew', name: 'J.Crew', priceRange: '$$', aesthetic: 'preppy' },
  { id: 'banana-republic', name: 'Banana Republic', priceRange: '$$', aesthetic: 'business' },
  
  // Premium ($$$)
  { id: 'nordstrom', name: 'Nordstrom', priceRange: '$$-$$$', aesthetic: 'department' },
  { id: 'bloomingdales', name: 'Bloomingdale\'s', priceRange: '$$-$$$', aesthetic: 'department' },
  { id: 'shopbop', name: 'Shopbop', priceRange: '$$-$$$', aesthetic: 'curated' },
  { id: 'ssense', name: 'SSENSE', priceRange: '$$-$$$$', aesthetic: 'designer' },
  
  // Luxury ($$$$)
  { id: 'net-a-porter', name: 'Net-a-Porter', priceRange: '$$$$', aesthetic: 'luxury' },
  { id: 'matches', name: 'Matches Fashion', priceRange: '$$$$', aesthetic: 'luxury' },
  { id: 'farfetch', name: 'Farfetch', priceRange: '$$-$$$$', aesthetic: 'boutique' },
  { id: 'mr-porter', name: 'Mr Porter', priceRange: '$$$$', aesthetic: 'mens-luxury' },
  { id: 'mytheresa', name: 'Mytheresa', priceRange: '$$$$', aesthetic: 'luxury' },
  
  // Athletic/Street
  { id: 'nike', name: 'Nike', priceRange: '$$', aesthetic: 'athletic' },
  { id: 'adidas', name: 'Adidas', priceRange: '$$', aesthetic: 'athletic' },
  { id: 'lululemon', name: 'Lululemon', priceRange: '$$$', aesthetic: 'athleisure' },
  { id: 'alo', name: 'Alo Yoga', priceRange: '$$$', aesthetic: 'athleisure' },
  { id: 'outdoor-voices', name: 'Outdoor Voices', priceRange: '$$', aesthetic: 'active' },
  
  // Sustainable/Ethical
  { id: 'patagonia', name: 'Patagonia', priceRange: '$$$', aesthetic: 'outdoor' },
  { id: 'eileen-fisher', name: 'Eileen Fisher', priceRange: '$$$', aesthetic: 'sustainable' },
  { id: 'kotn', name: 'Kotn', priceRange: '$$', aesthetic: 'ethical' },
  { id: 'pact', name: 'Pact', priceRange: '$$', aesthetic: 'organic' },
];

// Expanded style options
export const STYLE_OPTIONS = [
  { id: 'minimalist', label: 'Minimalist', description: 'Clean, simple, timeless', icon: '◯' },
  { id: 'casual', label: 'Casual', description: 'Relaxed, comfortable', icon: '●' },
  { id: 'business', label: 'Business', description: 'Professional, polished', icon: '◆' },
  { id: 'trendy', label: 'Trendy', description: 'Fashion-forward, current', icon: '▲' },
  { id: 'classic', label: 'Classic', description: 'Traditional, enduring', icon: '■' },
  { id: 'bohemian', label: 'Bohemian', description: 'Free-spirited, artistic', icon: '✿' },
  { id: 'athleisure', label: 'Athleisure', description: 'Sporty, comfortable', icon: '◎' },
  { id: 'romantic', label: 'Romantic', description: 'Soft, feminine', icon: '♡' },
];

type RawProduct = Omit<Product, 'store' | 'metadata'>;

const STORE_PROFILE_BY_BRAND: Record<string, Product['store']> = {
  uniqlo: { id: 'uniqlo', name: 'Uniqlo', capability: 'add_to_cart' },
  zara: { id: 'zara', name: 'Zara', capability: 'add_to_cart' },
  hm: { id: 'hm', name: 'H&M', capability: 'add_to_cart' },
  everlane: { id: 'everlane', name: 'Everlane', capability: 'prefill' },
  cos: { id: 'cos', name: 'COS', capability: 'add_to_cart' },
  aritzia: { id: 'aritzia', name: 'Aritzia', capability: 'add_to_cart' },
  reformation: { id: 'reformation', name: 'Reformation', capability: 'deep_link' },
  lululemon: { id: 'lululemon', name: 'Lululemon', capability: 'add_to_cart' },
  vince: { id: 'vince', name: 'Vince', capability: 'deep_link' },
  toteme: { id: 'toteme', name: 'Toteme', capability: 'deep_link' },
  'the-row': { id: 'the-row', name: 'The Row', capability: 'deep_link' },
  agolde: { id: 'agolde', name: 'Agolde', capability: 'deep_link' },
  nike: { id: 'nike', name: 'Nike', capability: 'add_to_cart' },
  patagonia: { id: 'patagonia', name: 'Patagonia', capability: 'add_to_cart' },
  default: { id: 'multi-brand', name: 'Retail Partner', capability: 'deep_link' }
};

const BRIGHT_COLOR_KEYWORDS = ['neon', 'lime', 'yellow', 'orange', 'hot pink', 'red', 'bright', 'fuchsia', 'electric'];
const SYNTHETIC_MATERIALS = ['polyester', 'nylon', 'acrylic'];
const LOGO_HEAVY_BRANDS = new Set(['nike', 'adidas', 'zara']);

function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function inferMetadata(product: RawProduct): Product['metadata'] {
  const name = product.name.toLowerCase();
  const categoryOccasions: Record<string, string[]> = {
    dresses: ['date-night', 'event'],
    outerwear: ['everyday', 'travel', 'work'],
    shoes: ['everyday', 'travel'],
    tops: ['everyday', 'work'],
    bottoms: ['everyday', 'work'],
    accessories: ['everyday', 'event']
  };
  const materialTags = ['cotton', 'wool', 'cashmere', 'silk', 'linen', 'denim', 'leather', 'polyester', 'nylon']
    .filter(tag => name.includes(tag));
  const fitTags = [
    name.includes('oversized') || name.includes('wide') ? 'relaxed' : '',
    name.includes('slim') || name.includes('tailored') ? 'slim' : '',
    name.includes('straight') ? 'straight' : '',
    name.includes('box') ? 'boxy' : ''
  ].filter(Boolean) as string[];
  const silhouetteTags = [
    name.includes('cropped') ? 'cropped' : '',
    name.includes('wide') ? 'wide-leg' : '',
    name.includes('midi') ? 'midi' : '',
    name.includes('maxi') ? 'maxi' : '',
    name.includes('structured') ? 'structured' : ''
  ].filter(Boolean) as string[];
  const occasionTags = categoryOccasions[product.category] || ['everyday'];
  const brandKey = normalizeKey(product.brand);
  const logoLevel: Product['metadata']['logoLevel'] = LOGO_HEAVY_BRANDS.has(brandKey) ? 'high' : 'low';

  return {
    materialTags: materialTags.length > 0 ? materialTags : ['cotton'],
    fitTags: fitTags.length > 0 ? fitTags : ['regular'],
    silhouetteTags: silhouetteTags.length > 0 ? silhouetteTags : ['classic'],
    occasionTags,
    logoLevel
  };
}

function enrichProduct(product: RawProduct): Product {
  const brandKey = normalizeKey(product.brand);
  const store = STORE_PROFILE_BY_BRAND[brandKey] || STORE_PROFILE_BY_BRAND.default;
  return {
    ...product,
    store: {
      ...store,
      id: store.id || brandKey
    },
    metadata: inferMetadata(product)
  };
}

// Diverse product catalog across price ranges
const RAW_CURATED_PRODUCTS: RawProduct[] = [
  // Budget Tops ($25-75)
  {
    id: 'uniqlo-airism-tee',
    name: 'AIRism Cotton T-Shirt',
    brand: 'Uniqlo',
    price: 29,
    category: 'tops',
    gender: 'unisex',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    productUrl: 'https://uniqlo.com/airism-tee',
    scores: { minimalist: 85, casual: 90, business: 30, classic: 70, trendy: 40, bohemian: 20, athleisure: 60, romantic: 30 }
  },
  {
    id: 'everlane-box-tee',
    name: 'Organic Cotton Box-Cut Tee',
    brand: 'Everlane',
    price: 38,
    category: 'tops',
    gender: 'womens',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=400&fit=crop',
    productUrl: 'https://everlane.com/box-cut-tee',
    scores: { minimalist: 90, casual: 85, business: 35, classic: 75, trendy: 50, bohemian: 30, athleisure: 40, romantic: 35 }
  },
  {
    id: 'zara-basic-shirt',
    name: 'Basic Poplin Shirt',
    brand: 'Zara',
    price: 49,
    category: 'tops',
    gender: 'womens',
    image: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=400&h=400&fit=crop',
    productUrl: 'https://zara.com/basic-shirt',
    scores: { minimalist: 75, casual: 70, business: 80, classic: 85, trendy: 60, bohemian: 25, athleisure: 20, romantic: 40 }
  },
  {
    id: 'cos-knit-sweater',
    name: 'Relaxed Wool Sweater',
    brand: 'COS',
    price: 89,
    category: 'tops',
    gender: 'womens',
    image: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=400&h=400&fit=crop',
    productUrl: 'https://cos.com/wool-sweater',
    scores: { minimalist: 95, casual: 80, business: 65, classic: 80, trendy: 45, bohemian: 35, athleisure: 30, romantic: 55 }
  },
  
  // Mid-Range Tops ($75-150)
  {
    id: 'aritzia-babaton-blouse',
    name: 'Babaton Silk Blouse',
    brand: 'Aritzia',
    price: 128,
    category: 'tops',
    gender: 'womens',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop',
    productUrl: 'https://aritzia.com/babaton-blouse',
    scores: { minimalist: 70, casual: 60, business: 90, classic: 85, trendy: 70, bohemian: 40, athleisure: 20, romantic: 75 }
  },
  {
    id: 'reformation-cashmere',
    name: 'Cashmere Crew Sweater',
    brand: 'Reformation',
    price: 168,
    category: 'tops',
    gender: 'womens',
    image: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&h=400&fit=crop',
    productUrl: 'https://reformation.com/cashmere',
    scores: { minimalist: 80, casual: 85, business: 60, classic: 75, trendy: 65, bohemian: 50, athleisure: 35, romantic: 80 }
  },
  {
    id: 'lululemon-define-jacket',
    name: 'Define Jacket',
    brand: 'Lululemon',
    price: 128,
    category: 'outerwear',
    gender: 'womens',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    productUrl: 'https://lululemon.com/define-jacket',
    scores: { minimalist: 60, casual: 85, business: 20, classic: 50, trendy: 75, bohemian: 15, athleisure: 100, romantic: 20 }
  },
  
  // Premium/Luxury Tops ($150-500)
  {
    id: 'vince-cashmere',
    name: 'Essential Cashmere Sweater',
    brand: 'Vince',
    price: 345,
    category: 'tops',
    gender: 'womens',
    image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=400&h=400&fit=crop',
    productUrl: 'https://vince.com/cashmere',
    scores: { minimalist: 95, casual: 80, business: 85, classic: 90, trendy: 40, bohemian: 30, athleisure: 25, romantic: 70 }
  },
  {
    id: 'toteme-ribbed-tee',
    name: 'Ribbed Modal T-Shirt',
    brand: 'Totême',
    price: 150,
    category: 'tops',
    gender: 'womens',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop',
    productUrl: 'https://toteme-studio.com/ribbed-tee',
    scores: { minimalist: 98, casual: 85, business: 50, classic: 80, trendy: 55, bohemian: 25, athleisure: 35, romantic: 50 }
  },
  {
    id: 'the-row-shirt',
    name: 'Silk Charmeuse Shirt',
    brand: 'The Row',
    price: 890,
    category: 'tops',
    gender: 'womens',
    image: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=400&h=400&fit=crop',
    productUrl: 'https://therow.com/silk-shirt',
    scores: { minimalist: 100, casual: 60, business: 95, classic: 90, trendy: 30, bohemian: 25, athleisure: 10, romantic: 60 }
  },
  
  // Bottoms - Budget
  {
    id: 'uniqlo-wide-pants',
    name: 'Wide Fit Pleated Pants',
    brand: 'Uniqlo',
    price: 49,
    category: 'bottoms',
    gender: 'womens',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
    productUrl: 'https://uniqlo.com/wide-pants',
    scores: { minimalist: 80, casual: 85, business: 60, classic: 75, trendy: 70, bohemian: 45, athleisure: 40, romantic: 35 }
  },
  {
    id: 'everlane-jeans',
    name: 'The Way-High Jean',
    brand: 'Everlane',
    price: 98,
    category: 'bottoms',
    gender: 'womens',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop',
    productUrl: 'https://everlane.com/way-high-jean',
    scores: { minimalist: 75, casual: 90, business: 25, classic: 80, trendy: 80, bohemian: 40, athleisure: 30, romantic: 30 }
  },
  {
    id: 'zara-tailored-trousers',
    name: 'Tailored Straight Trousers',
    brand: 'Zara',
    price: 69,
    category: 'bottoms',
    gender: 'womens',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop',
    productUrl: 'https://zara.com/tailored-trousers',
    scores: { minimalist: 70, casual: 65, business: 85, classic: 80, trendy: 75, bohemian: 25, athleisure: 20, romantic: 35 }
  },
  
  // Bottoms - Mid/Premium
  {
    id: 'aritzia-effortless-pant',
    name: 'Effortless Pant',
    brand: 'Aritzia',
    price: 148,
    category: 'bottoms',
    gender: 'womens',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop',
    productUrl: 'https://aritzia.com/effortless-pant',
    scores: { minimalist: 85, casual: 80, business: 90, classic: 85, trendy: 70, bohemian: 30, athleisure: 35, romantic: 40 }
  },
  {
    id: 'agolde-jeans',
    name: '90s Pinch Waist Jeans',
    brand: 'Agolde',
    price: 188,
    category: 'bottoms',
    gender: 'womens',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
    productUrl: 'https://agolde.com/90s-jeans',
    scores: { minimalist: 70, casual: 95, business: 20, classic: 75, trendy: 95, bohemian: 50, athleisure: 25, romantic: 35 }
  },
  {
    id: 'the-row-ginza-pants',
    name: 'Ginza Straight Pants',
    brand: 'The Row',
    price: 990,
    category: 'bottoms',
    gender: 'womens',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop',
    productUrl: 'https://therow.com/ginza-pants',
    scores: { minimalist: 100, casual: 50, business: 95, classic: 90, trendy: 40, bohemian: 20, athleisure: 10, romantic: 35 }
  },
  
  // Dresses
  {
    id: 'reformation-dress',
    name: 'Juliette Dress',
    brand: 'Reformation',
    price: 248,
    category: 'dresses',
    gender: 'womens',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop',
    productUrl: 'https://reformation.com/juliette-dress',
    scores: { minimalist: 60, casual: 70, business: 50, classic: 70, trendy: 85, bohemian: 80, athleisure: 15, romantic: 95 }
  },
  {
    id: 'zara-slip-dress',
    name: 'Satin Slip Dress',
    brand: 'Zara',
    price: 59,
    category: 'dresses',
    gender: 'womens',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop',
    productUrl: 'https://zara.com/slip-dress',
    scores: { minimalist: 75, casual: 65, business: 40, classic: 75, trendy: 80, bohemian: 60, athleisure: 20, romantic: 85 }
  },
  
  // Shoes - All ranges
  {
    id: 'nike-air-force',
    name: 'Air Force 1',
    brand: 'Nike',
    price: 110,
    category: 'shoes',
    gender: 'unisex',
    image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400&h=400&fit=crop',
    productUrl: 'https://nike.com/air-force-1',
    scores: { minimalist: 70, casual: 100, business: 10, classic: 90, trendy: 85, bohemian: 30, athleisure: 90, romantic: 15 }
  },
  {
    id: 'everlane-day-glove',
    name: 'The Day Glove',
    brand: 'Everlane',
    price: 165,
    category: 'shoes',
    gender: 'womens',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop',
    productUrl: 'https://everlane.com/day-glove',
    scores: { minimalist: 90, casual: 80, business: 85, classic: 85, trendy: 50, bohemian: 40, athleisure: 30, romantic: 60 }
  },
  {
    id: 'margiela-tabi',
    name: 'Tabi Ankle Boots',
    brand: 'Maison Margiela',
    price: 1080,
    category: 'shoes',
    gender: 'womens',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop',
    productUrl: 'https://farfetch.com/margiela-tabi',
    scores: { minimalist: 75, casual: 70, business: 60, classic: 60, trendy: 95, bohemian: 45, athleisure: 20, romantic: 40 }
  },
  {
    id: 'manolo-blahnik',
    name: 'Hangisi Pump',
    brand: 'Manolo Blahnik',
    price: 995,
    category: 'shoes',
    gender: 'womens',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop',
    productUrl: 'https://manoloblahnik.com/hangisi',
    scores: { minimalist: 70, casual: 30, business: 95, classic: 95, trendy: 60, bohemian: 35, athleisure: 5, romantic: 90 }
  },
  
  // Accessories
  {
    id: 'muji-tote',
    name: 'Canvas Tote Bag',
    brand: 'Muji',
    price: 25,
    category: 'accessories',
    gender: 'unisex',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
    productUrl: 'https://muji.com/canvas-tote',
    scores: { minimalist: 95, casual: 90, business: 40, classic: 80, trendy: 30, bohemian: 50, athleisure: 40, romantic: 25 }
  },
  {
    id: 'lemaire-croissant',
    name: 'Croissant Bag',
    brand: 'Lemaire',
    price: 890,
    category: 'accessories',
    gender: 'unisex',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
    productUrl: 'https://lemaire.fr/croissant',
    scores: { minimalist: 95, casual: 85, business: 70, classic: 75, trendy: 80, bohemian: 55, athleisure: 30, romantic: 75 }
  },
  
  // Outerwear
  {
    id: 'uniqlo-ultra-light',
    name: 'Ultra Light Down Jacket',
    brand: 'Uniqlo',
    price: 69,
    category: 'outerwear',
    gender: 'womens',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop',
    productUrl: 'https://uniqlo.com/ultra-light-down',
    scores: { minimalist: 80, casual: 90, business: 30, classic: 75, trendy: 50, bohemian: 25, athleisure: 60, romantic: 20 }
  },
  {
    id: 'toteme-coat',
    name: 'Signature Wool Coat',
    brand: 'Totême',
    price: 990,
    category: 'outerwear',
    gender: 'womens',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop',
    productUrl: 'https://toteme-studio.com/wool-coat',
    scores: { minimalist: 98, casual: 60, business: 85, classic: 90, trendy: 40, bohemian: 25, athleisure: 15, romantic: 50 }
  },
  {
    id: 'patagonia-fleece',
    name: 'Retro Pile Fleece',
    brand: 'Patagonia',
    price: 139,
    category: 'outerwear',
    gender: 'womens',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    productUrl: 'https://patagonia.com/retro-pile',
    scores: { minimalist: 40, casual: 95, business: 10, classic: 60, trendy: 70, bohemian: 60, athleisure: 85, romantic: 20 }
  },
];

export const CURATED_PRODUCTS: Product[] = RAW_CURATED_PRODUCTS.map(enrichProduct);

// FIXED matching algorithm
export function matchProducts(
  products: Product[],
  preferences: {
    styles: string[];
    brands: string[];
    budget: number;
    gender: string;
    categories: string[];
    strictBrands: boolean;
    occasion?: string;
    sizes?: Record<string, string>;
    maxStores?: number;
    negatives?: Array<'no-bright-colors' | 'no-slim-fit'>;
    feedbackModel?: FeedbackModel;
  }
): Product[] {
  const occasionStyleBoost: Record<string, string[]> = {
    everyday: ['casual', 'minimalist', 'classic'],
    work: ['business', 'classic', 'minimalist'],
    'date-night': ['romantic', 'trendy'],
    event: ['trendy', 'romantic', 'classic'],
    travel: ['casual', 'athleisure', 'minimalist'],
    workout: ['athleisure', 'casual']
  };

  // Filter by category AND gender first
  let filtered = products.filter(product => {
    // Gender filter
    if (preferences.gender && product.gender !== 'unisex' && product.gender !== preferences.gender) {
      return false;
    }
    
    // Category filter (MUST match at least one selected category)
    if (preferences.categories.length > 0) {
      if (!preferences.categories.includes(product.category)) {
        return false;
      }
    }
    
    // Brand filter (only if strict mode)
    if (preferences.strictBrands && preferences.brands.length > 0) {
      const brandMatch = preferences.brands.some(b => 
        product.brand.toLowerCase().replace(/\s+/g, '-') === b
      );
      if (!brandMatch) return false;
    }

    if (preferences.negatives?.includes('no-bright-colors')) {
      const nameLower = product.name.toLowerCase();
      if (BRIGHT_COLOR_KEYWORDS.some(color => nameLower.includes(color))) return false;
    }

    if (preferences.negatives?.includes('no-slim-fit') && product.metadata.fitTags.includes('slim')) {
      return false;
    }
    
    return true;
  });
  
  // Score remaining products
  let scored = filtered.map(product => {
    let score = 35;
    
    // Style matching (0-35 points)
    if (preferences.styles.length > 0) {
      const styleScores = preferences.styles.map(style => 
        product.scores[style as keyof typeof product.scores] || 0
      );
      const avgStyleScore = styleScores.reduce((a, b) => a + b, 0) / styleScores.length;
      score += (avgStyleScore / 100) * 35;
      if (avgStyleScore < 45) {
        score -= 18;
      }
    }

    // Occasion-aware boost (0-15 points)
    if (preferences.occasion && occasionStyleBoost[preferences.occasion]) {
      const occasionStyles = occasionStyleBoost[preferences.occasion];
      const occasionScores = occasionStyles.map(style => product.scores[style as keyof typeof product.scores] || 0);
      const avgOccasionScore = occasionScores.reduce((a, b) => a + b, 0) / occasionScores.length;
      score += (avgOccasionScore / 100) * 15;
    }

    // Budget matching (0-30 points)
    if (product.price <= preferences.budget) {
      const ratio = product.price / Math.max(preferences.budget, 1);
      score += 18 + ratio * 12; // Reward close-to-budget matches.
    } else if (product.price <= preferences.budget * 1.2) {
      score += 10;
    } else if (product.price <= preferences.budget * 1.5) {
      score += 4;
    } else {
      score -= 15;
    }

    // Brand preference bonus (0-15 points) - NOT a filter, just bonus
    if (preferences.brands.length > 0 && !preferences.strictBrands) {
      const brandMatch = preferences.brands.some(b => 
        product.brand.toLowerCase().replace(/\s+/g, '-') === b
      );
      if (brandMatch) {
        score += 15;
      }
    }

    // Adaptive feedback boosts from user behavior.
    const feedback = preferences.feedbackModel;
    if (feedback) {
      const topStyles = Object.entries(product.scores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(entry => entry[0]);
      const styleBoost = topStyles.reduce((acc, style) => acc + (feedback.styleAffinity?.[style] || 0), 0);
      const brandBoost = feedback.brandAffinity?.[normalizeKey(product.brand)] || 0;
      const storeBoost = feedback.storeAffinity?.[product.store.id] || 0;
      const categoryBoost = feedback.categoryAffinity?.[product.category] || 0;
      score += styleBoost + brandBoost + storeBoost + categoryBoost;
    }

    return { ...product, matchScore: Math.round(score) };
  });
  
  // Sort by score descending
  scored.sort((a, b) => (b as any).matchScore - (a as any).matchScore);

  // Preserve category coverage first, then fill with best remaining matches.
  const minScore = preferences.styles.length > 0 ? 50 : 40;
  const highConfidence = scored.filter((p: any) => p.matchScore >= minScore) as Product[];
  const diversified: Product[] = [];
  const used = new Set<string>();

  preferences.categories.forEach(category => {
    const firstInCategory = highConfidence.find(product => product.category === category && !used.has(product.id));
    if (firstInCategory) {
      diversified.push(firstInCategory);
      used.add(firstInCategory.id);
    }
  });

  highConfidence.forEach(product => {
    if (!used.has(product.id)) {
      diversified.push(product);
      used.add(product.id);
    }
  });

  const maxStores = Math.max(1, preferences.maxStores ?? 3);
  const limitedStores: Product[] = [];
  const selectedStores = new Set<string>();

  diversified.forEach(product => {
    const storeKey = product.store.id;
    if (selectedStores.has(storeKey)) {
      limitedStores.push(product);
      return;
    }
    if (selectedStores.size < maxStores) {
      selectedStores.add(storeKey);
      limitedStores.push(product);
    }
  });

  return limitedStores;
}

export function generateMatchExplanation(
  product: Product,
  preferences: { styles: string[]; brands: string[]; occasion?: string }
): string {
  const reasons: string[] = [];
  
  // Top matching styles
  if (preferences.styles.length > 0) {
    const styleScores = preferences.styles.map(style => ({
      style,
      score: product.scores[style as keyof typeof product.scores] || 0
    }));
    styleScores.sort((a, b) => b.score - a.score);
    
    const topStyle = styleScores[0];
    if (topStyle.score >= 70) {
      reasons.push(`Perfect for ${topStyle.style} style`);
    } else if (topStyle.score >= 50) {
      reasons.push(`Good for ${topStyle.style} looks`);
    }
  }
  
  // Brand mention
  if (preferences.brands.length > 0) {
    const brandMatch = preferences.brands.some(b => 
      product.brand.toLowerCase().replace(/\s+/g, '-') === b
    );
    if (brandMatch) {
      reasons.push(`From your preferred brand`);
    }
  }
  
  // Category
  reasons.push(`${product.category} category match`);
  
  if (preferences.occasion) {
    reasons.push(`Curated for ${preferences.occasion.replace('-', ' ')} wear`);
  }
  
  return reasons[0] || 'Matches your preferences';
}
