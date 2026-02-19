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
  store: {
    id: string;
    name: string;
    capability: 'prefill' | 'add_to_cart' | 'deep_link';
  };
  metadata: {
    materialTags: string[];
    fitTags: string[];
    silhouetteTags: string[];
    occasionTags: string[];
    logoLevel: 'low' | 'medium' | 'high';
  };
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
  negatives?: Array<'no-bright-colors' | 'no-slim-fit'>;
}

export interface FeedbackModel {
  styleAffinity?: Record<string, number>;
  brandAffinity?: Record<string, number>;
  storeAffinity?: Record<string, number>;
  categoryAffinity?: Record<string, number>;
}
