export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password) => {
  return typeof password === "string" && password.length >= 6;
};

export const isValidObjectId = (id) => {
  return /^[a-f\d]{24}$/i.test(id);
};