# Global Navigation & Header

## Summary

Site-wide header for Arts Consolidated Store: brand title, Home and Cart navigation, and a live cart-item badge driven by `useCartStore.totalItems()`. Mounted once in the root layout so it appears on every page.

## Goals

- Render a persistent header with site title **"Arts Consolidated Store"**.
- Provide navigation to Home (`/`) and Cart (`/cart`).
- Show a cart icon with a badge that reflects `totalItems` from the Zustand cart store.
- Handle Next.js client hydration so the badge does not flash incorrect counts before persist rehydration.

## Non-goals

- Product list, product detail, or cart page content (routes may be placeholders).
- Mobile hamburger / drawer navigation.
- Search, account, or theme controls.
- Applying discounts in the badge (badge is count only).

## UI requirements

### Brand / title

| Requirement | Detail |
| --- | --- |
| Visible text | `Arts Consolidated Store` |
| Behavior | Links to Home (`/`) |
| Semantics | Prefer a heading or link with accessible name matching the title |

### Navigation

| Link | Target | Notes |
| --- | --- | --- |
| Home | `/` | Clear accessible name “Home” |
| Cart | `/cart` | Accessible name includes “Cart”; may combine icon + text |

Use Next.js `Link` for client-side navigation. Header must remain visible after navigation.

### Cart badge

| State | Behavior |
| --- | --- |
| `totalItems() === 0` | Badge is **not shown** (or not visible to assistive tech as a count) |
| `totalItems() > 0` | Badge displays the numeric count (sum of quantities, not unique SKUs) |
| Updates | Badge updates immediately when cart store `addItem` / `removeItem` / `updateQuantity` / `clearCart` changes totals |
| Source of truth | `useCartStore` → `totalItems()` |

Icon: `lucide-react` shopping cart (or equivalent) next to / as part of the Cart control.

## Hydration (Next.js + Zustand)

The header (or the badge sub-tree) must be a **client component** because it reads Zustand state.

| Concern | Approach |
| --- | --- |
| SSR / first paint | Before persist rehydration, treat count as unknown / empty — do **not** render a misleading non-zero badge from the empty default store |
| After rehydration | Subscribe to `items` / `totalItems` and show the live badge |
| Helper | Reuse or introduce `useCartHasHydrated` / `useSyncExternalStore` on `persist.hasHydrated()` (see cart-store provider patterns) |
| Layout | Keep `RootLayout` as a Server Component; compose `<SiteHeader />` (client) inside it above `{children}` |

Avoid reading `localStorage` directly in the header; go through the store.

## Accessibility

- Landmark: wrap header in `<header>` (or `role="banner"`).
- Links discoverable by role + name (Playwright: `getByRole('link', { name: ... })`).
- Cart badge count exposed accessibly (e.g. text inside the Cart link, or `aria-label` like `Cart, 3 items` when count > 0).

## Acceptance criteria

1. On any page with the root layout, the header shows **Arts Consolidated Store**.
2. Header includes working links to `/` (Home) and `/cart` (Cart).
3. With an empty cart, no numeric cart badge is shown.
4. After items are added to the cart, the badge shows `totalItems` and updates when items are removed or quantity is decreased for the same product.
5. After a full page load with persisted cart data, the badge shows the correct count once hydration finishes (no lasting wrong non-zero flash from pre-hydrate empty state).
6. BDD scenarios in `e2e/features/header.feature` pass.

## File plan (implementation phase — not yet)

| Path | Role |
| --- | --- |
| `src/components/site-header.tsx` | Client header: title, nav, cart badge |
| `src/app/layout.tsx` | Mount `<SiteHeader />` above page content |
| `src/app/cart/page.tsx` | Minimal placeholder so `/cart` is a valid route |
| Optional | Extract `useCartHasHydrated` if not already shared |

## Trade-offs

- **Hide badge at zero** vs always show `0`: hiding reduces noise; tests assert absence when empty.
- **Client header** vs server header + client badge only: a single client header keeps wiring simple for this assignment size.
- **Placeholder `/cart` page**: required so Cart navigation does not 404 before the cart feature ships.

## Known limitations

- No responsive collapse / mobile menu.
- Badge does not show total price (count only).
- Cart page content is out of scope for this slice.
