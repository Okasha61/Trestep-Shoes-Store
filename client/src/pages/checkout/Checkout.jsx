import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiMapPin,
  FiPhone,
  FiUser,
  FiMail,
  FiTruck,
  FiShoppingBag,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { createOrder } from "../../services/orderService";

function Checkout() {
  const navigate = useNavigate();

  const { cartItems, subtotal, shipping, total, clearCart } = useCart();

  const { user, isAuthenticated } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.username || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  });

  // If cart is empty
  if (cartItems.length === 0) {
    return (
      <section className="min-h-[70vh] bg-black px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-lime-400/20 bg-lime-400/10">
            <FiShoppingBag className="text-4xl text-lime-400" />
          </div>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Your Cart is Empty
          </h1>

          <p className="mt-3 text-gray-400">
            Add some products to your cart before proceeding to checkout.
          </p>

          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-lime-400 px-6 py-3 font-semibold text-black transition hover:bg-lime-300"
          >
            Continue Shopping
            <FiArrowRight />
          </Link>
        </div>
      </section>
    );
  }

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Place Order
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Login check
    if (!isAuthenticated) {
      toast.error("Please login before placing your order");

      navigate("/login", {
        state: {
          from: {
            pathname: "/checkout",
          },
        },
      });

      return;
    }

    // Basic validation
    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }

    if (!formData.address.trim()) {
      toast.error("Please enter your delivery address");
      return;
    }

    if (!formData.city.trim()) {
      toast.error("Please enter your city");
      return;
    }

    if (!formData.postalCode.trim()) {
      toast.error("Please enter your postal code");
      return;
    }

    try {
      setIsSubmitting(true);

      const orderItems = cartItems.map((item) => ({
        productId: item.product?._id || item._id || item.id,
        quantity: Number(item.quantity || 1),
        color: item.selectedColor || item.color || null,
        size: item.selectedSize || item.size || null,
        selectedColor: item.selectedColor || item.color || null,
        selectedSize: item.selectedSize || item.size || null,
      }));

      await createOrder({
        items: orderItems,
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          notes: formData.notes,
        },
        paymentMethod: "COD",
        subtotal,
        shipping,
        total,
      });

      clearCart();

      toast.success("Order placed successfully!");

      navigate("/");
    } catch (error) {
      console.error("Order Error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-black px-4 py-10 text-white sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <Link
            to="/cart"
            className="mb-5 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-lime-400"
          >
            <FiArrowLeft />
            Back to Cart
          </Link>

          <p className="text-sm font-medium uppercase tracking-[0.25em] text-lime-400">
            TRESTEP
          </p>

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl lg:text-5xl">
            Checkout
          </h1>

          <p className="mt-2 text-gray-400">
            Complete your details and place your order.
          </p>
        </div>

        {/* Checkout Layout */}
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* Left Side */}
          <div>
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* Customer Information */}
              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5 sm:p-7">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold">
                    Customer Information
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Enter your contact details.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* Full Name */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Full Name
                    </label>

                    <div className="relative">
                      <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="w-full rounded-xl border border-white/10 bg-black py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-gray-600 focus:border-lime-400"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Email Address
                    </label>

                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@email.com"
                        className="w-full rounded-xl border border-white/10 bg-black py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-gray-600 focus:border-lime-400"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Phone Number
                    </label>

                    <div className="relative">
                      <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="03XX XXXXXXX"
                        className="w-full rounded-xl border border-white/10 bg-black py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-gray-600 focus:border-lime-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5 sm:p-7">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-400/10">
                    <FiMapPin className="text-lime-400" />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold">
                      Shipping Address
                    </h2>

                    <p className="text-sm text-gray-500">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>

                <div className="space-y-5">

                  {/* Address */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Complete Address
                    </label>

                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      placeholder="House/Flat No, Street, Area..."
                      className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-lime-400"
                    />
                  </div>

                  {/* City + Postal Code */}
                  <div className="grid gap-5 sm:grid-cols-2">

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-300">
                        City
                      </label>

                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Enter city"
                        className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-lime-400"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-300">
                        Postal Code
                      </label>

                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="Postal code"
                        className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-lime-400"
                      />
                    </div>

                  </div>

                  {/* Order Notes */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Order Notes
                      <span className="ml-2 text-xs text-gray-600">
                        Optional
                      </span>
                    </label>

                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Any special instructions?"
                      className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-lime-400"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5 sm:p-7">
                <h2 className="text-xl font-semibold">
                  Payment Method
                </h2>

                <div className="mt-5 rounded-xl border border-lime-400/40 bg-lime-400/5 p-4">
                  <div className="flex items-start gap-4">

                    <div className="mt-1">
                      <FiCheckCircle className="text-xl text-lime-400" />
                    </div>

                    <div>
                      <h3 className="font-semibold">
                        Cash on Delivery
                      </h3>

                      <p className="mt-1 text-sm leading-relaxed text-gray-400">
                        Pay in cash when your Trestep order is delivered
                        to your doorstep.
                      </p>
                    </div>

                  </div>
                </div>
              </div>

              {/* Mobile Place Order */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-lime-400 px-5 py-4 font-semibold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60 lg:hidden"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Order
                    <FiArrowRight />
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Right Side - Order Summary */}
          <aside className="h-fit lg:sticky lg:top-24">

            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5 sm:p-6">

              <h2 className="text-xl font-semibold">
                Your Order
              </h2>

              {/* Products */}
              <div className="mt-6 max-h-[380px] space-y-4 overflow-y-auto pr-1">

                {cartItems.map((item) => {
                  const product = item.product || item;

                  const itemId =
                    product?._id ||
                    product?.id ||
                    item.cartItemId;

                  const image =
                    product?.images?.[0] ||
                    product?.image ||
                    "/placeholder.png";

                  const name =
                    product?.name || "Product";

                  const price =
                    Number(product?.price) || 0;

                  return (
                    <div
                      key={item.cartItemId || itemId}
                      className="flex gap-3"
                    >

                      {/* Image */}
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-black">
                        <img
                          src={image}
                          alt={name}
                          className="h-full w-full object-cover"
                        />

                        <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-lime-400 px-1 text-[10px] font-bold text-black">
                          {item.quantity}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-medium">
                          {name}
                        </h3>

                        {item.selectedColor && (
                          <p className="mt-1 text-xs text-gray-500">
                            Color: {item.selectedColor?.name || item.selectedColor}
                          </p>
                        )}

                        {item.selectedSize && (
                          <p className="text-xs text-gray-500">
                            Size: {item.selectedSize}
                          </p>
                        )}
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          Rs.{" "}
                          {(price * item.quantity).toLocaleString()}
                        </p>
                      </div>

                    </div>
                  );
                })}

              </div>

              <div className="my-6 h-px bg-white/10" />

              {/* Summary */}
              <div className="space-y-4 text-sm">

                <div className="flex justify-between">
                  <span className="text-gray-400">
                    Subtotal
                  </span>

                  <span>
                    Rs. {subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <FiTruck />
                    Shipping
                  </div>

                  <span>
                    {shipping === 0
                      ? "Free"
                      : `Rs. ${shipping.toLocaleString()}`}
                  </span>
                </div>

              </div>

              <div className="my-6 h-px bg-white/10" />

              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">
                  Total
                </span>

                <span className="text-2xl font-bold text-lime-400">
                  Rs. {total.toLocaleString()}
                </span>
              </div>

              {/* Desktop Place Order */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="mt-6 hidden w-full items-center justify-center gap-2 rounded-xl bg-lime-400 px-5 py-4 font-semibold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60 lg:flex"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Order
                    <FiArrowRight />
                  </>
                )}
              </button>

              {/* Security */}
              <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-gray-500">
                <FiCheckCircle className="text-lime-400" />
                Secure & reliable checkout
              </div>

            </div>
          </aside>

        </div>
      </div>
    </section>
  );
}

export default Checkout;