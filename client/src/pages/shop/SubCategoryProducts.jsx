import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import ProductGrid from "../../components/ProductGrid";
import { getProducts } from "../../services/productService";

function SubCategoryProducts() {
  const {
    gender,
    category,
    subCategory,
  } = useParams();

  const [
    products,
    setProducts,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const decodedGender =
    decodeURIComponent(
      gender || ""
    );

  const decodedCategory =
    decodeURIComponent(
      category || ""
    );

  const decodedSubCategory =
    subCategory
      ? decodeURIComponent(
          subCategory
        )
      : "";

  useEffect(() => {
    let active = true;

    const loadProducts =
      async () => {
        try {
          setLoading(true);
          setError("");

          const data =
            await getProducts({
              gender: decodedGender,
              category:
                decodedCategory,
              ...(decodedSubCategory
                ? {
                    subCategory:
                      decodedSubCategory,
                  }
                : {}),
            });

          const productList =
            data?.products ||
            data?.data ||
            data ||
            [];

          if (active) {
            setProducts(
              Array.isArray(
                productList
              )
                ? productList
                : []
            );
          }
        } catch (loadError) {
          console.error(
            "Failed to load category products:",
            loadError
          );

          if (active) {
            setError(
              loadError?.response
                ?.data?.message ||
                "Failed to load products."
            );
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };

    loadProducts();

    return () => {
      active = false;
    };
  }, [
    decodedGender,
    decodedCategory,
    decodedSubCategory,
  ]);

  return (
    <section className="min-h-screen bg-black px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Breadcrumb */}
        <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link
            to="/shop"
            className="transition hover:text-lime-400"
          >
            Shop
          </Link>

          <span>/</span>

          <Link
            to={
              decodedGender.toLowerCase() ===
              "men"
                ? "/men"
                : "/women"
            }
            className="transition hover:text-lime-400"
          >
            {decodedGender}
          </Link>

          <span>/</span>

          <span className="text-gray-300">
            {decodedCategory}
          </span>

          {decodedSubCategory && (
            <>
              <span>/</span>

              <span className="text-lime-400">
                {
                  decodedSubCategory
                }
              </span>
            </>
          )}
        </div>

        {/* Heading */}
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-lime-400">
            Trestep Collection
          </p>

          <h1 className="text-4xl font-black sm:text-5xl">
            {decodedSubCategory ||
              decodedCategory}
          </h1>

          <p className="mt-4 max-w-2xl text-gray-400">
            Explore our{" "}
            {decodedGender.toLowerCase()}{" "}
            {decodedCategory.toLowerCase()}{" "}
            collection
            {decodedSubCategory
              ? ` featuring ${decodedSubCategory.toLowerCase()} footwear.`
              : "."}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {/* Products */}
        <ProductGrid
          products={products}
          loading={loading}
        />
      </div>
    </section>
  );
}

export default SubCategoryProducts;