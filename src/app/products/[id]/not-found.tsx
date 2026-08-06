import Link from 'next/link';

export default function ProductNotFound() {
  return (
    <div className="flex flex-col items-start gap-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
        Product not found
      </h1>
      <p className="max-w-md text-zinc-600">
        We couldn&apos;t find that product. It may have been removed or the link
        is incorrect.
      </p>
      <Link
        href="/"
        className="text-sm font-semibold text-zinc-900 underline-offset-4 hover:underline"
      >
        Back to products
      </Link>
    </div>
  );
}
