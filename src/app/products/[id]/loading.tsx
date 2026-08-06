export default function ProductDetailsLoading() {
  return (
    <article
      className="grid gap-8 py-2 lg:grid-cols-2 lg:gap-12"
      aria-busy="true"
      aria-label="Loading product"
    >
      <div className="aspect-square animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <div className="h-9 w-3/4 max-w-md animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-6 w-20 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-8 w-28 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-5 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>

        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-2/3 max-w-sm animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>

        <div className="h-11 w-full max-w-xs animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </article>
  );
}
