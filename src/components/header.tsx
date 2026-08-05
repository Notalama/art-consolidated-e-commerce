'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

import { useCartHasHydrated } from '@/components/cart-store-provider';
import { useCartStore } from '@/store/useCartStore';
import { cn } from '@/lib/utils';

export function Header() {
  const hasHydrated = useCartHasHydrated();
  const totalItems = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  const showBadge = hasHydrated && totalItems > 0;
  const cartLabel = showBadge
    ? `Cart, ${totalItems} ${totalItems === 1 ? 'item' : 'items'}`
    : 'Cart';

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-zinc-900 sm:text-lg"
        >
          Arts Consolidated Store
        </Link>

        <nav aria-label="Main" className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900"
          >
            Home
          </Link>

          <Link
            href="/cart"
            aria-label={cartLabel}
            className="relative inline-flex items-center gap-2 text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900"
          >
            <ShoppingCart aria-hidden className="size-5" />
            <span>Cart</span>
            {showBadge ? (
              <span
                data-testid="cart-badge"
                className={cn(
                  'inline-flex min-w-5 items-center justify-center rounded-full bg-zinc-900 px-1.5 py-0.5 text-xs font-semibold text-white',
                )}
              >
                {totalItems}
              </span>
            ) : null}
          </Link>
        </nav>
      </div>
    </header>
  );
}
