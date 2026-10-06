import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  FiSearch,
  FiShoppingBag,
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiGrid,
  FiHeart,
  FiPackage,
} from "react-icons/fi";

import toast from "react-hot-toast";

import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { useWishlist } from "../hooks/useWishlist";

function Navbar() {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const [accountOpen, setAccountOpen] =
    useState(false);

  // ======================================================
  // SEARCH STATE
  // ======================================================

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const accountRef = useRef(null);

  const searchInputRef = useRef(null);

  const navigate = useNavigate();

  const { totalItems } = useCart();

  const { wishlistCount } =
    useWishlist();

  const {
    user,
    isAuthenticated,
    isAdmin,
    logout,
  } = useAuth();

  // ======================================================
  // NAVIGATION LINKS
  // ======================================================

  const navLinks = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Men",
      path: "/men",
    },
    {
      name: "Women",
      path: "/women",
    },
    {
      name: "New Arrivals",
      path: "/new-arrivals",
    },
    {
      name: "About",
      path: "/about",
    },
  ];

  // ======================================================
  // CLOSE ACCOUNT DROPDOWN
  // ======================================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(
          event.target
        )
      ) {
        setAccountOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  // ======================================================
  // FOCUS SEARCH INPUT
  // ======================================================

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [searchOpen]);

  // ======================================================
  // CLOSE MENUS
  // ======================================================

  const closeMenus = () => {
    setAccountOpen(false);
    setMenuOpen(false);
  };

  // ======================================================
  // SEARCH TOGGLE
  // ======================================================

  const handleSearchToggle = () => {
    setAccountOpen(false);
    setMenuOpen(false);

    setSearchOpen(
      (previous) => !previous
    );
  };

  // ======================================================
  // SEARCH SUBMIT
  // ======================================================

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const query =
      searchQuery.trim();

    if (!query) {
      searchInputRef.current?.focus();
      return;
    }

    // Normalize search text
    const normalizedQuery =
      query.toLowerCase().replace(/\s+/g, " ");

    // ==================================================
    // DIRECT GENDER SEARCH
    // ==================================================

    if (normalizedQuery === "men") {
      handleCloseSearch();
      navigate("/men");
      return;
    }

    if (normalizedQuery === "women") {
      handleCloseSearch();
      navigate("/women");
      return;
    }

    // ==================================================
    // NORMAL PRODUCT SEARCH
    // ==================================================

    handleCloseSearch();

    navigate(
      `/search?query=${encodeURIComponent(
        query
      )}`
    );
  };

  // ======================================================
  // CLEAR SEARCH
  // ======================================================

  const handleClearSearch = () => {
    setSearchQuery("");

    searchInputRef.current?.focus();
  };

  // ======================================================
  // CLOSE SEARCH
  // ======================================================

  const handleCloseSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = () => {
    logout();

    closeMenus();

    handleCloseSearch();

    toast.success(
      "Logged out successfully"
    );

    navigate("/");
  };

  // ======================================================
  // ADMIN DASHBOARD
  // ======================================================

  const handleAdminDashboard = () => {
    closeMenus();

    handleCloseSearch();

    navigate("/admin");
  };

  // ======================================================
  // MY ORDERS
  // ======================================================

  const handleMyOrders = () => {
    closeMenus();

    handleCloseSearch();

    navigate("/my-orders");
  };

  // ======================================================
  // ACCOUNT TOGGLE
  // ======================================================

  const handleAccountToggle = (
    event
  ) => {
    event.stopPropagation();

    setSearchOpen(false);

    if (!isAuthenticated) {
      closeMenus();

      navigate("/login");

      return;
    }

    setAccountOpen(
      (previous) => !previous
    );
  };

  // ======================================================
  // MOBILE MENU
  // ======================================================

  const handleMobileMenu = () => {
    setMenuOpen(
      (previous) => !previous
    );

    setAccountOpen(false);

    setSearchOpen(false);
  };

  // ======================================================
  // NAVIGATION CLICK
  // ======================================================

  const handleNavigation = () => {
    closeMenus();
    setSearchOpen(false);
    setSearchQuery("");
  };

  // ======================================================
  // JSX
  // ======================================================

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* ==================================================
            LOGO
        ================================================== */}

        <Link
          to="/"
          className="navbar-logo"
          onClick={handleNavigation}
        >
          TRE<span>STEP</span>
        </Link>

        {/* ==================================================
            DESKTOP NAVIGATION
        ================================================== */}

        <nav className="desktop-nav">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={
                handleNavigation
              }
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* ==================================================
            NAVBAR ACTIONS
        ================================================== */}

        <div className="navbar-actions">

          {/* ==================================================
              SEARCH
              
              Search remains available on desktop/tablet.
              CSS can hide .mobile-search on mobile.
          ================================================== */}

          <div
            className={`navbar-search mobile-search ${
              searchOpen
                ? "navbar-search-open"
                : ""
            }`}
          >
            {!searchOpen ? (
              <button
                type="button"
                className="nav-icon"
                title="Search"
                aria-label="Open search"
                onClick={
                  handleSearchToggle
                }
              >
                <FiSearch />
              </button>
            ) : (
              <>
                {/* Search Form */}

                <form
                  className="navbar-search-form"
                  onSubmit={
                    handleSearchSubmit
                  }
                >
                  <FiSearch className="navbar-search-icon" />

                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(event) =>
                      setSearchQuery(
                        event.target.value
                      )
                    }
                    placeholder="Search shoes, categories..."
                    aria-label="Search products"
                    autoComplete="off"
                  />

                  {/* Clear Input */}

                  {searchQuery && (
                    <button
                      type="button"
                      className="navbar-search-clear"
                      onClick={
                        handleClearSearch
                      }
                      aria-label="Clear search"
                    >
                      <FiX />
                    </button>
                  )}
                </form>

                {/* Close Search */}

                <button
                  type="button"
                  className="navbar-search-close"
                  title="Close search"
                  aria-label="Close search"
                  onClick={
                    handleCloseSearch
                  }
                >
                  <FiX />
                </button>
              </>
            )}
          </div>

          {/* ==================================================
              ACCOUNT
          ================================================== */}

          <div
            ref={accountRef}
            className="relative"
          >
            <button
              type="button"
              onClick={
                handleAccountToggle
              }
              className="nav-icon"
              title={
                isAuthenticated
                  ? user?.username ||
                    "Account"
                  : "Login"
              }
              aria-label="Account"
            >
              <FiUser />
            </button>

            {/* ==================================================
                ACCOUNT DROPDOWN
            ================================================== */}

            {isAuthenticated &&
              accountOpen && (
                <div className="absolute right-0 top-full z-[1100] mt-3 w-64 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 text-white shadow-2xl">

                  {/* User Information */}

                  <div className="border-b border-white/10 px-5 py-4">

                    <p className="truncate text-base font-bold text-white">
                      {user?.username ||
                        "User"}
                    </p>

                    <p className="mt-1 truncate text-xs text-gray-500">
                      {user?.email || ""}
                    </p>

                    {isAdmin && (
                      <span className="mt-3 inline-flex rounded-full bg-lime-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-lime-400">
                        Admin
                      </span>
                    )}
                  </div>

                  {/* My Orders */}

                  <button
                    type="button"
                    onClick={
                      handleMyOrders
                    }
                    className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm font-semibold text-gray-300 transition hover:bg-white/5 hover:text-white"
                  >
                    <FiPackage className="text-lg text-lime-400" />

                    <span>
                      My Orders
                    </span>
                  </button>

                  {/* Admin Dashboard */}

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={
                        handleAdminDashboard
                      }
                      className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm font-semibold text-gray-300 transition hover:bg-white/5 hover:text-white"
                    >
                      <FiGrid className="text-lg text-lime-400" />

                      <span>
                        Admin Dashboard
                      </span>
                    </button>
                  )}

                  {/* Logout */}

                  <button
                    type="button"
                    onClick={
                      handleLogout
                    }
                    className="flex w-full items-center gap-3 border-t border-white/10 px-5 py-3 text-left text-sm font-semibold text-red-400 transition hover:bg-red-500/5"
                  >
                    <FiLogOut className="text-lg" />

                    <span>
                      Logout
                    </span>
                  </button>
                </div>
              )}
          </div>

          {/* ==================================================
              WISHLIST
          ================================================== */}

          <Link
            to="/wishlist"
            className="nav-icon cart-icon"
            title="Wishlist"
            onClick={
              handleNavigation
            }
          >
            <FiHeart />

            {wishlistCount > 0 && (
              <span className="cart-count">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* ==================================================
              CART
          ================================================== */}

          <Link
            to="/cart"
            className="nav-icon cart-icon"
            title="Cart"
            onClick={
              handleNavigation
            }
          >
            <FiShoppingBag />

            <span className="cart-count">
              {totalItems}
            </span>
          </Link>

          {/* ==================================================
              MOBILE MENU
          ================================================== */}

          <button
            type="button"
            className="mobile-menu-btn"
            onClick={
              handleMobileMenu
            }
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <FiX />
            ) : (
              <FiMenu />
            )}
          </button>
        </div>
      </div>

      {/* ====================================================
          MOBILE NAVIGATION
      ==================================================== */}

      {menuOpen && (
        <nav className="mobile-nav">

          {/* Main Navigation Links */}

          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={
                handleNavigation
              }
              className={({ isActive }) =>
                isActive
                  ? "mobile-nav-link active"
                  : "mobile-nav-link"
              }
            >
              {link.name}
            </NavLink>
          ))}

          {/* ==================================================
              SEARCH REMOVED FROM MOBILE MENU
              
              Search is intentionally not shown here.
          ================================================== */}

          {/* My Orders */}

          {isAuthenticated && (
            <button
              type="button"
              onClick={
                handleMyOrders
              }
              className="mobile-nav-link text-left"
            >
              My Orders
            </button>
          )}

          {/* Admin Dashboard */}

          {isAuthenticated &&
            isAdmin && (
              <button
                type="button"
                onClick={
                  handleAdminDashboard
                }
                className="mobile-nav-link text-left"
              >
                Admin Dashboard
              </button>
            )}

          {/* Logout */}

          {isAuthenticated && (
            <button
              type="button"
              onClick={
                handleLogout
              }
              className="mobile-nav-link text-left"
            >
              Logout
            </button>
          )}
        </nav>
      )}
    </header>
  );
}

export default Navbar;