import { useMemo } from "react";

import ProductGrid from "../../components/ProductGrid";
import useProducts from "../../hooks/useProducts";

function Events() {
  const { products, loading, error } = useProducts();

  const eventProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.category?.toLowerCase() === "events" ||
        product.category?.toLowerCase() === "event"
    );
  }, [products]);

  return (
    <section className="min-h-screen bg-black px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-lime-400">
            Premium Occasions
          </p>

          <h1 className="text-4xl font-black sm:text-5xl">
            Event Collection
          </h1>

          <p className="mt-4 max-w-2xl text-gray-400">
            Premium footwear designed to complete your look
            for special occasions and important moments.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        <ProductGrid
          products={eventProducts}
          loading={loading}
        />
      </div>
    </section>
  );
}

export default Events;