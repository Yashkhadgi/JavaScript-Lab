# ShopKart — Amazon-style E-commerce Clone (Frontend Only)

A frontend-only e-commerce UI/UX clone of Amazon.in, built with React + Vite + Tailwind CSS + Zustand.
No backend, no authentication, no real payments — everything runs on mock in-memory data.

## Tech Stack
- React 18 + Vite
- React Router v6 (routing)
- Tailwind CSS (styling, Amazon color palette)
- Zustand (cart + UI state)
- lucide-react (icons)

## Features
- Homepage with hero promo cards + 10 dense category sections (30+ product tiles)
- Product listing page with left filter sidebar (category, brand, rating, price, discount) + sorting
- Click any product → opens a right-side slide-over detail drawer (no page navigation, no URL change)
- Add to Cart / Buy Now, quantity selector, color variants where applicable
- Cart page with quantity steppers, free-delivery progress bar, related products carousel
- Checkout page with address form, payment method selector, order summary, and order confirmation
- No sign-in / auth anywhere — "Hello, sign in" is static text only

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev
```

Then open the URL shown in the terminal (usually **http://localhost:5173**).

### Other commands

```bash
npm run build     # production build (outputs to dist/)
npm run preview   # preview the production build locally
```

## Project Structure

```
src/
  data/products.js          # mock product catalog (33 products, 7 categories)
  store/useStore.js         # Zustand store: cart, product-detail drawer, search, toast
  components/
    Header.jsx               # top navy bar: logo, search, account, cart
    NavBar.jsx                # secondary nav links row
    Footer.jsx                # multi-column footer
    ProductCard.jsx           # product grid card (+ compact tile mode for homepage)
    CategorySection.jsx       # homepage section wrapper (title + 2x2 tile grid)
    ProductDetailDrawer.jsx   # global right-side slide-over product detail panel
    FilterSidebar.jsx         # listing page filters
    StarRating.jsx            # star rating display
    Toast.jsx                 # "Added to cart" toast
  pages/
    HomePage.jsx
    ProductListingPage.jsx
    CartPage.jsx
    CheckoutPage.jsx
  App.jsx                    # routes + layout shell
  main.jsx                   # entry point
```

## Notes
- Product images are placeholder photos from picsum.photos (seeded, so each product always shows the same image). Swap `image` URLs in `src/data/products.js` for real product photos if you want.
- Cart state is in-memory only (Zustand, no persistence) — it resets on page refresh. Add `zustand/middleware persist` with localStorage if you want it to survive reloads.
- To add real products, just add more objects to the `products` array in `src/data/products.js` — every page reads from that single source.
