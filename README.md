# ShopperAgent React v2.0

AI-powered personal shopping with vision analysis, brand mood boards, and luxury aesthetics.

## Features

- **Vision Upload**: Upload outfit photos, AI extracts style, colors, items
- **Brand Mood Board**: 
  - "Pure" mode: single brand aesthetic
  - "Mix" mode: blend up to 3 brands with adjustable ratios
- **Smart Matching**: AI scores products by style compatibility
- **Luxury Design**: Minimalist, high-end aesthetic inspired by SSENSE, COS, The Row

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Custom luxury design tokens
- **Animation**: Framer Motion
- **Drag & Drop**: @dnd-kit (for future mood board drag features)
- **Icons**: Lucide React

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Create `.env.local`:

```env
# OpenAI for Vision API (backend only - never expose to client)
OPENAI_API_KEY=sk-...

# Affiliate/Retailer APIs (backend)
RAKUTEN_API_KEY=...
AMAZON_ACCESS_KEY=...
```

## Deployment

### Static Export (Netlify/Vercel)
```bash
npm run build
# Upload 'dist' folder
```

### With Backend (for Vision + Affiliate APIs)
Deploy to:
- Vercel (serverless functions)
- Railway/Render (Node.js)
- VPS (Docker)

## Architecture Notes

### Frontend (React)
- Client-side state management for preferences
- Mock data for products (replace with API calls)
- Simulated vision analysis (replace with OpenAI GPT-4 Vision)

### Backend (Node.js) - To Add
- `/api/vision` - Analyze uploaded images
- `/api/products` - Search/filter product catalog
- `/api/cart` - Generate affiliate cart URLs
- Database: PostgreSQL or MongoDB for user carts, saved looks

### Affiliate Integration
Without scraping, use:
1. **Deep links** with UTM tracking (immediate)
2. **Product Advertising API** (Amazon - requires approval)
3. **Rakuten/LinkShare** (Nordstrom, SSENSE - partner approval)
4. **Retailer direct APIs** (Shopify stores, etc.)

## Next Steps

1. Add Node backend with OpenAI Vision integration
2. Real product database (PostgreSQL + vector embeddings for style matching)
3. User authentication (Clerk/Auth0)
4. Saved carts & lookbooks
5. Price drop alerts (scheduled jobs)

## Design System

- **Colors**: Dark luxury palette with warm gold accent (#c4a77d)
- **Typography**: Inter (clean, modern)
- **Spacing**: Generous whitespace, editorial feel
- **Motion**: Subtle, slow animations (luxury feel)

---

Built with React + Next.js + Tailwind