import { useMemo, useState } from "react";

import ProductGrid from "../../components/ProductGrid";
import useProducts from "../../hooks/useProducts";

const sportsCategories = [
  "all",
  "cricket",
  "football",
  "running",
  "basketball",
  "training",
  "gym",
];

function Sports() {
  const { products, loading, error } = useProducts();

  const [selectedSport, setSelectedSport] = useState("all");

  const sportsProducts = useMemo(() => {
    let result = products.filter(
      (product) =>
        product.category?.toLowerCase() === "sports" ||
        product.category?.toLowerCase() === "sport"
    );

    if (selectedSport !== "all") {
      result = result.filter(
        (product) =>
          product.sport?.toLowerCase() === selectedSport
      );
    }

    return result;
  }, [products, selectedSport]);

  return (
    <section className="min-h-screen bg-black px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-lime-400">
            Trestep Sports
          </p>

          <h1 className="text-4xl font-black sm:text-5xl">
            Sports Collection
          </h1>

          <p className="mt-4 max-w-2xl text-gray-400">
            Performance footwear for athletes, training,
            competition and everyday movement.
          </p>
        </div>

        {/* Sports Categories */}
        <div className="mb-10 flex flex-wrap gap-3">
          {sportsCategories.map((sport) => (
            <button
              key={sport}
              onClick={() => setSelectedSport(sport)}
              className={`rounded-full border px-5 py-2.5 text-sm font-semibold capitalize transition ${
                selectedSport === sport
                  ? "border-lime-400 bg-lime-400 text-black"
                  : "border-white/10 bg-zinc-900 text-gray-300 hover:border-lime-400 hover:text-lime-400"
              }`}
            >
              {sport === "all" ? "All Sports" : sport}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        <ProductGrid
          products={sportsProducts}
          loading={loading}
        />
      </div>
    </section>
  );
}

export default Sports;