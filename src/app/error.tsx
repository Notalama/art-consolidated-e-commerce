'use client';

import { useEffect } from 'react';

type ErrorPageProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function Error({ error, retry }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-start gap-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
        Something went wrong
      </h1>
      <p className="max-w-md text-base text-zinc-700 dark:text-zinc-300">
        We couldn&apos;t load this page. Please try again. If the problem
        continues, check your connection or come back later.
      </p>
      {error.digest ? (
        <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
          Error ID: {error.digest}
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => retry()}
        className="inline-flex h-11 items-center justify-center rounded-lg bg-zinc-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        Try again
      </button>
    </div>
  );
}
