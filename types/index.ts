export interface Product {
  id: string;
  name: string;
  brand: string;
  retailer: string;
  price: number;
  category: 'tops' | 'bottoms' | 'shoes' | 'outerwear' | 'accessories' | 'dresses';
  gender: 'mens' | 'womens' | 'unisex';
  image: string;
  productUrl: string;
  inStock: boolean;
  sizes: string[];
  tags: string[];
  scores: {
    minimalist: number;
    business: number;
    casual: number;
    luxury: number;
    streetwear: number;
    avantgarde: number;
    romantic: number;
    androgynous: number;
  };
  matchScore?: number;
}

export interface Brand {
  id: string;
  name: string;
  aesthetic: string;
  priceRange: 'budget' | 'mid' | 'luxury';
  image: string;
  description: string;
  website?: string;
}

export interface StyleInspiration {
  id: string;
  name: string;
  description: string;
  image: string;
  tags: string[];
  brands: string[];
  products: string[];
}

export interface UserPreferences {
  gender: 'mens' | 'womens' | 'unisex' | '';
  categories: string[];
  styles: string[];
  brands: string[];
  budget: number;
  strictBrands: boolean;
  mode: 'pure' | 'mix';
  mixRatio?: Record<string, number>;
}