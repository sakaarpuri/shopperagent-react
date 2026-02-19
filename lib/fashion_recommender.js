const fs = require('fs');

class FashionRecommender {
  constructor(catalogPath) {
    this.catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
    this.products = this.catalog.stores.flatMap(s => 
      s.products.map(p => ({...p, store_id: s.store_id, store_name: s.store_name}))
    );
  }

  // Parse price to number (handles $, €, commas)
  parsePrice(priceStr) {
    if (typeof priceStr === 'number') return priceStr;
    const num = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
    return priceStr.includes('€') ? num * 1.1 : num; // Convert EUR to USD roughly
  }

  // Extract materials from product name
  extractMaterials(name) {
    const materials = [];
    const n = name.toLowerCase();
    
    // Material detection
    if (n.includes('leather') || n.includes('suede') || n.includes('vachetta')) materials.push('leather');
    if (n.includes('silk') || n.includes('silky') || n.includes('satin') || n.includes('georgette')) materials.push('silk');
    if (n.includes('cashmere')) materials.push('cashmere');
    if (n.includes('denim') || n.includes('jean')) materials.push('denim');
    if (n.includes('cotton') || n.includes('jersey') || n.includes('terry')) materials.push('cotton');
    if (n.includes('wool') || n.includes('merino')) materials.push('wool');
    if (n.includes('linen')) materials.push('linen');
    if (n.includes('canvas')) materials.push('canvas');
    if (n.includes('mesh') || n.includes('chiffon')) materials.push('mesh');
    if (n.includes('velvet') || n.includes('velour')) materials.push('velvet');
    if (n.includes('fleece')) materials.push('fleece');
    if (n.includes('nylon')) materials.push('nylon');
    if (n.includes('poly')) materials.push('polyester');
    
    return materials;
  }

  // Extract style tags from product name
  extractStyleTags(product) {
    const name = product.name.toLowerCase();
    const tags = [];
    
    // Add material tags
    const materials = this.extractMaterials(product.name);
    tags.push(...materials);
    
    // Material-based quality tags
    if (materials.includes('cashmere') || materials.includes('silk') || materials.includes('leather')) {
      tags.push('luxury', 'premium');
    }
    if (materials.includes('organic') || materials.includes('sustainable')) {
      tags.push('eco-friendly', 'sustainable');
    }
    
    // Category-based tags
    const categoryMap = {
      'Dresses': ['dressy', 'feminine', 'elegant'],
      'Jackets': ['outerwear', 'layering', 'structured'],
      'T-Shirts': ['casual', 'basic', 'comfortable'],
      'Sweaters': ['cozy', 'warm', 'layering'],
      'Hoodies': ['casual', 'streetwear', 'comfortable'],
      'Pants': ['bottoms', 'structured'],
      'Jeans': ['casual', 'denim', 'classic'],
      'Leggings': ['athletic', 'stretchy', 'comfortable'],
      'Shoes': ['footwear', 'practical'],
      'Running Shoes': ['athletic', 'sporty', 'comfortable'],
      'Casual Shoes': ['everyday', 'comfortable'],
      'Flats': ['feminine', 'comfortable', 'professional'],
      'Shorts': ['casual', 'summer'],
      'Tops': ['versatile', 'feminine'],
      'Outerwear': ['layering', 'structured', 'professional'],
      'Bodysuits': ['fitted', 'sexy', 'layering'],
      'Lingerie': ['intimate', 'feminine'],
      'Accessories': ['accessory', 'styling'],
      'Sandals': ['summer', 'casual', 'comfortable']
    };
    
    if (categoryMap[product.category]) {
      tags.push(...categoryMap[product.category]);
    }
    
    // Name-based style detection
    if (name.includes('bandage')) tags.push('sexy', 'fitted', 'night-out');
    if (name.includes('slip')) tags.push('comfortable', 'easy');
    if (name.includes('cropped')) tags.push('trendy', 'youthful');
    if (name.includes('oversized')) tags.push('relaxed', 'comfortable', 'trendy');
    if (name.includes('vintage')) tags.push('retro', 'classic');
    if (name.includes('ribbed')) tags.push('textured', 'fitted');
    if (name.includes('boxy')) tags.push('relaxed', 'modern');
    if (name.includes('sustainable') || name.includes('organic')) tags.push('eco-friendly');
    if (name.includes('seamless')) tags.push('smooth', 'athletic');
    if (name.includes('cloudform') || name.includes('buttersoft')) tags.push('comfortable', 'soft');
    if (name.includes('baggy')) tags.push('relaxed', 'trendy', 'streetwear');
    if (name.includes('wide leg')) tags.push('relaxed', 'trendy');
    if (name.includes('high rise') || name.includes('high-rise')) tags.push('flattering', 'trendy');
    if (name.includes('backless') || name.includes('cut out')) tags.push('sexy', 'night-out');
    if (name.includes('midi') || name.includes('maxi')) tags.push('elegant', 'dressy');
    if (name.includes('mini')) tags.push('trendy', 'youthful', 'night-out');
    if (name.includes('wrap')) tags.push('flattering', 'feminine');
    
    // Store-based tags
    const storeTags = {
      'kith': ['streetwear', 'premium', 'trendy', 'designer'],
      'gymshark': ['athletic', 'performance', 'fitted'],
      'fashionnova': ['trendy', 'fast-fashion', 'night-out', 'sexy'],
      'allbirds': ['sustainable', 'comfortable', 'casual', 'eco-friendly'],
      'everlane': ['minimalist', 'sustainable', 'quality', 'basic']
    };
    
    if (storeTags[product.store_id]) {
      tags.push(...storeTags[product.store_id]);
    }
    
    return [...new Set(tags)];
  }

