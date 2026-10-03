import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiImage,
  FiPlus,
  FiSave,
  FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";

import { createProduct } from "../../services/productService";
import { getCategories } from "../../services/categoryService";

const AddProduct = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] =
    useState(true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    gender: "Men",
    category: "",
    subCategory: "",
    sport: "",
    colors: [],
    sizes: [],
    stock: "",
    isNew: false,
    isTrending: false,
    isBestSeller: false,
  });

  const [colorInput, setColorInput] =
    useState("");

  const [sizeInput, setSizeInput] =
    useState("");

  const [colorImageFiles, setColorImageFiles] = useState({});

  // ==================================================
  // LOAD CATEGORIES
  // ==================================================

  useEffect(() => {
    let active = true;

    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);

        const data = await getCategories();

        const categoryList =
          data?.categories ||
          data?.data ||
          data ||
          [];

        if (active) {
          setCategories(
            Array.isArray(categoryList)
              ? categoryList
              : []
          );
        }
      } catch (error) {
        console.error(error);

        toast.error(
          error?.response?.data?.message ||
            "Failed to load categories."
        );
      } finally {
        if (active) {
          setCategoriesLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      active = false;
    };
  }, []);

  // ==================================================
  // FILTER CATEGORIES BY GENDER
  // ==================================================

  const genderCategories = useMemo(() => {
    return categories.filter(
      (category) =>
        category.gender?.toLowerCase() ===
        formData.gender?.toLowerCase()
    );
  }, [categories, formData.gender]);

  // ==================================================
  // SELECTED CATEGORY
  // ==================================================

  const selectedCategory = useMemo(() => {
    return genderCategories.find(
      (category) =>
        category.name?.toLowerCase() ===
        formData.category?.toLowerCase()
    );
  }, [
    genderCategories,
    formData.category,
  ]);

  // ==================================================
  // SUB CATEGORIES
  // ==================================================

  const subCategories = useMemo(() => {
    return (
      selectedCategory?.subCategories ||
      selectedCategory?.subcategories ||
      []
    );
  }, [selectedCategory]);

  // ==================================================
  // CHANGE
  // ==================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    // Gender changed.
    // Reset category and sub-category.
    if (name === "gender") {
      setFormData((previous) => ({
        ...previous,
        gender: value,
        category: "",
        subCategory: "",
        sport: "",
      }));

      return;
    }

    // Category changed.
    // Reset sub-category.
    if (name === "category") {
      setFormData((previous) => ({
        ...previous,
        category: value,
        subCategory: "",
        sport: "",
      }));

      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ==================================================
  // COLORS
  // ==================================================

  const addColor = () => {
    const color =
      colorInput.trim();

    if (!color) return;

    if (
      formData.colors.includes(color)
    ) {
      toast.error(
        "This color is already added."
      );

      return;
    }

    setFormData((previous) => ({
      ...previous,
      colors: [
        ...previous.colors,
        color,
      ],
    }));

    setColorImageFiles((previous) => ({
      ...previous,
      [color]: [],
    }));

    setColorInput("");
  };

  const removeColor = (color) => {
    setFormData((previous) => ({
      ...previous,
      colors:
        previous.colors.filter(
          (item) => item !== color
        ),
    }));

    setColorImageFiles((previous) => {
      const next = { ...previous };
      delete next[color];
      return next;
    });
  };

  // ==================================================
  // SIZES
  // ==================================================

  const addSize = () => {
    const size =
      sizeInput.trim();

    if (!size) return;

    if (
      formData.sizes.includes(size)
    ) {
      toast.error(
        "This size is already added."
      );

      return;
    }

    setFormData((previous) => ({
      ...previous,
      sizes: [
        ...previous.sizes,
        size,
      ],
    }));

    setSizeInput("");
  };

  const removeSize = (size) => {
    setFormData((previous) => ({
      ...previous,
      sizes:
        previous.sizes.filter(
          (item) => item !== size
        ),
    }));
  };

  // ==================================================
  // COLOR IMAGES
  // ==================================================

  const handleColorImages = (color, event) => {
    const files = Array.from(
      event.target.files || []
    );

    setColorImageFiles((previous) => ({
      ...previous,
      [color]: files,
    }));
  };

  // ==================================================
  // SUBMIT
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error(
        "Product name is required."
      );
      return;
    }

    if (
      !formData.description.trim()
    ) {
      toast.error(
        "Product description is required."
      );
      return;
    }

    if (
      !formData.price ||
      Number(formData.price) <= 0
    ) {
      toast.error(
        "Please enter a valid price."
      );
      return;
    }

    if (!formData.category) {
      toast.error(
        "Please select a category."
      );
      return;
    }

    if (
      !formData.subCategory &&
      subCategories.length > 0
    ) {
      toast.error(
        "Please select a sub-category."
      );
      return;
    }

    if (
      !formData.stock ||
      Number(formData.stock) < 0
    ) {
      toast.error(
        "Please enter valid stock."
      );
      return;
    }

    if (
      formData.colors.length === 0
    ) {
      toast.error(
        "Please add at least one color."
      );
      return;
    }

    if (
      formData.sizes.length === 0
    ) {
      toast.error(
        "Please add at least one size."
      );
      return;
    }

    const missingColorImages = formData.colors.filter(
      (color) =>
        !colorImageFiles[color] ||
        colorImageFiles[color].length === 0
    );

    if (missingColorImages.length > 0) {
      toast.error(
        `Please add at least one image for ${missingColorImages[0]}.`
      );
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append(
        "name",
        formData.name
      );

      data.append(
        "description",
        formData.description
      );

      data.append(
        "price",
        formData.price
      );

      data.append(
        "oldPrice",
        formData.oldPrice
      );

      data.append(
        "gender",
        formData.gender
      );

      data.append(
        "category",
        formData.category
      );

      data.append(
        "subCategory",
        formData.subCategory
      );

      data.append(
        "sport",
        ""
      );

      data.append(
        "stock",
        formData.stock
      );

      data.append(
        "colors",
        JSON.stringify(
          formData.colors
        )
      );

      data.append(
        "sizes",
        JSON.stringify(
          formData.sizes
        )
      );

      data.append(
        "isNew",
        formData.isNew
      );

      data.append(
        "isTrending",
        formData.isTrending
      );

      data.append(
        "isBestSeller",
        formData.isBestSeller
      );

      const colorImageMap = formData.colors.map(
        (color) => ({
          color,
          existingImages: [],
          newImageCount:
            colorImageFiles[color]?.length || 0,
        })
      );

      data.append(
        "colorImageMap",
        JSON.stringify(colorImageMap)
      );

      formData.colors.forEach((color) => {
        (colorImageFiles[color] || []).forEach(
          (image) => {
            data.append(
              "images",
              image
            );
          }
        );
      });

      await createProduct(data);

      toast.success(
        "Product added successfully."
      );

      navigate(
        "/admin/products"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to add product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/admin/products"
            className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-lime-400"
          >
            <FiArrowLeft />
            Back to Products
          </Link>

          <h1 className="text-3xl font-bold">
            Add Product
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Add a new footwear product to Trestep.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-6"
      >
        {/* Basic Information */}
        <section className="rounded-2xl border border-white/10 bg-zinc-950 p-6 md:p-8">
          <h2 className="text-xl font-bold">
            Basic Information
          </h2>

          <div className="mt-6 grid gap-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Product Name *
              </label>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Trestep Air Runner"
                className="admin-input"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Description *
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Write product description..."
                className="admin-input resize-none"
              />
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="rounded-2xl border border-white/10 bg-zinc-950 p-6 md:p-8">
          <h2 className="text-xl font-bold">
            Pricing & Stock
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Price *
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="8500"
                className="admin-input"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Old Price
              </label>

              <input
                type="number"
                name="oldPrice"
                value={formData.oldPrice}
                onChange={handleChange}
                placeholder="10000"
                className="admin-input"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Stock *
              </label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="50"
                min="0"
                className="admin-input"
              />
            </div>
          </div>
        </section>

        {/* Category */}
        <section className="rounded-2xl border border-white/10 bg-zinc-950 p-6 md:p-8">
          <h2 className="text-xl font-bold">
            Category
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {/* Gender */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Gender
              </label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="admin-input"
              >
                <option value="Men">
                  Men
                </option>

                <option value="Women">
                  Women
                </option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Category *
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={
                  categoriesLoading
                }
                className="admin-input"
              >
                <option value="">
                  {categoriesLoading
                    ? "Loading categories..."
                    : genderCategories.length ===
                      0
                    ? `No ${formData.gender} categories`
                    : "Select Category"}
                </option>

                {genderCategories.map(
                  (category) => (
                    <option
                      key={
                        category._id ||
                        category.id
                      }
                      value={
                        category.name
                      }
                    >
                      {category.name}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Sub Category */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Sub Category
                {subCategories.length >
                  0 && " *"}
              </label>

              <select
                name="subCategory"
                value={
                  formData.subCategory
                }
                onChange={handleChange}
                disabled={
                  !formData.category ||
                  subCategories.length === 0
                }
                className="admin-input"
              >
                <option value="">
                  {!formData.category
                    ? "Select category first"
                    : subCategories.length ===
                      0
                    ? "No sub-categories"
                    : "Select Sub Category"}
                </option>

                {subCategories.map(
                  (item) => {
                    const subCategoryName =
                      typeof item ===
                      "string"
                        ? item
                        : item?.name ||
                          "";

                    return (
                      <option
                        key={
                          subCategoryName
                        }
                        value={
                          subCategoryName
                        }
                      >
                        {
                          subCategoryName
                        }
                      </option>
                    );
                  }
                )}
              </select>
            </div>
          </div>

          {formData.category &&
            subCategories.length >
              0 && (
              <p className="mt-4 text-xs text-gray-600">
                Sub-categories are managed
                from the Admin Categories
                section.
              </p>
            )}
        </section>

        {/* Colors & Sizes */}
        <section className="rounded-2xl border border-white/10 bg-zinc-950 p-6 md:p-8">
          <h2 className="text-xl font-bold">
            Colors & Sizes
          </h2>

          {/* Colors */}
          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium">
              Colors
            </label>

            <div className="flex gap-3">
              <input
                value={colorInput}
                onChange={(e) =>
                  setColorInput(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (
                    e.key ===
                    "Enter"
                  ) {
                    e.preventDefault();
                    addColor();
                  }
                }}
                placeholder="Black"
                className="admin-input"
              />

              <button
                type="button"
                onClick={addColor}
                className="flex shrink-0 items-center gap-2 rounded-xl bg-lime-400 px-5 font-semibold text-black hover:bg-lime-300"
              >
                <FiPlus />
                Add
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {formData.colors.map(
                (color) => (
                  <span
                    key={color}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-black px-4 py-2 text-sm"
                  >
                    {color}

                    <button
                      type="button"
                      onClick={() =>
                        removeColor(
                          color
                        )
                      }
                      className="text-gray-500 hover:text-red-400"
                    >
                      <FiX />
                    </button>
                  </span>
                )
              )}
            </div>
          </div>

          {/* Sizes */}
          <div className="mt-8">
            <label className="mb-2 block text-sm font-medium">
              Sizes
            </label>

            <div className="flex gap-3">
              <input
                value={sizeInput}
                onChange={(e) =>
                  setSizeInput(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (
                    e.key ===
                    "Enter"
                  ) {
                    e.preventDefault();
                    addSize();
                  }
                }}
                placeholder="42"
                className="admin-input"
              />

              <button
                type="button"
                onClick={addSize}
                className="flex shrink-0 items-center gap-2 rounded-xl bg-lime-400 px-5 font-semibold text-black hover:bg-lime-300"
              >
                <FiPlus />
                Add
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {formData.sizes.map(
                (size) => (
                  <span
                    key={size}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-black px-4 py-2 text-sm"
                  >
                    {size}

                    <button
                      type="button"
                      onClick={() =>
                        removeSize(
                          size
                        )
                      }
                      className="text-gray-500 hover:text-red-400"
                    >
                      <FiX />
                    </button>
                  </span>
                )
              )}
            </div>
          </div>
        </section>

        {/* Images */}
        <section className="rounded-2xl border border-white/10 bg-zinc-950 p-6 md:p-8">
          <h2 className="text-xl font-bold">
            Product Images
          </h2>

          <div className="mt-6 space-y-4">
            {formData.colors.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/20 p-8 text-center">
                <FiImage className="mx-auto text-4xl text-gray-600" />

                <p className="mt-4 text-sm text-gray-400">
                  Add colors first, then upload images for each color.
                </p>
              </div>
            ) : (
              formData.colors.map((color) => (
                <div
                  key={color}
                  className="rounded-2xl border border-white/10 bg-black/30 p-5"
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <p className="font-semibold">{color}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        Upload one or more images for this color.
                      </p>
                    </div>

                    <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold transition hover:border-lime-400 hover:text-lime-400">
                      <FiImage />
                      Choose Images

                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) =>
                          handleColorImages(color, e)
                        }
                        className="hidden"
                      />
                    </label>
                  </div>

                  {colorImageFiles[color]?.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-lime-400">
                        {colorImageFiles[color].length} image(s) selected
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {colorImageFiles[color].map(
                          (file, index) => (
                            <span
                              key={`${file.name}-${index}`}
                              className="rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-400"
                            >
                              {file.name}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Labels */}
        <section className="rounded-2xl border border-white/10 bg-zinc-950 p-6 md:p-8">
          <h2 className="text-xl font-bold">
            Product Labels
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 p-4">
              <input
                type="checkbox"
                name="isNew"
                checked={
                  formData.isNew
                }
                onChange={handleChange}
                className="h-4 w-4 accent-lime-400"
              />

              <span className="text-sm">
                New Arrival
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 p-4">
              <input
                type="checkbox"
                name="isTrending"
                checked={
                  formData.isTrending
                }
                onChange={handleChange}
                className="h-4 w-4 accent-lime-400"
              />

              <span className="text-sm">
                Trending
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 p-4">
              <input
                type="checkbox"
                name="isBestSeller"
                checked={
                  formData.isBestSeller
                }
                onChange={handleChange}
                className="h-4 w-4 accent-lime-400"
              />

              <span className="text-sm">
                Best Seller
              </span>
            </label>
          </div>
        </section>

        {/* Submit */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            to="/admin/products"
            className="rounded-xl border border-white/10 px-6 py-3 text-center font-semibold transition hover:border-white/30"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-7 py-3 font-semibold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiSave />

            {loading
              ? "Saving..."
              : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;