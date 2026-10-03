import { useMemo } from "react";

import ProductGrid from "../../components/ProductGrid";
import useProducts from "../../hooks/useProducts";

function NewArrivals() {
  const { products, loading, error } = useProducts();

  const newProducts = useMemo(() => {
    return products.filter(
      (product) => product.isNew === true
    );
  }, [products]);

  return (
    <section className="min-h-screen bg-black px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-lime-400">
            Just Dropped
          </p>

          <h1 className="text-4xl font-black sm:text-5xl">
            New Arrivals
          </h1>

          <p className="mt-4 max-w-2xl text-gray-400">
            Discover the latest additions to the Trestep
            collection.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        <ProductGrid
          products={newProducts}
          loading={loading}
        />
      </div>
    </section>
  );
}

export default NewArrivals;