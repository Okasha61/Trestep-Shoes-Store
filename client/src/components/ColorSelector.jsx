function ColorSelector({
  colors = [],
  selectedColor,
  onColorChange,
  onChange,
}) {
  const handleColorChange = (colorName) => {
    onColorChange?.(colorName);
    onChange?.(colorName);
  };

  const getColorName = (color) => {
    if (!color) return "";

    if (typeof color === "string") {
      return color.trim();
    }

    return String(
      color.name ||
        color.value ||
        ""
    ).trim();
  };

  const getColorValue = (color) => {
    if (!color) return "";

    if (typeof color === "string") {
      return color.trim();
    }

    return (
      color.value ||
      color.name ||
      ""
    );
  };

  const normalizeColor = (color) =>
    getColorName(color)
      .toLowerCase()
      .trim();

  return (
    <div className="color-selector">

      <div className="color-options">

        {colors.map((color, index) => {
          const colorName = getColorName(color);

          const colorValue = getColorValue(color);

          if (!colorName) {
            return null;
          }

          const isSelected =
            normalizeColor(selectedColor) ===
            normalizeColor(colorName);

          return (
            <button
              key={`${colorName}-${index}`}
              type="button"
              className={
                isSelected
                  ? "color-option selected"
                  : "color-option"
              }
              onClick={() =>
                handleColorChange(colorName)
              }
              title={colorName}
              aria-label={`Select ${colorName}`}
              aria-pressed={isSelected}
            >

              <span
                className="color-circle"
                style={{
                  backgroundColor:
                    colorValue || colorName,
                }}
              />

              <span className="color-name">
                {colorName}
              </span>

            </button>
          );
        })}

      </div>

    </div>
  );
}

export default ColorSelector;