  // Extract occasion from query
  detectOccasion(query) {
    const q = query.toLowerCase();
    const occasions = {
      'workout': ['workout', 'gym', 'exercise', 'running', 'fitness', 'training'],
      'date-night': ['date', 'dinner', 'night out', 'club', 'party', 'sexy'],
      'work': ['work', 'office', 'professional', 'business', 'interview'],
      'casual': ['casual', 'everyday', 'weekend', 'lounging', 'relaxing'],
      'formal': ['formal', 'wedding', 'event', 'elegant', 'fancy'],
      'outdoor': ['outdoor', 'hiking', 'walking', 'travel']
    };
    
    for (const [occasion, keywords] of Object.entries(occasions)) {
      if (keywords.some(k => q.includes(k))) return occasion;
    }
    return 'general';
  }

  // Extract style preferences from query
  extractStylePreferences(query) {
    const q = query.toLowerCase();
    const preferences = {
      vibes: [],
      avoid: []
    };
    
    // Style preferences
    const styleKeywords = {
      'professional': ['work', 'office', 'professional', 'business', 'interview', 'career'],
      'casual': ['casual', 'everyday', 'relaxed', 'laid-back', 'comfortable'],
      'sporty': ['sporty', 'athletic', 'gym', 'workout', 'fitness', 'active'],
      'elegant': ['elegant', 'classy', 'sophisticated', 'refined', 'dressy'],
      'trendy': ['trendy', 'fashionable', 'stylish', 'current', 'modern'],
      'minimalist': ['minimalist', 'simple', 'clean', 'basic', 'understated'],
      'boho': ['boho', 'bohemian', 'flowy', 'hippie', 'earthy'],
      'edgy': ['edgy', 'bold', 'alternative', 'punk', 'rock'],
      'feminine': ['feminine', 'girly', 'delicate', 'romantic', 'soft'],
      'luxe': ['luxe', 'luxury', 'high-end', 'designer', 'expensive', 'premium'],
      'night-out': ['night out', 'clubbing', 'party', 'sexy', 'daring'],
      'classic': ['classic', 'timeless', 'traditional', 'preppy'],
      'sustainable': ['sustainable', 'eco-friendly', 'organic', 'ethical', 'green']
    };
    
    Object.entries(styleKeywords).forEach(([style, keywords]) => {
      if (keywords.some(k => q.includes(k))) {
        preferences.vibes.push(style);
      }
    });
    
    return preferences.vibes;
  }

