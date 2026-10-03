import User from "../models/User.js";

import {
  hashPassword,
  comparePassword,
} from "../utils/hashPassword.js";

import generateToken from "../utils/generateToken.js";

import crypto from "crypto";

import { sendEmail } from "../services/emailService.js";

// ======================================================
// SIGNUP
// ======================================================

export const signup = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
    } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message:
          "Username, email and password are required",
      });
    }

    if (username.trim().length < 3) {
      return res.status(400).json({
        message:
          "Username must be at least 3 characters",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashedPassword =
      await hashPassword(password);

    const user = await User.create({
      username: username.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      message: "Failed to create account",
    });
  }
};

// ======================================================
// LOGIN
// ======================================================

export const login = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required",
      });
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch =
      await comparePassword(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Failed to login",
    });
  }
};

// ======================================================
// GET ME
// ======================================================

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Get me error:", error);

    return res.status(500).json({
      message: "Failed to get user",
    });
  }
};

// ======================================================
// UPDATE PROFILE
// ======================================================

export const updateProfile = async (
  req,
  res
) => {
  try {
    const {
      username,
      email,
    } = req.body;

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ----------------------------------------------
    // USERNAME
    // ----------------------------------------------

    if (username !== undefined) {
      const trimmedUsername =
        username.trim();

      if (!trimmedUsername) {
        return res.status(400).json({
          message: "Name is required",
        });
      }

      if (
        trimmedUsername.length < 3 ||
        trimmedUsername.length > 50
      ) {
        return res.status(400).json({
          message:
            "Name must be between 3 and 50 characters",
        });
      }

      user.username = trimmedUsername;
    }

    // ----------------------------------------------
    // EMAIL
    // ----------------------------------------------

    if (email !== undefined) {
      const normalizedEmail = email
        .trim()
        .toLowerCase();

      if (!normalizedEmail) {
        return res.status(400).json({
          message: "Email is required",
        });
      }

      const existingUser =
        await User.findOne({
          email: normalizedEmail,
          _id: {
            $ne: user._id,
          },
        });

      if (existingUser) {
        return res.status(409).json({
          message:
            "Email already registered",
        });
      }

      user.email = normalizedEmail;
    }

    await user.save();

    return res.status(200).json({
      message:
        "Profile updated successfully",

      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "Update profile error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update profile",
    });
  }
};

// ======================================================
// CHANGE PASSWORD
// ======================================================

export const changePassword = async (
  req,
  res
) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword
    ) {
      return res.status(400).json({
        message:
          "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check current password
    const passwordMatch =
      await comparePassword(
        currentPassword,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        message:
          "Current password is incorrect",
      });
    }

    // Prevent same password
    const samePassword =
      await comparePassword(
        newPassword,
        user.password
      );

    if (samePassword) {
      return res.status(400).json({
        message:
          "New password must be different from current password",
      });
    }

    const hashedPassword =
      await hashPassword(newPassword);

    user.password = hashedPassword;

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return res.status(200).json({
      message:
        "Password changed successfully",
    });
  } catch (error) {
    console.error(
      "Change password error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to change password",
    });
  }
};

// ======================================================
// FORGOT PASSWORD
// ======================================================

export const forgotPassword = async (
  req,
  res
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(200).json({
        message:
          "If an account exists with this email, a reset link has been sent",
      });
    }

    const resetToken =
      crypto.randomBytes(32).toString("hex");

    const hashedResetToken =
      crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    user.resetPasswordToken =
      hashedResetToken;

    user.resetPasswordExpires =
      Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetUrl =
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif;">
        <h2>Password Reset</h2>

        <p>Hello ${user.username},</p>

        <p>
          You requested to reset your password.
        </p>

        <p>
          Click the button below to reset your password:
        </p>

        <a
          href="${resetUrl}"
          style="
            display:inline-block;
            padding:12px 20px;
            background:#9cff00;
            color:#000;
            text-decoration:none;
            font-weight:bold;
            border-radius:6px;
          "
        >
          Reset Password
        </a>

        <p style="margin-top:20px;">
          This link will expire in 15 minutes.
        </p>

        <p>
          If you did not request this, you can ignore this email.
        </p>
      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: "Trestep Password Reset",
      html: emailHtml,
    });

    return res.status(200).json({
      message:
        "If an account exists with this email, a reset link has been sent",
    });
  } catch (error) {
    console.error(
      "Forgot password error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to process password reset",
    });
  }
};

// ======================================================
// RESET PASSWORD
// ======================================================

export const resetPassword = async (
  req,
  res
) => {
  try {
    const { token } = req.params;

    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters",
      });
    }

    const hashedToken =
      crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await User.findOne({
      resetPasswordToken:
        hashedToken,

      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message:
          "Invalid or expired reset token",
      });
    }

    const hashedPassword =
      await hashPassword(password);

    user.password = hashedPassword;

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return res.status(200).json({
      message:
        "Password reset successfully",
    });
  } catch (error) {
    console.error(
      "Reset password error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to reset password",
    });
  }
};