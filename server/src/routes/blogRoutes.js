import express from "express";

import {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ======================================================
// PUBLIC ROUTES
// ======================================================

// Get all published blogs
router.get(
  "/",
  getBlogs
);

// Get single blog
router.get(
  "/:id",
  getBlogById
);

// ======================================================
// ADMIN ROUTES
// ======================================================

// Create blog
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  createBlog
);

// Update blog
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  updateBlog
);

// Delete blog
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteBlog
);

export default router;