import api from "./api";

// ==========================================
// GET CATEGORIES
// ==========================================
export const getCategories = async () => {
  const response =
    await api.get("/categories");

  return response.data;
};

// ==========================================
// CREATE CATEGORY
// ==========================================
export const createCategory = async (
  formData
) => {
  const response =
    await api.post(
      "/categories",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

  return response.data;
};

// ==========================================
// UPDATE CATEGORY
// ==========================================
export const updateCategory = async (
  id,
  formData
) => {
  const response =
    await api.put(
      `/categories/${id}`,
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

  return response.data;
};

// ==========================================
// DELETE CATEGORY
// ==========================================
export const deleteCategory = async (
  id
) => {
  const response =
    await api.delete(
      `/categories/${id}`
    );

  return response.data;
};