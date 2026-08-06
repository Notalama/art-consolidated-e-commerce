import { ProductGridSkeleton } from '@/components/product-grid-skeleton';

export default function CatalogLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-8 w-40 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      <ProductGridSkeleton />
    </div>
  );
}
