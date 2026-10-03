import {
  useEffect,
  useState,
} from "react";

import {
  FiFolder,
  FiImage,
  FiPlus,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import toast from "react-hot-toast";

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../services/categoryService";

const normalize = (data) =>
  data?.categories ||
  data?.data ||
  data ||
  [];

const normalizeSubCategory = (item) => {
  if (typeof item === "string") {
    return {
      name: item,
      description: "",
      image: "",
    };
  }

  return {
    name: item?.name || "",
    description: item?.description || "",
    image: item?.image || "",
  };
};

const Categories = () => {
  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [categoryName, setCategoryName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [gender, setGender] =
    useState("");

  const [categoryImage, setCategoryImage] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [subCategoryName, setSubCategoryName] =
    useState("");

  const [subCategoryDescription, setSubCategoryDescription] =
    useState("");

  const [subCategoryImage, setSubCategoryImage] =
    useState(null);

  const [subCategoryImagePreview, setSubCategoryImagePreview] =
    useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("");

  const refresh = async () => {
    try {
      setLoading(true);

      const data =
        await getCategories();

      setCategories(
        normalize(data)
      );
    } catch (error) {
      toast.error(
        error?.response?.data
          ?.message ||
          "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleImageChange = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(
        "Please select an image file."
      );
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      toast.error(
        "Image must be less than 5MB."
      );
      return;
    }

    setCategoryImage(file);
    setImagePreview(
      URL.createObjectURL(file)
    );
  };

  const handleSubCategoryImageChange = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(
        "Please select an image file."
      );
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      toast.error(
        "Image must be less than 5MB."
      );
      return;
    }

    setSubCategoryImage(file);
    setSubCategoryImagePreview(
      URL.createObjectURL(file)
    );
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();

    const name =
      categoryName.trim();

    const cleanDescription =
      description.trim();

    if (!name) {
      toast.error(
        "Enter category name."
      );
      return;
    }

    if (!cleanDescription) {
      toast.error(
        "Enter category description."
      );
      return;
    }

    if (!gender) {
      toast.error(
        "Please select Men or Women."
      );
      return;
    }

    if (!categoryImage) {
      toast.error(
        "Please select category image."
      );
      return;
    }

    try {
      setSaving(true);

      const formData =
        new FormData();

      formData.append("name", name);
      formData.append(
        "description",
        cleanDescription
      );
      formData.append("gender", gender);
      formData.append(
        "image",
        categoryImage
      );
      formData.append(
        "subCategories",
        JSON.stringify([])
      );

      await createCategory(
        formData
      );

      setCategoryName("");
      setDescription("");
      setGender("");
      setCategoryImage(null);
      setImagePreview("");

      const imageInput =
        document.getElementById(
          "category-image"
        );

      if (imageInput) {
        imageInput.value = "";
      }

      await refresh();

      toast.success(
        "Category added successfully."
      );
    } catch (error) {
      toast.error(
        error?.response?.data
          ?.message ||
          "Could not add category."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Delete this category and all its sub-categories?"
      );

    if (!confirmed) return;

    try {
      await deleteCategory(id);

      if (
        String(selectedCategory) ===
        String(id)
      ) {
        setSelectedCategory("");
      }

      await refresh();

      toast.success(
        "Category deleted."
      );
    } catch (error) {
      toast.error(
        error?.response?.data
          ?.message ||
          "Could not delete category."
      );
    }
  };

  const handleAddSubCategory =
    async (e) => {
      e.preventDefault();

      if (!selectedCategory) {
        toast.error(
          "Select a category first."
        );
        return;
      }

      const name =
        subCategoryName.trim();

      const cleanDescription =
        subCategoryDescription.trim();

      if (!name) {
        toast.error(
          "Enter sub-category name."
        );
        return;
      }

      if (!cleanDescription) {
        toast.error(
          "Enter sub-category description."
        );
        return;
      }

      if (!subCategoryImage) {
        toast.error(
          "Please select sub-category image."
        );
        return;
      }

      const category =
        categories.find(
          (item) =>
            String(
              item._id || item.id
            ) ===
            String(selectedCategory)
        );

      if (!category) {
        toast.error(
          "Category not found."
        );
        return;
      }

      const current =
        (
          category.subCategories ||
          category.subcategories ||
          []
        ).map(normalizeSubCategory);

      const exists =
        current.some(
          (item) =>
            item.name.toLowerCase() ===
            name.toLowerCase()
        );

      if (exists) {
        toast.error(
          "Sub-category already exists."
        );
        return;
      }

      try {
        setSaving(true);

        const formData =
          new FormData();

        formData.append(
          "name",
          category.name
        );

        formData.append(
          "description",
          category.description || ""
        );

        formData.append(
          "gender",
          category.gender || ""
        );

        formData.append(
          "subCategories",
          JSON.stringify([
            ...current,
            {
              name,
              description: cleanDescription,
              image: "",
            },
          ])
        );

        formData.append(
          "subCategoryImage",
          subCategoryImage
        );

        await updateCategory(
          category._id ||
            category.id,
          formData
        );

        setSubCategoryName("");
        setSubCategoryDescription("");
        setSubCategoryImage(null);
        setSubCategoryImagePreview("");

        const input =
          document.getElementById(
            "sub-category-image"
          );

        if (input) {
          input.value = "";
        }

        await refresh();

        toast.success(
          "Sub-category added."
        );
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Could not add sub-category."
        );
      } finally {
        setSaving(false);
      }
    };

  const removeSubCategory =
    async (
      category,
      subCategory
    ) => {
      const current =
        (
          category.subCategories ||
          category.subcategories ||
          []
        ).map(normalizeSubCategory);

      const confirmed =
        window.confirm(
          `Remove "${subCategory.name}" sub-category?`
        );

      if (!confirmed) return;

      try {
        setSaving(true);

        const formData =
          new FormData();

        formData.append(
          "name",
          category.name
        );

        formData.append(
          "description",
          category.description || ""
        );

        formData.append(
          "gender",
          category.gender || ""
        );

        formData.append(
          "subCategories",
          JSON.stringify(
            current.filter(
              (item) =>
                item.name !==
                subCategory.name
            )
          )
        );

        await updateCategory(
          category._id ||
            category.id,
          formData
        );

        await refresh();

        toast.success(
          "Sub-category removed."
        );
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Could not remove sub-category."
        );
      } finally {
        setSaving(false);
      }
    };

  return (
    <div>
      <p className="text-sm uppercase tracking-widest text-lime-400">
        Store Management
      </p>

      <h1 className="mt-2 text-3xl font-bold">
        Categories
      </h1>

      <p className="mt-2 text-sm text-gray-500">
        Create and manage your store
        categories and sub-categories.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* ADD CATEGORY */}
        <form
          onSubmit={handleAddCategory}
          className="rounded-2xl border border-white/10 bg-zinc-950 p-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400/10 text-lime-400">
              <FiFolder />
            </div>

            <div>
              <h2 className="font-bold">
                Add Category
              </h2>

              <p className="text-xs text-gray-500">
                Add image, name, gender and
                description.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium">
              Category Image
            </label>

            <label
              htmlFor="category-image"
              className="flex cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/20 bg-black p-4 transition hover:border-lime-400/50"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Category preview"
                  className="h-40 w-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <FiImage className="text-3xl" />
                  <span className="mt-3 text-sm">
                    Choose Category Image
                  </span>
                  <span className="mt-1 text-xs">
                    Maximum 5MB
                  </span>
                </div>
              )}

              <input
                id="category-image"
                type="file"
                accept="image/*"
                onChange={
                  handleImageChange
                }
                className="hidden"
              />
            </label>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium">
              Category Name
            </label>

            <input
              value={categoryName}
              onChange={(e) =>
                setCategoryName(
                  e.target.value
                )
              }
              placeholder="Sports"
              className="admin-input"
            />
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium">
              Category For
            </label>

            <select
              value={gender}
              onChange={(e) =>
                setGender(
                  e.target.value
                )
              }
              className="admin-input"
            >
              <option value="">
                Select Gender
              </option>
              <option value="Men">
                Men
              </option>
              <option value="Women">
                Women
              </option>
            </select>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium">
              Small Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              rows="3"
              maxLength={300}
              placeholder="Built for sports, training and everyday performance."
              className="admin-input resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-lime-400 px-5 py-3 font-semibold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiPlus />
            {saving
              ? "Saving..."
              : "Add Category"}
          </button>
        </form>

        {/* ADD SUB CATEGORY */}
        <form
          onSubmit={handleAddSubCategory}
          className="rounded-2xl border border-white/10 bg-zinc-950 p-6"
        >
          <h2 className="font-bold">
            Add Sub-Category
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Add image, name and a short description.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Category
              </label>

              <select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(
                    e.target.value
                  )
                }
                className="admin-input"
              >
                <option value="">
                  Select Category
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={
                        category._id ||
                        category.id
                      }
                      value={
                        category._id ||
                        category.id
                      }
                    >
                      {category.name} —{" "}
                      {category.gender ||
                        "No Gender"}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Sub-Category Image
              </label>

              <label
                htmlFor="sub-category-image"
                className="flex cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/20 bg-black p-4 transition hover:border-lime-400/50"
              >
                {subCategoryImagePreview ? (
                  <img
                    src={subCategoryImagePreview}
                    alt="Sub-category preview"
                    className="h-40 w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <FiImage className="text-3xl" />
                    <span className="mt-3 text-sm">
                      Choose Sub-Category Image
                    </span>
                    <span className="mt-1 text-xs">
                      Maximum 5MB
                    </span>
                  </div>
                )}

                <input
                  id="sub-category-image"
                  type="file"
                  accept="image/*"
                  onChange={
                    handleSubCategoryImageChange
                  }
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Sub-Category Name
              </label>

              <input
                value={subCategoryName}
                onChange={(e) =>
                  setSubCategoryName(
                    e.target.value
                  )
                }
                placeholder="Football"
                className="admin-input"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Short Description
              </label>

              <textarea
                value={
                  subCategoryDescription
                }
                onChange={(e) =>
                  setSubCategoryDescription(
                    e.target.value
                  )
                }
                rows="3"
                maxLength={120}
                placeholder="Performance shoes built for speed, grip and comfort."
                className="admin-input resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-5 rounded-xl bg-lime-400 px-5 py-3 font-semibold text-black transition hover:bg-lime-300 disabled:opacity-50"
          >
            Add Sub-Category
          </button>
        </form>
      </div>

      {loading ? (
        <p className="mt-8 text-gray-500">
          Loading categories...
        </p>
      ) : categories.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-zinc-950 p-10 text-center">
          <FiFolder className="mx-auto text-4xl text-gray-600" />
          <p className="mt-4 text-gray-500">
            No categories found.
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Add your first category above.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {categories.map(
            (category) => {
              const id =
                category._id ||
                category.id;

              const subs =
                (
                  category.subCategories ||
                  category.subcategories ||
                  []
                ).map(normalizeSubCategory);

              return (
                <div
                  key={id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950"
                >
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-black text-gray-700">
                      <FiFolder className="text-4xl" />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-bold">
                          {category.name}
                        </h2>

                        <div className="mt-2 inline-flex rounded-full bg-lime-400/10 px-3 py-1 text-xs font-semibold text-lime-400">
                          {category.gender ||
                            "Gender not set"}
                        </div>

                        <p className="mt-2 text-xs text-gray-500">
                          {subs.length}{" "}
                          sub-categor
                          {subs.length ===
                          1
                            ? "y"
                            : "ies"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(id)
                        }
                        className="rounded-lg border border-white/10 p-2 text-gray-500 transition hover:border-red-400/20 hover:text-red-400"
                      >
                        <FiTrash2 />
                      </button>
                    </div>

                    {category.description && (
                      <p className="mt-4 text-sm leading-6 text-gray-400">
                        {category.description}
                      </p>
                    )}

                    <div className="mt-5 space-y-3">
                      {subs.length === 0 ? (
                        <p className="text-xs text-gray-600">
                          No sub-categories
                        </p>
                      ) : (
                        subs.map(
                          (item) => (
                            <div
                              key={item.name}
                              className="flex items-center gap-3 rounded-xl border border-white/10 bg-black p-3"
                            >
                              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-900">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center text-gray-700">
                                    <FiImage />
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="font-semibold">
                                  {item.name}
                                </p>

                                <p className="mt-1 text-xs leading-5 text-gray-500">
                                  {item.description ||
                                    "No description added."}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  removeSubCategory(
                                    category,
                                    item
                                  )
                                }
                                className="rounded-lg p-2 text-gray-600 transition hover:text-red-400"
                                title="Remove sub-category"
                              >
                                <FiX />
                              </button>
                            </div>
                          )
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
};

export default Categories;
