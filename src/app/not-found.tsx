import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-start gap-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
        Page not found
      </h1>
      <p className="max-w-md text-base text-zinc-700 dark:text-zinc-300">
        The page you requested does not exist or may have moved.
      </p>
      <Link
        href="/"
        className="inline-flex h-11 items-center justify-center rounded-lg bg-zinc-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        Back to products
      </Link>
    </div>
  );
}
