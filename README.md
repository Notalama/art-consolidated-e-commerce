# Arts Consolidated E-Commerce

A responsive product storefront built for the Arts Consolidated interview assignment. Shoppers can browse products from [DummyJSON](https://dummyjson.com), view product details, and manage a persistent client-side cart.

## Project overview

The app is a Next.js App Router storefront with server-rendered catalog and product pages, a client-side cart (Zustand + `localStorage`), and behavior-driven E2E coverage with Playwright BDD.

**Core user flows**

- Browse the product catalog on the home page
- Open a product detail page (price, discount, rating, description)
- Add a product to the cart (once per product from details; quantity managed on the cart page)
- Review cart lines, adjust quantities, remove items, and see order totals
- Persist cart contents across refreshes in the browser

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router, React Server Components) |
| Language | TypeScript (`strict: true`) |
| UI | React 19, Tailwind CSS 4, Lucide icons |
| Data | DummyJSON REST API (`https://dummyjson.com`) |
| Cart state | Zustand with `persist` + `localStorage` |
| Unit tests | Vitest + happy-dom + Istanbul coverage |
| E2E / BDD | Playwright + [playwright-bdd](https://github.com/vitalets/playwright-bdd) (Gherkin) |

## Run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run test:unit` | Vitest unit tests with coverage |
| `npm run test:bdd` | Generate BDD specs and run Playwright E2E |

### BDD / E2E

First-time Playwright browser install (if needed):

```bash
npx playwright install
```

Then:

```bash
npm run test:bdd
```

E2E runs against a local Next.js server with `NEXT_PUBLIC_E2E=1` so the cart store can be seeded via `window.__CART_STORE__`. Features live under `e2e/features/`; scenarios are derived from the product specs in `docs/specs/`.

## Architecture & thought process

### Next.js App Router for SSR performance

Catalog and product detail pages are React Server Components. Products are fetched on the server from DummyJSON, which:

- Improves first paint and SEO for product content
- Keeps API credentials / fetch logic off the client bundle
- Uses route-level `loading.tsx` skeletons for perceived performance
- Scopes catalog loading to the `(catalog)` route group so product navigation does not flash the grid skeleton

Client components are limited to interactive surfaces: header cart badge, add-to-cart, cart view, and image error fallbacks.

### BDD-driven development workflow

Business behavior was specified first (`docs/specs/<feature>.md`), then expressed as Gherkin under `e2e/features/`, with step definitions and page objects. Implementation followed only after the suite was agreed. That keeps acceptance criteria executable and reduces UI drift.

### Zustand with persistence for cart state

The cart is a client concern for this assignment: no auth and no cart API. Zustand provides a small typed store with:

- `addItem` / `removeItem` / `updateQuantity` / `clearCart`
- `persist` middleware writing `{ items }` to `localStorage` (`cart-storage`)
- `skipHydration: true` plus a provider that rehydrates on the client, avoiding SSR/client HTML mismatch on the badge and cart page

## Trade-offs

| Decision | Why | Cost |
| --- | --- | --- |
| Client-side cart persistence | Matches the assignment scope; no backend required | Cart is device/browser local; no cross-device sync |
| Live DummyJSON in E2E | Realistic integration; less fixture maintenance | Tests depend on third-party availability and payload shape |
| One-shot “Add to Cart” on details | Simpler UX; quantities live on the cart page | No quantity stepper on the product page |
| Checkout button is a no-op | Checkout was out of scope | Summary CTA is present for UI completeness only |
| Catalog loads first DummyJSON page only | API default limit is enough for the demo | No search, filters, or pagination yet |

## Known limitations & roadmap

**Limitations**

- No authentication or user accounts
- No real checkout, payments, tax, or shipping
- No catalog search, category filters, or pagination
- Cart prices are snapshotted at add time; later catalog price changes do not rewrite existing lines
- DummyJSON is an external dependency (availability and rate limits)

**Future roadmap**

1. Checkout flow (shipping address, payment stub, order confirmation)
2. Authentication and server-synced carts
3. Catalog pagination, search, and filters
4. Stock / inventory awareness and optimistic UI
5. Broader component unit tests (React Testing Library) alongside existing Vitest coverage of lib/store

## Project structure (high level)

```text
src/
  app/                 # App Router pages, loading, error, not-found
  components/          # UI (header, product card, cart, …)
  lib/                 # API client, money helpers, utils
  store/               # Zustand cart store
  types/               # Shared TypeScript types
docs/specs/            # Feature specs
e2e/
  features/            # Gherkin scenarios
  steps/               # Step definitions
  pages/               # Page objects
```

## Deploy on Vercel

This project is ready for [Vercel](https://vercel.com):

1. Push the repository to GitHub (or connect another Git provider).
2. Import the project in the Vercel dashboard (framework preset: **Next.js**).
3. Leave build settings at defaults:
   - **Build command:** `npm run build`
   - **Output:** Next.js (automatic)
4. Deploy. No environment variables are required for the storefront (DummyJSON is public).

Optional CLI:

```bash
npx vercel
```

Production notes:

- Cart persistence uses browser `localStorage` only; it does not require Vercel KV or a database.
- Image optimization allows `cdn.dummyjson.com` via `next.config.ts` `images.remotePatterns`.

## Quality notes

- TypeScript strict mode is enabled (`tsconfig.json`).
- Route error recovery: `src/app/error.tsx` (segment boundary with `retry`).
- Unknown routes: `src/app/not-found.tsx`; missing products: `src/app/products/[id]/not-found.tsx`.
- Layout is mobile-first (`px-4`, responsive product grid, stacked cart rows on small screens, larger tap targets on quantity controls).
