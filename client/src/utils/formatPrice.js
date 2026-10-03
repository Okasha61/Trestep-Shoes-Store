export const formatPrice = (price) => {
  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return "Rs. 0";
  }

  return `Rs. ${numericPrice.toLocaleString("en-PK")}`;
};

export default formatPrice;