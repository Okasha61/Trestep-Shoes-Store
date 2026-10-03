import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiShoppingBag,
} from "react-icons/fi";
import toast from "react-hot-toast";

import { useAuth } from "../../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    if (!formData.password) {
      toast.error("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const data = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      toast.success("Login successful!");

      // Admin user
      if (data?.user?.role === "admin") {
        navigate("/admin", {
          replace: true,
        });
      } else {
        // Normal user
        navigate(from, {
          replace: true,
        });
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Login failed. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left Side */}
        <div className="relative hidden overflow-hidden bg-zinc-950 lg:flex lg:flex-col lg:justify-between">
          {/* Background */}
          <div className="absolute inset-0">
            <div className="absolute left-[-150px] top-[-150px] h-[400px] w-[400px] rounded-full bg-lime-400/10 blur-3xl" />

            <div className="absolute bottom-[-150px] right-[-100px] h-[400px] w-[400px] rounded-full bg-lime-400/5 blur-3xl" />
          </div>

          <div className="relative z-10 p-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-2xl font-black tracking-tight"
            >
              <span className="text-lime-400">TRE</span>
              <span>STEP</span>
            </Link>
          </div>

          <div className="relative z-10 px-10 pb-16 xl:px-16">
            <p className="text-sm uppercase tracking-[0.3em] text-lime-400">
              Welcome Back
            </p>

            <h1 className="mt-5 max-w-xl text-5xl font-black leading-tight xl:text-6xl">
              Step into your
              <span className="block text-lime-400">
                next journey.
              </span>
            </h1>

            <p className="mt-6 max-w-lg leading-7 text-gray-500">
              Sign in to access your Trestep account, manage your
              orders, save your favorite shoes and discover your next
              pair.
            </p>
          </div>

          <div className="relative z-10 px-10 pb-8 text-xs text-gray-600">
            © {new Date().getFullYear()} Trestep. All rights reserved.
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-center px-5 py-12 sm:px-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="mb-10 text-center lg:hidden">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-3xl font-black"
              >
                <span className="text-lime-400">TRE</span>
                <span>STEP</span>
              </Link>
            </div>

            {/* Heading */}
            <div>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-lime-400/10 text-xl text-lime-400">
                <FiShoppingBag />
              </div>

              <p className="text-sm uppercase tracking-widest text-lime-400">
                Account Login
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Welcome back
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Enter your details to access your Trestep account.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email Address
                </label>

                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-white/10 bg-zinc-950 py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-700 focus:border-lime-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-xs text-lime-400 transition hover:text-lime-300"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-white/10 bg-zinc-950 py-3.5 pl-11 pr-12 text-sm outline-none transition placeholder:text-gray-700 focus:border-lime-400"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (previous) => !previous
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 transition hover:text-white"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-lime-400 px-5 py-3.5 font-semibold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Signing in..."
                  : "Sign In"}

                {!loading && <FiArrowRight />}
              </button>
            </form>

            {/* Signup */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-lime-400 transition hover:text-lime-300"
                >
                  Create Account
                </Link>
              </p>
            </div>

            {/* Back Home */}
            <div className="mt-8 text-center">
              <Link
                to="/"
                className="text-xs text-gray-600 transition hover:text-gray-400"
              >
                ← Back to Trestep
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;