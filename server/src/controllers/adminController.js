import mongoose from "mongoose";

import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Blog from "../models/Blog.js";

import { sendEmail } from "../services/emailService.js";

// ======================================================
// ADMIN DASHBOARD
// ======================================================

export const getDashboardStats = async (
  req,
  res,
  next
) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalBlogs,
    ] = await Promise.all([
      // Sirf normal customers
      User.countDocuments({
        role: "user",
      }),

      Product.countDocuments(),

      Order.countDocuments(),

      Blog.countDocuments(),
    ]);

    // ==================================================
    // TOTAL REVENUE
    // ==================================================

    const revenueResult =
      await Order.aggregate([
        {
          $match: {
            orderStatus: {
              $ne: "Cancelled",
            },
          },
        },

        {
          $group: {
            _id: null,

            totalRevenue: {
              $sum: "$total",
            },
          },
        },
      ]);

    const totalRevenue =
      revenueResult[0]
        ?.totalRevenue || 0;

    // ==================================================
    // RECENT ORDERS
    // ==================================================

    const recentOrders =
      await Order.find()
        .populate(
          "user",
          "username email"
        )
        .sort({
          createdAt: -1,
        })
        .limit(5);

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,

      dashboard: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalBlogs,
        totalRevenue,
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// GET ALL ORDERS
// ======================================================

