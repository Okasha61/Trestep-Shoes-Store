import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiHeart,
  FiShoppingBag,
  FiTrash2,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

import ProductCard from "../../components/ProductCard";
import { useWishlist } from "../../hooks/useWishlist";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";

function Wishlist() {
  const {
    wishlistItems,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  // Add wishlist product to cart
  const handleAddToCart = async (product) => {
    if (!product) return;

    const colors = product.colors || [];
    const sizes = product.sizes || [];

    const defaultColor =
      colors.length > 0
        ? typeof colors[0] === "string"
          ? colors[0]
          : colors[0]?.name
        : "";

    const defaultSize =
      sizes.length > 0
        ? typeof sizes[0] === "string"
          ? sizes[0]
          : sizes[0]?.value
        : "";

    if (colors.length > 0 && !defaultColor) {
      toast.error("Please select a color first.");
      return;
    }

    if (sizes.length > 0 && !defaultSize) {
      toast.error("Please select a size first.");
      return;
    }

    try {
      await addToCart(product, defaultColor, defaultSize, 1);
      toast.success("Product added to cart");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Could not add to cart");
    }
  };

  // Remove product
  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not remove wishlist item");
    }
  };

  // Clear complete wishlist
  const handleClearWishlist = async () => {
    if (wishlistItems.length === 0) return;

    const confirmed = window.confirm(
      "Are you sure you want to clear your wishlist?"
    );

    if (!confirmed) return;

    try {
      await clearWishlist();
      toast.success("Wishlist cleared");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not clear wishlist");
    }
  };

  return (
    <section className="min-h-screen bg-black px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>
            <Link
              to="/shop"
              className="mb-5 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-lime-400"
            >
              <FiArrowLeft />
              Continue Shopping
            </Link>

            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400 text-black">
                <FiHeart size={25} />
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-lime-400">
                  Trestep
                </p>

                <h1 className="text-3xl font-black sm:text-4xl">
                  My Wishlist
                </h1>
              </div>
            </div>
          </div>

          {/* Clear Button */}
          {wishlistItems.length > 0 && (
            <button
              onClick={handleClearWishlist}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
            >
              <FiTrash2 />
              Clear Wishlist
            </button>
          )}
        </div>

        {/* Login Message */}
        {!isAuthenticated && (
          <div className="mb-8 flex flex-col justify-between gap-4 rounded-2xl border border-lime-400/20 bg-lime-400/5 p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-bold">
                Save your favorite shoes
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Login to keep your wishlist connected to
                your account.
              </p>
            </div>

            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl bg-lime-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-lime-300"
            >
              Login
            </Link>
          </div>
        )}

        {/* Empty Wishlist */}
        {wishlistItems.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-zinc-950 px-6 py-16 text-center">

            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
              <FiHeart
                size={35}
                className="text-gray-500"
              />
            </div>

            <h2 className="text-2xl font-black sm:text-3xl">
              Your Wishlist is Empty
            </h2>

            <p className="mx-auto mt-3 max-w-md text-gray-500">
              You haven&apos;t added any shoes to your
              wishlist yet. Explore our collection and save
              your favorite styles.
            </p>

            <Link
              to="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-lime-400 px-6 py-3 font-bold text-black transition hover:bg-lime-300"
            >
              <FiShoppingBag />
              Explore Shoes
            </Link>
          </div>
        ) : (
          <>
            {/* Wishlist Info */}
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-5">
              <p className="text-sm text-gray-400">
                <span className="font-semibold text-white">
                  {wishlistItems.length}
                </span>{" "}
                {wishlistItems.length === 1
                  ? "item"
                  : "items"}{" "}
                saved
              </p>
            </div>

            {/* Products */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlistItems.map((product) => {
                const productId =
                  product._id || product.id;

                return (
                  <div
                    key={productId}
                    className="group relative"
                  >
                    {/* Remove Wishlist Button */}
                    <button
                      onClick={() =>
                        handleRemove(productId)
                      }
                      aria-label="Remove from wishlist"
                      className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-red-500/20 bg-black/80 text-red-400 backdrop-blur-sm transition hover:bg-red-500 hover:text-white"
                    >
                      <FiTrash2 size={17} />
                    </button>

                    {/* Product Card */}
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Wishlist;