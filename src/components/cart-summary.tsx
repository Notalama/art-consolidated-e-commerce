import { formatUsd } from '@/lib/format-money';
import { cn } from '@/lib/utils';

type CartSummaryProps = {
  itemCount: number;
  subtotal: number;
  className?: string;
};

export function CartSummary({
  itemCount,
  subtotal,
  className,
}: CartSummaryProps) {
  return (
    <aside
      className={cn(
        'min-w-0 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900',
        className,
      )}
    >
      <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Order summary
      </h2>

      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-zinc-600 dark:text-zinc-300">Items</dt>
          <dd
            data-testid="cart-summary-item-count"
            className="font-medium text-zinc-900 dark:text-zinc-50"
          >
            {itemCount}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-4">
          <dt className="text-zinc-600 dark:text-zinc-300">Order subtotal</dt>
          <dd
            data-testid="cart-summary-subtotal"
            className="font-medium text-zinc-900 dark:text-zinc-50"
          >
            {formatUsd(subtotal)}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-zinc-200 pt-3 dark:border-zinc-700">
          <dt className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Total
          </dt>
          <dd
            data-testid="cart-summary-total"
            className="text-base font-semibold text-zinc-900 dark:text-zinc-50"
          >
            {formatUsd(subtotal)}
          </dd>
        </div>
      </dl>

      <button
        type="button"
        className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-lg bg-zinc-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        Go to checkout
      </button>
    </aside>
  );
}
