import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  FiArrowLeft,
  FiArrowRight,
  FiHeart,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiStar,
  FiTruck,
  FiShield,
  FiCheckCircle,
} from "react-icons/fi";

import { toast } from "react-hot-toast";

import ColorSelector from "../../components/ColorSelector";
import SizeSelector from "../../components/SizeSelector";
import ProductCard from "../../components/ProductCard";

import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { useProducts } from "../../hooks/useProducts";
import { useWishlist } from "../../hooks/useWishlist";
import { getProduct } from "../../services/productService";
import {
  createProductReview,
  getProductReviews,
  getReviewEligibility,
} from "../../services/reviewService";


/* =========================================================
   HELPERS
========================================================= */

const getColorName = (color) => {
  if (!color) return "";

  if (typeof color === "string") {
    return color.trim();
  }

  return String(
    color.name ||
      color.value ||
      ""
  ).trim();
};


const normalizeColor = (color) => {
  return getColorName(color)
    .toLowerCase()
    .trim();
};


/* =========================================================
   PRODUCT DETAILS
========================================================= */

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const {
    products = [],
    loading: productsLoading = false,
  } = useProducts();

  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist();


  /* =========================================================
     STATE
  ========================================================= */

  const [product, setProduct] = useState(null);

  const [loadingProduct, setLoadingProduct] =
    useState(true);

  const [selectedImage, setSelectedImage] =
    useState(0);

  const [selectedColor, setSelectedColor] =
    useState("");

  const [selectedSize, setSelectedSize] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  const [productReviews, setProductReviews] =
    useState([]);

  const [reviewSummary, setReviewSummary] =
    useState({
      averageRating: 0,
      totalReviews: 0,
    });

  const [reviewsLoading, setReviewsLoading] =
    useState(true);

  const [reviewEligibility, setReviewEligibility] =
    useState(null);

  const [reviewRating, setReviewRating] =
    useState(0);

  const [reviewComment, setReviewComment] =
    useState("");

  const [reviewSubmitting, setReviewSubmitting] =
    useState(false);


  /* =========================================================
     FETCH PRODUCT
     
     IMPORTANT:
     All hooks are declared before ANY conditional return.
  ========================================================= */

  useEffect(() => {
    let active = true;

    const fetchProduct = async () => {
      try {
        setLoadingProduct(true);

        const data = await getProduct(id);

        if (active) {
          setProduct(
            data?.product || data
          );
        }
      } catch (error) {
        if (active) {
          setProduct(null);
        }
      } finally {
        if (active) {
          setLoadingProduct(false);
        }
      }
    };

    fetchProduct();

    return () => {
      active = false;
    };
  }, [id]);


  /* =========================================================
     FETCH REVIEWS
  ========================================================= */

  const fetchReviews = async () => {
    if (!id) return;

    try {
      setReviewsLoading(true);

      const data = await getProductReviews(id);

      setProductReviews(
        Array.isArray(data?.reviews)
          ? data.reviews
          : []
      );

      setReviewSummary(
        data?.summary || {
          averageRating: 0,
          totalReviews: 0,
        }
      );
    } catch (error) {
      setProductReviews([]);
      setReviewSummary({
        averageRating: 0,
        totalReviews: 0,
      });
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);


  /* =========================================================
     REVIEW ELIGIBILITY
  ========================================================= */

  useEffect(() => {
    let active = true;

    const checkEligibility = async () => {
      if (!id || !isAuthenticated) {
        setReviewEligibility(null);
        return;
      }

      try {
        const data = await getReviewEligibility(id);

        if (active) {
          setReviewEligibility(data);
        }
      } catch (error) {
        if (active) {
          setReviewEligibility({
            eligible: false,
            reason: "not_delivered",
          });
        }
      }
    };

    checkEligibility();

    return () => {
      active = false;
    };
  }, [id, isAuthenticated, productReviews.length]);


  /* =========================================================
     DEFAULT COLOR & SIZE
  ========================================================= */

  useEffect(() => {
    if (!product) {
      return;
    }

    const colors =
      Array.isArray(product.colors)
        ? product.colors
        : [];

    const sizes =
      Array.isArray(product.sizes)
        ? product.sizes
        : [];


    /* -------------------------
       Default Color
    ------------------------- */

    if (colors.length > 0) {
      const firstColor =
        getColorName(colors[0]);

      setSelectedColor(
        firstColor
      );

      setSelectedImage(0);
    } else {
      setSelectedColor("");
      setSelectedImage(0);
    }


    /* -------------------------
       Default Size
    ------------------------- */

    if (sizes.length > 0) {
      const firstSize =
        sizes[0];

      setSelectedSize(
        typeof firstSize === "object"
          ? firstSize.value ||
              firstSize.name ||
              ""
          : firstSize
      );
    } else {
      setSelectedSize("");
    }

    setQuantity(1);
  }, [product]);


  /* =========================================================
     PRODUCT DATA
     
     These are NORMAL variables, not hooks.
     They are safe to calculate before conditional returns.
  ========================================================= */

  const productId =
    product?._id ||
    product?.id ||
    "";

  const colors =
    product &&
    Array.isArray(product.colors)
      ? product.colors
      : [];

  const sizes =
    product &&
    Array.isArray(product.sizes)
      ? product.sizes
      : [];

  const colorImages =
    product &&
    Array.isArray(product.colorImages)
      ? product.colorImages
      : [];


  /* =========================================================
     GET IMAGES FOR COLOR
  ========================================================= */

  const getImagesForColor = (
    colorName
  ) => {
    if (!colorName) {
      return [];
    }

    const normalizedSelectedColor =
      normalizeColor(colorName);

    const colorEntry =
      colorImages.find(
        (entry) =>
          normalizeColor(
            entry?.color
          ) ===
          normalizedSelectedColor
      );

    if (
      colorEntry &&
      Array.isArray(
        colorEntry.images
      ) &&
      colorEntry.images.length > 0
    ) {
      return colorEntry.images.filter(
        Boolean
      );
    }

    return [];
  };


  /* =========================================================
     CURRENT COLOR IMAGES
  ========================================================= */

  const selectedColorImages =
    getImagesForColor(
      selectedColor
    );


  /*
    If selected color has its own images,
    show those images.

    Otherwise use normal product images.
  */

  const productImages =
    product &&
    Array.isArray(product.images)
      ? product.images.filter(Boolean)
      : [];

  const images =
    selectedColorImages.length > 0
      ? selectedColorImages
      : productImages.length > 0
      ? productImages
      : ["/placeholder.png"];


  /* =========================================================
     COLOR THUMBNAILS
     
     One representative image for every color.
     
     Example:
     Black  -> black image
     White  -> white image
     Green  -> green image
     Red    -> red image
  ========================================================= */

  const colorThumbnailItems =
    colors
      .map((color) => {
        const colorName =
          getColorName(color);

        if (!colorName) {
          return null;
        }

        const colorSpecificImages =
          getImagesForColor(
            colorName
          );

        const thumbnail =
          colorSpecificImages[0] ||
          productImages[0] ||
          "";

        return {
          color: colorName,
          image: thumbnail,
        };
      })
      .filter(Boolean);


  /* =========================================================
     ALL GALLERY ITEMS
     
     This keeps every color's image connected with
     its color.
     
     Example:
     Black image 1 -> Black
     Black image 2 -> Black
     White image 1 -> White
     Green image 1 -> Green
     Red image 1   -> Red
  ========================================================= */

  const galleryItems =
    colors.flatMap((color) => {
      const colorName =
        getColorName(color);

      if (!colorName) {
        return [];
      }

      const colorSpecificImages =
        getImagesForColor(
          colorName
        );

      return colorSpecificImages.map(
        (image, index) => ({
          color: colorName,
          image,
          index,
        })
      );
    });


  /*
    If colorImages does not exist,
    fallback to normal product images.
  */

  const finalGalleryItems =
    galleryItems.length > 0
      ? galleryItems
      : productImages.map(
          (image, index) => ({
            color:
              selectedColor,
            image,
            index,
          })
        );


  /* =========================================================
     KEEP IMAGE INDEX VALID
     
     IMPORTANT:
     This useEffect is BEFORE conditional returns.
     This fixes your Hooks error.
  ========================================================= */

  useEffect(() => {
    if (
      selectedImage < 0 ||
      selectedImage >= images.length
    ) {
      setSelectedImage(0);
    }
  }, [
    selectedColor,
    selectedImage,
    images.length,
  ]);


  /* =========================================================
     WISHLIST
  ========================================================= */

  const isWishlisted = product
    ? isInWishlist(
        product._id ||
          product.id
      )
    : false;


  /* =========================================================
     PRICE
  ========================================================= */

  const price =
    Number(product?.price) || 0;

  const oldPrice =
    Number(product?.oldPrice) || 0;

  const rating =
    Number(product?.rating) || 0;

  const reviews =
    Number(product?.reviews) || 0;

  const displayRating =
    Number(reviewSummary?.totalReviews) > 0
      ? Number(reviewSummary.averageRating) || 0
      : rating;

  const displayReviewCount =
    Number(reviewSummary?.totalReviews) > 0
      ? Number(reviewSummary.totalReviews)
      : reviews;

  const stock =
    Number(product?.stock);

  const discount =
    oldPrice > price
      ? Math.round(
          ((oldPrice -
            price) /
            oldPrice) *
            100
        )
      : 0;


  /* =========================================================
     RELATED PRODUCTS
  ========================================================= */

  const relatedProducts =
    products
      .filter(
        (item) =>
          String(
            item._id ||
              item.id
          ) !==
          String(productId)
      )
      .filter((item) => {
        if (!product?.category) {
          return true;
        }

        return (
          item.category?.toLowerCase() ===
          product.category?.toLowerCase()
        );
      })
      .slice(0, 4);


  /* =========================================================
     COLOR CHANGE
  ========================================================= */

  const handleColorChange = (
    colorName
  ) => {
    const cleanColorName =
      getColorName(colorName);

    setSelectedColor(
      cleanColorName
    );

    /*
      Every new color starts
      from its first image.
    */

    setSelectedImage(0);
  };


  /* =========================================================
     COLOR THUMBNAIL CLICK
     
     Clicking Black / White / Green / Red
     changes BOTH:
       1. Selected color
       2. Main image
  ========================================================= */

  const handleColorThumbnailClick = (
    colorName
  ) => {
    const cleanColorName =
      getColorName(colorName);

    setSelectedColor(
      cleanColorName
    );

    setSelectedImage(0);
  };


  /* =========================================================
     IMAGE THUMBNAIL CLICK
     
     Clicking an image belonging to a color
     automatically selects that color too.
  ========================================================= */

  const handleGalleryThumbnailClick = (
    item
  ) => {
    if (!item) {
      return;
    }

    const colorName =
      getColorName(
        item.color
      );

    /*
      If thumbnail belongs to a color,
      select that color.
    */

    if (colorName) {
      setSelectedColor(
        colorName
      );
    }

    /*
      The index belongs to that color's
      own image array.
    */

    setSelectedImage(
      Number.isInteger(
        item.index
      )
        ? item.index
        : 0
    );
  };


  /* =========================================================
     NORMAL IMAGE THUMBNAIL CLICK
  ========================================================= */

  const handleThumbnailClick = (
    index
  ) => {
    setSelectedImage(index);
  };


  /* =========================================================
     QUANTITY
  ========================================================= */

  const increaseQuantity = () => {
    if (
      Number.isFinite(stock) &&
      quantity >= stock
    ) {
      toast.error(
        "Maximum available stock reached"
      );

      return;
    }

    setQuantity(
      (previous) =>
        previous + 1
    );
  };


  const decreaseQuantity = () => {
    setQuantity(
      (previous) =>
        previous > 1
          ? previous - 1
          : 1
    );
  };


  /* =========================================================
     ADD TO CART
  ========================================================= */

  const handleAddToCart =
    async () => {
      if (
        colors.length > 0 &&
        !selectedColor
      ) {
        toast.error(
          "Please select a color"
        );

        return;
      }

      if (
        sizes.length > 0 &&
        !selectedSize
      ) {
        toast.error(
          "Please select a size"
        );

        return;
      }

      if (
        Number.isFinite(stock) &&
        stock <= 0
      ) {
        toast.error(
          "Product is out of stock"
        );

        return;
      }

      try {
        await addToCart(
          product,
          selectedColor,
          selectedSize,
          quantity
        );

        toast.success(
          "Product added to cart"
        );
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            error.message ||
            "Could not add to cart"
        );
      }
    };


  /* =========================================================
     BUY NOW
  ========================================================= */

  const handleBuyNow =
    async () => {
      if (!isAuthenticated) {
        toast.error(
          "Please login before buying"
        );

        navigate("/login", {
          state: {
            from: {
              pathname:
                `/product/${productId}`,
            },
          },
        });

        return;
      }

      if (
        colors.length > 0 &&
        !selectedColor
      ) {
        toast.error(
          "Please select a color"
        );

        return;
      }

      if (
        sizes.length > 0 &&
        !selectedSize
      ) {
        toast.error(
          "Please select a size"
        );

        return;
      }

      if (
        Number.isFinite(stock) &&
        stock <= 0
      ) {
        toast.error(
          "Product is out of stock"
        );

        return;
      }

      try {
        await addToCart(
          product,
          selectedColor,
          selectedSize,
          quantity
        );

        navigate("/checkout");
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            error.message ||
            "Could not add to cart"
        );
      }
    };


  /* =========================================================
     WISHLIST
  ========================================================= */

  const handleWishlist =
    async () => {
      if (!isAuthenticated) {
        toast.error(
          "Please login to use wishlist"
        );

        navigate("/login", {
          state: {
            from: {
              pathname:
                `/product/${productId}`,
            },
          },
        });

        return;
      }

      try {
        await toggleWishlist(
          product
        );

        toast.success(
          isWishlisted
            ? "Removed from wishlist"
            : "Added to wishlist"
        );
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            error.message ||
            "Wishlist update failed"
        );
      }
    };


  /* =========================================================
     SUBMIT REVIEW
  ========================================================= */

  const handleSubmitReview = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login to write a review");
      return;
    }

    if (!reviewEligibility?.eligible) {
      toast.error("You can review this product after delivery");
      return;
    }

    if (!reviewRating) {
      toast.error("Please select a rating");
      return;
    }

    if (!reviewComment.trim()) {
      toast.error("Please write your review");
      return;
    }

    try {
      setReviewSubmitting(true);

      await createProductReview(id, {
        rating: reviewRating,
        comment: reviewComment.trim(),
      });

      setReviewRating(0);
      setReviewComment("");
      toast.success("Review submitted successfully");

      await fetchReviews();

      if (isAuthenticated) {
        try {
          const eligibility = await getReviewEligibility(id);
          setReviewEligibility(eligibility);
        } catch {
          setReviewEligibility({
            eligible: false,
            reason: "already_reviewed",
          });
        }
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Could not submit review"
      );
    } finally {
      setReviewSubmitting(false);
    }
  };


  /* =========================================================
     LOADING
     
     IMPORTANT:
     Conditional returns come AFTER ALL HOOKS.
  ========================================================= */

  if (
    productsLoading ||
    loadingProduct
  ) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-black text-white">
        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-lime-400" />

          <p className="mt-4 text-sm text-gray-500">
            Loading product...
          </p>

        </div>
      </section>
    );
  }


  /* =========================================================
     PRODUCT NOT FOUND
  ========================================================= */

  if (!product) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-black px-4 text-white">

        <div className="text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-lime-400/10">
            <FiShoppingBag className="text-3xl text-lime-400" />
          </div>

          <h1 className="mt-6 text-3xl font-bold">
            Product Not Found
          </h1>

          <p className="mt-3 text-gray-400">
            Sorry, the product you're looking for doesn't exist.
          </p>

          <Link
            to="/shop"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-lime-400 px-6 py-3 font-semibold text-black transition hover:bg-lime-300"
          >
            Back to Shop
            <FiArrowRight />
          </Link>

        </div>

      </section>
    );
  }


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="min-h-screen bg-black text-white">

      {/* ==================================================
          PRODUCT SECTION
      ================================================== */}

      <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-14">

        <div className="mx-auto max-w-7xl">

          {/* Back */}

          <button
            onClick={() =>
              navigate(-1)
            }
            className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-lime-400"
          >
            <FiArrowLeft />
            Back
          </button>


          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">

            {/* ==================================================
                LEFT - PRODUCT IMAGES
            ================================================== */}

            <div>

              {/* Main Image */}

              <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950">

                <div className="absolute left-5 top-5 z-10 flex flex-wrap gap-2">

                  {product.isNew && (
                    <span className="rounded-full bg-lime-400 px-3 py-1 text-xs font-bold uppercase tracking-wider text-black">
                      New
                    </span>
                  )}

                  {product.isTrending && (
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-black">
                      Trending
                    </span>
                  )}

                  {discount > 0 && (
                    <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                      -{discount}%
                    </span>
                  )}

                </div>


                <img
                  src={
                    images[
                      selectedImage
                    ] ||
                    images[0]
                  }
                  alt={`${product.name} ${
                    selectedColor ||
                    "Product"
                  }`}
                  className="h-[400px] w-full object-cover transition duration-700 group-hover:scale-105 sm:h-[520px] lg:h-[600px]"
                />


                {/* Wishlist */}

                <button
                  onClick={
                    handleWishlist
                  }
                  className={`absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-md transition ${
                    isWishlisted
                      ? "border-red-500/30 bg-red-500/10 text-red-400"
                      : "border-white/10 bg-black/60 text-white hover:border-lime-400 hover:text-lime-400"
                  }`}
                  aria-label="Wishlist"
                  type="button"
                >
                  <FiHeart
                    className={
                      isWishlisted
                        ? "fill-current"
                        : ""
                    }
                  />
                </button>

              </div>


              {/* ==================================================
                  COLOR REPRESENTATIVE IMAGES
              ================================================== */}

              {colorThumbnailItems.length >
                0 && (
                <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">

                  {colorThumbnailItems.map(
                    (item) => {
                      const isColorSelected =
                        normalizeColor(
                          selectedColor
                        ) ===
                        normalizeColor(
                          item.color
                        );

                      return (
                        <button
                          key={
                            item.color
                          }
                          type="button"
                          onClick={() =>
                            handleColorThumbnailClick(
                              item.color
                            )
                          }
                          title={`View ${item.color}`}
                          className={`group overflow-hidden rounded-xl border transition ${
                            isColorSelected
                              ? "border-lime-400"
                              : "border-white/10 hover:border-white/30"
                          }`}
                        >

                          {item.image ? (
                            <img
                              src={
                                item.image
                              }
                              alt={`${product.name} ${item.color}`}
                              className="h-20 w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-20 w-full items-center justify-center bg-zinc-900 text-xs text-gray-500">
                              {
                                item.color
                              }
                            </div>
                          )}

                        </button>
                      );
                    }
                  )}

                </div>
              )}


              {/* ==================================================
                  SELECTED COLOR IMAGES
                  
                  These are additional images of the
                  currently selected color.
              ================================================== */}

              {images.length >
                1 && (
                <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">

                  {images.map(
                    (
                      image,
                      index
                    ) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() =>
                          handleThumbnailClick(
                            index
                          )
                        }
                        className={`overflow-hidden rounded-xl border transition ${
                          selectedImage ===
                          index
                            ? "border-lime-400"
                            : "border-white/10 hover:border-white/30"
                        }`}
                      >

                        <img
                          src={image}
                          alt={`${product.name} ${selectedColor} ${
                            index + 1
                          }`}
                          className="h-20 w-full object-cover"
                        />

                      </button>
                    )
                  )}

                </div>
              )}


              {/* ==================================================
                  ALL COLOR GALLERY
                  
                  If multiple colors/images exist,
                  every color's image can be clicked.
                  
                  We only show this when there are additional
                  color-specific images that aren't already
                  represented by the color thumbnails.
              ================================================== */}

              {finalGalleryItems.length >
                colorThumbnailItems.length &&
                finalGalleryItems.length >
                  0 && (
                <div className="mt-3 hidden">

                  {finalGalleryItems.map(
                    (item, index) => (
                      <button
                        key={`${item.color}-${item.image}-${index}`}
                        type="button"
                        onClick={() =>
                          handleGalleryThumbnailClick(
                            item
                          )
                        }
                      >
                        <img
                          src={item.image}
                          alt={`${product.name} ${item.color}`}
                        />
                      </button>
                    )
                  )}

                </div>
              )}

            </div>


            {/* ==================================================
                RIGHT - PRODUCT INFORMATION
            ================================================== */}

            <div className="flex flex-col">

              {/* Category */}

              <div className="flex flex-wrap items-center gap-3">

                {product.gender && (
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-400">
                    {
                      product.gender
                    }
                  </span>
                )}

                {product.category && (
                  <>
                    <span className="text-gray-700">
                      /
                    </span>

                    <span className="text-xs font-medium uppercase tracking-[0.15em] text-gray-500">
                      {
                        product.category
                      }
                    </span>
                  </>
                )}

              </div>


              {/* Name */}

              <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                {
                  product.name
                }
              </h1>


              {/* Rating */}

              <div className="mt-5 flex flex-wrap items-center gap-4">

                <div className="flex items-center gap-1">

                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <FiStar
                        key={star}
                        className={
                          star <=
                          Math.round(
                            displayRating
                          )
                            ? "fill-lime-400 text-lime-400"
                            : "text-gray-700"
                        }
                      />
                    )
                  )}

                </div>

                <span className="text-sm text-gray-400">
                  {displayRating.toFixed(1)}
                </span>

                <span className="text-sm text-gray-600">
                  ({displayReviewCount} reviews)
                </span>

              </div>


              {/* Price */}

              <div className="mt-7 flex items-center gap-4">

                <span className="text-3xl font-bold text-lime-400">
                  Rs.{" "}
                  {price.toLocaleString()}
                </span>

                {oldPrice >
                  price && (
                  <span className="text-lg text-gray-600 line-through">
                    Rs.{" "}
                    {oldPrice.toLocaleString()}
                  </span>
                )}

              </div>


              {/* Description */}

              <div className="mt-7 border-t border-white/10 pt-7">

                <h2 className="text-sm font-semibold uppercase tracking-wider">
                  Description
                </h2>

                <p className="mt-3 text-sm leading-7 text-gray-400">
                  {
                    product.description ||
                    "Premium footwear designed for comfort, performance, and everyday style. Built to keep you moving with confidence."
                  }
                </p>

              </div>


              {/* Sport / Sub Category */}

              {(product.subCategory ||
                product.sport) && (
                <div className="mt-6 flex flex-wrap gap-3">

                  {product.subCategory && (
                    <span className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-gray-400">
                      {
                        product.subCategory
                      }
                    </span>
                  )}

                  {product.sport && (
                    <span className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-gray-400">
                      {
                        product.sport
                      }
                    </span>
                  )}

                </div>
              )}


              {/* ==================================================
                  COLOR
              ================================================== */}

              {colors.length >
                0 && (
                <div className="mt-8">

                  <div className="mb-3 flex items-center justify-between">

                    <h2 className="text-sm font-semibold">
                      Color
                    </h2>

                    <span className="text-xs text-gray-500">
                      {
                        selectedColor
                      }
                    </span>

                  </div>

                  <ColorSelector
                    colors={
                      colors
                    }
                    selectedColor={
                      selectedColor
                    }
                    onChange={
                      handleColorChange
                    }
                  />

                </div>
              )}


              {/* Size */}

              {sizes.length >
                0 && (
                <div className="mt-8">

                  <div className="mb-3 flex items-center justify-between">

                    <h2 className="text-sm font-semibold">
                      Size
                    </h2>

                    <button
                      type="button"
                      className="text-xs text-lime-400 hover:text-lime-300"
                      onClick={() =>
                        toast(
                          "Size guide coming soon"
                        )
                      }
                    >
                      Size Guide
                    </button>

                  </div>

                  <SizeSelector
                    sizes={sizes}
                    selectedSize={
                      selectedSize
                    }
                    onChange={
                      setSelectedSize
                    }
                  />

                </div>
              )}


              {/* Quantity */}

              <div className="mt-8">

                <h2 className="mb-3 text-sm font-semibold">
                  Quantity
                </h2>

                <div className="flex h-12 w-fit items-center rounded-xl border border-white/10 bg-zinc-950">

                  <button
                    onClick={
                      decreaseQuantity
                    }
                    disabled={
                      quantity <=
                      1
                    }
                    className="flex h-full w-12 items-center justify-center text-gray-400 transition hover:text-lime-400 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <FiMinus />
                  </button>

                  <span className="flex w-12 justify-center font-semibold">
                    {quantity}
                  </span>

                  <button
                    onClick={
                      increaseQuantity
                    }
                    disabled={
                      Number.isFinite(
                        stock
                      ) &&
                      quantity >=
                        stock
                    }
                    className="flex h-full w-12 items-center justify-center text-gray-400 transition hover:text-lime-400 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <FiPlus />
                  </button>

                </div>

              </div>


              {/* Stock */}

              <div className="mt-5">

                {Number.isFinite(
                  stock
                ) ? (
                  stock > 0 ? (
                    <p className="flex items-center gap-2 text-sm text-lime-400">
                      <FiCheckCircle />
                      {
                        stock
                      }{" "}
                      items available
                    </p>
                  ) : (
                    <p className="text-sm text-red-400">
                      Out of Stock
                    </p>
                  )
                ) : (
                  <p className="text-sm text-gray-500">
                    Available
                  </p>
                )}

              </div>


              {/* Buttons */}

              <div className="mt-7 grid gap-3 sm:grid-cols-2">

                <button
                  onClick={
                    handleAddToCart
                  }
                  disabled={
                    Number.isFinite(
                      stock
                    ) &&
                    stock <= 0
                  }
                  className="flex items-center justify-center gap-2 rounded-xl border border-lime-400/50 bg-lime-400/10 px-5 py-4 font-semibold text-lime-400 transition hover:bg-lime-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FiShoppingBag />
                  Add to Cart
                </button>

                <button
                  onClick={
                    handleBuyNow
                  }
                  disabled={
                    Number.isFinite(
                      stock
                    ) &&
                    stock <= 0
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-5 py-4 font-semibold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Buy Now
                  <FiArrowRight />
                </button>

              </div>


              {/* Features */}

              <div className="mt-8 grid gap-3 border-t border-white/10 pt-7 sm:grid-cols-3">

                <div className="rounded-xl border border-white/10 bg-zinc-950 p-4">

                  <FiTruck className="text-xl text-lime-400" />

                  <p className="mt-3 text-xs font-semibold">
                    Fast Delivery
                  </p>

                  <p className="mt-1 text-[11px] text-gray-600">
                    Quick doorstep delivery
                  </p>

                </div>


                <div className="rounded-xl border border-white/10 bg-zinc-950 p-4">

                  <FiShield className="text-xl text-lime-400" />

                  <p className="mt-3 text-xs font-semibold">
                    Secure Shopping
                  </p>

                  <p className="mt-1 text-[11px] text-gray-600">
                    Safe & reliable checkout
                  </p>

                </div>


                <div className="rounded-xl border border-white/10 bg-zinc-950 p-4">

                  <FiCheckCircle className="text-xl text-lime-400" />

                  <p className="mt-3 text-xs font-semibold">
                    Quality Product
                  </p>

                  <p className="mt-1 text-[11px] text-gray-600">
                    Built for your journey
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          REVIEWS
      ================================================== */}

      <section className="border-t border-white/10 bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">

            {/* Review list */}
            <div>
              <div className="mb-7">
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-lime-400">
                  Customer Feedback
                </p>
                <h2 className="mt-2 text-3xl font-bold">
                  Reviews
                </h2>
              </div>

              {reviewsLoading ? (
                <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6 text-sm text-gray-500">
                  Loading reviews...
                </div>
              ) : productReviews.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6 text-sm text-gray-500">
                  No reviews yet. Be the first to review this product.
                </div>
              ) : (
                <div className="space-y-4">
                  {productReviews.map((review) => (
                    <article
                      key={review._id}
                      className="rounded-2xl border border-white/10 bg-zinc-950 p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">
                            {review.user?.username || "Customer"}
                          </p>
                          <div className="mt-2 flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FiStar
                                key={star}
                                className={
                                  star <= Number(review.rating)
                                    ? "fill-lime-400 text-lime-400"
                                    : "text-gray-700"
                                }
                              />
                            ))}
                          </div>
                        </div>

                        <span className="text-xs text-gray-600">
                          {review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString()
                            : ""}
                        </span>
                      </div>

                      <p className="mt-4 text-sm leading-7 text-gray-400">
                        {review.comment}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* Review form */}
            <div>
              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6 sm:p-7">
                <h3 className="text-xl font-bold">
                  Write a Review
                </h3>

                {!isAuthenticated ? (
                  <div className="mt-5 rounded-xl border border-white/10 bg-black p-4 text-sm text-gray-400">
                    Please login to write a review.
                  </div>
                ) : reviewEligibility?.reason === "already_reviewed" ? (
                  <div className="mt-5 rounded-xl border border-lime-400/20 bg-lime-400/5 p-4 text-sm text-gray-400">
                    You have already reviewed this product.
                  </div>
                ) : reviewEligibility?.eligible ? (
                  <form onSubmit={handleSubmitReview} className="mt-5">
                    <p className="text-sm text-gray-400">
                      Your rating
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="transition hover:scale-110"
                          aria-label={`${star} star rating`}
                        >
                          <FiStar
                            className={
                              star <= reviewRating
                                ? "h-6 w-6 fill-lime-400 text-lime-400"
                                : "h-6 w-6 text-gray-700"
                            }
                          />
                        </button>
                      ))}
                    </div>

                    <textarea
                      value={reviewComment}
                      onChange={(event) => setReviewComment(event.target.value)}
                      rows={5}
                      maxLength={1000}
                      placeholder="Share your experience with this product..."
                      className="mt-5 w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-lime-400/50"
                    />

                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="mt-4 w-full rounded-xl bg-lime-400 px-5 py-3 font-semibold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {reviewSubmitting ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                ) : (
                  <div className="mt-5 rounded-xl border border-white/10 bg-black p-4 text-sm leading-6 text-gray-500">
                    You can write a review after your order containing this product has been delivered.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ==================================================
          RELATED PRODUCTS
      ================================================== */}

      {relatedProducts.length >
        0 && (
        <section className="border-t border-white/10 bg-zinc-950 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">

          <div className="mx-auto max-w-7xl">

            <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

              <div>

                <p className="text-sm font-medium uppercase tracking-[0.25em] text-lime-400">
                  You May Also Like
                </p>

                <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                  Related Products
                </h2>

              </div>

              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-sm font-semibold text-lime-400 hover:text-lime-300"
              >
                View All
                <FiArrowRight />
              </Link>

            </div>


            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {relatedProducts.map(
                (
                  relatedProduct
                ) => (
                  <ProductCard
                    key={
                      relatedProduct._id ||
                      relatedProduct.id
                    }
                    product={
                      relatedProduct
                    }
                  />
                )
              )}

            </div>

          </div>

        </section>
      )}

    </main>
  );
}


export default ProductDetails;