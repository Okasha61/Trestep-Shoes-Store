import mongoose from "mongoose";
import Review from "../models/Review.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const isValidId = (id) => mongoose.isValidObjectId(id);

const recalculateProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const averageRating = Number((stats[0]?.averageRating || 0).toFixed(1));
  const totalReviews = stats[0]?.totalReviews || 0;

  await Product.findByIdAndUpdate(productId, {
    rating: averageRating,
    reviews: totalReviews,
  });

  return { averageRating, totalReviews };
};

export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!isValidId(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findById(productId).select("_id");
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const reviews = await Review.find({ product: productId })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    const summary = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: "$product",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      reviews,
      summary: {
        averageRating: Number((summary[0]?.averageRating || 0).toFixed(1)),
        totalReviews: summary[0]?.totalReviews || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const checkReviewEligibility = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!isValidId(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const existingReview = await Review.findOne({
      product: productId,
      user: req.user._id,
    });

    if (existingReview) {
      return res.json({
        success: true,
        eligible: false,
        reason: "already_reviewed",
      });
    }

    const deliveredOrder = await Order.findOne({
      user: req.user._id,
      orderStatus: "Delivered",
      "items.product": productId,
    }).sort({ updatedAt: -1 });

    if (!deliveredOrder) {
      return res.json({
        success: true,
        eligible: false,
        reason: "not_delivered",
      });
    }

    res.json({
      success: true,
      eligible: true,
      orderId: deliveredOrder._id,
    });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    if (!isValidId(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    if (!String(comment || "").trim()) {
      return res.status(400).json({ success: false, message: "Review comment is required" });
    }

    if (String(comment).trim().length > 1000) {
      return res.status(400).json({ success: false, message: "Review cannot exceed 1000 characters" });
    }

    const product = await Product.findById(productId).select("_id");
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const existingReview = await Review.findOne({
      product: productId,
      user: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    const deliveredOrder = await Order.findOne({
      user: req.user._id,
      orderStatus: "Delivered",
      "items.product": productId,
    }).sort({ updatedAt: -1 });

    if (!deliveredOrder) {
      return res.status(403).json({
        success: false,
        message: "You can review this product only after your order is delivered",
      });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      order: deliveredOrder._id,
      rating: numericRating,
      comment: String(comment).trim(),
    });

    const summary = await recalculateProductRating(productId);

    await review.populate("user", "username");
    await review.populate("product", "name images");
    await review.populate("order", "orderStatus createdAt updatedAt");

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
      summary,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }
    next(error);
  }
};

export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate("user", "username email")
      .populate("product", "name images price")
      .populate("order", "orderStatus createdAt updatedAt")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    if (!isValidId(reviewId)) {
      return res.status(400).json({ success: false, message: "Invalid review ID" });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    const productId = review.product;
    await review.deleteOne();

    const summary = await recalculateProductRating(productId);

    res.json({
      success: true,
      message: "Review deleted successfully",
      summary,
    });
  } catch (error) {
    next(error);
  }
};
