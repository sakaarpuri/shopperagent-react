const fs = require('fs');

// Load catalog
const catalog = JSON.parse(fs.readFileSync('fashion_catalog.json', 'utf8'));

// Style tag definitions
const styleRules = {
  // By store/brand
  storeStyles: {
    'Kith': ['streetwear', 'luxe', 'trendy', 'premium'],
    'Gymshark': ['sporty', 'athletic', 'performance', 'casual'],
    'Fashion Nova': ['trendy', 'night-out', 'sexy', 'feminine', 'bold'],
    'Allbirds': ['sustainable', 'casual', 'comfortable', 'minimalist'],
    'Everlane': ['minimalist', 'sustainable', 'professional', 'classic'],
    'Outdoor Voices': ['sporty', 'casual', 'comfortable', 'active'],
    'Chubbies': ['casual', 'fun', 'bold', 'summer', 'retro'],
    'TomboyX': ['gender-neutral', 'casual', 'comfortable', 'inclusive'],
    'Reformation': ['sustainable', 'feminine', 'trendy', 'chic', 'romantic'],
    'Alo Yoga': ['sporty', 'luxe', 'minimalist', 'yoga', 'premium'],
    'Lululemon': ['sporty', 'premium', 'performance', 'classic']
  },
  
  // By category
  categoryStyles: {
    'Jackets': ['layering', 'structured', 'outerwear'],
    'Pants': ['bottoms', 'structured'],
    'Shirts': ['professional', 'structured', 'versatile'],
    'T-Shirts': ['casual', 'basic', 'comfortable'],
    'Sweatshirts': ['casual', 'cozy', 'comfortable'],
    'Hoodies': ['casual', 'streetwear', 'comfortable'],
    'Sweaters': ['cozy', 'warm', 'layering', 'classic'],
    'Jeans': ['casual', 'classic', 'versatile'],
    'Leggings': ['sporty', 'comfortable', 'stretchy'],
    'Dresses': ['feminine', 'dressy', 'versatile'],
    'Shoes': ['practical', 'everyday'],
    'Running Shoes': ['sporty', 'performance', 'comfortable'],
    'Casual Shoes': ['casual', 'everyday', 'comfortable'],
    'Flats': ['feminine', 'comfortable', 'professional'],
    'Shorts': ['casual', 'summer', 'comfortable'],
    'Tops': ['versatile', 'feminine', 'layering'],
    'Outerwear': ['layering', 'structured', 'professional'],
    'Bodysuits': ['fitted', 'sexy', 'layering', 'trendy'],
    'Lingerie': ['intimate', 'feminine', 'sexy'],
    'Accessories': ['styling', 'finishing-touch'],
    'Sandals': ['summer', 'casual', 'comfortable'],
    'Swimwear': ['summer', 'beach', 'sexy', 'bold'],
    'Underwear': ['intimate', 'comfortable', 'basic']
  },
  
  // By name keywords
  keywordStyles: {
    'silk': ['luxe', 'elegant', 'professional'],
    'cashmere': ['luxe', 'cozy', 'premium', 'classic'],
    'leather': ['edgy', 'luxe', 'bold', 'classic'],
    'suede': ['luxe', 'bohemian', 'classic'],
    'velvet': ['luxe', 'elegant', 'night-out'],
    'linen': ['minimalist', 'summer', 'breezy', 'sustainable'],
    'denim': ['casual', 'classic', 'versatile'],
    'organic': ['sustainable', 'minimalist'],
    'seamless': ['sporty', 'smooth', 'comfortable'],
    'cropped': ['trendy', 'youthful', 'casual'],
    'oversized': ['relaxed', 'trendy', 'comfortable', 'streetwear'],
    'baggy': ['relaxed', 'trendy', 'streetwear', 'retro'],
    'wide leg': ['trendy', 'relaxed', 'retro'],
    'high rise': ['flattering', 'trendy', 'feminine'],
    'vintage': ['retro', 'classic', 'unique'],
    'bandage': ['sexy', 'night-out', 'fitted', 'bold'],
    'backless': ['sexy', 'night-out', 'elegant', 'bold'],
    'slip': ['elegant', 'feminine', 'luxe', 'minimalist'],
    'maxi': ['elegant', 'boho', 'feminine'],
    'midi': ['elegant', 'professional', 'feminine', 'classic'],
    'mini': ['sexy', 'trendy', 'night-out', 'youthful'],
    'ribbed': ['trendy', 'textured', 'casual'],
    'quilted': ['cozy', 'classic', 'texture'],
    'mesh': ['sporty', 'sexy', 'bold'],
    'chiffon': ['elegant', 'feminine', 'flowy', 'romantic'],
    'lace': ['feminine', 'sexy', 'elegant', 'romantic'],
    'corset': ['sexy', 'trendy', 'night-out', 'bold'],
    'cargo': ['utilitarian', 'trendy', 'casual', 'streetwear'],
    'trench': ['classic', 'professional', 'timeless'],
    'blazer': ['professional', 'structured', 'classic', 'workwear'],
    'polo': ['preppy', 'classic', 'smart-casual'],
    'turtleneck': ['classic', 'cozy', 'minimalist', 'professional'],
    'bodysuit': ['trendy', 'fitted', 'layering', 'versatile'],
    'jumpsuit': ['trendy', 'feminine', 'versatile', 'elegant'],
    'romper': ['casual', 'summer', 'youthful', 'feminine'],
    'sweatpant': ['casual', 'cozy', 'comfortable', 'loungewear'],
    'legging': ['sporty', 'comfortable', 'versatile'],
    'bra': ['intimate', 'sporty', 'feminine'],
    'hoodie': ['casual', 'streetwear', 'cozy', 'comfortable'],
    'cardigan': ['cozy', 'classic', 'layering', 'feminine'],
    'skirt': ['feminine', 'versatile', 'classic'],
    'short': ['casual', 'summer', 'comfortable'],
    'tank': ['casual', 'summer', 'layering', 'basic'],
    'camisole': ['feminine', 'layering', 'elegant', 'basic'],
    'jogger': ['casual', 'sporty', 'comfortable', 'loungewear'],
    'puffer': ['warm', 'casual', 'winter', 'trendy'],
    'parka': ['utilitarian', 'warm', 'outdoor', 'classic'],
    'bomber': ['trendy', 'casual', 'streetwear', 'retro'],
    'windbreaker': ['sporty', 'casual', 'outdoor', 'lightweight'],
    'tote': ['practical', 'classic', 'versatile'],
    'crossbody': ['practical', 'casual', 'hands-free'],
    'backpack': ['practical', 'casual', 'sporty', 'student'],
    'bucket hat': ['trendy', 'casual', 'streetwear', 'retro'],
    'beanie': ['cozy', 'casual', 'winter', 'streetwear'],
    'cap': ['casual', 'sporty', 'streetwear'],
    'sunglasses': ['stylish', 'summer', 'essential'],
    'belt': ['structured', 'finishing-touch', 'professional'],
    'scarf': ['cozy', 'elegant', 'layering', 'classic']
  },
  
  // Price-based
  priceStyles: {
    luxe: 300,
    premium: 150,
    affordable: 50
  }
};