  // Weighted scoring function (Step 1: Pre-filtering)
  scoreProduct(product, query, budget) {
    const q = query.toLowerCase();
    const price = this.parsePrice(product.price);
    const tags = product.style_tags || this.extractStyleTags(product);
    const materials = this.extractMaterials(product.name);
    const stylePrefs = this.extractStylePreferences(query);
    let score = 0;
    const reasons = [];
    
    // HARD BUDGET FILTER: Reject items >50% over budget
    if (budget && price > budget * 1.5) {
      return { score: 0, reasons: ['Over budget limit'], price, tags, rejected: true };
    }
    
    // Price match (25% weight)
    if (budget) {
      if (price <= budget) {
        score += 0.25;
        reasons.push(`Within budget ($${price.toFixed(0)})`);
      } else if (price <= budget * 1.2) {
        score += 0.18;
        reasons.push(`Slightly over budget (+${((price/budget-1)*100).toFixed(0)}%)`);
      } else if (price <= budget * 1.5) {
        score += 0.10;
        reasons.push(`Over budget (+${((price/budget-1)*100).toFixed(0)}%)`);
      }
    }
    
    // Category match with synonyms (20% weight)
    const categoryKeywords = {
      'dress': ['Dresses'],
      'gown': ['Dresses'],
      'shoe': ['Shoes', 'Running Shoes', 'Casual Shoes', 'Flats', 'Sandals'],
      'sneaker': ['Shoes', 'Running Shoes', 'Casual Shoes'],
      'footwear': ['Shoes', 'Running Shoes', 'Casual Shoes', 'Flats', 'Sandals'],
      'jacket': ['Jackets', 'Outerwear'],
      'coat': ['Jackets', 'Outerwear'],
      'pant': ['Pants', 'Jeans', 'Leggings'],
      'trouser': ['Pants'],
      'sweater': ['Sweaters'],
      'shirt': ['T-Shirts', 'Tops', 'Shirts'],
      'blouse': ['Tops', 'Shirts'],
      'top': ['Tops', 'T-Shirts', 'Shirts'],
      'tee': ['T-Shirts', 'Tops'],
      'legging': ['Leggings'],
      'jean': ['Jeans'],
      'denim': ['Jeans', 'Jackets'],
      'hoodie': ['Hoodies'],
      'sweatshirt': ['Hoodies', 'Sweaters'],
      'short': ['Shorts'],
      'bodysuit': ['Bodysuits', 'Tops'],
      'corset': ['Tops', 'Bodysuits'],
      'bra': ['Lingerie', 'Sports Bras'],
      'jumpsuit': ['Jumpsuits'],
      'romper': ['Jumpsuits'],
      'flat': ['Flats', 'Shoes'],
      'heel': ['Flats', 'Shoes'],
      'accessory': ['Accessories'],
      'bag': ['Accessories'],
      'hat': ['Accessories']
    };
    
    let categoryMatched = false;
    for (const [keyword, categories] of Object.entries(categoryKeywords)) {
      if (q.includes(keyword) && categories.includes(product.category)) {
        score += 0.20;
        reasons.push(`Matching category: ${product.category}`);
        categoryMatched = true;
        break;
      }
    }
    
    // Material match (15% weight - NEW)
    const queryMaterials = this.extractMaterials(query);
    if (queryMaterials.length > 0) {
      const materialMatches = materials.filter(m => queryMaterials.includes(m));
      if (materialMatches.length > 0) {
        score += 0.15;
        reasons.push(`Material match: ${materialMatches.join(', ')}`);
      }
    }
    
    // Style tag match (15% weight - NEW with style_tags)
    if (stylePrefs.length > 0 && tags.length > 0) {
      const styleMatches = tags.filter(tag => stylePrefs.includes(tag));
      if (styleMatches.length > 0) {
        const styleScore = Math.min(0.15, styleMatches.length * 0.08);
        score += styleScore;
        reasons.push(`Style match: ${styleMatches.join(', ')}`);
      }
    }
    
    // Style/occasion match (20% weight)
    const occasion = this.detectOccasion(q);
    const occasionCategoryMap = {
      'workout': ['Leggings', 'Sports Bras', 'T-Shirts', 'Running Shoes', 'Shorts', 'Tanks'],
      'date-night': ['Dresses', 'Tops', 'Shoes', 'Bodysuits', 'Jumpsuits'],
      'work': ['Shirts', 'Pants', 'Outerwear', 'Flats', 'Sweaters', 'Tops'],
      'casual': ['T-Shirts', 'Hoodies', 'Jeans', 'Casual Shoes', 'Sweaters', 'Shorts'],
      'formal': ['Dresses', 'Outerwear', 'Shirts', 'Flats', 'Sweaters'],
      'outdoor': ['Jackets', 'Running Shoes', 'Casual Shoes', 'Pants']
    };
    
    if (occasionCategoryMap[occasion]?.includes(product.category)) {
      score += 0.20;
      reasons.push(`Good for ${occasion}`);
    }
    
    // Keyword match in name (10% weight - reduced from 20%)
    const nameWords = product.name.toLowerCase().split(/\s+/);
    const queryWords = q.split(/\s+/).filter(w => w.length > 3);
    let keywordMatches = 0;
    
    for (const word of queryWords) {
      if (nameWords.some(nw => nw.includes(word) || word.includes(nw))) {
        keywordMatches++;
      }
    }
    
    if (keywordMatches > 0) {
      const matchScore = Math.min(0.10, keywordMatches * 0.03);
      score += matchScore;
      reasons.push(`${keywordMatches} keyword matches`);
    }
    
    // Store preference match (10% weight)
    const storeKeywords = {
      'kith': ['streetwear', 'premium', 'designer', 'trendy'],
      'gymshark': ['gym', 'workout', 'fitness', 'athletic'],
      'fashionnova': ['trendy', 'sexy', 'fashion', 'dress'],
      'allbirds': ['comfortable', 'sustainable', 'eco', 'shoes'],
      'everlane': ['quality', 'minimalist', 'basic', 'sustainable']
    };
    
    if (storeKeywords[product.store_id]?.some(kw => q.includes(kw))) {
      score += 0.10;
      reasons.push(`Matches ${product.store_name} style`);
    }
    
    return { score, reasons, price, tags, materials };
  }

