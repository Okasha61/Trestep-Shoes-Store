import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiFilter, FiX, FiChevronDown } from "react-icons/fi";

import ProductGrid from "../../components/ProductGrid";
import useProducts from "../../hooks/useProducts";
import { getCategories } from "../../services/categoryService";

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  // ==================================================
  // URL VALUES
  // ==================================================

  const urlGender = searchParams.get("gender") || "all";
  const urlCategory = searchParams.get("category") || "all";
  const urlSubCategory =
    searchParams.get("subCategory") || "all";

  // ==================================================
  // FILTER STATE
  // ==================================================

  const [gender, setGender] = useState(urlGender);
  const [category, setCategory] = useState(urlCategory);
  const [subCategory, setSubCategory] =
    useState(urlSubCategory);

  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);

  // ==================================================
  // CATEGORY STATE
  // ==================================================

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] =
    useState(true);

  // ==================================================
  // PRODUCT QUERY
  // ==================================================

  const productParams = useMemo(() => {
    const params = {};

    if (gender !== "all") {
      params.gender =
        gender === "men" ? "Men" : "Women";
    }

    if (
      gender !== "all" &&
      category !== "all"
    ) {
      params.category = category;
    }

    if (
      gender !== "all" &&
      category !== "all" &&
      subCategory !== "all"
    ) {
      params.subCategory = subCategory;
    }

    return params;
  }, [gender, category, subCategory]);

  const {
    products,
    loading,
    error,
  } = useProducts(productParams);

  // ==================================================
  // LOAD DATABASE CATEGORIES
  // ==================================================

  useEffect(() => {
    let active = true;

    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);

        const data = await getCategories();

        const categoryList =
          data?.categories ||
          data?.data ||
          data ||
          [];

        if (active) {
          setCategories(
            Array.isArray(categoryList)
              ? categoryList
              : []
          );
        }
      } catch (error) {
        console.error(
          "Failed to load categories:",
          error
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

    fetchCategories();

    return () => {
      active = false;
    };
  }, []);

  // ==================================================
  // SYNC STATE WITH URL
  // ==================================================

  useEffect(() => {
    const nextGender =
      searchParams.get("gender") || "all";

    const nextCategory =
      searchParams.get("category") || "all";

    const nextSubCategory =
      searchParams.get("subCategory") || "all";

    setGender(nextGender);
    setCategory(nextCategory);
    setSubCategory(nextSubCategory);
  }, [searchParams]);

  // ==================================================
  // AVAILABLE CATEGORIES
  // ==================================================

  const availableCategories = useMemo(() => {
    if (gender === "all") {
      return [];
    }

    const selectedGender =
      gender === "men" ? "Men" : "Women";

    return categories.filter(
      (item) =>
        item.gender?.toLowerCase() ===
        selectedGender.toLowerCase()
    );
  }, [categories, gender]);

  // ==================================================
  // SELECTED CATEGORY
  // ==================================================

  const selectedCategory = useMemo(() => {
    if (category === "all") {
      return null;
    }

    return (
      availableCategories.find(
        (item) =>
          item.name?.toLowerCase() ===
          category.toLowerCase()
      ) || null
    );
  }, [
    availableCategories,
    category,
  ]);

  // ==================================================
  // AVAILABLE SUB CATEGORIES
  // ==================================================

  const availableSubCategories = useMemo(() => {
    if (!selectedCategory) {
      return [];
    }

    return Array.isArray(
      selectedCategory.subCategories
    )
      ? selectedCategory.subCategories
      : [];
  }, [selectedCategory]);

  // ==================================================
  // CHANGE GENDER
  // ==================================================

  const handleGenderChange = (value) => {
    setGender(value);

    // All
    if (value === "all") {
      setCategory("all");
      setSubCategory("all");

      setSearchParams({});
      return;
    }

    // Men / Women
    setCategory("all");
    setSubCategory("all");

    setSearchParams({
      gender: value,
    });
  };

  // ==================================================
  // CHANGE CATEGORY
  // ==================================================

  const handleCategoryChange = (value) => {
    if (value === "all") {
      setCategory("all");
      setSubCategory("all");

      if (gender === "all") {
        setSearchParams({});
      } else {
        setSearchParams({
          gender,
        });
      }

      return;
    }

    setCategory(value);
    setSubCategory("all");

    setSearchParams({
      gender,
      category: value,
    });
  };

  // ==================================================
  // CHANGE SUB CATEGORY
  // ==================================================

  const handleSubCategoryChange = (value) => {
    if (value === "all") {
      setSubCategory("all");

      setSearchParams({
        gender,
        category,
      });

      return;
    }

    setSubCategory(value);

    setSearchParams({
      gender,
      category,
      subCategory: value,
    });
  };

  // ==================================================
  // SORT PRODUCTS
  // ==================================================

  const sortedProducts = useMemo(() => {
    const result = [...products];

    if (sortBy === "low-high") {
      result.sort(
        (a, b) =>
          Number(a.price) -
          Number(b.price)
      );
    }

    if (sortBy === "high-low") {
      result.sort(
        (a, b) =>
          Number(b.price) -
          Number(a.price)
      );
    }

    if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );
    }

    return result;
  }, [products, sortBy]);

  // ==================================================
  // FILTER LABEL
  // ==================================================

  const filterTitle = useMemo(() => {
    if (gender === "all") {
      return "All Products";
    }

    if (
      category !== "all" &&
      subCategory !== "all"
    ) {
      return `${gender === "men" ? "Men" : "Women"} / ${category} / ${subCategory}`;
    }

    if (category !== "all") {
      return `${gender === "men" ? "Men" : "Women"} / ${category}`;
    }

    return gender === "men"
      ? "Men's Products"
      : "Women's Products";
  }, [
    gender,
    category,
    subCategory,
  ]);

  return (
    <section className="min-h-screen bg-black px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ==================================================
            HEADING
        ================================================== */}

        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-lime-400">
            Trestep Collection
          </p>

          <h1 className="text-4xl font-black sm:text-5xl">
            Shop All Shoes
          </h1>

          <p className="mt-4 max-w-2xl text-gray-400">
            Explore our complete collection of premium shoes
            designed for sport, lifestyle and everyday performance.
          </p>
        </div>

        {/* ==================================================
            MOBILE FILTER BUTTON
        ================================================== */}

        <button
          onClick={() =>
            setShowFilters(true)
          }
          className="mb-6 flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900 px-5 py-3 text-sm font-semibold transition hover:border-lime-400 hover:text-lime-400 lg:hidden"
        >
          <FiFilter />
          Filters
        </button>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">

          {/* ==================================================
              DESKTOP SIDEBAR
          ================================================== */}

          <aside className="hidden rounded-2xl border border-white/10 bg-zinc-950 p-5 lg:block">

            <h2 className="mb-5 text-lg font-bold">
              Filters
            </h2>

            {/* ==================================================
                GENDER
            ================================================== */}

            <div className="mb-8">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
                Gender
              </h3>

              <div className="space-y-2">
                {[
                  "all",
                  "men",
                  "women",
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() =>
                      handleGenderChange(
                        item
                      )
                    }
                    className={`block w-full rounded-lg px-3 py-2 text-left text-sm capitalize transition ${
                      gender === item
                        ? "bg-lime-400 font-semibold text-black"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {item === "all"
                      ? "All"
                      : item}
                  </button>
                ))}
              </div>
            </div>

            {/* ==================================================
                CATEGORY
            ================================================== */}

            <div className="mb-8">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
                Category
              </h3>

              {gender === "all" ? (
                <p className="text-xs leading-5 text-gray-600">
                  Select Men or Women to view categories.
                </p>
              ) : categoriesLoading ? (
                <p className="text-xs text-gray-600">
                  Loading categories...
                </p>
              ) : availableCategories.length ===
                0 ? (
                <p className="text-xs text-gray-600">
                  No categories available.
                </p>
              ) : (
                <div className="space-y-2">

                  <button
                    onClick={() =>
                      handleCategoryChange(
                        "all"
                      )
                    }
                    className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                      category === "all"
                        ? "bg-lime-400 font-semibold text-black"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    All Categories
                  </button>

                  {availableCategories.map(
                    (item) => (
                      <button
                        key={
                          item._id ||
                          item.id
                        }
                        onClick={() =>
                          handleCategoryChange(
                            item.name
                          )
                        }
                        className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                          category.toLowerCase() ===
                          item.name.toLowerCase()
                            ? "bg-lime-400 font-semibold text-black"
                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {item.name}
                      </button>
                    )
                  )}

                </div>
              )}
            </div>

            {/* ==================================================
                SUB CATEGORY
            ================================================== */}

            {category !== "all" && (
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
                  Sub Category
                </h3>

                {availableSubCategories.length ===
                0 ? (
                  <p className="text-xs leading-5 text-gray-600">
                    No sub-categories available.
                  </p>
                ) : (
                  <div className="space-y-2">

                    <button
                      onClick={() =>
                        handleSubCategoryChange(
                          "all"
                        )
                      }
                      className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                        subCategory === "all"
                          ? "bg-lime-400 font-semibold text-black"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      All Sub Categories
                    </button>

                    {availableSubCategories.map(
                      (item) => (
                        <button
                          key={item.name}
                          onClick={() =>
                            handleSubCategoryChange(
                              item.name
                            )
                          }
                          className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                            subCategory.toLowerCase() ===
                            item.name.toLowerCase()
                              ? "bg-lime-400 font-semibold text-black"
                              : "text-gray-400 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          {item.name}
                        </button>
                      )
                    )}

                  </div>
                )}
              </div>
            )}

          </aside>

          {/* ==================================================
              PRODUCTS
          ================================================== */}

          <div>

            {/* ==================================================
                TOP BAR
            ================================================== */}

            <div className="mb-6 flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center">

              <div>
                <p className="text-sm text-gray-400">
                  Showing{" "}
                  <span className="font-semibold text-white">
                    {sortedProducts.length}
                  </span>{" "}
                  products
                </p>

                <p className="mt-1 text-xs text-gray-600">
                  {filterTitle}
                </p>
              </div>

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value
                  )
                }
                className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-lime-400"
              >
                <option value="default">
                  Sort: Default
                </option>

                <option value="newest">
                  Newest
                </option>

                <option value="low-high">
                  Price: Low to High
                </option>

                <option value="high-low">
                  Price: High to Low
                </option>
              </select>
            </div>

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
              <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
                {error}
              </div>
            )}

            {/* ==================================================
                PRODUCTS GRID
            ================================================== */}

            <ProductGrid
              products={sortedProducts}
              loading={loading}
            />

          </div>
        </div>
      </div>

      {/* ==================================================
          MOBILE FILTER DRAWER
      ================================================== */}

      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/80"
            onClick={() =>
              setShowFilters(false)
            }
          />

          {/* Drawer */}
          <aside className="absolute right-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-zinc-950 p-6">

            {/* Drawer Header */}
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Filters
              </h2>

              <button
                onClick={() =>
                  setShowFilters(false)
                }
                className="rounded-lg p-2 hover:bg-white/10"
              >
                <FiX size={22} />
              </button>
            </div>

            {/* ==================================================
                MOBILE GENDER
            ================================================== */}

            <h3 className="mb-3 text-sm font-semibold uppercase text-gray-400">
              Gender
            </h3>

            <div className="mb-8 space-y-2">
              {[
                "all",
                "men",
                "women",
              ].map((item) => (
                <button
                  key={item}
                  onClick={() =>
                    handleGenderChange(
                      item
                    )
                  }
                  className={`block w-full rounded-lg px-4 py-3 text-left capitalize ${
                    gender === item
                      ? "bg-lime-400 font-semibold text-black"
                      : "text-gray-300 hover:bg-white/5"
                  }`}
                >
                  {item === "all"
                    ? "All"
                    : item}
                </button>
              ))}
            </div>

            {/* ==================================================
                MOBILE CATEGORY
            ================================================== */}

            <h3 className="mb-3 text-sm font-semibold uppercase text-gray-400">
              Category
            </h3>

            {gender === "all" ? (
              <p className="mb-8 text-xs leading-5 text-gray-600">
                Select Men or Women to view categories.
              </p>
            ) : categoriesLoading ? (
              <p className="mb-8 text-xs text-gray-600">
                Loading categories...
              </p>
            ) : (
              <div className="mb-8 space-y-2">

                <button
                  onClick={() =>
                    handleCategoryChange(
                      "all"
                    )
                  }
                  className={`block w-full rounded-lg px-4 py-3 text-left ${
                    category === "all"
                      ? "bg-lime-400 font-semibold text-black"
                      : "text-gray-300 hover:bg-white/5"
                  }`}
                >
                  All Categories
                </button>

                {availableCategories.map(
                  (item) => (
                    <button
                      key={
                        item._id ||
                        item.id
                      }
                      onClick={() =>
                        handleCategoryChange(
                          item.name
                        )
                      }
                      className={`block w-full rounded-lg px-4 py-3 text-left ${
                        category.toLowerCase() ===
                        item.name.toLowerCase()
                          ? "bg-lime-400 font-semibold text-black"
                          : "text-gray-300 hover:bg-white/5"
                      }`}
                    >
                      {item.name}
                    </button>
                  )
                )}

              </div>
            )}

            {/* ==================================================
                MOBILE SUB CATEGORY
            ================================================== */}

            {category !== "all" && (
              <>
                <h3 className="mb-3 text-sm font-semibold uppercase text-gray-400">
                  Sub Category
                </h3>

                <div className="space-y-2">

                  <button
                    onClick={() =>
                      handleSubCategoryChange(
                        "all"
                      )
                    }
                    className={`block w-full rounded-lg px-4 py-3 text-left ${
                      subCategory === "all"
                        ? "bg-lime-400 font-semibold text-black"
                        : "text-gray-300 hover:bg-white/5"
                    }`}
                  >
                    All Sub Categories
                  </button>

                  {availableSubCategories.map(
                    (item) => (
                      <button
                        key={item.name}
                        onClick={() =>
                          handleSubCategoryChange(
                            item.name
                          )
                        }
                        className={`block w-full rounded-lg px-4 py-3 text-left ${
                          subCategory.toLowerCase() ===
                          item.name.toLowerCase()
                            ? "bg-lime-400 font-semibold text-black"
                            : "text-gray-300 hover:bg-white/5"
                        }`}
                      >
                        {item.name}
                      </button>
                    )
                  )}

                </div>
              </>
            )}

            {/* Close Drawer */}
            <button
              onClick={() =>
                setShowFilters(false)
              }
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-lime-400 px-4 py-3 font-semibold text-black transition hover:bg-lime-300"
            >
              <FiChevronDown />
              Done
            </button>

          </aside>
        </div>
      )}
    </section>
  );
}

export default Shop;