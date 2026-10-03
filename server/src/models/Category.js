import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Sub-category name is required"],
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 300,
    },

    image: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 300,
    },

    image: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      enum: ["Men", "Women"],
      required: [true, "Category gender is required"],
      trim: true,
    },

    subCategories: {
      type: [subCategorySchema],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/*
  CATEGORY UNIQUENESS

  Same category name is allowed for different genders.

  Men + Sports
  Women + Sports

  Both are allowed.

  But:

  Men + Sports
  Men + Sports

  is NOT allowed.

  And:

  Women + Sports
  Women + Sports

  is NOT allowed.
*/
categorySchema.index(
  {
    name: 1,
    gender: 1,
  },
  {
    unique: true,
    name: "category_name_gender_unique",
    collation: {
      locale: "en",
      strength: 2,
    },
  }
);

const Category = mongoose.model(
  "Category",
  categorySchema
);

export default Category;