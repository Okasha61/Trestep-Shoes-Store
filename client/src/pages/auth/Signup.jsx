import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  FiArrowRight,
  FiCheck,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";

import toast from "react-hot-toast";

import { useAuth } from "../../hooks/useAuth";

const Signup = () => {
  const navigate = useNavigate();

  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ==========================================
    // FRONTEND VALIDATION
    // ==========================================

    const username = formData.username.trim();
    const email = formData.email.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    // Username
    if (!username) {
      toast.error("Please enter your username.");
      return;
    }

    if (username.length < 3) {
      toast.error("Username must be at least 3 characters.");
      return;
    }

    // Email
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    // Email format
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Password
    if (!password) {
      toast.error("Please enter a password.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    // Confirm password
    if (!confirmPassword) {
      toast.error("Please confirm your password.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    // ==========================================
    // SIGNUP REQUEST
    // ==========================================

    try {
      setLoading(true);

      await signup({
        username,
        email,
        password,
      });

      // Success
      toast.success("Account created successfully!");

      navigate("/login");
    } catch (error) {
      // ==========================================
      // BACKEND / NETWORK ERROR
      // ==========================================

      const backendMessage =
        error?.response?.data?.message;

      // Backend sent a message
      if (backendMessage) {
        toast.error(backendMessage);
        return;
      }

      // Request reached server but no response
      if (error?.request && !error?.response) {
        toast.error(
          "Unable to connect to the server. Please try again."
        );
        return;
      }

      // Unknown error
      toast.error(
        "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left Side */}
        <div className="relative hidden overflow-hidden bg-zinc-950 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0">
            <div className="absolute right-[-150px] top-[-150px] h-[450px] w-[450px] rounded-full bg-lime-400/10 blur-3xl" />

            <div className="absolute bottom-[-180px] left-[-100px] h-[400px] w-[400px] rounded-full bg-lime-400/5 blur-3xl" />
          </div>

          {/* Logo */}
          <div className="relative z-10 p-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-2xl font-black tracking-tight"
            >
              <span className="text-lime-400">
                TRE
              </span>

              <span>STEP</span>
            </Link>
          </div>

          {/* Content */}
          <div className="relative z-10 px-10 pb-16 xl:px-16">
            <p className="text-sm uppercase tracking-[0.3em] text-lime-400">
              Join Trestep
            </p>

            <h1 className="mt-5 max-w-xl text-5xl font-black leading-tight xl:text-6xl">
              Your next pair
              <span className="block text-lime-400">
                starts here.
              </span>
            </h1>

            <p className="mt-6 max-w-lg leading-7 text-gray-500">
              Create your account and explore a premium
              collection of footwear designed for sport,
              casual days and special events.
            </p>

            {/* Benefits */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-lime-400/10 text-lime-400">
                  <FiCheck />
                </span>

                Discover the latest shoe collections
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-lime-400/10 text-lime-400">
                  <FiCheck />
                </span>

                Save your favorite products
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-lime-400/10 text-lime-400">
                  <FiCheck />
                </span>

                Track your orders easily
              </div>
            </div>
          </div>

          <div className="relative z-10 px-10 pb-8 text-xs text-gray-600">
            © {new Date().getFullYear()} Trestep. All rights reserved.
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="mb-8 text-center lg:hidden">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-3xl font-black"
              >
                <span className="text-lime-400">
                  TRE
                </span>

                <span>STEP</span>
              </Link>
            </div>

            {/* Heading */}
            <div>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-lime-400/10 text-xl text-lime-400">
                <FiShoppingBag />
              </div>

              <p className="text-sm uppercase tracking-widest text-lime-400">
                Create Account
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Join Trestep
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Create your account to start shopping with Trestep.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium"
                >
                  Username
                </label>

                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />

                  <input
                    id="username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Your username"
                    autoComplete="username"
                    className="w-full rounded-xl border border-white/10 bg-zinc-950 py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-700 focus:border-lime-400"
                  />
                </div>
              </div>

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
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium"
                >
                  Password
                </label>

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
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
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
                  >
                    {showPassword ? (
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />

                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-white/10 bg-zinc-950 py-3.5 pl-11 pr-12 text-sm outline-none transition placeholder:text-gray-700 focus:border-lime-400"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) => !previous
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 transition hover:text-white"
                  >
                    {showConfirmPassword ? (
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
                  ? "Creating Account..."
                  : "Create Account"}

                {!loading && <FiArrowRight />}
              </button>
            </form>

            {/* Login */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-lime-400 transition hover:text-lime-300"
                >
                  Sign In
                </Link>
              </p>
            </div>

            {/* Terms */}
            <p className="mt-6 text-center text-xs leading-5 text-gray-600">
              By creating an account, you agree to our{" "}
              <Link
                to="/terms"
                className="text-gray-400 hover:text-lime-400"
              >
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-lime-400"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;