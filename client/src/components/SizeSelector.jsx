function SizeSelector({
  sizes = [],
  selectedSize,
  onChange,
  onSizeChange,
}) {
  const handleSizeChange = (size) => {
    const sizeValue =
      typeof size === "object"
        ? String(size?.value || size?.name || "").trim()
        : String(size).trim();

    if (!sizeValue) return;

    onChange?.(sizeValue);
    onSizeChange?.(sizeValue);
  };

  return (
    <div className="size-selector">
      <div className="size-options flex flex-wrap gap-3">
        {sizes.map((size) => {
          const sizeValue =
            typeof size === "object"
              ? String(size?.value || size?.name || "").trim()
              : String(size).trim();

          const isAvailable =
            typeof size === "object"
              ? size.available !== false
              : true;

          const isSelected =
            String(selectedSize) === sizeValue;

          if (!sizeValue) return null;

          return (
            <button
              key={sizeValue}
              type="button"
              disabled={!isAvailable}
              aria-pressed={isSelected}
              onClick={() => handleSizeChange(size)}
              className={`
                min-w-[52px] rounded-xl border px-4 py-3
                text-sm font-semibold transition-all duration-200
                ${
                  isSelected
                    ? "border-lime-400 bg-lime-400 text-black shadow-lg shadow-lime-400/10"
                    : "border-white/10 bg-zinc-950 text-gray-300 hover:border-lime-400/50 hover:text-white"
                }
                ${
                  !isAvailable
                    ? "cursor-not-allowed opacity-40 line-through hover:border-white/10 hover:text-gray-300"
                    : "cursor-pointer"
                }
              `}
            >
              {sizeValue}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SizeSelector;