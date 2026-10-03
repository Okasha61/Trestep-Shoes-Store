import express from "express";

import {
  signup,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ======================================================
// AUTH
// ======================================================

router.post(
  "/signup",
  signup
);

router.post(
  "/login",
  login
);

// ======================================================
// CURRENT USER
// ======================================================

router.get(
  "/me",
  authMiddleware,
  getMe
);

// ======================================================
// PROFILE
// ======================================================

router.put(
  "/profile",
  authMiddleware,
  updateProfile
);

// ======================================================
// CHANGE PASSWORD
// ======================================================

router.put(
  "/change-password",
  authMiddleware,
  changePassword
);

// ======================================================
// FORGOT PASSWORD
// ======================================================

router.post(
  "/forgot-password",
  forgotPassword
);

// ======================================================
// RESET PASSWORD
// ======================================================

router.post(
  "/reset-password/:token",
  resetPassword
);

export default router;