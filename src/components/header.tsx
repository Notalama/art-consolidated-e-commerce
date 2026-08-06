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
    <header className="w-full min-w-0 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex w-full min-w-0 max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6">
        <Link
          href="/"
          className="min-w-0 truncate text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-lg"
        >
          Arts Consolidated Store
        </Link>

        <nav
          aria-label="Main"
          className="flex shrink-0 items-center gap-3 sm:gap-6"
        >
          <Link
            href="/"
            className="text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
          >
            Home
          </Link>

          <Link
            href="/cart"
            aria-label={cartLabel}
            className="relative inline-flex min-h-10 items-center gap-2 text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
          >
            <ShoppingCart aria-hidden className="size-5" />
            <span>Cart</span>
            {showBadge ? (
              <span
                data-testid="cart-badge"
                className={cn(
                  'inline-flex min-w-5 items-center justify-center rounded-full bg-zinc-900 px-1.5 py-0.5 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900',
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
