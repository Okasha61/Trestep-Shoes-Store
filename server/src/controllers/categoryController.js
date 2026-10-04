import mongoose from "mongoose";
import Category from "../models/Category.js";

import { uploadToCloudinary } from "../middleware/uploadMiddleware.js";

// ======================================================
// HELPERS
// ======================================================

const escapeRegex = (value = "") => {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const parseSubCategories = (value, fallback = []) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;

    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const getUploadedFile = (req, field) => {
  return req.files?.[field]?.[0] || null;
};

const normalizeSubCategory = (item) => {
  if (typeof item === "string") {
    return {
      name: item.trim(),
      description: "",
      image: "",
    };
  }

  if (!item || typeof item !== "object") {
    return null;
  }

  return {
    name: String(item.name || "").trim(),
    description: String(item.description || "").trim(),
    image: String(item.image || "").trim(),
  };
};

const normalizeSubCategories = (subCategories = []) => {
  const normalized = subCategories
    .map(normalizeSubCategory)
    .filter((item) => item?.name);

  // Prevent duplicate sub-category names
  // inside the same category.
  const seen = new Set();

  return normalized.filter((item) => {
    const key = item.name.toLowerCase();

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);

    return true;
  });
};

// ======================================================
// CREATE CATEGORY
// ======================================================

export const createCategory = async (req, res) => {
  try {
    const { name, description, gender, subCategories } = req.body;

    const cleanName = String(name || "").trim();
    const cleanGender = String(gender || "").trim();
    const cleanDescription = String(description || "").trim();

    // ==================================================
    // VALIDATION
    // ==================================================

    if (!cleanName) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    if (cleanName.length > 100) {
      return res.status(400).json({
        message: "Category name cannot exceed 100 characters",
      });
    }

    if (!cleanGender) {
      return res.status(400).json({
        message: "Category gender is required",
      });
    }

    if (!["Men", "Women"].includes(cleanGender)) {
      return res.status(400).json({
        message: "Gender must be either Men or Women",
      });
    }

    if (cleanDescription.length > 300) {
      return res.status(400).json({
        message: "Category description cannot exceed 300 characters",
      });
    }

    // ==================================================
    // CHECK DUPLICATE CATEGORY
    // ==================================================

    const existingCategory = await Category.findOne({
      name: {
        $regex: `^${escapeRegex(cleanName)}$`,
        $options: "i",
      },
      gender: cleanGender,
    });

    if (existingCategory) {
      return res.status(400).json({
        message: `Category "${cleanName}" already exists for ${cleanGender}`,
      });
    }

    // ==================================================
    // CATEGORY IMAGE
    // ==================================================

    let image = "";

    const categoryImage = getUploadedFile(req, "image");

    if (categoryImage) {
      image = await uploadToCloudinary(
        categoryImage.buffer,
        "trestep/categories"
      );
    }

    // ==================================================
    // SUB CATEGORIES
    // ==================================================

    const parsedSubCategories = normalizeSubCategories(
      parseSubCategories(subCategories, [])
    );

    // Validate sub-category descriptions
    const invalidSubCategory = parsedSubCategories.find(
      (item) => item.description.length > 300
    );

    if (invalidSubCategory) {
      return res.status(400).json({
        message: `Sub-category "${invalidSubCategory.name}" description cannot exceed 300 characters`,
      });
    }

    // ==================================================
    // CREATE CATEGORY
    // ==================================================

    const category = await Category.create({
      name: cleanName,
      description: cleanDescription,
      gender: cleanGender,
      image,
      subCategories: parsedSubCategories,
    });

    return res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create category error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "This category already exists for this gender.",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: Object.values(error.errors)
          .map((item) => item.message)
          .join(", "),
      });
    }

    return res.status(500).json({
      message: "Failed to create category",
      error: error.message,
    });
  }
};

// ======================================================
// GET CATEGORIES
// ======================================================

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      isActive: true,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);

    return res.status(500).json({
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

// ======================================================
// UPDATE CATEGORY
// ======================================================

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid category ID",
      });
    }

    const { name, description, gender, subCategories } = req.body;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const cleanName = String(name || "").trim();
    const cleanGender = String(gender || "").trim();
    const cleanDescription = String(description || "").trim();

    // ==================================================
    // VALIDATION
    // ==================================================

    if (!cleanName) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    if (cleanName.length > 100) {
      return res.status(400).json({
        message: "Category name cannot exceed 100 characters",
      });
    }

    if (!cleanGender) {
      return res.status(400).json({
        message: "Category gender is required",
      });
    }

    if (!["Men", "Women"].includes(cleanGender)) {
      return res.status(400).json({
        message: "Gender must be either Men or Women",
      });
    }

    if (cleanDescription.length > 300) {
      return res.status(400).json({
        message: "Category description cannot exceed 300 characters",
      });
    }

    // ==================================================
    // CHECK DUPLICATE CATEGORY
    // ==================================================

    const existingCategory = await Category.findOne({
      _id: {
        $ne: id,
      },

      name: {
        $regex: `^${escapeRegex(cleanName)}$`,
        $options: "i",
      },

      gender: cleanGender,
    });

    if (existingCategory) {
      return res.status(400).json({
        message: `Category "${cleanName}" already exists for ${cleanGender}`,
      });
    }

    // ==================================================
    // SUB CATEGORIES
    // ==================================================

    let parsedSubCategories;

    if (subCategories !== undefined) {
      parsedSubCategories = normalizeSubCategories(
        parseSubCategories(subCategories, [])
      );
    } else {
      parsedSubCategories = normalizeSubCategories(
        category.subCategories || []
      );
    }

    const invalidSubCategory = parsedSubCategories.find(
      (item) => item.description.length > 300
    );

    if (invalidSubCategory) {
      return res.status(400).json({
        message: `Sub-category "${invalidSubCategory.name}" description cannot exceed 300 characters`,
      });
    }

    // ==================================================
    // SUB CATEGORY IMAGE
    // ==================================================

    const subCategoryImage = getUploadedFile(
      req,
      "subCategoryImage"
    );

    /*
      Existing frontend flow:
      when a new sub-category is added,
      the uploaded image belongs to the
      newly added/last sub-category.
    */

    if (
      subCategoryImage &&
      parsedSubCategories.length > 0
    ) {
      const lastIndex = parsedSubCategories.length - 1;

      const lastSubCategory =
        parsedSubCategories[lastIndex];

      if (lastSubCategory && !lastSubCategory.image) {
        lastSubCategory.image = await uploadToCloudinary(
          subCategoryImage.buffer,
          "trestep/subcategories"
        );
      }
    }

    // ==================================================
    // CATEGORY IMAGE
    // ==================================================

    let image = category.image || "";

    const categoryImage = getUploadedFile(
      req,
      "image"
    );

    if (categoryImage) {
      image = await uploadToCloudinary(
        categoryImage.buffer,
        "trestep/categories"
      );
    }

    // ==================================================
    // UPDATE
    // ==================================================

    category.name = cleanName;
    category.description = cleanDescription;
    category.gender = cleanGender;
    category.image = image;
    category.subCategories = parsedSubCategories;

    await category.save();

    return res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Update category error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "This category already exists for this gender.",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: Object.values(error.errors)
          .map((item) => item.message)
          .join(", "),
      });
    }

    return res.status(500).json({
      message: "Failed to update category",
      error: error.message,
    });
  }
};

// ======================================================
// DELETE CATEGORY
// ======================================================

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid category ID",
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    await Category.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);

    return res.status(500).json({
      message: "Failed to delete category",
      error: error.message,
    });
  }
};