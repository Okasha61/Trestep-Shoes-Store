import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

export const createOrderService = async (
  userId,
  orderData
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (
      !orderData.items ||
      !Array.isArray(orderData.items) ||
      orderData.items.length === 0
    ) {
      throw new Error("Order must contain at least one item");
    }

    if (!mongoose.isValidObjectId(userId)) {
      throw new Error("Invalid user ID");
    }

    const verifiedItems = [];

    for (const item of orderData.items) {
      if (!mongoose.isValidObjectId(item.product)) {
        throw new Error(
          `Invalid product ID: ${item.product}`
        );
      }

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error("Invalid product quantity");
      }

      const product = await Product.findById(
        item.product
      ).session(session);

      if (!product) {
        throw new Error(
          `Product not found: ${item.product}`
        );
      }

      if (product.stock < quantity) {
        throw new Error(
          `Not enough stock for ${product.name}`
        );
      }

      /*
       * Always use current product information from DB
       * instead of trusting the cart snapshot.
       */
      verifiedItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || "",
        price: product.price,
        quantity,
        color: item.color || "",
        size: item.size || "",
      });
    }

    const subtotal = verifiedItems.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    );

    const shippingFee = Number(
      orderData.shippingFee ?? 250
    );

    if (
      !Number.isFinite(shippingFee) ||
      shippingFee < 0
    ) {
      throw new Error("Invalid shipping fee");
    }

    const total = subtotal + shippingFee;

    /*
     * Atomic stock deduction.
     *
     * The condition:
     * stock: { $gte: quantity }
     *
     * prevents stock from becoming negative when
     * multiple customers order at the same time.
     */
    for (const item of verifiedItems) {
      const updatedProduct =
        await Product.findOneAndUpdate(
          {
            _id: item.product,
            stock: { $gte: item.quantity },
          },
          {
            $inc: {
              stock: -item.quantity,
            },
          },
          {
            new: true,
            session,
          }
        );

      if (!updatedProduct) {
        throw new Error(
          `Not enough stock for ${item.name}`
        );
      }
    }

    const [order] = await Order.create(
      [
        {
          user: userId,
          items: verifiedItems,
          shippingAddress: orderData.shippingAddress,
          subtotal,
          shippingFee,
          total,
          paymentMethod: "COD",
        },
      ],
      {
        session,
      }
    );

    /*
     * Clear cart inside the same transaction.
     */
    await Cart.findOneAndUpdate(
      { user: userId },
      { $set: { items: [] } },
      { session }
    );

    await session.commitTransaction();

    return order;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const getUserOrdersService = async (userId) => {
  return await Order.find({
    user: userId,
  })
    .populate("items.product")
    .sort({ createdAt: -1 });
};