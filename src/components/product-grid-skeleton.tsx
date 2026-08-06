import { cn } from '@/lib/utils';

type ProductCardSkeletonProps = {
  className?: string;
};

export function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm',
        className,
      )}
    >
      <div className="aspect-[4/3] animate-pulse bg-zinc-200" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-4 w-4/5 max-w-[80%] animate-pulse rounded bg-zinc-200" />
        <div className="h-4 w-2/5 max-w-[40%] animate-pulse rounded bg-zinc-200" />
        <div className="mt-1 flex items-center justify-between">
          <div className="h-4 w-16 animate-pulse rounded bg-zinc-200" />
          <div className="h-4 w-12 animate-pulse rounded bg-zinc-200" />
        </div>
      </div>
    </div>
  );
}

type ProductGridSkeletonProps = {
  count?: number;
};

export function ProductGridSkeleton({ count = 16 }: ProductGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
