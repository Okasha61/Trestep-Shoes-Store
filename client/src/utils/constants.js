export const APP_NAME = "Trestep";

export const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

// Product genders
export const GENDERS = [
  "men",
  "women",
];

// Main categories
export const CATEGORIES = [
  "sports",
  "casual",
  "events",
];

// Sports subcategories
export const SPORTS = [
  "cricket",
  "football",
  "running",
  "basketball",
  "training",
  "gym",
];

// Product sizes
export const SHOE_SIZES = [
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
  "47",
];

// Common shoe colors
export const SHOE_COLORS = [
  "Black",
  "White",
  "Red",
  "Blue",
  "Green",
  "Grey",
  "Brown",
  "Beige",
];

// Order statuses
export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

// Payment methods
export const PAYMENT_METHODS = [
  "cod",
];

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: "trestepToken",
};

// Shipping
export const SHIPPING_FEE = 250;

// Free shipping threshold
export const FREE_SHIPPING_THRESHOLD = 10000;

// Maximum quantity of one product
export const MAX_PRODUCT_QUANTITY = 10;