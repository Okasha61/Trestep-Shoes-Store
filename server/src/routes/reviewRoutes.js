import express from "express";
import {
  getProductReviews,
  checkReviewEligibility,
  createReview,
  deleteReview,
} from "../controllers/reviewController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/product/:productId", getProductReviews);
router.get("/product/:productId/eligibility", authMiddleware, checkReviewEligibility);
router.post("/product/:productId", authMiddleware, createReview);
router.delete("/:reviewId", authMiddleware, adminMiddleware, deleteReview);

export default router;