export const getAllOrders = async (
  req,
  res,
  next
) => {
  try {
    const orders =
      await Order.find()
        .populate(
          "user",
          "username email"
        )
        .populate(
          "items.product"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// UPDATE ORDER STATUS
// ======================================================

export const updateOrderStatus = async (
  req,
  res,
  next
) => {
  try {
    const {
      status,
      paymentStatus,
    } = req.body;

    // ==================================================
    // VALID ORDER STATUSES
    // ==================================================

    const validStatuses = [
      "Pending",
      "Confirmed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    const validPaymentStatuses = [
      "Pending",
      "Paid",
      "Failed",
    ];

    // ==================================================
    // NORMALIZE ORDER STATUS
    // ==================================================

    let normalizedStatus =
      null;

    if (
      status !== undefined &&
      status !== null &&
      String(status).trim()
    ) {
      const formattedStatus =
        String(status)
          .trim()
          .charAt(0)
          .toUpperCase() +
        String(status)
          .trim()
          .slice(1)
          .toLowerCase();

      if (
        !validStatuses.includes(
          formattedStatus
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid order status",
        });
      }

      normalizedStatus =
        formattedStatus;
    }

    // ==================================================
    // PAYMENT STATUS
    // ==================================================

    let normalizedPaymentStatus =
      null;

    if (
      paymentStatus !==
        undefined &&
      paymentStatus !== null &&
      String(paymentStatus).trim()
    ) {
      const formattedPaymentStatus =
        String(paymentStatus)
          .trim()
          .charAt(0)
          .toUpperCase() +
        String(paymentStatus)
          .trim()
          .slice(1)
          .toLowerCase();

      if (
        !validPaymentStatuses.includes(
          formattedPaymentStatus
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid payment status",
        });
      }

      normalizedPaymentStatus =
        formattedPaymentStatus;
    }

    if (
      !normalizedStatus &&
      !normalizedPaymentStatus
    ) {
      return res.status(400).json({
        success: false,
        message:
          "At least one order field must be provided",
      });
    }

    // ==================================================
    // FIND ORDER
    // ==================================================

    const { id } =
      req.params;

    if (
      !mongoose.isValidObjectId(id)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid order ID",
      });
    }

    const order =
      await Order.findById(id).populate(
        "user",
        "username email"
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found",
      });
    }

    // ==================================================
    // SAVE OLD STATUS
    // ==================================================

    const oldStatus =
      order.orderStatus;

    // ==================================================
    // UPDATE ORDER STATUS
    // ==================================================

    if (normalizedStatus) {
      order.orderStatus =
        normalizedStatus;
    }

    // ==================================================
    // UPDATE PAYMENT STATUS
    // ==================================================

    if (normalizedPaymentStatus) {
      order.paymentStatus =
        normalizedPaymentStatus;
    }

    // ==================================================
    // SAVE ORDER
    // ==================================================

    await order.save();

    // ==================================================
    // SEND EMAIL ONLY WHEN ORDER
    // STATUS ACTUALLY CHANGES
    // ==================================================

    if (
      normalizedStatus &&
      oldStatus !== normalizedStatus &&
      order.user?.email
    ) {
      try {
        const statusMessages = {
          Pending:
            "Your order has been received and is currently pending confirmation.",

          Confirmed:
            "Your order has been confirmed and will be processed shortly.",

          Processing:
            "Your order is now being prepared for shipment.",

          Shipped:
            "Great news! Your order has been shipped and is on its way to you.",

          Delivered:
            "Your order has been delivered successfully. Thank you for shopping with Trestep!",

          Cancelled:
            "Your order has been cancelled. If you have any questions, please contact Trestep support.",
        };

        const statusMessage =
          statusMessages[
            normalizedStatus
          ] ||
          "Your order status has been updated.";

        // ==================================================
        // PRODUCT ROWS
        // ==================================================

        const productRows =
          order.items
            .map(
              (item) => `
                <tr>

                  <td
                    style="
                      padding: 12px;
                      border-bottom: 1px solid #eee;
                    "
                  >

                    <strong>
                      ${item.name}
                    </strong>

                    ${
                      item.color
                        ? `
                          <div
                            style="
                              color: #666;
                              font-size: 13px;
                              margin-top: 4px;
                            "
                          >
                            Color: ${item.color}
                          </div>
                        `
                        : ""
                    }

                    ${
                      item.size
                        ? `
                          <div
                            style="
                              color: #666;
                              font-size: 13px;
                            "
                          >
                            Size: ${item.size}
                          </div>
                        `
                        : ""
                    }

                  </td>

                  <td
                    style="
                      padding: 12px;
                      border-bottom: 1px solid #eee;
                      text-align: center;
                    "
                  >
                    ${item.quantity}
                  </td>

                  <td
                    style="
                      padding: 12px;
                      border-bottom: 1px solid #eee;
                      text-align: right;
                    "
                  >
                    Rs. ${Number(
                      item.price *
                        item.quantity
                    ).toLocaleString()}
                  </td>

                </tr>
              `
            )
            .join("");

        // ==================================================
        // ORDER STATUS EMAIL
        // ==================================================

        const statusEmail = `
          <!DOCTYPE html>

          <html>

            <head>
              <meta charset="UTF-8" />

              <title>
                Trestep Order Update
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

                <!-- HEADER -->

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
                    Order Status Update
                  </p>

                </div>

                <!-- CONTENT -->

                <div
                  style="
                    padding: 30px;
                  "
                >

                  <h2>
                    Hi ${
                      order.user
                        ?.username ||
                      "Customer"
                    },
                  </h2>

                  <p
                    style="
                      color: #555;
                      line-height: 1.6;
                    "
                  >
                    ${statusMessage}
                  </p>

                  <!-- CURRENT STATUS -->

                  <div
                    style="
                      margin: 25px 0;
                      padding: 20px;
                      background: #f7f7f7;
                      border-radius: 8px;
                      text-align: center;
                    "
                  >

                    <p
                      style="
                        margin: 0 0 8px;
                        color: #666;
                        font-size: 14px;
                      "
                    >
                      Current Order Status
                    </p>

                    <h2
                      style="
                        margin: 0;
                        color: #65a30d;
                      "
                    >
                      ${normalizedStatus}
                    </h2>

                  </div>

                  <!-- ORDER INFORMATION -->

                  <div
                    style="
                      margin: 25px 0;
                      padding: 18px;
                      background: #f7f7f7;
                      border-radius: 8px;
                    "
                  >

                    <p style="margin: 5px 0;">

                      <strong>
                        Order ID:
                      </strong>

                      #${String(
                        order._id
                      ).slice(-8)}

                    </p>

                    <p style="margin: 5px 0;">

                      <strong>
                        Payment:
                      </strong>

                      Cash on Delivery

                    </p>

                    <p style="margin: 5px 0;">

                      <strong>
                        Total:
                      </strong>

                      Rs. ${Number(
                        order.total
                      ).toLocaleString()}

                    </p>

                  </div>

                  <!-- PRODUCTS -->

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

                  <!-- DELIVERY ADDRESS -->

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
                        order
                          .shippingAddress
                          ?.fullName ||
                        ""
                      }
                    </p>

                    <p
                      style="
                        margin: 6px 0;
                        color: #555;
                      "
                    >
                      ${
                        order
                          .shippingAddress
                          ?.phone ||
                        ""
                      }
                    </p>

                    <p
                      style="
                        margin: 6px 0;
                        color: #555;
                      "
                    >
                      ${
                        order
                          .shippingAddress
                          ?.address ||
                        ""
                      }
                    </p>

                    <p
                      style="
                        margin: 6px 0;
                        color: #555;
                      "
                    >
                      ${
                        order
                          .shippingAddress
                          ?.city ||
                        ""
                      }
                    </p>

                  </div>

                  <!-- FOOTER MESSAGE -->

                  <p
                    style="
                      margin-top: 30px;
                      color: #666;
                      line-height: 1.6;
                    "
                  >
                    Thank you for shopping with
                    Trestep.
                  </p>

                </div>

                <!-- FOOTER -->

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

        // ==================================================
        // SEND EMAIL
        // ==================================================

        await sendEmail({
          to: order.user.email,

          subject:
            `Trestep Order #${String(
              order._id
            ).slice(-8)} — ${normalizedStatus}`,

          html: statusEmail,
        });

        console.log(
          `Order status email sent to ${order.user.email}`
        );
      } catch (emailError) {
        // Email fail hone par
        // order update fail nahi hoga.
        console.error(
          "Order status email error:",
          emailError
        );
      }
    }

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,

      message:
        "Order updated successfully",

      order,
    });
  } catch (error) {
    next(error);
  }
};