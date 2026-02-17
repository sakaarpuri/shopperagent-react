# ShopperAgent v2: React Architecture & Vision Integration

## What Changed: HTML → React

### 1. Component Architecture
**Before (HTML)**: One 600-line file with inline styles, manual DOM manipulation
**After (React)**: Modular components with clear separation of concerns

```
components/
├── vision-upload.tsx      # Photo analysis UI
├── brand-mood-board.tsx   # Drag/blend interface
app/
├── page.tsx               # Main flow orchestrator
├── layout.tsx             # Root layout + styling
```

### 2. State Management
**Before**: Global variables, manual DOM updates, bugs like "initApp not called"
**After**: React state with automatic re-renders, clear data flow

```typescript
// React: Single source of truth
const [preferences, setPreferences] = useState<UserPreferences>({
  gender: '',
  brands: [],
  mode: 'pure',
  // ...
});
```

### 3. Design System
**Before**: Inline styles mixed with CSS, inconsistent spacing
**After**: Tailwind with luxury design tokens

```css
/* Consistent luxury aesthetic */
--accent: #c4a77d;        /* Warm gold */
--background: #0a0a0b;    /* Rich black */
--surface: #141414;       /* Elevated cards */
```

## Vision Integration: How It Works

### User Flow
1. **Upload**: User drops photo or clicks to upload
2. **Analysis**: Image sent to OpenAI GPT-4 Vision API
3. **Extraction**: AI returns structured data:
   ```json
   {
     "items": [
       { "type": "Wool coat", "color": "Camel", "style": "minimalist" },
       { "type": "Trousers", "color": "Black", "style": "business" }
     ],
     "overallStyle": ["minimalist", "luxury"],
     "colorPalette": ["#c4a77d", "#1a1a1a"]
   }
   ```
4. **Matching**: System finds products with similar style scores

### Implementation (Backend Required)
```typescript
// pages/api/analyze-image.ts
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { imageBase64 } = await req.json();
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: 'Analyze this outfit. Return JSON with: items[], overallStyle[], colorPalette[]' },
        { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
      ]
    }],
    response_format: { type: 'json_object' }
  });
  
  return Response.json(JSON.parse(response.choices[0].message.content));
}
```

## Real-World Usability: Retailer Integration

### Option 1: Deep Links (Immediate, No Scraping)
User clicks "Add to SSENSE Cart" → Opens retailer product page with affiliate link
- **Pros**: No ToS issues, instant, works with any retailer
- **Cons**: User must manually add to cart on retailer site
- **Tracking**: UTM parameters + affiliate network

### Option 2: Affiliate APIs (Real Data)
Once approved for partner programs:

| Network | Retailers | Data Available |
|---------|-----------|----------------|
| Rakuten | Nordstrom, SSENSE, MR PORTER | Catalog, prices, images |
| Amazon Product API | Amazon | Full catalog |
| CJ Affiliate | Everlane, Adidas | Product feeds |

**Implementation**:
```typescript
// Search affiliate API instead of static JSON
const products = await rakutenApi.search({
  keyword: 'wool coat',
  merchant: 'ssense',
  sort: 'relevance'
});
```

### Option 3: Universal Cart (Advanced)
Some retailers support pre-filled carts via URL params:
- **Shopify stores**: `?cart=[{id:123,qty:1}]`
- **Custom integrations**: Direct API (requires partnership)

## Brand Selection: Pure vs Mix

### Pure Mode
User selects one brand → All recommendations from that aesthetic
- Filters products by brand
- Higher style score weighting

### Mix Mode (Unique Feature)
User selects 2-3 brands → AI blends aesthetics
- Adjustable ratio sliders (e.g., 60% The Row, 40% Acne)
- Products scored by weighted combination of brand aesthetics
- Visual "mood board" interface

## What Makes This "Luxury"

### Visual Design
- **Color**: Warm gold accent on deep black (not bright green)
- **Typography**: Clean geometric sans-serif, generous line-height
- **Motion**: Slow, ease-out animations (0.5s not 0.2s)
- **Spacing**: Editorial-style whitespace
- **Imagery**: High-quality Unsplash photography

### Interaction Patterns
- No jarring state changes
- Subtle hover effects
- Progress indicators during AI operations
- Clear feedback on selections

## Deployment Path

### Phase 1: Static (Current)
- Next.js static export
- Deploy to Netlify/Vercel
- Mock data for products
- Simulated vision analysis

### Phase 2: Add Backend
- Deploy Node.js API routes
- OpenAI Vision integration
- PostgreSQL for product database
- Real affiliate API calls

### Phase 3: Full Product
- User authentication
- Saved carts & lookbooks
- Price tracking/alerts
- Mobile app (React Native)

## Next Actions

1. **Test locally**: `npm install && npm run dev`
2. **Add backend**: Create `pages/api/` routes for vision + products
3. **Apply for affiliates**: Rakuten, Amazon, individual retailer programs
4. **Build product database**: Scrape (if permitted) or manually curate luxury items with style scores

## Comparison: What React Enables

| Feature | HTML Version | React Version |
|---------|--------------|---------------|
| Vision Upload | ❌ Not possible cleanly | ✅ Drop zone + preview |
| Brand Mood Board | ❌ Static buttons | ✅ Interactive mix/blend |
| State Management | ❌ Bug-prone globals | ✅ Clean hooks |
| Animations | ❌ Manual CSS | ✅ Framer Motion |
| Component Reuse | ❌ Copy-paste | ✅ Import components |
| Backend Integration | ❌ Static only | ✅ API routes ready |
| Mobile Responsive | ⚠️ Partial | ✅ Tailwind responsive |

The React version is a **foundation for a real product**, not just a demo.