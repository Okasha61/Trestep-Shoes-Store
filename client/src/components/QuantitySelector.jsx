import { FiMinus, FiPlus } from "react-icons/fi";

function QuantitySelector({
  quantity = 1,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
}) {
  return (
    <div className="quantity-selector">

      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
      >
        <FiMinus />
      </button>

      <span>{quantity}</span>

      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= max}
        aria-label="Increase quantity"
      >
        <FiPlus />
      </button>

    </div>
  );
}

export default QuantitySelector;