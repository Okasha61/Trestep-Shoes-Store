import express from "express";

import {
  getUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get("/", getUsers);

router.get("/:id", getUserById);

router.put("/:id/role", updateUserRole);

router.delete("/:id", deleteUser);

export default router;