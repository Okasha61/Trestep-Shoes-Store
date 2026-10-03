import Product from "../models/Product.js";

export const createProductService = async (productData) => {
  return await Product.create(productData);
};

export const getProductsService = async (filters = {}) => {
  return await Product.find(filters).sort({ createdAt: -1 });
};

export const getProductByIdService = async (id) => {
  return await Product.findById(id);
};

export const updateProductService = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

export const deleteProductService = async (id) => {
  return await Product.findByIdAndDelete(id);
};