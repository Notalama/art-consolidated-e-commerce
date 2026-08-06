# Home Page Product Catalog

## Summary

Replace the default Next.js starter on `/` with a server-rendered product catalog from DummyJSON. Shoppers see a responsive grid of product cards (image, title, price, rating) and can open a product detail route by clicking a card.

## Goals

- Fetch products on the server via `fetchProducts()` (`GET https://dummyjson.com/products`).
- Render a responsive product grid on `/`.
- Provide a reusable `ProductCard` with thumbnail, title, formatted price, and star rating.
- Show a skeleton UI through `src/app/loading.tsx` while the route segment loads.
- Navigate to `/products/[id]` when a card is activated.

## Non-goals

- Pagination, search, filters, or sort controls.
- Client-side product fetching / TanStack Query for this page.
- Full product detail page UI (route may be a placeholder until that feature).
- Cart actions on the card (add-to-cart is out of scope here).
- Asserting skeleton visibility in BDD (too timing-sensitive against a fast API).

## Route & data fetching

| Item | Detail |
| --- | --- |
| Route | `/` → `src/app/page.tsx` (Server Component) |
| Data | `await fetchProducts()` from `src/lib/api.ts` (DummyJSON in app runs; `src/fixtures/products.json` when `USE_PRODUCT_FIXTURES=1`) |
| Caching | Use Next.js `fetch` defaults from the API helper (no extra client cache) |
| Errors | Non-OK DummyJSON responses already throw in `fetchProducts`; surface via Next error boundary / fail the request (no custom error UI required in this slice) |

SSR: the product list HTML should be available from the server response (not only after client hydration).

## UI requirements

### Page

- Primary content landmark with an accessible heading (e.g. “Products” or “Shop”).
- Product grid:
  - Mobile: 1 column
  - Tablet (`sm`/`md`): 2 columns
  - Desktop (`lg`+): 3–4 columns
- Empty list: if API returns zero products, show a simple empty message (edge case).

### `ProductCard`

| Element | Behavior |
| --- | --- |
| Thumbnail | Product `thumbnail` image; meaningful `alt` (product title) |
| Title | Product `title` |
| Price | `price` formatted as currency (USD), e.g. `$9.99` |
| Rating | Numeric `rating` with a star icon (`lucide-react` `Star` or equivalent) |
| Interaction | Entire card is a link (or contains a single primary link) to `/products/{id}` |

Suggested path: `src/components/product-card.tsx`.

Cards are presentational; no `'use client'` required unless a small client sub-piece is needed for icons only (prefer keeping the card a Server Component).

### Loading state

- `src/app/loading.tsx` renders a skeleton grid matching the catalog layout (placeholder blocks for image + text lines).
- Skeletons must be decorative / non-interactive (no fake product links).

## Navigation

Clicking a product card navigates to `/products/[id]`.

Until the Product Details feature lands, add a minimal placeholder page at `src/app/products/[id]/page.tsx` so navigation does not 404.

## Accessibility

- Product list in a list or grid with clear card names (link accessible name includes product title).
- Images have non-empty `alt` text.
- Price and rating are visible as text (not icon-only).
- Keyboard: cards are focusable links.

## Acceptance criteria

1. Visiting `/` shows multiple products from DummyJSON.
2. Each card shows thumbnail, title, USD-formatted price, and rating with a star icon.
3. Grid is responsive (1 / 2 / 3–4 columns by breakpoint).
4. `loading.tsx` provides a skeleton catalog while the page segment loads.
5. Activating a product card navigates to `/products/{id}` for that product’s id.
6. BDD scenarios in `e2e/features/home_catalog.feature` pass.

## File plan (implementation phase — not yet)

| Path | Role |
| --- | --- |
| `src/app/page.tsx` | Server Component: fetch + grid |
| `src/app/loading.tsx` | Catalog skeleton |
| `src/components/product-card.tsx` | Card UI + link |
| `src/app/products/[id]/page.tsx` | Placeholder detail route |
| `next.config.ts` | Allow DummyJSON / CDN image hosts if using `next/image` |

## Trade-offs

- **Fixture-backed E2E:** Playwright sets `USE_PRODUCT_FIXTURES=1` so `fetchProducts` / `fetchProductById` read `src/fixtures/products.json` (stable id `1` = “Essence Mascara”). Production / normal `next dev` still calls DummyJSON.
- **Server Components only on home:** keeps the page simple and SEO-friendly; cart header remains the client island.
- **Placeholder detail page:** unblocks navigation BDD before the detail feature.

## Known limitations

- Default DummyJSON page size (~30 products); no “load more”.
- No offline / retry UX beyond Next’s default error handling.
- Skeleton may flash briefly or not be observable on a fast network.
