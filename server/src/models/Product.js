import mongoose from "mongoose";

const colorImageSchema = new mongoose.Schema(
  {
    color: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: 0,
    },

    oldPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    gender: {
      type: String,
      enum: ["Men", "Women"],
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
    },

    subCategory: {
      type: String,
      default: "",
      trim: true,
    },

    sport: {
      type: String,
      default: "",
      trim: true,
    },

    colors: {
      type: [String],
      default: [],
    },

    colorImages: {
      type: [colorImageSchema],
      default: [],
    },

    sizes: {
      type: [String],
      default: [],
    },

    images: {
      type: [String],
      default: [],
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    isNew: {
      type: Boolean,
      default: false,
    },

    isTrending: {
      type: Boolean,
      default: false,
    },

    isBestSeller: {
      type: Boolean,
      default: false,
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
