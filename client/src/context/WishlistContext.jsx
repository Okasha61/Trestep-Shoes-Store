import { createContext, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  addToWishlist as addWishlistApi,
  clearWishlist as clearWishlistApi,
  getWishlist,
  removeFromWishlist as removeWishlistApi,
} from "../services/wishlistService";

export const WishlistContext = createContext(null);

const normalizeWishlist = (data) => {
  const raw = data?.wishlist?.products || data?.wishlist?.items || data?.products || data?.wishlist || [];
  return Array.isArray(raw) ? raw.map((item) => item.product || item) : [];
};

function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshWishlist = async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      return [];
    }
    setLoading(true);
    try {
      const data = await getWishlist();
      const items = normalizeWishlist(data);
      setWishlistItems(items);
      return items;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshWishlist().catch((error) => console.error("Wishlist load error:", error));
  }, [isAuthenticated]);

  const addToWishlist = async (product) => {
    if (!isAuthenticated) throw new Error("Please login before using wishlist.");
    const productId = product?._id || product?.id;
    if (!productId) throw new Error("Product not found.");
    await addWishlistApi(productId);
    await refreshWishlist();
  };

  const removeFromWishlist = async (productId) => {
    await removeWishlistApi(productId);
    await refreshWishlist();
  };

  const toggleWishlist = async (product) => {
    const productId = product?._id || product?.id;
    if (!productId) return;
    if (wishlistItems.some((item) => String(item._id || item.id) === String(productId))) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(product);
    }
  };

  const isInWishlist = (productId) =>
    wishlistItems.some((item) => String(item._id || item.id) === String(productId));

  const clearWishlist = async () => {
    await clearWishlistApi();
    setWishlistItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        loading,
        refreshWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export default WishlistProvider;
