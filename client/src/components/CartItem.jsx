import {
  FiTrash2,
  FiMinus,
  FiPlus,
} from "react-icons/fi";

function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}) {
  if (!item) return null;

  const product = item.product || item;

  const itemId =
    item.cartItemId ||
    item._id ||
    item.id;

  const image =
    product.images?.[0] ||
    product.image ||
    "/placeholder.png";

  const productName =
    product.name || "Product";

  const price =
    Number(product.price || 0);

  return (
    <article
      className="
        group
        relative
        flex
        w-full
        flex-col
        gap-4
        rounded-2xl
        border
        border-white/10
        bg-zinc-950
        p-4
        transition-all
        duration-300
        hover:border-lime-400/30
        hover:bg-zinc-900/80

        sm:flex-row
        sm:items-center
        sm:p-5
      "
    >

      {/* =====================================================
          PRODUCT IMAGE
      ===================================================== */}

      <div
        className="
          relative
          h-36
          w-full
          shrink-0
          overflow-hidden
          rounded-xl
          border
          border-white/10
          bg-zinc-900

          sm:h-32
          sm:w-32

          md:h-36
          md:w-36
        "
      >
        <img
          src={image}
          alt={productName}
          className="
            h-full
            w-full
            object-cover
            transition
            duration-500
            group-hover:scale-105
          "
        />
      </div>


      {/* =====================================================
          PRODUCT INFORMATION
      ===================================================== */}

      <div
        className="
          flex
          min-w-0
          flex-1
          flex-col
          justify-center
        "
      >

        <h3
          className="
            truncate
            text-base
            font-semibold
            text-white
            sm:text-lg
          "
        >
          {productName}
        </h3>


        {/* Color */}

        {item.selectedColor && (
          <p
            className="
              mt-2
              text-sm
              text-gray-400
            "
          >
            Color:
            <strong
              className="
                ml-1
                font-medium
                text-gray-200
              "
            >
              {item.selectedColor?.name ||
                item.selectedColor}
            </strong>
          </p>
        )}


        {/* Size */}

        {item.selectedSize && (
          <p
            className="
              mt-1
              text-sm
              text-gray-400
            "
          >
            Size:
            <strong
              className="
                ml-1
                font-medium
                text-gray-200
              "
            >
              {item.selectedSize}
            </strong>
          </p>
        )}


        {/* Price */}

        <p
          className="
            mt-3
            text-base
            font-bold
            text-lime-400
          "
        >
          Rs. {price.toLocaleString()}
        </p>

      </div>


      {/* =====================================================
          QUANTITY
      ===================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-4

          sm:flex-col
          sm:items-center
          sm:justify-center

          md:min-w-[105px]
        "
      >

        <span
          className="
            text-xs
            font-medium
            uppercase
            tracking-wider
            text-gray-500
            sm:hidden
          "
        >
          Quantity
        </span>


        <div
          className="
            flex
            h-10
            items-center
            overflow-hidden
            rounded-lg
            border
            border-white/10
            bg-black
          "
        >

          <button
            type="button"
            onClick={() =>
              onDecrease?.(itemId)
            }
            className="
              flex
              h-full
              w-9
              items-center
              justify-center
              text-gray-400
              transition
              hover:bg-white/10
              hover:text-white
            "
            aria-label="Decrease quantity"
          >
            <FiMinus size={14} />
          </button>


          <span
            className="
              flex
              min-w-[34px]
              items-center
              justify-center
              text-sm
              font-semibold
              text-white
            "
          >
            {item.quantity}
          </span>


          <button
            type="button"
            onClick={() =>
              onIncrease?.(itemId)
            }
            className="
              flex
              h-full
              w-9
              items-center
              justify-center
              text-gray-400
              transition
              hover:bg-white/10
              hover:text-lime-400
            "
            aria-label="Increase quantity"
          >
            <FiPlus size={14} />
          </button>

        </div>

      </div>


      {/* =====================================================
          REMOVE BUTTON
      ===================================================== */}

      <button
        type="button"
        onClick={() =>
          onRemove?.(itemId)
        }
        className="
          absolute
          right-4
          top-4

          flex
          h-9
          w-9
          items-center
          justify-center

          rounded-lg
          border
          border-red-500/20

          bg-red-500/5

          text-red-400

          transition

          hover:border-red-500/40
          hover:bg-red-500/10
          hover:text-red-300

          sm:static
          sm:shrink-0
        "
        aria-label="Remove item"
      >
        <FiTrash2 size={16} />
      </button>

    </article>
  );
}

export default CartItem;