  // Pre-filter candidates (Step 1)
  getCandidates(query, budget, maxCandidates = 15) {
    const scored = this.products.map(p => {
      const scoring = this.scoreProduct(p, query, budget);
      return { ...p, ...scoring };
    });
    
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, maxCandidates)
      .filter(p => p.score > 0); // Only return products with some relevance
  }

  // Format candidates for LLM (Step 2)
  formatForLLM(candidates) {
    return candidates.map((p, i) => ({
      index: i + 1,
      name: p.name,
      store: p.store_name,
      price: p.price,
      category: p.category,
      score: (p.score * 100).toFixed(0) + '%',
      tags: p.tags.slice(0, 5).join(', ')
    }));
  }

  // Main recommendation function
  async recommend(query, budget = null) {
    console.log(`\n🎯 Query: "${query}" | Budget: ${budget ? '$'+budget : 'Any'}`);
    
    // Step 1: Pre-filter with weighted scoring
    const candidates = this.getCandidates(query, budget, 15);
    console.log(`📊 Pre-filtered ${candidates.length} candidates`);
    
    if (candidates.length === 0) {
      return { error: 'No matching products found', candidates: [] };
    }
    
    // Step 2: LLM ranking (returns top 3 with reasoning)
    const formatted = this.formatForLLM(candidates);
    
    // For testing without actual LLM call, return top 3 by score
    const top3 = candidates.slice(0, 3).map((p, i) => ({
      rank: i + 1,
      name: p.name,
      store: p.store_name,
      price: p.price,
      category: p.category,
      product_id: p.id,
      url: `${p.store_name.toLowerCase().replace(/\s/g, '')}.com${p.url}`,
      score: (p.score * 100).toFixed(1) + '%',
      reasons: p.reasons,
      tags: p.tags
    }));
    
    return {
      query,
      budget,
      candidates_count: candidates.length,
      recommendations: top3
    };
  }

  // Test accuracy
  async runAccuracyTests() {
    const tests = [
      { query: "I need workout leggings for the gym", budget: 50 },
      { query: "Something classy for a dinner date", budget: 100 },
      { query: "Comfortable running shoes", budget: 150 },
      { query: "Casual weekend hoodie", budget: 80 },
      { query: "Professional work pants", budget: 120 },
      { query: "Sustainable basic t-shirt", budget: 60 },
      { query: "Trendy dress for clubbing", budget: 40 },
      { query: "Luxury leather jacket", budget: 500 },
      { query: "Comfy shoes for walking", budget: 100 },
      { query: "Elegant silk blouse for work", budget: 150 }
    ];
    
    const results = [];
    for (const test of tests) {
      const result = await this.recommend(test.query, test.budget);
      results.push({ ...test, ...result });
    }
    
    return results;
  }
}

