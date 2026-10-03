import { useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiMail, FiShoppingBag } from "react-icons/fi";
import toast from "react-hot-toast";

import api from "../../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/forgot-password",
        {
          email: email.trim(),
        }
      );

      toast.success(
        response.data?.message ||
          "Reset link sent to your email."
      );

      setEmail("");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to send reset link."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">

          <div className="mb-10 text-center">
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

          <div>
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-lime-400/10 text-xl text-lime-400">
              <FiShoppingBag />
            </div>

            <p className="text-sm uppercase tracking-widest text-lime-400">
              Password Recovery
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Forgot your password?
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Enter your email address and we'll send you
              a password reset link.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
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
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full rounded-xl border border-white/10 bg-zinc-950 py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-700 focus:border-lime-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-lime-400 px-5 py-3.5 font-semibold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Sending..."
                : "Send Reset Link"}

              {!loading && <FiArrowRight />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="text-sm text-lime-400 transition hover:text-lime-300"
            >
              ← Back to Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;