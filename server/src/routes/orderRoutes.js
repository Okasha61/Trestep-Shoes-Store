import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createOrder);
router.get("/my-orders", getMyOrders);
router.put("/:id/cancel", cancelOrder);
router.get("/:id", getOrderById);

export default router;
