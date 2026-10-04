import mongoose from "mongoose";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

import { uploadToCloudinary } from "../middleware/uploadMiddleware.js";

// ======================================================
// HELPERS
// ======================================================

const parseArray = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  try {
    const parsed = JSON.parse(value);

    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => String(item).trim())
        .filter(Boolean);
    }
  } catch {
    // Continue below
  }

  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

// ======================================================
// PARSE COLOR IMAGE MAP
// ======================================================

const parseColorImageMap = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  try {
    const parsed = JSON.parse(value);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// ======================================================
// PARSE BOOLEAN
// ======================================================

const parseBoolean = (value) => {
  if (
    value === true ||
    value === "true" ||
    value === 1 ||
    value === "1"
  ) {
    return true;
  }

  return false;
};

// ======================================================
// ESCAPE REGEX
// ======================================================

const escapeRegex = (value = "") => {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// ======================================================
// NORMALIZE GENDER
// ======================================================

const normalizeGender = (value) => {
  const gender = String(value || "")
    .trim()
    .toLowerCase();

  if (
    gender === "men" ||
    gender === "male"
  ) {
    return "Men";
  }

  if (
    gender === "women" ||
    gender === "female"
  ) {
    return "Women";
  }

  return "";
};

// ======================================================
// NUMBER HELPER
// ======================================================

const parseNumber = (value, fieldName) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return {
      valid: false,
      value: null,
      message: `${fieldName} is required`,
    };
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return {
      valid: false,
      value: null,
      message: `${fieldName} must be a valid number`,
    };
  }

  return {
    valid: true,
    value: number,
  };
};

// ======================================================
// UPLOAD COLOR IMAGES
// ======================================================

const buildColorImagesFromFiles = async (
  colorMap,
  files = []
) => {
  const map = parseColorImageMap(colorMap);

  if (!map.length) {
    return [];
  }

  const newImageCounts = map.map((entry) =>
    Math.max(
      0,
      Number(entry?.newImageCount || 0)
    )
  );

  const totalExpectedFiles =
    newImageCounts.reduce(
      (sum, count) => sum + count,
      0
    );

  if (totalExpectedFiles > files.length) {
    throw new Error(
      "Color image mapping does not match uploaded files"
    );
  }

  let fileIndex = 0;

  const result = [];

  for (let index = 0; index < map.length; index += 1) {
    const entry = map[index];

    const color = String(
      entry?.color || ""
    ).trim();

    if (!color) {
      continue;
    }

    const existingImages =
      Array.isArray(entry?.existingImages)
        ? entry.existingImages.filter(Boolean)
        : [];

    const newImageCount =
      newImageCounts[index];

    const currentFiles = files.slice(
      fileIndex,
      fileIndex + newImageCount
    );

    fileIndex += newImageCount;

    const newImages = await Promise.all(
      currentFiles.map((file) =>
        uploadToCloudinary(
          file.buffer,
          "trestep/products"
        )
      )
    );

    result.push({
      color,
      images: [
        ...existingImages,
        ...newImages,
      ],
    });
  }

  return result;
};

// ======================================================
// VALIDATE CATEGORY + SUB CATEGORY
// ======================================================

const validateProductCategory = async ({
  gender,
  category,
  subCategory,
}) => {
  if (!gender || !category) {
    return {
      valid: false,
      message: "Gender and category are required",
    };
  }

  const normalizedGender =
    normalizeGender(gender);

  if (!normalizedGender) {
    return {
      valid: false,
      message:
        'Gender must be either "Men" or "Women"',
    };
  }

  const cleanCategory = String(
    category
  ).trim();

  const categoryDoc =
    await Category.findOne({
      gender: {
        $regex: `^${escapeRegex(
          normalizedGender
        )}$`,
        $options: "i",
      },

      name: {
        $regex: `^${escapeRegex(
          cleanCategory
        )}$`,
        $options: "i",
      },

      isActive: true,
    });

  if (!categoryDoc) {
    return {
      valid: false,
      message: `Category "${cleanCategory}" does not exist for ${normalizedGender}`,
    };
  }

  const actualCategoryName =
    categoryDoc.name;

  // ==================================================
  // NO SUB-CATEGORY
  // ==================================================

  if (
    !subCategory ||
    !String(subCategory).trim()
  ) {
    return {
      valid: true,
      categoryName: actualCategoryName,
      subCategoryName: "",
    };
  }

  // ==================================================
  // FIND SUB-CATEGORY
  // ==================================================

  const cleanSubCategory =
    String(subCategory).trim();

  const selectedSubCategory =
    categoryDoc.subCategories?.find(
      (item) =>
        item?.name
          ?.trim()
          .toLowerCase() ===
        cleanSubCategory.toLowerCase()
    );

  if (!selectedSubCategory) {
    return {
      valid: false,
      message: `Sub-category "${cleanSubCategory}" does not belong to ${normalizedGender} ${actualCategoryName}`,
    };
  }

  return {
    valid: true,
    categoryName: actualCategoryName,
    subCategoryName:
      selectedSubCategory.name,
  };
};

