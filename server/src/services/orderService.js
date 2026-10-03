import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrderService = async (userId, orderData) => {
  for (const item of orderData.items) {
    const product = await Product.findById(item.product);

    if (!product) {
      throw new Error(`Product not found: ${item.product}`);
    }

    if (product.stock < item.quantity) {
      throw new Error(`Not enough stock for ${product.name}`);
    }
  }

  for (const item of orderData.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: {
        stock: -item.quantity,
      },
    });
  }

  return await Order.create({
    user: userId,
    ...orderData,
  });
};

export const getUserOrdersService = async (userId) => {
  return await Order.find({ user: userId })
    .populate("items.product")
    .sort({ createdAt: -1 });
};