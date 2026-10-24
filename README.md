# GiftVision with AI — 30–50% MVP

A React + Vite prototype for an AI-powered gifting website.

## Features
- Ready-made hampers
- 20 sample products
- Custom hamper builder
- Product add/remove and dynamic pricing
- Personalization
- Mock AI hamper recommendation
- Mock AI visual preview
- CSS animated gift-video preview
- Cart with LocalStorage
- Checkout demo
- Order confirmation
- Responsive UI

## Run in VS Code

1. Install Node.js (LTS).
2. Extract/open this folder in VS Code.
3. Open VS Code Terminal.
4. Run:
   ```bash
   npm install
   npm run dev
   ```
5. Open the localhost URL shown by Vite (usually http://localhost:5173).

## Build for production
```bash
npm run build
npm run preview
```

## Future AI integration
Mock service files are in:
- `src/services/aiRecommendationService.js`
- `src/services/aiImageService.js`
- `src/services/aiVideoService.js`

No API key is required for this MVP.
