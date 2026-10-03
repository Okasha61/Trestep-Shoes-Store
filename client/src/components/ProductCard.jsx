import { Link, useNavigate } from "react-router-dom";

import {
  FiHeart,
  FiShoppingBag,
} from "react-icons/fi";

import toast from "react-hot-toast";

import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";
import { useAuth } from "../hooks/useAuth";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist();

  const { isAuthenticated } = useAuth();

  if (!product) {
    return null;
  }

  // ======================================================
  // PRODUCT BASIC DATA
  // ======================================================

  const id =
    product._id ||
    product.id;

  const image =
    product.images?.[0] ||
    product.image ||
    "";

  const colors =
    product.colors || [];

  const sizes =
    product.sizes || [];

  // ======================================================
  // DEFAULT COLOR
  // ======================================================

  const firstColor =
    typeof colors[0] === "object"
      ? colors[0]?.name ||
        colors[0]?.value
      : colors[0] || null;

  // ======================================================
  // DEFAULT SIZE
  // ======================================================

  const firstSize =
    typeof sizes[0] === "object"
      ? sizes[0]?.value
      : sizes[0] || null;

  // ======================================================
  // WISHLIST
  // ======================================================

  const wishlisted =
    isInWishlist(id);

  // ======================================================
  // DISCOUNT
  // ======================================================

  const discount =
    Number(product.oldPrice) >
    Number(product.price)
      ? Math.round(
          ((Number(product.oldPrice) -
            Number(product.price)) /
            Number(product.oldPrice)) *
            100
        )
      : 0;

  // ======================================================
  // CART
  // ======================================================

  const handleCart = async () => {
    if (!isAuthenticated) {
      toast.error(
        "Please login before adding to cart"
      );

      navigate("/login", {
        state: {
          from: {
            pathname: `/product/${id}`,
          },
        },
      });

      return;
    }

    try {
      await addToCart(
        product,
        firstColor,
        firstSize,
        1
      );

      toast.success(
        "Added to cart"
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Could not add to cart"
      );
    }
  };

  // ======================================================
  // WISHLIST
  // ======================================================

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error(
        "Please login to use wishlist"
      );

      navigate("/login");

      return;
    }

    try {
      await toggleWishlist(product);

      toast.success(
        wishlisted
          ? "Removed from wishlist"
          : "Added to wishlist"
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Wishlist update failed"
      );
    }
  };

  // ======================================================
  // PRODUCT CARD
  // ======================================================

  return (
    <article className="product-card">

      {/* =====================================================
          IMAGE
      ===================================================== */}

      <div className="product-image-wrapper">

        {/* NEW BADGE */}

        {product.isNew && (
          <span className="product-badge new-badge">
            NEW
          </span>
        )}

        {/* TRENDING BADGE */}

        {!product.isNew &&
          product.isTrending && (
            <span className="product-badge trending-badge">
              TRENDING
            </span>
          )}

        {/* BEST SELLER BADGE */}

        {!product.isNew &&
          !product.isTrending &&
          product.isBestSeller && (
            <span className="product-badge bestseller-badge">
              BEST SELLER
            </span>
          )}

        {/* =================================================
            DISCOUNT BADGE

            Discount is intentionally placed below the
            top-left product badge so it never overlaps
            with the wishlist heart.
        ================================================= */}

        {discount > 0 && (
          <span
            className="discount-badge"
            style={{
              top: "36px",
              left: "10px",
              right: "auto",
            }}
          >
            -{discount}%
          </span>
        )}

        {/* =================================================
            WISHLIST
        ================================================= */}

        <button
          className={`wishlist-button ${
            wishlisted
              ? "text-red-400"
              : ""
          }`}
          onClick={handleWishlist}
          aria-label={
            wishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          type="button"
        >
          <FiHeart
            className={
              wishlisted
                ? "fill-current"
                : ""
            }
          />
        </button>

        {/* =================================================
            PRODUCT IMAGE
        ================================================= */}

        <Link to={`/product/${id}`}>
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="product-image"
            />
          ) : (
            <div className="image-placeholder">
              No Image
            </div>
          )}
        </Link>

      </div>

      {/* =====================================================
          PRODUCT INFO
      ===================================================== */}

      <div className="product-info">

        {/* CATEGORY */}

        <p className="product-category">
          {product.category ||
            "Footwear"}
        </p>

        {/* PRODUCT NAME */}

        <Link
          to={`/product/${id}`}
          className="product-name"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* =================================================
            PRICE
        ================================================= */}

        <div className="product-price">

          {/* CURRENT PRICE */}

          <span className="current-price">
            Rs.{" "}
            {Number(
              product.price || 0
            ).toLocaleString()}
          </span>

          {/* OLD PRICE */}

          {Number(product.oldPrice) >
            Number(product.price) && (
            <span className="old-price">
              Rs.{" "}
              {Number(
                product.oldPrice
              ).toLocaleString()}
            </span>
          )}

        </div>

        {/* =================================================
            ADD TO CART
        ================================================= */}

        <button
          className="add-cart-button"
          onClick={handleCart}
          type="button"
        >
          <FiShoppingBag />

          <span>
            Add To Cart
          </span>
        </button>

      </div>
    </article>
  );
}

export default ProductCard;