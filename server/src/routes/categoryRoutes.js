import express from "express";

import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

import {
  uploadCategoryImage,
} from "../middleware/uploadMiddleware.js";

const router =
  express.Router();

// ==========================================
// PUBLIC
// ==========================================

router.get(
  "/",
  getCategories
);

// ==========================================
// ADMIN
// ==========================================

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  uploadCategoryImage,
  createCategory
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  uploadCategoryImage,
  updateCategory
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteCategory
);

export default router;