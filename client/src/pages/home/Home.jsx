import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiShoppingBag,
  FiTrendingUp,
  FiStar,
  FiTruck,
  FiCheckCircle,
} from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ProductCard from "../../components/ProductCard";
import useProducts from "../../hooks/useProducts";
import { getCategories } from "../../services/categoryService";

gsap.registerPlugin(ScrollTrigger);

function Home() {
  const heroRef = useRef(null);
  const shoeRefs = useRef([]);
  const heroTextRef = useRef(null);

  const categoryRef = useRef(null);
  const womenCategoryRef = useRef(null);

  const menCategoryZoneRef = useRef(null);
  const womenCategoryZoneRef = useRef(null);

  const arrivalRef = useRef(null);
  const trendingRef = useRef(null);
  const bestSellerRef = useRef(null);
  const ctaRef = useRef(null);

  // ==================================================
  // INFINITE SCROLL PAUSE REFS
  // ==================================================

  const menPausedRef = useRef(false);
  const womenPausedRef = useRef(false);

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] =
    useState(true);

  const { products, loading, error } = useProducts();

  // ==================================================
  // PRODUCT FILTERS
  // ==================================================

  const newArrivals = products.filter(
    (product) => product.isNew
  );

  const trendingProducts = products.filter(
    (product) => product.isTrending
  );

  const bestSellers = products.filter(
    (product) => product.isBestSeller
  );

  // ==================================================
  // CATEGORY FILTERS
  // ==================================================

  const menCategories = categories.filter(
    (category) => category.gender === "Men"
  );

  const womenCategories = categories.filter(
    (category) => category.gender === "Women"
  );

  // ==================================================
  // SCROLL CONDITIONS
  // ==================================================

  const menHasScroll = menCategories.length > 3;
  const womenHasScroll = womenCategories.length > 3;

  const newArrivalsHasScroll =
    newArrivals.length > 4;

  const trendingHasScroll =
    trendingProducts.length > 4;

  const bestSellersHasScroll =
    bestSellers.length > 4;

  // ==================================================
  // LOAD CATEGORIES FROM DATABASE
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
  // HERO SHOES
  // ==================================================

  const heroShoes = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80",
      title: "Velocity",
      color: "#84cc16",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80",
      title: "Urban",
      color: "#22c55e",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80",
      title: "Motion",
      color: "#a3e635",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1557942260-4e6d5c9c6e6b?auto=format&fit=crop&w=1000&q=80",
      title: "Court",
      color: "#65a30d",
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1000&q=80",
      title: "Elite",
      color: "#bef264",
    },
  ];

  // ==================================================
  // CATEGORY INFINITE AUTO SCROLL
  // ==================================================

  useEffect(() => {
    const containers = [
      {
        element: categoryRef.current,
        enabled: menHasScroll,
        pausedRef: menPausedRef,
        count: menCategories.length,
      },
      {
        element: womenCategoryRef.current,
        enabled: womenHasScroll,
        pausedRef: womenPausedRef,
        count: womenCategories.length,
      },
    ];

    const cleanups = [];

    containers.forEach(
      ({
        element,
        enabled,
        pausedRef,
        count,
      }) => {
        if (
          !element ||
          !enabled ||
          count <= 3
        ) {
          return;
        }

        let animationFrame;
        let lastTime = performance.now();

        const speed = 35;

        // ============================================
        // GET WIDTH OF ONE COMPLETE CATEGORY SET
        // ============================================

        const getLoopWidth = () => {
          const children = element.children;

          if (children.length < count * 2) {
            return 0;
          }

          const firstCard = children[0];

          const secondSetFirstCard =
            children[count];

          if (
            !firstCard ||
            !secondSetFirstCard
          ) {
            return 0;
          }

          return (
            secondSetFirstCard.offsetLeft -
            firstCard.offsetLeft
          );
        };

        // ============================================
        // START FROM MIDDLE COPY
        // ============================================

        const initializePosition = () => {
          const loopWidth =
            getLoopWidth();

          if (loopWidth > 0) {
            element.scrollLeft =
              loopWidth;
          }
        };

        // ============================================
        // INFINITE POSITION NORMALIZATION
        // ============================================

        const normalizePosition = () => {
          const loopWidth =
            getLoopWidth();

          if (!loopWidth) {
            return;
          }

          // Moving right
          if (
            element.scrollLeft >=
            loopWidth * 2
          ) {
            element.scrollLeft -=
              loopWidth;
          }

          // Moving left
          if (
            element.scrollLeft <= 0
          ) {
            element.scrollLeft +=
              loopWidth;
          }
        };

        // ============================================
        // AUTO ANIMATION
        // ============================================

        const animate = (time) => {
          const delta =
            time - lastTime;

          lastTime = time;

          if (!pausedRef.current) {
            element.scrollLeft +=
              (speed * delta) / 1000;
          }

          normalizePosition();

          animationFrame =
            requestAnimationFrame(
              animate
            );
        };

        // ============================================
        // MANUAL SCROLL
        // ============================================

        const handleScroll = () => {
          normalizePosition();
        };

        // ============================================
        // SCROLL EVENT
        // ============================================

        element.addEventListener(
          "scroll",
          handleScroll,
          { passive: true }
        );

        // ============================================
        // WAIT FOR DOM TO RENDER
        // ============================================

        const initializeTimer =
          setTimeout(() => {
            initializePosition();

            lastTime =
              performance.now();

            animationFrame =
              requestAnimationFrame(
                animate
              );
          }, 100);

        // ============================================
        // CLEANUP
        // ============================================

        cleanups.push(() => {
          clearTimeout(
            initializeTimer
          );

          cancelAnimationFrame(
            animationFrame
          );

          element.removeEventListener(
            "scroll",
            handleScroll
          );
        });
      }
    );

    return () => {
      cleanups.forEach(
        (cleanup) => cleanup()
      );
    };
  }, [
    menHasScroll,
    womenHasScroll,
    menCategories.length,
    womenCategories.length,
  ]);

  // ==================================================
  // CATEGORY ARROW SCROLL
  // ==================================================

  const scrollCategories = (
    containerRef,
    direction
  ) => {
    const container =
      containerRef.current;

    if (!container) return;

    const firstCard =
      container.children[0];

    const secondCard =
      container.children[1];

    if (
      !firstCard ||
      !secondCard
    ) {
      return;
    }

    // One card + gap
    const amount =
      secondCard.offsetLeft -
      firstCard.offsetLeft;

    // Keep auto scroll paused while
    // the arrow interaction is happening
    if (containerRef === categoryRef) {
      menPausedRef.current = true;
    }

    if (
      containerRef ===
      womenCategoryRef
    ) {
      womenPausedRef.current = true;
    }

    container.scrollBy({
      left:
        direction === "left"
          ? -amount
          : amount,
      behavior: "smooth",
    });
  };

  // ==================================================
  // GSAP ANIMATIONS
  // ==================================================

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      const shoes =
        shoeRefs.current.filter(Boolean);

      gsap.set(shoes, {
        clearProps: "transform",
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        opacity: 1,
      });

      // Hero text
      if (
        heroTextRef.current?.children?.length
      ) {
        gsap.from(
          heroTextRef.current.children,
          {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
          }
        );
      }

      // Hero shoes
      if (shoes.length) {
        gsap.from(shoes, {
          scale: 0.5,
          opacity: 0,
          y: 100,
          rotation: -15,
          duration: 1.2,
          stagger: 0.15,
          ease: "back.out(1.5)",
        });
      }

      // Hero scroll
      if (
        heroRef.current &&
        shoes.length === 5
      ) {
        const heroTimeline =
          gsap.timeline({
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1,
              pin: false,
              invalidateOnRefresh: true,
            },
          });

        heroTimeline
          .to(
            shoes[0],
            {
              x: -280,
              y: 100,
              rotation: -15,
              scale: 0.8,
            },
            0
          )
          .to(
            shoes[1],
            {
              x: -140,
              y: 40,
              rotation: -8,
              scale: 0.9,
            },
            0
          )
          .to(
            shoes[2],
            {
              x: 0,
              y: -20,
              rotation: 0,
              scale: 1,
            },
            0
          )
          .to(
            shoes[3],
            {
              x: 140,
              y: 40,
              rotation: 8,
              scale: 0.9,
            },
            0
          )
          .to(
            shoes[4],
            {
              x: 280,
              y: 100,
              rotation: 15,
              scale: 0.8,
            },
            0
          );
      }

      // Men categories
      if (
        categoryRef.current?.children?.length
      ) {
        gsap.from(
          categoryRef.current.children,
          {
            scrollTrigger: {
              trigger: categoryRef.current,
              start: "top 80%",
            },
            y: 70,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
          }
        );
      }

      // Women categories
      if (
        womenCategoryRef.current?.children
          ?.length
      ) {
        gsap.from(
          womenCategoryRef.current.children,
          {
            scrollTrigger: {
              trigger:
                womenCategoryRef.current,
              start: "top 80%",
            },
            y: 70,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
          }
        );
      }

      // New arrivals
      if (
        arrivalRef.current?.children?.length
      ) {
        gsap.from(
          arrivalRef.current.children,
          {
            scrollTrigger: {
              trigger: arrivalRef.current,
              start: "top 80%",
            },
            y: 60,
            opacity: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
          }
        );
      }

      // Trending
      if (
        trendingRef.current?.children?.length
      ) {
        gsap.from(
          trendingRef.current.children,
          {
            scrollTrigger: {
              trigger: trendingRef.current,
              start: "top 80%",
            },
            y: 60,
            opacity: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
          }
        );
      }

      // Best Sellers
      if (
        bestSellerRef.current?.children?.length
      ) {
        gsap.from(
          bestSellerRef.current.children,
          {
            scrollTrigger: {
              trigger: bestSellerRef.current,
              start: "top 80%",
            },
            y: 60,
            opacity: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
          }
        );
      }

      // CTA
      if (ctaRef.current) {
        gsap.from(ctaRef.current, {
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 85%",
          },
          scale: 0.95,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });
      }

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);

      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);
    }, heroRef);

    return () => {
      ctx.revert();
      shoeRefs.current = [];
    };
  }, []);

  // ==================================================
  // HERO IMAGE LOAD
  // ==================================================

  const handleHeroImageLoad = () => {
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  };

  return (
    <main className="overflow-hidden bg-black text-white">

      {/* ==================================================
          HERO
      ================================================== */}

      <section
        ref={heroRef}
        className="relative flex min-h-[90vh] items-center overflow-hidden px-4 py-20 sm:px-6 lg:min-h-screen lg:px-8"
      >
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-400/10 blur-[120px]" />

        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2">

          {/* Hero Content */}

          <div
            ref={heroTextRef}
            className="relative z-10 max-w-2xl"
          >
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.35em] text-lime-400">
              Step Into Your World
            </p>

            <h1 className="text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
              MOVE
              <br />
              <span className="text-lime-400">
                DIFFERENT.
              </span>
            </h1>

            <p className="mt-7 max-w-lg text-base leading-7 text-gray-400 sm:text-lg">
              Discover footwear designed for people who don't
              follow the path. From everyday street style to
              high-performance sports, Trestep keeps you moving.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-xl bg-lime-400 px-6 py-3.5 font-semibold text-black transition duration-300 hover:bg-lime-300"
              >
                Shop Collection
                <FiArrowRight />
              </Link>

              <Link
                to="/new-arrivals"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 font-semibold text-white transition duration-300 hover:border-lime-400 hover:text-lime-400"
              >
                New Arrivals
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-8 border-t border-white/10 pt-7">
              <div>
                <p className="text-2xl font-bold">
                  500+
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Premium Styles
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold">
                  10K+
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Happy Customers
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold">
                  4.9/5
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Customer Rating
                </p>
              </div>
            </div>
          </div>

          {/* Hero Shoes */}

          <div className="relative flex h-[420px] items-center justify-center sm:h-[520px] lg:h-[620px]">
            {heroShoes.map((shoe, index) => (
              <div
                key={shoe.id}
                ref={(element) => {
                  shoeRefs.current[index] =
                    element;
                }}
                className="absolute"
                style={{
                  zIndex:
                    heroShoes.length - index,
                }}
              >
                <div className="relative">

                  <div
                    className="absolute inset-0 -z-10 rounded-full opacity-20 blur-3xl"
                    style={{
                      backgroundColor:
                        shoe.color,
                    }}
                  />

                  <img
                    src={shoe.image}
                    alt={shoe.title}
                    onLoad={
                      handleHeroImageLoad
                    }
                    className="h-[240px] w-[300px] rounded-3xl object-cover shadow-2xl sm:h-[300px] sm:w-[380px] lg:h-[340px] lg:w-[440px]"
                  />

                  <div className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-black/70 px-4 py-2 backdrop-blur-md">
                    <span className="text-xs font-semibold uppercase tracking-widest text-lime-400">
                      {shoe.title}
                    </span>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-gray-600 lg:flex">
          <span className="text-[10px] uppercase tracking-[0.3em]">
            Scroll
          </span>

          <div className="h-10 w-px bg-gradient-to-b from-lime-400 to-transparent" />
        </div>
      </section>

      {/* ==================================================
          DATABASE CATEGORIES
      ================================================== */}

      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">

          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-lime-400">
                Explore
              </p>

              <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                Shop By Category
              </h2>

              <p className="mt-3 max-w-xl text-gray-400">
                Find the perfect pair for your lifestyle, your sport,
                and your everyday moves.
              </p>
            </div>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-sm font-semibold text-lime-400 hover:text-lime-300"
            >
              View All
              <FiArrowRight />
            </Link>
          </div>

          {categoriesLoading ? (
            <div className="py-16 text-center text-gray-500">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-zinc-950 px-6 py-16 text-center">
              <h3 className="text-xl font-bold">
                No categories available
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Categories added from the admin panel will appear here.
              </p>
            </div>
          ) : (
            <>
              {/* ==========================================
                  MEN CATEGORIES
              ========================================== */}

              {menCategories.length > 0 && (
                <div className="mb-12">

                  <div className="mb-6">
                    <h3 className="text-2xl font-bold sm:text-3xl">
                      Men
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      Explore footwear designed for men.
                    </p>
                  </div>

                  <div
                    ref={menCategoryZoneRef}
                    onMouseEnter={() => {
                      if (menHasScroll) {
                        menPausedRef.current =
                          true;
                      }
                    }}
                    onMouseLeave={() => {
                      if (menHasScroll) {
                        menPausedRef.current =
                          false;
                      }
                    }}
                    className="relative"
                  >

                    {/* LEFT ARROW */}

                    {menHasScroll && (
                      <button
                        type="button"
                        aria-label="Previous men categories"
                        onClick={() =>
                          scrollCategories(
                            categoryRef,
                            "left"
                          )
                        }
                        className="absolute left-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white shadow-xl backdrop-blur-md transition hover:border-lime-400 hover:bg-lime-400 hover:text-black"
                      >
                        <FiChevronLeft className="text-xl" />
                      </button>
                    )}

                    {/* CATEGORY CONTAINER */}

                    <div
                      ref={categoryRef}
                      className={
                        menHasScroll
                          ? "flex gap-5 overflow-x-auto pb-2 scrollbar-hide"
                          : "grid gap-5 md:grid-cols-2 lg:grid-cols-3"
                      }
                      style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                      }}
                    >
                      {menHasScroll
                        ? [
                            ...menCategories,
                            ...menCategories,
                            ...menCategories,
                          ].map(
                            (
                              category,
                              index
                            ) => {
                              const id =
                                category._id ||
                                category.id;

                              return (
                                <Link
                                  key={`${id}-${index}`}
                                  to={`/men?category=${encodeURIComponent(
                                    category.name
                                  )}`}
                                  className="group relative h-[400px] w-full flex-none overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
                                >
                                  {category.image ? (
                                    <img
                                      src={
                                        category.image
                                      }
                                      alt={
                                        category.name
                                      }
                                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-zinc-900">
                                      <span className="text-2xl font-bold text-gray-600">
                                        {
                                          category.name
                                        }
                                      </span>
                                    </div>
                                  )}

                                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                                  <div className="absolute bottom-0 left-0 right-0 p-7">

                                    <h3 className="text-3xl font-bold">
                                      {
                                        category.name
                                      }
                                    </h3>

                                    {category.description && (
                                      <p className="mt-2 max-w-xs text-sm text-gray-300">
                                        {
                                          category.description
                                        }
                                      </p>
                                    )}

                                    <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-lime-400">
                                      Men
                                    </p>

                                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-lime-400">
                                      Explore
                                      <FiArrowRight className="transition group-hover:translate-x-1" />
                                    </span>

                                  </div>
                                </Link>
                              );
                            }
                          )
                        : menCategories.map(
                            (category) => {
                              const id =
                                category._id ||
                                category.id;

                              return (
                                <Link
                                  key={id}
                                  to={`/men?category=${encodeURIComponent(
                                    category.name
                                  )}`}
                                  className="group relative h-[400px] overflow-hidden rounded-3xl border border-white/10 bg-zinc-950"
                                >
                                  {category.image ? (
                                    <img
                                      src={
                                        category.image
                                      }
                                      alt={
                                        category.name
                                      }
                                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-zinc-900">
                                      <span className="text-2xl font-bold text-gray-600">
                                        {
                                          category.name
                                        }
                                      </span>
                                    </div>
                                  )}

                                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                                  <div className="absolute bottom-0 left-0 right-0 p-7">

                                    <h3 className="text-3xl font-bold">
                                      {
                                        category.name
                                      }
                                    </h3>

                                    {category.description && (
                                      <p className="mt-2 max-w-xs text-sm text-gray-300">
                                        {
                                          category.description
                                        }
                                      </p>
                                    )}

                                    <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-lime-400">
                                      Men
                                    </p>

                                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-lime-400">
                                      Explore
                                      <FiArrowRight className="transition group-hover:translate-x-1" />
                                    </span>

                                  </div>
                                </Link>
                              );
                            }
                          )}
                    </div>

                    {/* RIGHT ARROW */}

                    {menHasScroll && (
                      <button
                        type="button"
                        aria-label="Next men categories"
                        onClick={() =>
                          scrollCategories(
                            categoryRef,
                            "right"
                          )
                        }
                        className="absolute right-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white shadow-xl backdrop-blur-md transition hover:border-lime-400 hover:bg-lime-400 hover:text-black"
                      >
                        <FiChevronRight className="text-xl" />
                      </button>
                    )}

                  </div>
                </div>
              )}

              {/* ==========================================
                  WOMEN CATEGORIES
              ========================================== */}

              {womenCategories.length > 0 && (
                <div>

                  <div className="mb-6">
                    <h3 className="text-2xl font-bold sm:text-3xl">
                      Women
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      Explore footwear designed for women.
                    </p>
                  </div>

                  <div
                    ref={womenCategoryZoneRef}
                    onMouseEnter={() => {
                      if (womenHasScroll) {
                        womenPausedRef.current =
                          true;
                      }
                    }}
                    onMouseLeave={() => {
                      if (womenHasScroll) {
                        womenPausedRef.current =
                          false;
                      }
                    }}
                    className="relative"
                  >

                    {/* LEFT ARROW */}

                    {womenHasScroll && (
                      <button
                        type="button"
                        aria-label="Previous women categories"
                        onClick={() =>
                          scrollCategories(
                            womenCategoryRef,
                            "left"
                          )
                        }
                        className="absolute left-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white shadow-xl backdrop-blur-md transition hover:border-lime-400 hover:bg-lime-400 hover:text-black"
                      >
                        <FiChevronLeft className="text-xl" />
                      </button>
                    )}

                    {/* CATEGORY CONTAINER */}

                    <div
                      ref={womenCategoryRef}
                      className={
                        womenHasScroll
                          ? "flex gap-5 overflow-x-auto pb-2 scrollbar-hide"
                          : "grid gap-5 md:grid-cols-2 lg:grid-cols-3"
                      }
                      style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                      }}
                    >
                      {womenHasScroll
                        ? [
                            ...womenCategories,
                            ...womenCategories,
                            ...womenCategories,
                          ].map(
                            (
                              category,
                              index
                            ) => {
                              const id =
                                category._id ||
                                category.id;

                              return (
                                <Link
                                  key={`${id}-${index}`}
                                  to={`/women?category=${encodeURIComponent(
                                    category.name
                                  )}`}
                                  className="group relative h-[400px] w-full flex-none overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
                                >
                                  {category.image ? (
                                    <img
                                      src={
                                        category.image
                                      }
                                      alt={
                                        category.name
                                      }
                                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-zinc-900">
                                      <span className="text-2xl font-bold text-gray-600">
                                        {
                                          category.name
                                        }
                                      </span>
                                    </div>
                                  )}

                                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                                  <div className="absolute bottom-0 left-0 right-0 p-7">

                                    <h3 className="text-3xl font-bold">
                                      {
                                        category.name
                                      }
                                    </h3>

                                    {category.description && (
                                      <p className="mt-2 max-w-xs text-sm text-gray-300">
                                        {
                                          category.description
                                        }
                                      </p>
                                    )}

                                    <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-lime-400">
                                      Women
                                    </p>

                                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-lime-400">
                                      Explore
                                      <FiArrowRight className="transition group-hover:translate-x-1" />
                                    </span>

                                  </div>
                                </Link>
                              );
                            }
                          )
                        : womenCategories.map(
                            (category) => {
                              const id =
                                category._id ||
                                category.id;

                              return (
                                <Link
                                  key={id}
                                  to={`/women?category=${encodeURIComponent(
                                    category.name
                                  )}`}
                                  className="group relative h-[400px] overflow-hidden rounded-3xl border border-white/10 bg-zinc-950"
                                >
                                  {category.image ? (
                                    <img
                                      src={
                                        category.image
                                      }
                                      alt={
                                        category.name
                                      }
                                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-zinc-900">
                                      <span className="text-2xl font-bold text-gray-600">
                                        {
                                          category.name
                                        }
                                      </span>
                                    </div>
                                  )}

                                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                                  <div className="absolute bottom-0 left-0 right-0 p-7">

                                    <h3 className="text-3xl font-bold">
                                      {
                                        category.name
                                      }
                                    </h3>

                                    {category.description && (
                                      <p className="mt-2 max-w-xs text-sm text-gray-300">
                                        {
                                          category.description
                                        }
                                      </p>
                                    )}

                                    <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-lime-400">
                                      Women
                                    </p>

                                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-lime-400">
                                      Explore
                                      <FiArrowRight className="transition group-hover:translate-x-1" />
                                    </span>

                                  </div>
                                </Link>
                              );
                            }
                          )}
                    </div>

                    {/* RIGHT ARROW */}

                    {womenHasScroll && (
                      <button
                        type="button"
                        aria-label="Next women categories"
                        onClick={() =>
                          scrollCategories(
                            womenCategoryRef,
                            "right"
                          )
                        }
                        className="absolute right-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white shadow-xl backdrop-blur-md transition hover:border-lime-400 hover:bg-lime-400 hover:text-black"
                      >
                        <FiChevronRight className="text-xl" />
                      </button>
                    )}

                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </section>

      {/* ==================================================
          NEW ARRIVALS
      ================================================== */}

      <section className="bg-zinc-950 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">

          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-lime-400">
                Just Dropped
              </p>

              <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                New Arrivals
              </h2>

              <p className="mt-3 text-gray-400">
                Fresh styles. New energy. Same Trestep attitude.
              </p>
            </div>

            <Link
              to="/new-arrivals"
              className="inline-flex items-center gap-2 text-sm font-semibold text-lime-400 hover:text-lime-300"
            >
              See All
              <FiArrowRight />
            </Link>
          </div>

          <div
            ref={arrivalRef}
            className={
              newArrivalsHasScroll
                ? "flex gap-5 overflow-x-auto pb-2 scrollbar-hide"
                : "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
            }
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {loading ? (
              <p className="text-gray-500">
                Loading products...
              </p>
            ) : (
              newArrivals.map(
                (product) => (
                  <div
                    key={product._id}
                    className={
                      newArrivalsHasScroll
                        ? "w-full flex-none sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3.75rem)/4)]"
                        : ""
                    }
                  >
                    <ProductCard
                      product={product}
                    />
                  </div>
                )
              )
            )}
          </div>

        </div>
      </section>

      {/* ==================================================
          TRENDING / WHAT'S HOT
      ================================================== */}

      <section
        id="whatshot"
        className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">

          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 text-lime-400">
                <FiTrendingUp />

                <p className="text-sm font-medium uppercase tracking-[0.25em]">
                  Trending Now
                </p>
              </div>

              <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                What's Hot
              </h2>

              <p className="mt-3 text-gray-400">
                The styles everyone's talking about right now.
              </p>
            </div>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-sm font-semibold text-lime-400 hover:text-lime-300"
            >
              Shop Trending
              <FiArrowRight />
            </Link>
          </div>

          <div
            ref={trendingRef}
            className={
              trendingHasScroll
                ? "flex gap-5 overflow-x-auto pb-2 scrollbar-hide"
                : "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
            }
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {loading ? (
              <p className="text-gray-500">
                Loading products...
              </p>
            ) : (
              trendingProducts.map(
                (product) => (
                  <div
                    key={product._id}
                    className={
                      trendingHasScroll
                        ? "w-full flex-none sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3.75rem)/4)]"
                        : ""
                    }
                  >
                    <ProductCard
                      product={product}
                    />
                  </div>
                )
              )
            )}
          </div>

        </div>
      </section>

      {/* ==================================================
          BEST SELLERS
      ================================================== */}

      <section className="bg-zinc-950 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">

          <div className="mb-10 text-center">
            <div className="flex items-center justify-center gap-2 text-lime-400">
              <FiStar />

              <p className="text-sm font-medium uppercase tracking-[0.25em]">
                Customer Favorites
              </p>
            </div>

            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
              Best Sellers
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-gray-400">
              The pairs our customers keep coming back for.
            </p>
          </div>

          <div
            ref={bestSellerRef}
            className={
              bestSellersHasScroll
                ? "flex gap-5 overflow-x-auto pb-2 scrollbar-hide"
                : "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
            }
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {loading ? (
              <p className="text-gray-500">
                Loading products...
              </p>
            ) : (
              bestSellers.map(
                (product) => (
                  <div
                    key={product._id}
                    className={
                      bestSellersHasScroll
                        ? "w-full flex-none sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3.75rem)/4)]"
                        : ""
                    }
                  >
                    <ProductCard
                      product={product}
                    />
                  </div>
                )
              )
            )}
          </div>

        </div>
      </section>

      {/* ==================================================
          CTA
      ================================================== */}

      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div
          ref={ctaRef}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-lime-400/20 bg-lime-400 px-6 py-16 text-black sm:px-10 lg:px-16"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border-[40px] border-black/5" />

          <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full border-[50px] border-black/5" />

          <div className="relative z-10 max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.3em]">
              Your Next Pair
            </p>

            <h2 className="mt-3 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              FIND YOUR
              <br />
              PERFECT STEP.
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-6 text-black/70 sm:text-base">
              Whether you're hitting the streets, the gym, or the
              field, Trestep has a pair built for your journey.
            </p>

            <Link
              to="/shop"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3.5 font-semibold !text-white transition hover:!bg-zinc-900"
            >
              Start Shopping
              <FiShoppingBag />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================================================
          TRUST
      ================================================== */}

      <section className="border-t border-white/10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-3">

          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-lime-400/10 text-lime-400">
              <FiTruck className="text-xl" />
            </div>

            <h3 className="mt-4 font-semibold">
              Fast Delivery
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Quick and reliable delivery to your doorstep.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-lime-400/10 text-lime-400">
              <FiCheckCircle className="text-xl" />
            </div>

            <h3 className="mt-4 font-semibold">
              Quality First
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Carefully selected footwear made for your lifestyle.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-lime-400/10 text-lime-400">
              <FiShoppingBag className="text-xl" />
            </div>

            <h3 className="mt-4 font-semibold">
              Easy Shopping
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Simple shopping experience from product to checkout.
            </p>
          </div>

        </div>
      </section>

    </main>
  );
}

export default Home;