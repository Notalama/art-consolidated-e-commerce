import { ProductCard } from '@/components/product-card';
import { fetchProducts } from '@/lib/api';

export default async function HomePage() {
  const { products } = await fetchProducts();

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
        Products
      </h1>

      {products.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-300">
          No products available right now.
        </p>
      ) : (
        <ul className="grid min-w-0 list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => (
            <li key={product.id} className="min-w-0">
              <ProductCard product={product} priority={index < 4} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
