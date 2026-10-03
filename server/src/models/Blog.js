import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    // ==================================================
    // TITLE
    // ==================================================

    title: {
      type: String,
      required: [
        true,
        "Blog title is required",
      ],
      trim: true,
      maxlength: 200,
    },

    // ==================================================
    // SLUG
    // ==================================================

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // ==================================================
    // CATEGORY
    // ==================================================

    category: {
      type: String,
      required: [
        true,
        "Blog category is required",
      ],
      trim: true,
      maxlength: 100,
    },

    // ==================================================
    // EXCERPT
    // ==================================================

    excerpt: {
      type: String,
      default: "",
      trim: true,
      maxlength: 300,
    },

    // ==================================================
    // CONTENT
    // ==================================================

    content: {
      type: String,
      required: [
        true,
        "Blog content is required",
      ],
      trim: true,
    },

    // ==================================================
    // IMAGE
    // ==================================================

    image: {
      type: String,
      required: [
        true,
        "Blog image is required",
      ],
      trim: true,
    },

    // ==================================================
    // AUTHOR
    // ==================================================

    author: {
      type: String,
      default: "Trestep",
      trim: true,
    },

    // ==================================================
    // PUBLISHED
    // ==================================================

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Blog =
  mongoose.model(
    "Blog",
    blogSchema
  );

export default Blog;