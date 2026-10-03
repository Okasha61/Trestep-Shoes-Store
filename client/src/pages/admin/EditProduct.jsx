import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FiArrowLeft,
  FiImage,
  FiPlus,
  FiSave,
  FiX,
} from "react-icons/fi";

import toast from "react-hot-toast";

import {
  getProduct,
  updateProduct,
} from "../../services/productService";

import {
  getCategories,
} from "../../services/categoryService";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [colorImageFiles, setColorImageFiles] = useState({});
  const [colorImageUrls, setColorImageUrls] = useState({});

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
    stock: 0,
    isNew: false,
    isTrending: false,
    isBestSeller: false,
  });

  const [colorInput, setColorInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");

  // ==================================================
  // NORMALIZE GENDER
  // ==================================================

  const normalizeGender = (value) => {
    const gender = value
      ?.toString()
      .trim()
      .toLowerCase();

    if (gender === "male") {
      return "men";
    }

    if (gender === "female") {
      return "women";
    }

    return gender;
  };

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
        console.error(
          "Failed to load categories:",
          error
        );

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
  // LOAD PRODUCT
  // ==================================================

  useEffect(() => {
    let active = true;

    const fetchProduct = async () => {
      try {
        setLoading(true);

        const data = await getProduct(id);

        const product =
          data?.product || data;

        if (!active || !product) {
          return;
        }

        setFormData({
          name:
            product.name || "",

          description:
            product.description || "",

          price:
            product.price ?? "",

          oldPrice:
            product.oldPrice ?? "",

          gender:
            product.gender || "Men",

          category:
            product.category || "",

          subCategory:
            product.subCategory || "",

          sport:
            product.sport || "",

          colors:
            Array.isArray(product.colors)
              ? product.colors
              : [],

          sizes:
            Array.isArray(product.sizes)
              ? product.sizes
              : [],

          stock:
            product.stock ?? 0,

          isNew:
            Boolean(product.isNew),

          isTrending:
            Boolean(product.isTrending),

          isBestSeller:
            Boolean(product.isBestSeller),
        });

        const loadedColorImages = {};

        if (Array.isArray(product.colorImages) && product.colorImages.length > 0) {
          product.colorImages.forEach((entry) => {
            const color = String(entry?.color || "").trim();

            if (color) {
              loadedColorImages[color] = Array.isArray(entry?.images)
                ? entry.images
                : [];
            }
          });
        } else if (Array.isArray(product.colors) && product.colors.length > 0) {
          loadedColorImages[product.colors[0]] = Array.isArray(product.images)
            ? product.images
            : [];
        }

        setColorImageUrls(loadedColorImages);
        setColorImageFiles({});
      } catch (error) {
        console.error(
          "Failed to load product:",
          error
        );

        toast.error(
          error?.response?.data?.message ||
            "Failed to load product."
        );

        navigate(
          "/admin/products"
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      active = false;
    };
  }, [id, navigate]);

  // ==================================================
  // FILTER CATEGORIES BY GENDER
  // ==================================================

  const filteredCategories = useMemo(() => {
    const selectedGender =
      normalizeGender(formData.gender);

    if (!selectedGender) {
      return [];
    }

    return categories.filter(
      (category) =>
        normalizeGender(category.gender) ===
        selectedGender
    );
  }, [
    categories,
    formData.gender,
  ]);

  // ==================================================
  // SELECTED CATEGORY
  // ==================================================

  const selectedCategory = useMemo(() => {
    return categories.find(
      (category) =>
        category.name
          ?.toLowerCase()
          .trim() ===
          formData.category
            ?.toLowerCase()
            .trim() &&
        normalizeGender(
          category.gender
        ) ===
          normalizeGender(
            formData.gender
          )
    );
  }, [
    categories,
    formData.category,
    formData.gender,
  ]);

  // ==================================================
  // SUB CATEGORIES
  // ==================================================

  const subCategories =
    selectedCategory?.subCategories ||
    selectedCategory?.subcategories ||
    [];

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

    // ------------------------------
    // Gender changed
    // ------------------------------

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

    // ------------------------------
    // Category changed
    // ------------------------------

    if (name === "category") {
      setFormData((previous) => ({
        ...previous,
        category: value,
        subCategory: "",
        sport: "",
      }));

      return;
    }

    // ------------------------------
    // Normal fields
    // ------------------------------

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ==================================================
  // TAGS
  // ==================================================

  const addTag = (
    field,
    value,
    clear
  ) => {
    const clean = value.trim();

    if (!clean) {
      return;
    }

    if (
      formData[field].includes(clean)
    ) {
      toast.error(
        `This ${
          field === "colors"
            ? "color"
            : "size"
        } is already added.`
      );

      return;
    }

    setFormData((previous) => ({
      ...previous,
      [field]: [
        ...previous[field],
        clean,
      ],
    }));

    if (field === "colors") {
      setColorImageFiles((previous) => ({
        ...previous,
        [clean]: [],
      }));

      setColorImageUrls((previous) => ({
        ...previous,
        [clean]: [],
      }));
    }

    clear("");
  };

  const removeTag = (
    field,
    value
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]:
        previous[field].filter(
          (item) => item !== value
        ),
    }));

    if (field === "colors") {
      setColorImageFiles((previous) => {
        const next = { ...previous };
        delete next[value];
        return next;
      });

      setColorImageUrls((previous) => {
        const next = { ...previous };
        delete next[value];
        return next;
      });
    }
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

    // ------------------------------
    // Basic validation
    // ------------------------------

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

    // ------------------------------
    // Make sure category belongs
    // to selected gender
    // ------------------------------

    const validCategory =
      filteredCategories.find(
        (category) =>
          category.name
            ?.toLowerCase()
            .trim() ===
          formData.category
            ?.toLowerCase()
            .trim()
      );

    if (!validCategory) {
      toast.error(
        "Please select a valid category for the selected gender."
      );

      return;
    }

    // ------------------------------
    // Validate subcategory
    // ------------------------------

    if (
      formData.subCategory &&
      subCategories.length > 0
    ) {
      const validSubCategory =
        subCategories.some(
          (item) => {
            const name =
              typeof item === "string"
                ? item
                : item?.name || "";

            return (
              name
                .toLowerCase()
                .trim() ===
              formData.subCategory
                .toLowerCase()
                .trim()
            );
          }
        );

      if (!validSubCategory) {
        toast.error(
          "Please select a valid sub-category."
        );

        return;
      }
    }

    if (
      formData.stock === "" ||
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
        (!colorImageUrls[color] ||
          colorImageUrls[color].length === 0) &&
        (!colorImageFiles[color] ||
          colorImageFiles[color].length === 0)
    );

    if (missingColorImages.length > 0) {
      toast.error(
        `Please add at least one image for ${missingColorImages[0]}.`
      );
      return;
    }

    // ==================================================
    // UPDATE PRODUCT
    // ==================================================

    try {
      setSaving(true);

      const body = new FormData();

      body.append(
        "name",
        formData.name
      );

      body.append(
        "description",
        formData.description
      );

      body.append(
        "price",
        formData.price
      );

      body.append(
        "oldPrice",
        formData.oldPrice
      );

      body.append(
        "gender",
        formData.gender
      );

      body.append(
        "category",
        formData.category
      );

      body.append(
        "subCategory",
        formData.subCategory
      );

      // Compatibility field
      body.append(
        "sport",
        ""
      );

      body.append(
        "stock",
        formData.stock
      );

      body.append(
        "colors",
        JSON.stringify(
          formData.colors
        )
      );

      body.append(
        "sizes",
        JSON.stringify(
          formData.sizes
        )
      );

      body.append(
        "isNew",
        String(
          formData.isNew
        )
      );

      body.append(
        "isTrending",
        String(
          formData.isTrending
        )
      );

      body.append(
        "isBestSeller",
        String(
          formData.isBestSeller
        )
      );

      const colorImageMap = formData.colors.map(
        (color) => ({
          color,
          existingImages:
            colorImageUrls[color] || [],
          newImageCount:
            colorImageFiles[color]?.length || 0,
        })
      );

      body.append(
        "colorImageMap",
        JSON.stringify(colorImageMap)
      );

      formData.colors.forEach((color) => {
        (colorImageFiles[color] || []).forEach(
          (file) => {
            body.append(
              "images",
              file
            );
          }
        );
      });

      await updateProduct(
        id,
        body
      );

      toast.success(
        "Product updated successfully."
      );

      navigate(
        "/admin/products"
      );
    } catch (error) {
      console.error(
        "Update product error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to update product."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="p-10 text-gray-400">
        Loading product...
      </div>
    );
  }

  // ==================================================
  // UI
  // ==================================================

  return (
    <div>

      {/* Header */}
      <Link
        to="/admin/products"
        className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-lime-400"
      >
        <FiArrowLeft />
        Back to Products
      </Link>

      <h1 className="text-3xl font-bold">
        Edit Product
      </h1>

      <p className="mt-2 text-sm text-gray-500">
        Update product information stored in MongoDB.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-6"
      >

        {/* Basic */}
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
                    : "Select Category"}
                </option>

                {filteredCategories.map(
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

            {/* Subcategory */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Sub Category
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
                    : subCategories.length === 0
                    ? "No sub-categories"
                    : "Select Sub Category"}
                </option>

                {subCategories.map(
                  (item) => {
                    const subCategoryName =
                      typeof item === "string"
                        ? item
                        : item?.name || "";

                    if (!subCategoryName) {
                      return null;
                    }

                    return (
                      <option
                        key={
                          subCategoryName
                        }
                        value={
                          subCategoryName
                        }
                      >
                        {subCategoryName}
                      </option>
                    );
                  }
                )}
              </select>
            </div>

          </div>
        </section>

        {/* Colors & Sizes */}
        <section className="rounded-2xl border border-white/10 bg-zinc-950 p-6 md:p-8">

          <h2 className="text-xl font-bold">
            Colors & Sizes
          </h2>

          <div className="mt-6 grid gap-8 md:grid-cols-2">

            {/* Colors */}
            <div>

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

                      addTag(
                        "colors",
                        colorInput,
                        setColorInput
                      );
                    }
                  }}
                  placeholder="Black"
                  className="admin-input"
                />

                <button
                  type="button"
                  onClick={() =>
                    addTag(
                      "colors",
                      colorInput,
                      setColorInput
                    )
                  }
                  className="flex shrink-0 items-center gap-2 rounded-xl bg-lime-400 px-5 font-semibold text-black"
                >
                  <FiPlus />
                  Add
                </button>

              </div>

              <div className="mt-3 flex flex-wrap gap-2">

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
                          removeTag(
                            "colors",
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
            <div>

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

                      addTag(
                        "sizes",
                        sizeInput,
                        setSizeInput
                      );
                    }
                  }}
                  placeholder="42"
                  className="admin-input"
                />

                <button
                  type="button"
                  onClick={() =>
                    addTag(
                      "sizes",
                      sizeInput,
                      setSizeInput
                    )
                  }
                  className="flex shrink-0 items-center gap-2 rounded-xl bg-lime-400 px-5 font-semibold text-black"
                >
                  <FiPlus />
                  Add
                </button>

              </div>

              <div className="mt-3 flex flex-wrap gap-2">

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
                          removeTag(
                            "sizes",
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
              formData.colors.map((color) => {
                const existingImages = colorImageUrls[color] || [];
                const newImages = colorImageFiles[color] || [];

                return (
                  <div
                    key={color}
                    className="rounded-2xl border border-white/10 bg-black/30 p-5"
                  >
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                      <div>
                        <p className="font-semibold">{color}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          Existing images are kept. Choose new images to add.
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

                    {existingImages.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs uppercase tracking-wider text-gray-600">
                          Current Images
                        </p>

                        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                          {existingImages.map((image, index) => (
                            <div
                              key={`${image}-${index}`}
                              className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900"
                            >
                              <img
                                src={image}
                                alt={`${color} ${index + 1}`}
                                className="h-24 w-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {newImages.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-lime-400">
                          {newImages.length} new image(s) selected
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {newImages.map((file, index) => (
                            <span
                              key={`${file.name}-${index}`}
                              className="rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-400"
                            >
                              {file.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Labels */}
        <section className="rounded-2xl border border-white/10 bg-zinc-950 p-6 md:p-8">

          <h2 className="text-xl font-bold">
            Labels
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">

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

              <span>
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

              <span>
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

              <span>
                Best Seller
              </span>

            </label>

          </div>
        </section>

        {/* Submit */}
        <div className="flex justify-end gap-3">

          <Link
            to="/admin/products"
            className="rounded-xl border border-white/10 px-6 py-3 font-semibold transition hover:border-white/30"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-lime-400 px-7 py-3 font-semibold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiSave />

            {saving
              ? "Saving..."
              : "Update Product"}
          </button>

        </div>

      </form>
    </div>
  );
};

export default EditProduct;