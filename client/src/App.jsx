import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

// Home
import Home from "./pages/home/Home";

// Shop
import MyOrders from "./pages/orders/MyOrders";
import Shop from "./pages/shop/Shop";
import Men from "./pages/shop/Men";
import Women from "./pages/shop/Women";
import Sports from "./pages/shop/Sports";
import Casual from "./pages/shop/Casual";
import Events from "./pages/shop/Events";
import NewArrivals from "./pages/shop/NewArrivals";
import SearchResults from "./pages/shop/SearchResults";
import SubCategoryProducts from "./pages/shop/SubCategoryProducts";

// Product
import ProductDetails from "./pages/product/ProductDetails";

// Cart & Checkout
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/checkout/Checkout";

// Wishlist
import Wishlist from "./pages/wishlist/Wishlist";

// Authentication
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// About
import About from "./pages/about/About";
import OurJourney from "./pages/about/OurJourney";
import Blogs from "./pages/about/Blogs";
import Contact from "./pages/about/Contact";
import BlogDetails from "./pages/about/BlogDetails";

// Policies
import PrivacyPolicy from "./pages/policies/PrivacyPolicy";
import RefundPolicy from "./pages/policies/RefundPolicy";
import StoreLocation from "./pages/policies/StoreLocation";
import TermsConditions from "./pages/policies/TermsConditions";

// Admin
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import Categories from "./pages/admin/Categories";
import Orders from "./pages/admin/Orders";
import AdminReviews from "./pages/admin/Reviews";
import AdminBlogs from "./pages/admin/AdminBlogs";
import Profile from "./pages/admin/Profile";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* ==================================================
            MAIN WEBSITE ROUTES
        ================================================== */}

        <Route element={<MainLayout />}>
          {/* Home */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* ==================================================
              SHOP
          ================================================== */}

          <Route
            path="/shop"
            element={<Shop />}
          />

          <Route
            path="/shop/:gender/:category"
            element={<SubCategoryProducts />}
          />

          <Route
            path="/shop/:gender/:category/:subCategory"
            element={<SubCategoryProducts />}
          />

          <Route
            path="/men"
            element={<Men />}
          />

          <Route
            path="/women"
            element={<Women />}
          />

          <Route
            path="/sports"
            element={<Sports />}
          />

          <Route
            path="/casual"
            element={<Casual />}
          />

          <Route
            path="/events"
            element={<Events />}
          />

          <Route
            path="/new-arrivals"
            element={<NewArrivals />}
          />

          <Route
            path="/search"
            element={<SearchResults />}
          />

          {/* ==================================================
              PROTECTED USER ROUTES
          ================================================== */}

          <Route element={<ProtectedRoute />}>
            <Route
              path="/my-orders"
              element={<MyOrders />}
            />

            <Route
              path="/checkout"
              element={<Checkout />}
            />
          </Route>

          {/* ==================================================
              PRODUCT
          ================================================== */}

          <Route
            path="/product/:id"
            element={<ProductDetails />}
          />

          {/* ==================================================
              CART
          ================================================== */}

          <Route
            path="/cart"
            element={<Cart />}
          />

          {/* ==================================================
              WISHLIST
          ================================================== */}

          <Route
            path="/wishlist"
            element={<Wishlist />}
          />

          {/* ==================================================
              AUTHENTICATION
          ================================================== */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/reset-password/:token"
            element={<ResetPassword />}
          />

          {/* ==================================================
              ABOUT
          ================================================== */}

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/our-journey"
            element={<OurJourney />}
          />

          {/* ==================================================
              BLOGS
          ================================================== */}

          {/* Blog Listing */}
          <Route
            path="/blogs"
            element={<Blogs />}
          />

          {/* Blog Details - NEW/CORRECT ROUTE */}
          <Route
            path="/blogs/:id"
            element={<BlogDetails />}
          />

          {/* Old Blog URL - kept for compatibility */}
          <Route
            path="/blog/:id"
            element={<BlogDetails />}
          />

          {/* Contact */}
          <Route
            path="/contact"
            element={<Contact />}
          />

          {/* ==================================================
              POLICIES
          ================================================== */}

          <Route
            path="/privacy-policy"
            element={<PrivacyPolicy />}
          />

          <Route
            path="/refund-policy"
            element={<RefundPolicy />}
          />

          <Route
            path="/store-location"
            element={<StoreLocation />}
          />

          <Route
            path="/terms"
            element={<TermsConditions />}
          />
        </Route>

        {/* ==================================================
            ADMIN ROUTES
        ================================================== */}

        <Route element={<ProtectedRoute adminOnly />}>
          <Route element={<AdminLayout />}>

            {/* Admin Dashboard */}
            <Route
              path="/admin"
              element={<Dashboard />}
            />

            <Route
              path="/admin/dashboard"
              element={<Dashboard />}
            />

            {/* Admin Products */}
            <Route
              path="/admin/products"
              element={<Products />}
            />

            <Route
              path="/admin/products/add"
              element={<AddProduct />}
            />

            <Route
              path="/admin/products/edit/:id"
              element={<EditProduct />}
            />

            {/* Admin Categories */}
            <Route
              path="/admin/categories"
              element={<Categories />}
            />

            {/* Admin Orders */}
            <Route
              path="/admin/orders"
              element={<Orders />}
            />

            {/* Admin Reviews */}
            <Route
              path="/admin/reviews"
              element={<AdminReviews />}
            />

            {/* Admin Blogs */}
            <Route
              path="/admin/blogs"
              element={<AdminBlogs />}
            />

            {/* Admin Profile */}
            <Route
              path="/admin/profile"
              element={<Profile />}
            />

          </Route>
        </Route>

        {/* ==================================================
            404 PAGE
        ================================================== */}

        <Route
          path="*"
          element={
            <div className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
              <div className="text-center">

                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-lime-400">
                  TRESTEP
                </p>

                <h1 className="text-7xl font-black">
                  404
                </h1>

                <h2 className="mt-4 text-2xl font-bold">
                  Page Not Found
                </h2>

                <p className="mt-3 text-gray-500">
                  The page you are looking for does not exist.
                </p>

                <a
                  href="/"
                  className="mt-7 inline-flex rounded-xl bg-lime-400 px-6 py-3 font-bold text-black transition hover:bg-lime-300"
                >
                  Back to Home
                </a>

              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;