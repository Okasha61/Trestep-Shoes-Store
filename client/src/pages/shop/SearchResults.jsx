import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import { FiSearch } from "react-icons/fi";

import ProductGrid from "../../components/ProductGrid";
import useProducts from "../../hooks/useProducts";
import { getCategories } from "../../services/categoryService";

const normalizeText = (value = "") =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const normalizeSubCategory = (item) => {
  if (typeof item === "string") {
    return item.trim();
  }

  return item?.name?.trim() || "";
};

function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("query") || "";

  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useProducts();

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] =
    useState(true);

  const [searchMessage, setSearchMessage] =
    useState("");

  // ======================================================
  // LOAD CATEGORIES FROM DATABASE
  // ======================================================

  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);

        const data = await getCategories();

        const list =
          data?.categories ||
          data?.data ||
          data ||
          [];

        if (active) {
          setCategories(
            Array.isArray(list) ? list : []
          );
        }
      } catch (error) {
        console.error(
          "Failed to load search categories:",
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

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  // ======================================================
  // RESOLVE CATEGORY / SUBCATEGORY SEARCH
  // ======================================================

  useEffect(() => {
    if (categoriesLoading) {
      return;
    }

    const searchTerm = normalizeText(query);

    setSearchMessage("");

    if (!searchTerm) {
      return;
    }

    // ----------------------------------------------------
    // DIRECT GENDER SEARCH
    // ----------------------------------------------------

    if (searchTerm === "men") {
      navigate("/men", { replace: true });
      return;
    }

    if (searchTerm === "women") {
      navigate("/women", { replace: true });
      return;
    }

    // ----------------------------------------------------
    // EXTRACT GENDER FROM SEARCH
    // ----------------------------------------------------

    const words = searchTerm.split(" ");

    let gender = "";

    const remainingWords = words.filter((word) => {
      if (word === "men" || word === "male") {
        gender = "Men";
        return false;
      }

      if (
        word === "women" ||
        word === "woman" ||
        word === "female"
      ) {
        gender = "Women";
        return false;
      }

      return true;
    });

    const remainingSearch = normalizeText(
      remainingWords.join(" ")
    );

    if (!remainingSearch) {
      if (gender === "Men") {
        navigate("/men", { replace: true });
        return;
      }

      if (gender === "Women") {
        navigate("/women", { replace: true });
        return;
      }

      return;
    }

    // ----------------------------------------------------
    // FIND CATEGORY / SUBCATEGORY IN DATABASE
    // ----------------------------------------------------

    const matchingCategories = [];

    categories.forEach((category) => {
      const categoryName = normalizeText(
        category?.name
      );

      if (!categoryName) {
        return;
      }

      const subCategories =
        category?.subCategories ||
        category?.subcategories ||
        [];

      const normalizedSubCategories =
        subCategories
          .map(normalizeSubCategory)
          .filter(Boolean);

      // --------------------------------------------------
      // CATEGORY MATCH
      // Example:
      // men sports
      // women sports
      // --------------------------------------------------

      if (remainingSearch === categoryName) {
        matchingCategories.push({
          category,
          subCategory: null,
        });

        return;
      }

      // --------------------------------------------------
      // SUBCATEGORY MATCH
      // Example:
      // men running
      // women running
      // --------------------------------------------------

      const matchingSubCategory =
        normalizedSubCategories.find(
          (subCategory) =>
            normalizeText(subCategory) ===
            remainingSearch
        );

      if (matchingSubCategory) {
        matchingCategories.push({
          category,
          subCategory: matchingSubCategory,
        });
      }
    });

    // ----------------------------------------------------
    // NO CATEGORY / SUBCATEGORY MATCH
    // ----------------------------------------------------

    if (matchingCategories.length === 0) {
      return;
    }

    // ----------------------------------------------------
    // FILTER BY GENDER IF USER SPECIFIED IT
    // ----------------------------------------------------

    let filteredMatches = matchingCategories;

    if (gender) {
      filteredMatches =
        matchingCategories.filter(
          ({ category }) =>
            normalizeText(category?.gender) ===
            normalizeText(gender)
        );
    }

    // ----------------------------------------------------
    // EXACTLY ONE MATCH
    // ----------------------------------------------------

    if (filteredMatches.length === 1) {
      const match = filteredMatches[0];

      const categoryName =
        match.category.name;

      const categoryGender =
        normalizeText(match.category.gender);

      const genderPath =
        categoryGender === "men"
          ? "/men"
          : "/women";

      // --------------------------------------------------
      // SUBCATEGORY SEARCH
      //
      // men running
      // =>
      // /shop/men/Sports/Running
      //
      // women running
      // =>
      // /shop/women/Sports/Running
      // --------------------------------------------------

      if (match.subCategory) {
        navigate(
          `/shop/${
            categoryGender === "men"
              ? "men"
              : "women"
          }/${encodeURIComponent(
            categoryName
          )}/${encodeURIComponent(
            match.subCategory
          )}`,
          {
            replace: true,
          }
        );

        return;
      }

      // --------------------------------------------------
      // CATEGORY SEARCH
      //
      // men sports
      // =>
      // /men?category=Sports
      // --------------------------------------------------

      const params = new URLSearchParams();

      params.set(
        "category",
        categoryName
      );

      navigate(
        `${genderPath}?${params.toString()}`,
        {
          replace: true,
        }
      );

      return;
    }

    // ----------------------------------------------------
    // AMBIGUOUS SEARCH WITHOUT GENDER
    //
    // running
    // =>
    // ask user Men/Women
    // ----------------------------------------------------

    if (!gender && filteredMatches.length > 1) {
      setSearchMessage(
        `"${query}" is available for both Men and Women. Please specify a gender, for example "Men ${query}" or "Women ${query}".`
      );

      return;
    }

    // ----------------------------------------------------
    // GENDER SPECIFIED BUT NOTHING FOUND
    // ----------------------------------------------------

    if (
      gender &&
      filteredMatches.length === 0
    ) {
      setSearchMessage(
        `We couldn't find "${remainingSearch}" for ${gender}.`
      );
    }
  }, [
    query,
    categories,
    categoriesLoading,
    navigate,
  ]);

  // ======================================================
  // PRODUCT SEARCH
  // ======================================================

  const searchResults = useMemo(() => {
    const searchTerm = normalizeText(query);

    if (!searchTerm) {
      return [];
    }

    // These are handled as navigation searches.
    if (
      searchTerm === "men" ||
      searchTerm === "women"
    ) {
      return [];
    }

    const words = searchTerm.split(" ");

    let gender = "";

    const remainingWords = words.filter((word) => {
      if (
        word === "men" ||
        word === "male"
      ) {
        gender = "men";
        return false;
      }

      if (
        word === "women" ||
        word === "woman" ||
        word === "female"
      ) {
        gender = "women";
        return false;
      }

      return true;
    });

    const productSearch =
      normalizeText(
        remainingWords.join(" ")
      );

    if (!productSearch) {
      return [];
    }

    return products.filter((product) => {
      const name = normalizeText(
        product.name
      );

      const category = normalizeText(
        product.category
      );

      const subCategory = normalizeText(
        product.subCategory
      );

      const sport = normalizeText(
        product.sport
      );

      const description = normalizeText(
        product.description
      );

      const productGender =
        normalizeText(product.gender);

      // --------------------------------------------------
      // GENDER FILTER
      // --------------------------------------------------

      if (
        gender &&
        productGender !== gender &&
        !(
          gender === "men" &&
          productGender === "male"
        ) &&
        !(
          gender === "women" &&
          productGender === "female"
        )
      ) {
        return false;
      }

      // --------------------------------------------------
      // PRODUCT MATCH
      // --------------------------------------------------

      return (
        name.includes(productSearch) ||
        category.includes(productSearch) ||
        subCategory.includes(productSearch) ||
        sport.includes(productSearch) ||
        description.includes(productSearch)
      );
    });
  }, [products, query]);

  // ======================================================
  // LOADING
  // ======================================================

  const loading =
    productsLoading ||
    categoriesLoading;

  // ======================================================
  // UI
  // ======================================================

  return (
    <section className="min-h-screen bg-black px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400 text-black">
            <FiSearch size={25} />
          </div>

          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-lime-400">
            Search
          </p>

          <h1 className="text-4xl font-black sm:text-5xl">
            Search Results
          </h1>

          {query && (
            <p className="mt-4 text-gray-400">
              Results for{" "}
              <span className="font-semibold text-white">
                &quot;{query}&quot;
              </span>
            </p>
          )}
        </div>

        {productsError && (
          <div className="mb-6 rounded-xl bg-red-500/10 p-4 text-red-400">
            {productsError}
          </div>
        )}

        {searchMessage ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-10 text-center">
            <FiSearch
              size={40}
              className="mx-auto mb-4 text-gray-600"
            />

            <h2 className="text-xl font-bold">
              Please specify your search
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-gray-500">
              {searchMessage}
            </p>
          </div>
        ) : !query.trim() ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-10 text-center">
            <FiSearch
              size={40}
              className="mx-auto mb-4 text-gray-600"
            />

            <h2 className="text-xl font-bold">
              Search for a product
            </h2>

            <p className="mt-2 text-gray-500">
              Try searching for shoes, sports,
              cricket, football, running or
              another category.
            </p>
          </div>
        ) : (
          searchResults.length === 0 &&
          !loading ? (
            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-10 text-center">
              <h2 className="text-2xl font-bold">
                No products found
              </h2>

              <p className="mt-3 text-gray-500">
                We couldn&apos;t find any product
                matching &quot;{query}&quot;.
              </p>

              <Link
                to="/shop"
                className="mt-6 inline-flex rounded-xl bg-lime-400 px-6 py-3 font-bold text-black transition hover:bg-lime-300"
              >
                Browse All Shoes
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6 text-sm text-gray-400">
                <span className="font-semibold text-white">
                  {searchResults.length}
                </span>{" "}
                product
                {searchResults.length !== 1
                  ? "s"
                  : ""}{" "}
                found
              </div>

              <ProductGrid
                products={searchResults}
                loading={loading}
              />
            </>
          )
        )}
      </div>
    </section>
  );
}

export default SearchResults;