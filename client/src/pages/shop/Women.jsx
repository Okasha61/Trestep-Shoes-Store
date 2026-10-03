import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useParams,
  useSearchParams,
} from "react-router-dom";

import ProductGrid from "../../components/ProductGrid";
import useProducts from "../../hooks/useProducts";
import { getCategories } from "../../services/categoryService";

const normalizeSubCategory = (item) => {
  if (typeof item === "string") {
    return {
      name: item,
      description: "",
      image: "",
    };
  }

  return {
    name: item?.name || "",
    description: item?.description || "",
    image: item?.image || "",
  };
};

function Women() {
  const { products, loading, error } =
    useProducts();

  const [categories, setCategories] =
    useState([]);

  const [
    categoriesLoading,
    setCategoriesLoading,
  ] = useState(true);

  const [searchParams, setSearchParams] =
    useSearchParams();

  // ======================================================
  // READ CATEGORY / SUBCATEGORY FROM URL
  // ======================================================

  const {
    category: routeCategory,
    subCategory: routeSubCategory,
  } = useParams();

  /*
    Supports both:

    /women?category=Sports

    and

    /shop/women/Sports/Running
  */

  const selectedCategory =
    routeCategory ||
    searchParams.get("category") ||
    "";

  const selectedSubCategory =
    routeSubCategory ||
    searchParams.get("subCategory") ||
    "";

  // ======================================================
  // LOAD WOMEN CATEGORIES
  // ======================================================

  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);

        const data =
          await getCategories();

        const list =
          data?.categories ||
          data?.data ||
          data ||
          [];

        const womenCategories =
          Array.isArray(list)
            ? list.filter(
                (item) =>
                  item.gender?.toLowerCase() ===
                  "women"
              )
            : [];

        if (active) {
          setCategories(
            womenCategories
          );
        }
      } catch (loadError) {
        console.error(
          "Failed to load women categories:",
          loadError
        );

        if (active) {
          setCategories([]);
        }
      } finally {
        if (active) {
          setCategoriesLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  // ======================================================
  // AUTO SELECT FIRST CATEGORY ONLY ON /women
  // ======================================================

  useEffect(() => {
    if (categoriesLoading) return;

    if (categories.length === 0) return;

    // Don't modify canonical subcategory URL
    // or an already selected category.
    if (
      routeCategory ||
      routeSubCategory ||
      searchParams.get("category")
    ) {
      return;
    }

    const firstCategory =
      categories[0];

    if (!firstCategory?.name) return;

    setSearchParams(
      {
        category: firstCategory.name,
      },
      {
        replace: true,
      }
    );
  }, [
    categories,
    categoriesLoading,
    routeCategory,
    routeSubCategory,
    searchParams,
    setSearchParams,
  ]);

  // ======================================================
  // ACTIVE CATEGORY
  // ======================================================

  const activeCategory = useMemo(
    () =>
      categories.find(
        (category) =>
          category.name?.toLowerCase() ===
          selectedCategory.toLowerCase()
      ),
    [
      categories,
      selectedCategory,
    ]
  );

  // ======================================================
  // SUBCATEGORIES
  // ======================================================

  const subCategories = useMemo(
    () =>
      (
        activeCategory?.subCategories ||
        activeCategory?.subcategories ||
        []
      )
        .map(normalizeSubCategory)
        .filter((item) => item.name),
    [activeCategory]
  );

  // ======================================================
  // WOMEN PRODUCTS
  // ======================================================

  const womenProducts = useMemo(() => {
    /*
      No subcategory = no products.

      Example:

      /women?category=Sports

      shows Sports subcategory cards.

      /shop/women/Sports/Running

      shows only Running products.
    */

    if (
      !selectedCategory ||
      !selectedSubCategory
    ) {
      return [];
    }

    // ----------------------------------------------------
    // FILTER GENDER
    // ----------------------------------------------------

    let result = products.filter(
      (product) => {
        const productGender =
          product.gender?.toLowerCase();

        return (
          productGender === "women" ||
          productGender === "female"
        );
      }
    );

    // ----------------------------------------------------
    // FILTER CATEGORY
    // ----------------------------------------------------

    result = result.filter(
      (product) =>
        product.category?.toLowerCase() ===
        selectedCategory.toLowerCase()
    );

    // ----------------------------------------------------
    // FILTER SUBCATEGORY
    // ----------------------------------------------------

    result = result.filter(
      (product) =>
        product.subCategory?.toLowerCase() ===
        selectedSubCategory.toLowerCase()
    );

    return result;
  }, [
    products,
    selectedCategory,
    selectedSubCategory,
  ]);

  // ======================================================
  // CATEGORY SELECTION
  // ======================================================

  const selectCategory = (name) => {
    /*
      Example:

      /women?category=Sports
    */

    setSearchParams({
      category: name,
    });
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <section className="min-h-screen bg-black px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-lime-400">
            Trestep Women
          </p>

          <h1 className="text-4xl font-black sm:text-5xl">
            Women&apos;s Shoes
          </h1>

          <p className="mt-4 max-w-2xl text-gray-400">
            Discover premium footwear built for
            performance, comfort and everyday style.
          </p>
        </div>

        {/* ==================================================
            CATEGORY BUTTONS
        ================================================== */}

        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {!categoriesLoading &&
            categories.map((category) => (
              <button
                type="button"
                key={
                  category._id ||
                  category.id
                }
                onClick={() =>
                  selectCategory(
                    category.name
                  )
                }
                className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                  selectedCategory.toLowerCase() ===
                  category.name?.toLowerCase()
                    ? "border-lime-400 bg-lime-400 text-black"
                    : "border-white/10 bg-zinc-900 text-gray-300 hover:border-lime-400 hover:text-lime-400"
                }`}
              >
                {category.name}
              </button>
            ))}
        </div>

        {/* ==================================================
            SUBCATEGORY CARDS

            Hidden when a specific subcategory is
            already selected from the URL.
        ================================================== */}

        {selectedCategory &&
          activeCategory &&
          subCategories.length > 0 &&
          !selectedSubCategory && (
            <div className="mb-12">
              <div className="mb-6 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-lime-400">
                  {activeCategory.name}
                </p>

                <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                  Explore{" "}
                  {activeCategory.name}
                </h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {subCategories.map(
                  (subCategory) => (
                    <Link
                      key={subCategory.name}
                      to={`/shop/women/${encodeURIComponent(
                        activeCategory.name
                      )}/${encodeURIComponent(
                        subCategory.name
                      )}`}
                      className={`overflow-hidden rounded-2xl border text-left transition ${
                        selectedSubCategory.toLowerCase() ===
                        subCategory.name.toLowerCase()
                          ? "border-lime-400"
                          : "border-white/10 hover:border-lime-400/40"
                      } bg-zinc-950`}
                    >
                      <div className="h-56 overflow-hidden bg-zinc-900">
                        {subCategory.image ? (
                          <img
                            src={
                              subCategory.image
                            }
                            alt={
                              subCategory.name
                            }
                            className="h-full w-full object-cover transition duration-500 hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-gray-600">
                            <span className="text-lg font-semibold">
                              {
                                subCategory.name
                              }
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <h3 className="font-bold">
                          {
                            subCategory.name
                          }
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                          {subCategory.description ||
                            "Premium footwear selected for your style and everyday comfort."}
                        </p>
                      </div>
                    </Link>
                  )
                )}
              </div>
            </div>
          )}

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="mb-6 rounded-xl bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {/* ==================================================
            PRODUCTS

            Only specific subcategory products.
        ================================================== */}

        {selectedCategory &&
          selectedSubCategory && (
            <ProductGrid
              products={womenProducts}
              loading={loading}
            />
          )}
      </div>
    </section>
  );
}

export default Women;