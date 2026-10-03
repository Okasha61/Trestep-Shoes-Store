import { useEffect, useState } from "react";

import {
  FiFileText,
  FiPlus,
  FiTrash2,
  FiX,
  FiImage,
  FiUpload,
} from "react-icons/fi";

import toast from "react-hot-toast";

import {
  createBlog,
  deleteBlog,
  getBlogs,
} from "../../services/blogService";

const normalize = (data) =>
  data?.blogs || data?.data || data || [];

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    excerpt: "",
    content: "",
    image: null,
    author: "Trestep",
    isPublished: true,
  });

  const [imagePreview, setImagePreview] = useState("");

  // ======================================================
  // LOAD BLOGS
  // ======================================================

  const refresh = async () => {
    try {
      setLoading(true);

      const response = await getBlogs();

      setBlogs(normalize(response));
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to load blogs"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  // ======================================================
  // IMAGE CHANGE
  // ======================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      e.target.value = "";
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setImagePreview(URL.createObjectURL(file));
  };

  // ======================================================
  // REMOVE IMAGE
  // ======================================================

  const removeSelectedImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));

    setImagePreview("");

    const input = document.getElementById("blog-image");

    if (input) {
      input.value = "";
    }
  };

  // ======================================================
  // RESET FORM
  // ======================================================

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      excerpt: "",
      content: "",
      image: null,
      author: "Trestep",
      isPublished: true,
    });

    setImagePreview("");

    const input = document.getElementById("blog-image");

    if (input) {
      input.value = "";
    }
  };

  // ======================================================
  // CLOSE FORM
  // ======================================================

  const closeForm = () => {
    if (saving) {
      return;
    }

    setShowForm(false);
    resetForm();
  };

  // ======================================================
  // INPUT CHANGE
  // ======================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================================================
  // SUBMIT
  // ======================================================

  const submit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      return toast.error("Please enter blog title.");
    }

    if (!formData.category.trim()) {
      return toast.error("Please enter blog category.");
    }

    if (!formData.image) {
      return toast.error("Please select a blog image.");
    }

    if (!formData.excerpt.trim()) {
      return toast.error("Please enter short description.");
    }

    if (!formData.content.trim()) {
      return toast.error("Please enter blog content.");
    }

    try {
      setSaving(true);

      const data = new FormData();

      data.append(
        "title",
        formData.title.trim()
      );

      data.append(
        "category",
        formData.category.trim()
      );

      data.append(
        "excerpt",
        formData.excerpt.trim()
      );

      data.append(
        "content",
        formData.content.trim()
      );

      data.append(
        "author",
        formData.author.trim() || "Trestep"
      );

      data.append(
        "isPublished",
        formData.isPublished
      );

      data.append("image", formData.image);

      await createBlog(data);

      toast.success("Blog created successfully.");

      setShowForm(false);
      resetForm();

      await refresh();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Could not create blog"
      );
    } finally {
      setSaving(false);
    }
  };

  // ======================================================
  // DELETE
  // ======================================================

  const remove = async (id) => {
    if (!window.confirm("Delete this blog?")) {
      return;
    }

    try {
      await deleteBlog(id);

      await refresh();

      toast.success("Blog deleted.");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Could not delete blog"
      );
    }
  };

  // ======================================================
  // OPEN FORM
  // ======================================================

  const openForm = () => {
    resetForm();
    setShowForm(true);
  };

  return (
    <div>
      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div>
          <p className="text-sm uppercase tracking-widest text-lime-400">
            Content Management
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Blogs
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create and manage database-backed blog posts.
          </p>
        </div>

        <button
          type="button"
          onClick={openForm}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-5 py-3 font-semibold text-black transition hover:bg-lime-300"
        >
          <FiPlus />
          Add Blog
        </button>
      </div>

      {/* ==================================================
          CREATE BLOG MODAL
      ================================================== */}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6">
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl">
            {/* ==================================================
                MODAL HEADER
            ================================================== */}

            <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-xl font-bold">
                  Create Blog
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Add a new article to your Trestep website.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            {/* ==================================================
                SCROLLABLE FORM AREA
            ================================================== */}

            <div className="overflow-y-auto">
              <form
                onSubmit={submit}
                className="space-y-5 p-5 sm:p-6"
              >
                {/* ==================================================
                    TITLE + CATEGORY
                ================================================== */}

                <div className="grid gap-5 md:grid-cols-2">
                  {/* TITLE */}

                  <div>
                    <label
                      htmlFor="blog-title"
                      className="mb-2 block text-sm font-medium text-gray-300"
                    >
                      Blog Title
                    </label>

                    <input
                      id="blog-title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="How to Choose the Right Running Shoes"
                      className="admin-input"
                    />
                  </div>

                  {/* CATEGORY */}

                  <div>
                    <label
                      htmlFor="blog-category"
                      className="mb-2 block text-sm font-medium text-gray-300"
                    >
                      Category
                    </label>

                    <input
                      id="blog-category"
                      name="category"
                      type="text"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="Footwear Guide"
                      className="admin-input"
                    />
                  </div>
                </div>

                {/* ==================================================
                    FEATURED IMAGE
                ================================================== */}

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-300">
                      Featured Image
                    </label>

                    <span className="text-xs text-gray-600">
                      Max 5MB
                    </span>
                  </div>

                  {!imagePreview ? (
                    <label
                      htmlFor="blog-image"
                      className="flex min-h-[170px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/20 px-5 py-8 text-center transition hover:border-lime-400/40 hover:bg-white/[0.02]"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-400/10">
                        <FiUpload className="text-2xl text-lime-400" />
                      </div>

                      <p className="mt-3 text-sm font-medium text-gray-300">
                        Upload Featured Image
                      </p>

                      <p className="mt-1 text-xs text-gray-600">
                        JPG, PNG or WEBP
                      </p>

                      <input
                        id="blog-image"
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                      <div className="relative overflow-hidden rounded-lg">
                        <img
                          src={imagePreview}
                          alt="Blog preview"
                          className="h-52 w-full object-cover sm:h-60"
                        />

                        <button
                          type="button"
                          onClick={removeSelectedImage}
                          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/75 text-white transition hover:bg-red-500"
                        >
                          <FiX />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm text-gray-300">
                            {formData.image?.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-600">
                            Image selected
                          </p>
                        </div>

                        <label
                          htmlFor="blog-image"
                          className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-gray-300 transition hover:bg-white/5 hover:text-white"
                        >
                          <FiImage />
                          Change

                          <input
                            id="blog-image"
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* ==================================================
                    EXCERPT
                ================================================== */}

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="blog-excerpt"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Short Description
                    </label>

                    <span className="text-xs text-gray-600">
                      {formData.excerpt.length}/300
                    </span>
                  </div>

                  <textarea
                    id="blog-excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    maxLength={300}
                    rows={3}
                    placeholder="Write a short description that will appear on the blog listing..."
                    className="admin-input resize-none"
                  />
                </div>

                {/* ==================================================
                    CONTENT
                ================================================== */}

                <div>
                  <label
                    htmlFor="blog-content"
                    className="mb-2 block text-sm font-medium text-gray-300"
                  >
                    Blog Content
                  </label>

                  <textarea
                    id="blog-content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows={7}
                    placeholder="Write your complete blog article here..."
                    className="admin-input min-h-[180px] resize-y"
                  />

                  <p className="mt-1 text-xs text-gray-600">
                    Write the complete article content here.
                  </p>
                </div>

                {/* ==================================================
                    AUTHOR
                ================================================== */}

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="blog-author"
                      className="mb-2 block text-sm font-medium text-gray-300"
                    >
                      Author
                    </label>

                    <input
                      id="blog-author"
                      name="author"
                      type="text"
                      value={formData.author}
                      onChange={handleChange}
                      placeholder="Trestep"
                      className="admin-input"
                    />
                  </div>

                  {/* PUBLISH */}

                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-300">
                      Publishing
                    </p>

                    <label className="flex h-[50px] cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4">
                      <input
                        type="checkbox"
                        checked={formData.isPublished}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            isPublished:
                              e.target.checked,
                          }))
                        }
                        className="h-4 w-4 accent-lime-400"
                      />

                      <div>
                        <p className="text-sm text-gray-300">
                          Publish immediately
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </form>
            </div>

            {/* ==================================================
                MODAL FOOTER
            ================================================== */}

            <div className="flex shrink-0 items-center justify-end gap-3 border-t border-white/10 bg-zinc-950 px-5 py-4 sm:px-6">
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                form="blog-form"
                disabled={saving}
                onClick={submit}
                className="rounded-xl bg-lime-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Uploading..."
                  : "Create Blog"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          BLOG LIST
      ================================================== */}

      {loading ? (
        <p className="mt-8 text-gray-500">
          Loading blogs...
        </p>
      ) : blogs.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-zinc-950 p-10 text-center">
          <FiFileText className="mx-auto text-4xl text-gray-600" />

          <h2 className="mt-4 text-xl font-semibold">
            No blogs yet
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Create your first blog post.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => {
            const id = blog._id || blog.id;

            return (
              <article
                key={id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950"
              >
                {blog.image ? (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-48 w-full items-center justify-center bg-zinc-900">
                    <FiFileText className="text-4xl text-lime-400" />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <FiFileText className="text-2xl text-lime-400" />

                    <span className="rounded-full bg-lime-400/10 px-3 py-1 text-xs text-lime-400">
                      {blog.isPublished
                        ? "Published"
                        : "Draft"}
                    </span>
                  </div>

                  <p className="mt-5 text-xs uppercase tracking-wider text-gray-600">
                    {blog.category}
                  </p>

                  <h2 className="mt-2 line-clamp-2 text-xl font-bold">
                    {blog.title}
                  </h2>

                  {blog.excerpt && (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                      {blog.excerpt}
                    </p>
                  )}

                  <p className="mt-4 text-xs text-gray-600">
                    By {blog.author || "Trestep"}
                  </p>

                  <button
                    type="button"
                    onClick={() => remove(id)}
                    className="mt-6 flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 transition hover:text-red-400"
                  >
                    <FiTrash2 />
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;