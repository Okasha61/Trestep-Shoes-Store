import express from "express";
import {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/adminController.js";
import { getAllReviews } from "../controllers/reviewController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get("/dashboard", getDashboardStats);
router.get("/orders", getAllOrders);
router.put("/orders/:id", updateOrderStatus);
router.get("/reviews", getAllReviews);

export default router;
