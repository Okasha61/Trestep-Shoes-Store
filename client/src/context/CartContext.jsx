import { createContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  addCartItem,
  clearCart as clearCartApi,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../services/cartService";

export const CartContext = createContext(null);

const normalizeCartItems = (data) => {
  const raw = data?.cart?.items || data?.items || data?.cart || [];
  return Array.isArray(raw)
    ? raw.map((item) => {
        const product = item.product || item;
        return {
          ...product,
          product,
          cartItemId: item._id || item.cartItemId,
          selectedColor: item.selectedColor ?? item.color ?? null,
          selectedSize: item.selectedSize ?? item.size ?? null,
          quantity: Number(item.quantity || 1),
        };
      })
    : [];
};

function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshCart = async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return [];
    }
    setLoading(true);
    try {
      const data = await getCart();
      const items = normalizeCartItems(data);
      setCartItems(items);
      return items;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart().catch((error) => console.error("Cart load error:", error));
  }, [isAuthenticated]);

  const addToCart = async (product, selectedColor = null, selectedSize = null, quantity = 1) => {
    if (!product?._id && !product?.id) throw new Error("Product not found.");
    if (!isAuthenticated) throw new Error("Please login before adding items to cart.");

    const productId = product._id || product.id;
    const data = await addCartItem({
      productId,
      quantity,
      color: selectedColor,
      size: selectedSize,
      selectedColor,
      selectedSize,
    });
    const items = normalizeCartItems(data);
    if (items.length) setCartItems(items);
    else await refreshCart();
    return data;
  };

  const removeFromCart = async (cartItemId) => {
    await removeCartItem(cartItemId);
    await refreshCart();
  };

  const increaseQuantity = async (cartItemId) => {
    const item = cartItems.find((entry) => entry.cartItemId === cartItemId);
    if (!item) return;
    await updateCartItem(cartItemId, item.quantity + 1);
    await refreshCart();
  };

  const decreaseQuantity = async (cartItemId) => {
    const item = cartItems.find((entry) => entry.cartItemId === cartItemId);
    if (!item) return;
    if (item.quantity <= 1) {
      await removeFromCart(cartItemId);
      return;
    }
    await updateCartItem(cartItemId, item.quantity - 1);
    await refreshCart();
  };

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity <= 0) return removeFromCart(cartItemId);
    await updateCartItem(cartItemId, quantity);
    await refreshCart();
  };

  const clearCart = async () => {
    await clearCartApi();
    setCartItems([]);
  };

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    [cartItems]
  );
  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0),
    [cartItems]
  );
  const shipping = subtotal === 0 ? 0 : subtotal >= 10000 ? 0 : 250;
  const total = subtotal + shipping;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        refreshCart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        shipping,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
