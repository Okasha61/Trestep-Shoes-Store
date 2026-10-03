import Product from "../models/Product.js";

import Category from "../models/Category.js";

import {
  uploadToCloudinary,
} from "../middleware/uploadMiddleware.js";

// ======================================================
// HELPERS
// ======================================================

const parseArray = (value) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  try {
    const parsed = JSON.parse(value);

    if (Array.isArray(parsed)) {
      return parsed;
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
// PARSE BOOLEAN
// ======================================================

const parseColorImageMap = (value) => {
  if (!value) {
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

const buildColorImagesFromFiles = async (colorMap, files = []) => {
  const map = parseColorImageMap(colorMap);

  if (!map.length) {
    return [];
  }

  const uploadedImages = await Promise.all(
    files.map((file) => uploadToCloudinary(file.buffer))
  );

  let fileIndex = 0;

  return map.map((entry) => {
    const color = String(entry?.color || "").trim();

    const existingImages = Array.isArray(entry?.existingImages)
      ? entry.existingImages.filter(Boolean)
      : [];

    const newImageCount = Math.max(
      0,
      Number(entry?.newImageCount || 0)
    );

    const newImages = uploadedImages.slice(
      fileIndex,
      fileIndex + newImageCount
    );

    fileIndex += newImageCount;

    return {
      color,
      images: [...existingImages, ...newImages],
    };
  }).filter((entry) => entry.color);
};

const parseBoolean = (value) => {
  if (
    value === true ||
    value === "true"
  ) {
    return true;
  }

  return false;
};

// ======================================================
// ESCAPE REGEX
// ======================================================

const escapeRegex = (value) => {
  return String(value).replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
};

// ======================================================
// NORMALIZE GENDER
// ======================================================
// Returns canonical Product/Category value:
// "Men" or "Women"
//
// Accepts:
// men
// Men
// MEN
// male
// women
// Women
// WOMEN
// female
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
      message:
        "Gender and category are required",
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
          String(category).trim()
        )}$`,
        $options: "i",
      },

      isActive: true,
    });

  if (!categoryDoc) {
    return {
      valid: false,
      message: `Category "${category}" does not exist for ${normalizedGender}`,
    };
  }

  // ==================================================
  // ACTUAL CATEGORY NAME FROM DATABASE
  // ==================================================

  const actualCategoryName =
    categoryDoc.name;

  // ==================================================
  // NO SUB-CATEGORY SELECTED
  // ==================================================

  if (
    !subCategory ||
    !String(subCategory).trim()
  ) {
    return {
      valid: true,
      categoryName:
        actualCategoryName,
      subCategoryName: "",
    };
  }

  // ==================================================
  // FIND SUB-CATEGORY
  // ==================================================

  const selectedSubCategory =
    categoryDoc.subCategories?.find(
      (item) =>
        item?.name
          ?.trim()
          .toLowerCase() ===
        String(subCategory)
          .trim()
          .toLowerCase()
    );

  if (!selectedSubCategory) {
    return {
      valid: false,
      message: `Sub-category "${subCategory}" does not belong to ${normalizedGender} ${actualCategoryName}`,
    };
  }

  // ==================================================
  // RETURN CANONICAL DATABASE VALUES
  // ==================================================

  return {
    valid: true,

    categoryName:
      actualCategoryName,

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

    if (
      !name ||
      !description ||
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
    // UPLOAD IMAGES
    // ==================================================

    let images = [];
    let colorImages = [];

    if (req.files?.length) {
      images = await Promise.all(
        req.files.map((file) =>
          uploadToCloudinary(file.buffer)
        )
      );
    }

    if (req.body.colorImageMap) {
      colorImages = await buildColorImagesFromFiles(
        req.body.colorImageMap,
        req.files || []
      );
    }

    // ==================================================
    // CREATE PRODUCT
    // ==================================================

    const product =
      await Product.create({
        name: name.trim(),

        description:
          description.trim(),

        price: Number(price),

        oldPrice: Number(
          oldPrice || 0
        ),

        // IMPORTANT:
        // Save "Men" / "Women"
        // because Product.js enum uses
        // ["Men", "Women"].
        gender: normalizedGender,

        category:
          categoryValidation.categoryName,

        subCategory:
          categoryValidation.subCategoryName,

        sport: sport || "",

        colors: parseArray(
          req.body.colors
        ),

        colorImages,

        sizes: parseArray(
          req.body.sizes
        ),

        images,

        rating: Number(
          rating || 0
        ),

        reviews: Number(
          reviews || 0
        ),

        stock: Number(
          stock || 0
        ),

        isNew:
          parseBoolean(isNew),

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
          category
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
          subCategory
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
          sport
        )}$`,
        $options: "i",
      };
    }

    // ==================================================
    // LABEL FILTERS
    // ==================================================

    if (isNew !== undefined) {
      filter.isNew =
        isNew === "true";
    }

    if (isTrending !== undefined) {
      filter.isTrending =
        isTrending === "true";
    }

    if (isBestSeller !== undefined) {
      filter.isBestSeller =
        isBestSeller === "true";
    }

    // ==================================================
    // SEARCH
    // ==================================================

    if (search) {
      const escapedSearch =
        escapeRegex(search);

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

    return res.json({
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

    return res.json({
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
    // ==================================================
    // FIND PRODUCT
    // ==================================================

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

    // ==================================================
    // COPY REQUEST DATA
    // ==================================================

    const data = {
      ...req.body,
    };

    // ==================================================
    // UPDATED CATEGORY VALUES
    // ==================================================

    const updatedGender =
      data.gender !== undefined
        ? data.gender
        : product.gender;

    const updatedCategory =
      data.category !== undefined
        ? data.category
        : product.category;

    const updatedSubCategory =
      data.subCategory !== undefined
        ? data.subCategory
        : product.subCategory;

    // ==================================================
    // NORMALIZE GENDER
    // ==================================================

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

        category:
          updatedCategory,

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
    // SAVE CANONICAL CATEGORY VALUES
    // ==================================================

    data.gender =
      normalizedGender;

    data.category =
      categoryValidation.categoryName;

    data.subCategory =
      categoryValidation.subCategoryName;

    // ==================================================
    // NUMBER VALUES
    // ==================================================

    if (
      data.price !== undefined
    ) {
      data.price = Number(
        data.price
      );
    }

    if (
      data.oldPrice !== undefined
    ) {
      data.oldPrice =
        Number(data.oldPrice);
    }

    if (
      data.stock !== undefined
    ) {
      data.stock = Number(
        data.stock
      );
    }

    if (
      data.rating !== undefined
    ) {
      data.rating =
        Number(data.rating);
    }

    if (
      data.reviews !== undefined
    ) {
      data.reviews =
        Number(data.reviews);
    }

    // ==================================================
    // ARRAYS
    // ==================================================

    if (
      data.colors !== undefined
    ) {
      data.colors =
        parseArray(
          data.colors
        );
    }

    if (
      data.sizes !== undefined
    ) {
      data.sizes =
        parseArray(
          data.sizes
        );
    }

    // ==================================================
    // BOOLEAN
    // ==================================================

    if (
      data.isNew !== undefined
    ) {
      data.isNew =
        parseBoolean(
          data.isNew
        );
    }

    if (
      data.isTrending !== undefined
    ) {
      data.isTrending =
        parseBoolean(
          data.isTrending
        );
    }

    if (
      data.isBestSeller !==
      undefined
    ) {
      data.isBestSeller =
        parseBoolean(
          data.isBestSeller
        );
    }

    // ==================================================
    // TRIM TEXT VALUES
    // ==================================================

    if (
      typeof data.name ===
      "string"
    ) {
      data.name =
        data.name.trim();
    }

    if (
      typeof data.description ===
      "string"
    ) {
      data.description =
        data.description.trim();
    }

    if (
      typeof data.sport ===
      "string"
    ) {
      data.sport =
        data.sport.trim();
    }

    // ==================================================
    // IMAGES
    // ==================================================

    if (req.body.colorImageMap !== undefined) {
      data.colorImages = await buildColorImagesFromFiles(
        req.body.colorImageMap,
        req.files || []
      );

      data.images = data.colorImages.flatMap(
        (entry) => entry.images || []
      );
    } else if (req.files?.length) {
      const newImages =
        await Promise.all(
          req.files.map(
            (file) =>
              uploadToCloudinary(
                file.buffer
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
        req.params.id,

        data,

        {
          new: true,
          runValidators: true,
        }
      );

    return res.json({
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
    const product =
      await Product.findByIdAndDelete(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found",
      });
    }

    return res.json({
      success: true,

      message:
        "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};