// Function to extract tags for a product
function getProductTags(product, storeName) {
  const tags = new Set();
  const name = product.name.toLowerCase();
  const category = product.category;
  
  // Add store-based tags
  if (styleRules.storeStyles[storeName]) {
    styleRules.storeStyles[storeName].forEach(tag => tags.add(tag));
  }
  
  // Add category-based tags
  if (styleRules.categoryStyles[category]) {
    styleRules.categoryStyles[category].forEach(tag => tags.add(tag));
  }
  
  // Add keyword-based tags
  Object.entries(styleRules.keywordStyles).forEach(([keyword, keywordTags]) => {
    if (name.includes(keyword)) {
      keywordTags.forEach(tag => tags.add(tag));
    }
  });
  
  // Add price-based tags
  const price = parseFloat(product.price.replace(/[^0-9.]/g, ''));
  if (product.price.includes('€')) {
    // Rough EUR to USD
    const usdPrice = price * 1.1;
    if (usdPrice >= styleRules.priceStyles.luxe) tags.add('luxe');
    else if (usdPrice >= styleRules.priceStyles.premium) tags.add('premium');
    else tags.add('affordable');
  } else {
    if (price >= styleRules.priceStyles.luxe) tags.add('luxe');
    else if (price >= styleRules.priceStyles.premium) tags.add('premium');
    else tags.add('affordable');
  }
  
  return Array.from(tags);
}

// Process all products
catalog.stores.forEach(store => {
  store.products.forEach(product => {
    product.style_tags = getProductTags(product, store.store_name);
  });
});

// Update metadata
catalog.catalog_metadata.updated_at = new Date().toISOString().split('T')[0];
catalog.catalog_metadata.has_style_tags = true;

// Save
fs.writeFileSync('fashion_catalog.json', JSON.stringify(catalog, null, 2));

// Count tags
let totalTags = 0;
catalog.stores.forEach(s => s.products.forEach(p => totalTags += p.style_tags.length));

console.log(`✅ Added style tags to ${catalog.catalog_metadata.total_products} products`);
console.log(`📊 Total tags: ${totalTags} (avg ${(totalTags/catalog.catalog_metadata.total_products).toFixed(1)} per product)`);

// Show sample
console.log('\n📝 Sample tags:');
const sample = catalog.stores[0].products[0];
console.log(`${sample.name}: ${sample.style_tags.join(', ')}`);
