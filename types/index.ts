export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: 'tops' | 'bottoms' | 'shoes' | 'outerwear' | 'accessories' | 'dresses';
  gender: 'mens' | 'womens' | 'unisex';
  image: string;
  productUrl: string;
  scores: Record<string, number>;
  matchScore?: number;
}

export interface Brand {
  id: string;
  name: string;
  priceRange: string;
  aesthetic?: string;
}

export interface UserPreferences {
  gender: 'mens' | 'womens' | 'unisex' | '';
  categories: string[];
  styles: string[];
  brands: string[];
  budget: number;
  strictBrands: boolean;
  mode: 'pure' | 'mix';
  occasion?: 'everyday' | 'work' | 'date-night' | 'event' | 'travel' | 'workout' | '';
  sizes?: Record<string, string>;
}
