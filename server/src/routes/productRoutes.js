import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import { uploadProductImages } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  uploadProductImages,
  createProduct
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  uploadProductImages,
  updateProduct
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteProduct
);

export default router;
