import api from "./api";

// ======================================================
// GET ALL BLOGS
// ======================================================

export const getBlogs = async () => {
  const response = await api.get("/blogs");

  return response.data;
};

// ======================================================
// GET SINGLE BLOG
// ======================================================

export const getBlogById = async (id) => {
  if (!id) {
    throw new Error("Blog ID is required");
  }

  const response = await api.get(
    `/blogs/${id}`
  );

  return response.data;
};

// ======================================================
// CREATE BLOG
// ======================================================

export const createBlog = async (data) => {
  const response = await api.post(
    "/blogs",
    data,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data;
};

// ======================================================
// UPDATE BLOG
// ======================================================

export const updateBlog = async (
  id,
  data
) => {
  if (!id) {
    throw new Error("Blog ID is required");
  }

  const response = await api.put(
    `/blogs/${id}`,
    data,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data;
};

// ======================================================
// DELETE BLOG
// ======================================================

export const deleteBlog = async (id) => {
  if (!id) {
    throw new Error("Blog ID is required");
  }

  const response = await api.delete(
    `/blogs/${id}`
  );

  return response.data;
};