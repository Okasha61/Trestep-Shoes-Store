// Email validation
export const isValidEmail = (email) => {
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password) => {
  return (
    typeof password === "string" &&
    password.length >= 6
  );
};

// Username validation
export const isValidUsername = (username) => {
  return (
    typeof username === "string" &&
    username.trim().length >= 3
  );
};

// Required field validation
export const isRequired = (value) => {
  return (
    value !== undefined &&
    value !== null &&
    String(value).trim() !== ""
  );
};

// Phone number validation
export const isValidPhone = (phone) => {
  const phoneRegex = /^(\+92|0)3[0-9]{9}$/;

  return phoneRegex.test(phone);
};

// Password confirmation
export const passwordsMatch = (
  password,
  confirmPassword
) => {
  return password === confirmPassword;
};

// Product price validation
export const isValidPrice = (price) => {
  const numericPrice = Number(price);

  return (
    !Number.isNaN(numericPrice) &&
    numericPrice >= 0
  );
};

// Product stock validation
export const isValidStock = (stock) => {
  const numericStock = Number(stock);

  return (
    Number.isInteger(numericStock) &&
    numericStock >= 0
  );
};

// Product name validation
export const isValidProductName = (name) => {
  return (
    typeof name === "string" &&
    name.trim().length >= 2
  );
};

// Validate product form
export const validateProduct = (product) => {
  const errors = {};

  if (!isValidProductName(product.name)) {
    errors.name =
      "Product name must contain at least 2 characters.";
  }

  if (!isValidPrice(product.price)) {
    errors.price = "Please enter a valid price.";
  }

  if (!isValidStock(product.stock)) {
    errors.stock = "Please enter valid stock.";
  }

  if (!isRequired(product.gender)) {
    errors.gender = "Please select a gender.";
  }

  if (!isRequired(product.category)) {
    errors.category = "Please select a category.";
  }

  return errors;
};