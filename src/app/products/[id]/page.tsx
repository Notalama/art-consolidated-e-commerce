type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  return (
    <div className="py-4">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
        Product {id}
      </h1>
      <p className="mt-2 text-zinc-600">Product details will appear here.</p>
    </div>
  );
}