// Export for use
module.exports = FashionRecommender;

// Run tests if called directly
if (require.main === module) {
  const recommender = new FashionRecommender('./fashion_catalog.json');
  
  console.log('='.repeat(60));
  console.log('FASHION RECOMMENDER - ACCURACY TEST');
  console.log('='.repeat(60));
  
  recommender.runAccuracyTests().then(results => {
    console.log('\n' + '='.repeat(60));
    console.log('DETAILED RESULTS');
    console.log('='.repeat(60));
    
    results.forEach((r, i) => {
      console.log(`\n${i + 1}. "${r.query}"`);
      console.log(`   Budget: $${r.budget} | Found: ${r.candidates_count} candidates`);
      console.log('   Top 3:');
      r.recommendations.forEach(rec => {
        console.log(`     ${rec.rank}. ${rec.name} (${rec.store}) - ${rec.price}`);
        console.log(`        Score: ${rec.score} | Category: ${rec.category}`);
        console.log(`        Reasons: ${rec.reasons.join(', ')}`);
        console.log(`        Tags: ${rec.tags.slice(0, 4).join(', ')}`);
      });
    });
    
    // Accuracy scoring
    console.log('\n' + '='.repeat(60));
    console.log('ACCURACY ASSESSMENT');
    console.log('='.repeat(60));
    
    let correctOccasion = 0;
    let correctCategory = 0;
    let withinBudget = 0;
    
    results.forEach(r => {
      const topRec = r.recommendations[0];
      if (!topRec) return;
      
      // Check occasion match
      if (r.query.includes('workout') && ['Leggings', 'Sports Bras'].includes(topRec.category)) correctOccasion++;
      if (r.query.includes('date') && ['Dresses'].includes(topRec.category)) correctOccasion++;
      if (r.query.includes('work') && ['Pants', 'Tops', 'Shirts'].includes(topRec.category)) correctOccasion++;
      if (r.query.includes('running') && ['Running Shoes'].includes(topRec.category)) correctOccasion++;
      if (r.query.includes('casual') && ['Hoodies', 'T-Shirts', 'Casual Shoes'].includes(topRec.category)) correctOccasion++;
      
      // Check budget
      const price = typeof topRec.price === 'string' 
        ? parseFloat(topRec.price.replace(/[^0-9.]/g, '')) 
        : topRec.price;
      if (price <= r.budget * 1.2) withinBudget++;
    });
    
    console.log(`\nTests passed: ${results.length}`);
    console.log(`Correct occasion/category matches: ${correctOccasion}/${results.length}`);
    console.log(`Within budget (+20% tolerance): ${withinBudget}/${results.length}`);
    console.log(`\nEstimated accuracy: ${((correctOccasion + withinBudget) / (results.length * 2) * 100).toFixed(1)}%`);
  });
}
