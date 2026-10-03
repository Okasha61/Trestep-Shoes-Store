import { Link, useNavigate } from "react-router-dom";

import {
  FiArrowLeft,
  FiArrowRight,
  FiShoppingBag,
  FiTrash2,
  FiTruck,
} from "react-icons/fi";

import { toast } from "react-hot-toast";

import CartItem from "../../components/CartItem";
import { useCart } from "../../hooks/useCart";


function Cart() {
  const navigate = useNavigate();

  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    subtotal,
    shipping,
    total,
  } = useCart();


  /* =====================================================
     EMPTY CART
  ===================================================== */

  if (cartItems.length === 0) {
    return (
      <section
        className="
          min-h-[70vh]
          bg-black
          px-4
          py-16
          text-white
          sm:px-6
          lg:px-8
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-3xl
            flex-col
            items-center
            justify-center
            text-center
          "
        >

          <div
            className="
              mb-6
              flex
              h-24
              w-24
              items-center
              justify-center
              rounded-full
              border
              border-lime-400/20
              bg-lime-400/10
            "
          >
            <FiShoppingBag
              className="
                text-4xl
                text-lime-400
              "
            />
          </div>


          <h1
            className="
              text-3xl
              font-bold
              sm:text-4xl
            "
          >
            Your Cart is Empty
          </h1>


          <p
            className="
              mt-3
              max-w-md
              text-gray-400
            "
          >
            Looks like you haven't added
            anything to your cart yet.
            Explore our latest collection
            and find your perfect pair.
          </p>


          <Link
            to="/shop"
            className="
              mt-8
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-lime-400
              px-6
              py-3
              font-semibold
              text-black
              transition
              duration-300
              hover:bg-lime-300
            "
          >
            Continue Shopping

            <FiArrowRight />
          </Link>

        </div>
      </section>
    );
  }


  /* =====================================================
     REMOVE ITEM
  ===================================================== */

  const handleRemove = async (
    cartItemId
  ) => {
    try {
      await removeFromCart(cartItemId);

      toast.success(
        "Product removed from cart"
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Could not remove item"
      );
    }
  };


  /* =====================================================
     INCREASE QUANTITY
  ===================================================== */

  const handleIncrease = async (
    cartItemId
  ) => {
    try {
      await increaseQuantity(cartItemId);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Could not update quantity"
      );
    }
  };


  /* =====================================================
     DECREASE QUANTITY
  ===================================================== */

  const handleDecrease = async (
    cartItemId
  ) => {
    try {
      await decreaseQuantity(cartItemId);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Could not update quantity"
      );
    }
  };


  /* =====================================================
     CLEAR CART
  ===================================================== */

  const handleClearCart = async () => {
    try {
      await clearCart();

      toast.success("Cart cleared");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Could not clear cart"
      );
    }
  };


  /* =====================================================
     CHECKOUT
  ===================================================== */

  const handleCheckout = () => {
    navigate("/checkout");
  };


  return (
    <section
      className="
        min-h-screen
        bg-black
        px-4
        py-10
        text-white
        sm:px-6
        lg:px-8
        lg:py-14
      "
    >

      <div
        className="
          mx-auto
          max-w-7xl
        "
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            mb-8
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >

          <div>

            <p
              className="
                mb-2
                text-xs
                font-medium
                uppercase
                tracking-[0.3em]
                text-lime-400
              "
            >
              TRESTEP
            </p>


            <h1
              className="
                text-3xl
                font-bold
                tracking-tight
                sm:text-4xl
                lg:text-5xl
              "
            >
              Shopping Cart
            </h1>


            <p
              className="
                mt-2
                text-sm
                text-gray-400
              "
            >
              {cartItems.length}{" "}
              {cartItems.length === 1
                ? "item"
                : "items"}{" "}
              in your cart
            </p>

          </div>


          {/* Clear Cart */}

          <button
            type="button"
            onClick={handleClearCart}
            className="
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-lg
              border
              border-red-500/25
              px-4
              py-2.5
              text-sm
              font-medium
              text-red-400
              transition
              hover:border-red-500/40
              hover:bg-red-500/10
            "
          >
            <FiTrash2 size={15} />

            Clear Cart
          </button>

        </div>


        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div
          className="
            grid
            items-start
            gap-7
            lg:grid-cols-[minmax(0,1fr)_350px]
            xl:grid-cols-[minmax(0,1fr)_370px]
          "
        >

          {/* =================================================
              CART ITEMS
          ================================================= */}

          <div className="min-w-0">

            <div className="space-y-3">

              {cartItems.map((item) => (
                <CartItem
                  key={item.cartItemId}
                  item={item}
                  onRemove={handleRemove}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                />
              ))}

            </div>


            {/* Continue Shopping */}

            <div className="pt-6">

              <Link
                to="/shop"
                className="
                  inline-flex
                  items-center
                  gap-2
                  text-sm
                  font-medium
                  text-gray-400
                  transition
                  hover:text-lime-400
                "
              >
                <FiArrowLeft />

                Continue Shopping
              </Link>

            </div>

          </div>


          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <aside
            className="
              h-fit
              rounded-2xl
              border
              border-white/10
              bg-zinc-950
              p-5
              lg:sticky
              lg:top-24
              lg:p-6
            "
          >

            <h2
              className="
                text-lg
                font-semibold
                sm:text-xl
              "
            >
              Order Summary
            </h2>


            <div
              className="
                my-5
                h-px
                bg-white/10
              "
            />


            {/* Subtotal */}

            <div
              className="
                flex
                items-center
                justify-between
                text-sm
              "
            >

              <span className="text-gray-400">
                Subtotal
              </span>

              <span className="font-semibold">
                Rs.{" "}
                {subtotal.toLocaleString()}
              </span>

            </div>


            {/* Shipping */}

            <div
              className="
                mt-4
                flex
                items-center
                justify-between
                text-sm
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-gray-400
                "
              >
                <FiTruck size={15} />

                <span>
                  Shipping
                </span>
              </div>


              <span className="font-semibold">
                {shipping === 0
                  ? "Free"
                  : `Rs. ${shipping.toLocaleString()}`}
              </span>

            </div>


            {/* Free Shipping */}

            {subtotal > 0 &&
              subtotal < 5000 && (
                <div
                  className="
                    mt-5
                    rounded-xl
                    border
                    border-lime-400/15
                    bg-lime-400/[0.04]
                    p-3
                  "
                >

                  <p
                    className="
                      text-xs
                      leading-relaxed
                      text-gray-400
                    "
                  >
                    Add{" "}

                    <span
                      className="
                        font-semibold
                        text-lime-400
                      "
                    >
                      Rs.{" "}
                      {(
                        5000 - subtotal
                      ).toLocaleString()}
                    </span>{" "}

                    more to get
                    free shipping.
                  </p>

                </div>
              )}


            {/* Free Shipping Success */}

            {subtotal >= 5000 && (
              <div
                className="
                  mt-5
                  rounded-xl
                  border
                  border-lime-400/15
                  bg-lime-400/[0.04]
                  p-3
                "
              >

                <p
                  className="
                    text-xs
                    font-medium
                    text-lime-400
                  "
                >
                  🎉 Congratulations!
                  You qualify for free shipping.
                </p>

              </div>
            )}


            <div
              className="
                my-5
                h-px
                bg-white/10
              "
            />


            {/* Total */}

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <span
                className="
                  text-base
                  font-semibold
                "
              >
                Total
              </span>


              <span
                className="
                  text-xl
                  font-bold
                  text-lime-400
                "
              >
                Rs.{" "}
                {total.toLocaleString()}
              </span>

            </div>


            {/* Checkout */}

            <button
              type="button"
              onClick={handleCheckout}
              className="
                mt-5
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-lime-400
                px-5
                py-3.5
                text-sm
                font-bold
                text-black
                transition
                duration-300
                hover:bg-lime-300
                hover:shadow-[0_8px_30px_rgba(156,255,0,0.15)]
              "
            >
              Proceed to Checkout

              <FiArrowRight size={17} />
            </button>


            {/* Payment Info */}

            <div className="mt-4 text-center">

              <p
                className="
                  text-[11px]
                  leading-relaxed
                  text-gray-500
                "
              >
                Secure checkout •
                Cash on Delivery available
              </p>

            </div>

          </aside>

        </div>

      </div>

    </section>
  );
}


export default Cart;