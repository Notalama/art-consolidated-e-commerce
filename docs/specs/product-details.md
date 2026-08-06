# Product Details Page

## Summary

Replace the placeholder at `/products/[id]` with a server-rendered product detail view from DummyJSON. Shoppers see full product information and can add the product to the cart **once** from this page. After it is in the cart, the control becomes an **Already in cart** link to `/cart`, where quantity and removal are handled. Missing products render a dedicated 404 via `notFound()`.

## Goals

- Dynamic route `/products/[id]` as a React Server Component.
- Fetch one product with `fetchProductById(id)` → `GET https://dummyjson.com/products/{id}`.
- Display title, main image, description, price, discount percentage, rating.
- **Add to Cart** once: inserts the product at quantity `1` if absent.
- If the product is already in the cart: show **Already in cart** (link to `/cart`) instead of Add to Cart — no further quantity changes from this page.
- Call `notFound()` for invalid / missing product IDs; customize UX with `not-found.tsx`.

## Non-goals

- Incrementing quantity from the details page (no repeated Add clicks).
- Quantity stepper / numeric input / slider on the details page (Cart page feature).
- Removing the item from the details page (use Cart).
- Image gallery / lightbox (single main image is enough).
- Related products or full reviews UI.
- Toast library (badge + control swap are enough).

## Route & data fetching

| Item | Detail |
| --- | --- |
| Route | `/products/[id]` → `src/app/products/[id]/page.tsx` (async Server Component) |
| Params | `params: Promise<{ id: string }>` (await, then parse) |
| Data | `fetchProductById(Number(id))` from `src/lib/api.ts` |
| Invalid id | Non-numeric, empty, or DummyJSON non-OK (e.g. 404) → `notFound()` |
| Images | Reuse `cdn.dummyjson.com` allowlist / `ProductImage` patterns from the catalog |

## UI requirements

### Layout

- Clear page heading: product **title** (`h1`).
- **Main image**: prefer `images[0]` when present, else `thumbnail`; meaningful `alt` (title).
- **Description**: full `description` text.
- **Price**: USD currency format (same approach as catalog).
- **Discount**: visible badge/chip showing `discountPercentage` (e.g. `10.48% off`).
- **Rating**: numeric rating with star icon (consistent with catalog).

### Cart CTA (client island)

| Cart state for this `id` | Control |
| --- | --- |
| Not in cart | `<button>` **Add to Cart** — calls `addItem` once (line quantity `1`) |
| Already in cart | `<Link href="/cart">` (or equivalent) accessible name **Already in cart** — navigates to `/cart` |

Rules:

- Do **not** call `addItem` again while the product is already present (any quantity ≥ 1).
- After a successful add, swap to **Already in cart** without requiring a full page reload.
- Header cart badge updates to reflect `totalItems` (e.g. `1` after first add from empty cart).
- Wait for cart persist hydration before deciding which control to show (avoid flashing Add when the item is already persisted).

Suggested split:

| Piece | Role |
| --- | --- |
| Server page | Fetch product, render static details, pass product snapshot into client CTA |
| Client `ProductCartCta` (or similar) | Hydration-aware Add vs Already-in-cart link |

### Interactive feedback

1. Click **Add to Cart** → item in store at qty `1` → badge updates → CTA becomes **Already in cart**.
2. Click **Already in cart** → navigate to `/cart`.

### 404

| File | Role |
| --- | --- |
| Call `notFound()` when the product cannot be loaded | Triggers Next.js not-found UI |
| `src/app/products/[id]/not-found.tsx` and/or `src/app/not-found.tsx` | “Product not found” + link Home |

## Accessibility

- One `h1` with the product title.
- Image `alt` uses the product title.
- Add to Cart is a `<button>`; Already in cart is a link with that accessible name.
- Discount and rating exposed as text, not icon-only.

## Acceptance criteria

1. Visiting `/products/1` shows title, main image, description, USD price, discount badge, rating, and **Add to Cart** when the item is not in the cart.
2. Clicking **Add to Cart** once adds the product (badge `1` from empty cart) and replaces the button with **Already in cart**.
3. **Already in cart** navigates to `/cart`.
4. A second visit to the same product details page while the item remains in the cart shows **Already in cart**, not Add to Cart.
5. Visiting a non-existent product id (e.g. `/products/999999`) shows the not-found UI.
6. BDD scenarios in `e2e/features/product_details.feature` pass.

## File plan (implementation phase — not yet)

| Path | Role |
| --- | --- |
| `src/app/products/[id]/page.tsx` | RSC: fetch + layout |
| `src/app/products/[id]/not-found.tsx` | Segment 404 UI |
| `src/components/product-cart-cta.tsx` | Client Add / Already-in-cart swap |
| Reuse | `ProductImage`, currency formatting, `useCartStore`, `useCartHasHydrated` |

## Trade-offs

- **One-shot add from details:** Matches “configure amount on cart”; avoids accidental quantity spam.
- **Link vs disabled button:** A link to cart is clearer than a dead control.
- **Badge as feedback:** Reuses header contracts.

## Known limitations

- No multi-image carousel.
- Cannot choose quantity &gt; 1 from details (Cart page).
- Soft 404 copy: prefer segment-level product messaging when both root and segment `not-found` exist.
