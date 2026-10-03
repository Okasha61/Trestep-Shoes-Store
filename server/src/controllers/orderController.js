import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

import {
  createOrderService,
  getUserOrdersService,
} from "../services/orderService.js";

import { sendEmail } from "../services/emailService.js";

// ==========================================
// CREATE ORDER
// ==========================================
export const createOrder = async (
  req,
  res,
  next
) => {
  try {
    const {
      shippingAddress,
      paymentMethod = "COD",
    } = req.body;

    // ========================================
    // GET CURRENT USER
    // ========================================
    const user = await User.findById(
      req.user._id
    ).select("username email");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ========================================
    // GET USER CART
    // ========================================
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    // ========================================
    // SHIPPING ADDRESS
    // ========================================
    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    // ========================================
    // NORMALIZE PAYMENT METHOD
    // ========================================
    const normalizedPaymentMethod =
      String(paymentMethod).toUpperCase();

    if (normalizedPaymentMethod !== "COD") {
      return res.status(400).json({
        success: false,
        message: "Only Cash on Delivery is available",
      });
    }

    // ========================================
    // PREPARE ORDER ITEMS
    // ========================================
    const items = cart.items.map(
      (item) => ({
        product: item.product,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
      })
    );

    // ========================================
    // CALCULATE SUBTOTAL
    // ========================================
    const subtotal = items.reduce(
      (total, item) =>
        total +
        Number(item.price) *
          Number(item.quantity),
      0
    );

    // ========================================
    // SHIPPING FEE
    // ========================================
    const shippingFee = 250;

    // ========================================
    // TOTAL
    // ========================================
    const total =
      subtotal + shippingFee;

    // ========================================
    // CREATE ORDER
    // ========================================
    const order =
      await createOrderService(
        req.user._id,
        {
          items,
          shippingAddress: {
            fullName:
              shippingAddress.fullName,
            phone:
              shippingAddress.phone,
            address:
              shippingAddress.address,
            city:
              shippingAddress.city,
          },
          subtotal,
          shippingFee,
          total,
          paymentMethod:
            normalizedPaymentMethod,
        }
      );

    // ========================================
    // CLEAR CART
    // ========================================
    cart.items = [];

    await cart.save();

    // ========================================
    // SEND ORDER CONFIRMATION EMAIL
    // ========================================
    try {
      const productRows =
        order.items
          .map(
            (item) => `
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    ${
                      item.image
                        ? `
                          <img
                            src="${item.image}"
                            alt="${item.name}"
                            width="70"
                            height="70"
                            style="
                              width: 70px;
                              height: 70px;
                              object-fit: cover;
                              border-radius: 8px;
                            "
                          />
                        `
                        : ""
                    }

                    <div>
                      <strong>
                        ${item.name}
                      </strong>

                      ${
                        item.color
                          ? `
                            <div style="color: #666; font-size: 13px; margin-top: 4px;">
                              Color: ${item.color}
                            </div>
                          `
                          : ""
                      }

                      ${
                        item.size
                          ? `
                            <div style="color: #666; font-size: 13px;">
                              Size: ${item.size}
                            </div>
                          `
                          : ""
                      }
                    </div>
                  </div>
                </td>

                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
                  ${item.quantity}
                </td>

                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
                  Rs. ${Number(
                    item.price *
                      item.quantity
                  ).toLocaleString()}
                </td>
              </tr>
            `
          )
          .join("");

      const orderEmail = `
        <!DOCTYPE html>

        <html>
          <head>
            <meta charset="UTF-8" />

            <title>
              Trestep Order Confirmation
            </title>
          </head>

          <body
            style="
              margin: 0;
              padding: 0;
              background: #f5f5f5;
              font-family: Arial, sans-serif;
              color: #111;
            "
          >
            <div
              style="
                max-width: 700px;
                margin: 30px auto;
                background: #ffffff;
                border-radius: 12px;
                overflow: hidden;
              "
            >

              <!-- Header -->
              <div
                style="
                  background: #000000;
                  color: #ffffff;
                  padding: 25px;
                  text-align: center;
                "
              >
                <h1
                  style="
                    margin: 0;
                    color: #a3e635;
                    font-size: 30px;
                  "
                >
                  TRESTEP
                </h1>

                <p
                  style="
                    margin: 8px 0 0;
                    color: #cccccc;
                  "
                >
                  Order Confirmation
                </p>
              </div>

              <!-- Content -->
              <div style="padding: 30px;">

                <h2>
                  Thank you for your order,
                  ${user.username}!
                </h2>

                <p
                  style="
                    color: #555;
                    line-height: 1.6;
                  "
                >
                  Your Trestep order has been
                  successfully placed.
                  We will process your order
                  and deliver it to your
                  provided address.
                </p>

                <!-- Order Info -->
                <div
                  style="
                    margin: 25px 0;
                    padding: 18px;
                    background: #f7f7f7;
                    border-radius: 8px;
                  "
                >
                  <p style="margin: 5px 0;">
                    <strong>Order ID:</strong>
                    #${String(
                      order._id
                    ).slice(-8)}
                  </p>

                  <p style="margin: 5px 0;">
                    <strong>Payment:</strong>
                    Cash on Delivery
                  </p>

                  <p style="margin: 5px 0;">
                    <strong>Status:</strong>
                    ${order.orderStatus}
                  </p>
                </div>

                <!-- Products -->
                <h3>
                  Your Products
                </h3>

                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  style="
                    border-collapse: collapse;
                    margin-top: 15px;
                  "
                >
                  <thead>
                    <tr
                      style="
                        background: #f5f5f5;
                      "
                    >
                      <th
                        style="
                          padding: 12px;
                          text-align: left;
                        "
                      >
                        Product
                      </th>

                      <th
                        style="
                          padding: 12px;
                          text-align: center;
                        "
                      >
                        Qty
                      </th>

                      <th
                        style="
                          padding: 12px;
                          text-align: right;
                        "
                      >
                        Price
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    ${productRows}
                  </tbody>
                </table>

                <!-- Summary -->
                <div
                  style="
                    margin-top: 25px;
                    padding-top: 20px;
                    border-top: 1px solid #ddd;
                  "
                >
                  <p
                    style="
                      display: flex;
                      justify-content: space-between;
                    "
                  >
                    <strong>
                      Subtotal
                    </strong>

                    <span>
                      Rs. ${Number(
                        order.subtotal
                      ).toLocaleString()}
                    </span>
                  </p>

                  <p
                    style="
                      display: flex;
                      justify-content: space-between;
                    "
                  >
                    <strong>
                      Shipping
                    </strong>

                    <span>
                      Rs. ${Number(
                        order.shippingFee
                      ).toLocaleString()}
                    </span>
                  </p>

                  <p
                    style="
                      font-size: 20px;
                      display: flex;
                      justify-content: space-between;
                      margin-top: 20px;
                    "
                  >
                    <strong>
                      Total
                    </strong>

                    <strong
                      style="
                        color: #65a30d;
                      "
                    >
                      Rs. ${Number(
                        order.total
                      ).toLocaleString()}
                    </strong>
                  </p>
                </div>

                <!-- Shipping -->
                <div
                  style="
                    margin-top: 30px;
                    padding: 20px;
                    background: #f7f7f7;
                    border-radius: 8px;
                  "
                >
                  <h3>
                    Delivery Address
                  </h3>

                  <p
                    style="
                      margin: 6px 0;
                      color: #555;
                    "
                  >
                    ${
                      order.shippingAddress
                        .fullName
                    }
                  </p>

                  <p
                    style="
                      margin: 6px 0;
                      color: #555;
                    "
                  >
                    ${
                      order.shippingAddress
                        .phone
                    }
                  </p>

                  <p
                    style="
                      margin: 6px 0;
                      color: #555;
                    "
                  >
                    ${
                      order.shippingAddress
                        .address
                    }
                  </p>

                  <p
                    style="
                      margin: 6px 0;
                      color: #555;
                    "
                  >
                    ${
                      order.shippingAddress
                        .city
                    }
                  </p>
                </div>

                <p
                  style="
                    margin-top: 30px;
                    color: #666;
                    line-height: 1.6;
                  "
                >
                  Thank you for shopping with
                  Trestep. We appreciate your
                  order!
                </p>

              </div>

              <!-- Footer -->
              <div
                style="
                  padding: 20px;
                  background: #000000;
                  color: #999;
                  text-align: center;
                  font-size: 13px;
                "
              >
                © ${new Date().getFullYear()}
                Trestep. All rights reserved.
              </div>

            </div>
          </body>
        </html>
      `;

      await sendEmail({
        to: user.email,
        subject:
          `Trestep Order Confirmation #${String(
            order._id
          ).slice(-8)}`,
        html: orderEmail,
      });

      console.log(
        "Order confirmation email sent to:",
        user.email
      );
    } catch (emailError) {
      // Email fail hone par order fail nahi hoga
      console.error(
        "Order email error:",
        emailError
      );
    }

    // ========================================
    // RESPONSE
    // ========================================
    res.status(201).json({
      success: true,
      message:
        "Order placed successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET MY ORDERS
// ==========================================
export const getMyOrders = async (
  req,
  res,
  next
) => {
  try {
    const orders =
      await getUserOrdersService(
        req.user._id
      );

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET ORDER BY ID
// ==========================================
export const getOrderById = async (
  req,
  res,
  next
) => {
  try {
    const order =
      await Order.findOne({
        _id: req.params.id,
        user: req.user._id,
      }).populate(
        "items.product"
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// CANCEL MY ORDER
// ======================================================

export const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required.",
      });
    }

    const cancellableStatuses = [
      "Pending",
      "Confirmed",
      "Processing",
    ];

    // Atomic update:
    // This prevents two simultaneous cancellation requests
    // from cancelling the same order twice.
    const order = await Order.findOneAndUpdate(
      {
        _id: id,
        user: req.user._id,
        orderStatus: {
          $in: cancellableStatuses,
        },
      },
      {
        $set: {
          orderStatus: "Cancelled",
        },
      },
      {
        new: true,
      }
    );

    if (!order) {
      const existingOrder = await Order.findOne({
        _id: id,
        user: req.user._id,
      });

      if (!existingOrder) {
        return res.status(404).json({
          success: false,
          message: "Order not found.",
        });
      }

      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because its status is ${existingOrder.orderStatus}.`,
      });
    }

    // Restore stock after successful cancellation
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stock: item.quantity,
          },
        }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully.",
      order,
    });
  } catch (error) {
    next(error);
  }
};