// ======================================================
// CREATE PRODUCT
// ======================================================

export const createProduct = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      description,
      price,
      oldPrice,
      gender,
      category,
      subCategory,
      sport,
      rating,
      reviews,
      stock,
      isNew,
      isTrending,
      isBestSeller,
    } = req.body;

    // ==================================================
    // BASIC VALIDATION
    // ==================================================

    const cleanName = String(
      name || ""
    ).trim();

    const cleanDescription = String(
      description || ""
    ).trim();

    if (
      !cleanName ||
      !cleanDescription ||
      price === undefined ||
      !gender ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, description, price, gender and category are required",
      });
    }

    // ==================================================
    // PRICE
    // ==================================================

    const parsedPrice = parseNumber(
      price,
      "Price"
    );

    if (!parsedPrice.valid) {
      return res.status(400).json({
        success: false,
        message: parsedPrice.message,
      });
    }

    if (parsedPrice.value < 0) {
      return res.status(400).json({
        success: false,
        message: "Price cannot be negative",
      });
    }

    // ==================================================
    // OLD PRICE
    // ==================================================

    let parsedOldPrice = 0;

    if (
      oldPrice !== undefined &&
      oldPrice !== null &&
      oldPrice !== ""
    ) {
      const result = parseNumber(
        oldPrice,
        "Old price"
      );

      if (!result.valid) {
        return res.status(400).json({
          success: false,
          message: result.message,
        });
      }

      if (result.value < 0) {
        return res.status(400).json({
          success: false,
          message:
            "Old price cannot be negative",
        });
      }

      parsedOldPrice = result.value;
    }

    // ==================================================
    // STOCK
    // ==================================================

    let parsedStock = 0;

    if (
      stock !== undefined &&
      stock !== null &&
      stock !== ""
    ) {
      const result = parseNumber(
        stock,
        "Stock"
      );

      if (!result.valid) {
        return res.status(400).json({
          success: false,
          message: result.message,
        });
      }

      if (
        result.value < 0 ||
        !Number.isInteger(result.value)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Stock must be a non-negative whole number",
        });
      }

      parsedStock = result.value;
    }

    // ==================================================
    // NORMALIZE GENDER
    // ==================================================

    const normalizedGender =
      normalizeGender(gender);

    if (!normalizedGender) {
      return res.status(400).json({
        success: false,
        message:
          'Gender must be either "Men" or "Women"',
      });
    }

    // ==================================================
    // CATEGORY VALIDATION
    // ==================================================

    const categoryValidation =
      await validateProductCategory({
        gender: normalizedGender,
        category,
        subCategory,
      });

    if (!categoryValidation.valid) {
      return res.status(400).json({
        success: false,
        message:
          categoryValidation.message,
      });
    }

    // ==================================================
    // IMAGES
    // ==================================================

    let images = [];
    let colorImages = [];

    if (req.body.colorImageMap !== undefined) {
      /*
        IMPORTANT:

        When colorImageMap exists, the uploaded files
        belong to the color-image mapping.

        We DO NOT upload req.files separately first,
        otherwise the same files would be uploaded twice.
      */

      colorImages =
        await buildColorImagesFromFiles(
          req.body.colorImageMap,
          req.files || []
        );

      images = colorImages.flatMap(
        (entry) => entry.images || []
      );
    } else if (req.files?.length) {
      images = await Promise.all(
        req.files.map((file) =>
          uploadToCloudinary(
            file.buffer,
            "trestep/products"
          )
        )
      );
    }

    // ==================================================
    // CREATE PRODUCT
    // ==================================================

    const product =
      await Product.create({
        name: cleanName,

        description:
          cleanDescription,

        price: parsedPrice.value,

        oldPrice: parsedOldPrice,

        gender: normalizedGender,

        category:
          categoryValidation.categoryName,

        subCategory:
          categoryValidation.subCategoryName,

        sport: String(
          sport || ""
        ).trim(),

        colors: parseArray(
          req.body.colors
        ),

        colorImages,

        sizes: parseArray(
          req.body.sizes
        ),

        images,

        rating: 0,

        reviews: 0,

        stock: parsedStock,

        isNew: parseBoolean(isNew),

        isTrending:
          parseBoolean(isTrending),

        isBestSeller:
          parseBoolean(isBestSeller),
      });

    return res.status(201).json({
      success: true,
      message:
        "Product created successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// GET PRODUCTS
// ======================================================

export const getProducts = async (
  req,
  res,
  next
) => {
  try {
    const {
      gender,
      category,
      subCategory,
      sport,
      isNew,
      isTrending,
      isBestSeller,
      search,
    } = req.query;

    const filter = {};

    // ==================================================
    // GENDER
    // ==================================================

    if (gender) {
      const normalizedGender =
        normalizeGender(gender);

      if (normalizedGender) {
        filter.gender = {
          $regex: `^${escapeRegex(
            normalizedGender
          )}$`,
          $options: "i",
        };
      }
    }

    // ==================================================
    // CATEGORY
    // ==================================================

    if (category) {
      filter.category = {
        $regex: `^${escapeRegex(
          String(category).trim()
        )}$`,
        $options: "i",
      };
    }

    // ==================================================
    // SUB CATEGORY
    // ==================================================

    if (subCategory) {
      filter.subCategory = {
        $regex: `^${escapeRegex(
          String(subCategory).trim()
        )}$`,
        $options: "i",
      };
    }

    // ==================================================
    // SPORT - OLD COMPATIBILITY
    // ==================================================

    if (sport) {
      filter.sport = {
        $regex: `^${escapeRegex(
          String(sport).trim()
        )}$`,
        $options: "i",
      };
    }

    // ==================================================
    // LABEL FILTERS
    // ==================================================

    if (isNew !== undefined) {
      filter.isNew =
        String(isNew).toLowerCase() ===
        "true";
    }

    if (isTrending !== undefined) {
      filter.isTrending =
        String(isTrending).toLowerCase() ===
        "true";
    }

    if (isBestSeller !== undefined) {
      filter.isBestSeller =
        String(isBestSeller).toLowerCase() ===
        "true";
    }

    // ==================================================
    // SEARCH
    // ==================================================

    if (search) {
      const escapedSearch =
        escapeRegex(
          String(search).trim()
        );

      filter.$or = [
        {
          name: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
        {
          description: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
      ];
    }

    // ==================================================
    // GET PRODUCTS
    // ==================================================

    const products =
      await Product.find(filter).sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// GET SINGLE PRODUCT
// ======================================================

export const getProduct = async (
  req,
  res,
  next
) => {
  try {
    if (
      !mongoose.isValidObjectId(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// UPDATE PRODUCT
// ======================================================

export const updateProduct = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.isValidObjectId(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product =
      await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found",
      });
    }

    // ==================================================
    // BASIC TEXT VALUES
    // ==================================================

    const updatedName =
      req.body.name !== undefined
        ? String(req.body.name).trim()
        : product.name;

    const updatedDescription =
      req.body.description !== undefined
        ? String(
            req.body.description
          ).trim()
        : product.description;

    if (!updatedName) {
      return res.status(400).json({
        success: false,
        message:
          "Product name is required",
      });
    }

    if (!updatedDescription) {
      return res.status(400).json({
        success: false,
        message:
          "Product description is required",
      });
    }

    // ==================================================
    // CATEGORY VALUES
    // ==================================================

    const updatedGender =
      req.body.gender !== undefined
        ? req.body.gender
        : product.gender;

    const updatedCategory =
      req.body.category !== undefined
        ? req.body.category
        : product.category;

    const updatedSubCategory =
      req.body.subCategory !== undefined
        ? req.body.subCategory
        : product.subCategory;

    const normalizedGender =
      normalizeGender(
        updatedGender
      );

    if (!normalizedGender) {
      return res.status(400).json({
        success: false,
        message:
          'Gender must be either "Men" or "Women"',
      });
    }

    // ==================================================
    // CATEGORY VALIDATION
    // ==================================================

    const categoryValidation =
      await validateProductCategory({
        gender: normalizedGender,
        category: updatedCategory,
        subCategory:
          updatedSubCategory,
      });

    if (!categoryValidation.valid) {
      return res.status(400).json({
        success: false,
        message:
          categoryValidation.message,
      });
    }

    // ==================================================
    // UPDATE DATA
    // ==================================================

    const data = {
      name: updatedName,

      description:
        updatedDescription,

      gender: normalizedGender,

      category:
        categoryValidation.categoryName,

      subCategory:
        categoryValidation.subCategoryName,
    };

    // ==================================================
    // SPORT
    // ==================================================

    if (req.body.sport !== undefined) {
      data.sport = String(
        req.body.sport
      ).trim();
    }

    // ==================================================
    // NUMBERS
    // ==================================================

    if (req.body.price !== undefined) {
      const result = parseNumber(
        req.body.price,
        "Price"
      );

      if (!result.valid || result.value < 0) {
        return res.status(400).json({
          success: false,
          message:
            result.message ||
            "Price cannot be negative",
        });
      }

      data.price = result.value;
    }

    if (req.body.oldPrice !== undefined) {
      if (
        req.body.oldPrice === ""
      ) {
        data.oldPrice = 0;
      } else {
        const result = parseNumber(
          req.body.oldPrice,
          "Old price"
        );

        if (
          !result.valid ||
          result.value < 0
        ) {
          return res.status(400).json({
            success: false,
            message:
              result.message ||
              "Old price cannot be negative",
          });
        }

        data.oldPrice =
          result.value;
      }
    }

    if (req.body.stock !== undefined) {
      const result = parseNumber(
        req.body.stock,
        "Stock"
      );

      if (
        !result.valid ||
        result.value < 0 ||
        !Number.isInteger(
          result.value
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Stock must be a non-negative whole number",
        });
      }

      data.stock = result.value;
    }

    // ==================================================
    // RATING / REVIEWS
    // ==================================================

    if (req.body.rating !== undefined) {
      const result = parseNumber(
        req.body.rating,
        "Rating"
      );

      if (
        !result.valid ||
        result.value < 0 ||
        result.value > 5
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Rating must be between 0 and 5",
        });
      }

      data.rating = result.value;
    }

    if (
      req.body.reviews !== undefined
    ) {
      const result = parseNumber(
        req.body.reviews,
        "Reviews"
      );

      if (
        !result.valid ||
        result.value < 0 ||
        !Number.isInteger(
          result.value
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Reviews must be a non-negative whole number",
        });
      }

      data.reviews = result.value;
    }

    // ==================================================
    // ARRAYS
    // ==================================================

    if (req.body.colors !== undefined) {
      data.colors = parseArray(
        req.body.colors
      );
    }

    if (req.body.sizes !== undefined) {
      data.sizes = parseArray(
        req.body.sizes
      );
    }

    // ==================================================
    // BOOLEAN
    // ==================================================

    if (req.body.isNew !== undefined) {
      data.isNew =
        parseBoolean(
          req.body.isNew
        );
    }

    if (
      req.body.isTrending !==
      undefined
    ) {
      data.isTrending =
        parseBoolean(
          req.body.isTrending
        );
    }

    if (
      req.body.isBestSeller !==
      undefined
    ) {
      data.isBestSeller =
        parseBoolean(
          req.body.isBestSeller
        );
    }

    // ==================================================
    // IMAGES
    // ==================================================

    if (
      req.body.colorImageMap !==
      undefined
    ) {
      const colorImages =
        await buildColorImagesFromFiles(
          req.body.colorImageMap,
          req.files || []
        );

      data.colorImages =
        colorImages;

      data.images =
        colorImages.flatMap(
          (entry) =>
            entry.images || []
        );
    } else if (
      req.files?.length
    ) {
      const newImages =
        await Promise.all(
          req.files.map(
            (file) =>
              uploadToCloudinary(
                file.buffer,
                "trestep/products"
              )
          )
        );

      data.images =
        newImages;
    }

    // ==================================================
    // UPDATE PRODUCT
    // ==================================================

    const updatedProduct =
      await Product.findByIdAndUpdate(
        id,
        data,
        {
          new: true,
          runValidators: true,
        }
      );

    return res.status(200).json({
      success: true,
      message:
        "Product updated successfully",
      product:
        updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// DELETE PRODUCT
// ======================================================

export const deleteProduct = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.isValidObjectId(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product =
      await Product.findByIdAndDelete(
        id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};