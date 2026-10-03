import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

export const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({
      user: req.user._id,
    }).populate("products");

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [],
      });
    }

    res.json({
      success: true,
      wishlist,
    });
  } catch (error) {
    next(error);
  }
};

export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [productId],
      });
    } else {
      const exists = wishlist.products.some(
        (id) => id.toString() === productId
      );

      if (!exists) {
        wishlist.products.push(productId);
        await wishlist.save();
      }
    }

    await wishlist.populate("products");

    res.status(201).json({
      success: true,
      message: "Added to wishlist",
      wishlist,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (
  req,
  res,
  next
) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    wishlist.products =
      wishlist.products.filter(
        (id) => id.toString() !== req.params.productId
      );

    await wishlist.save();

    res.json({
      success: true,
      message: "Removed from wishlist",
      wishlist,
    });
  } catch (error) {
    next(error);
  }
};