import User from "../models/User.js";

import {
  hashPassword,
  comparePassword,
} from "../utils/hashPassword.js";

import generateToken from "../utils/generateToken.js";

import crypto from "crypto";

import { sendEmail } from "../services/emailService.js";

// ======================================================
// HELPERS
// ======================================================

const normalizeEmail = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase();
};

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  );
};

const sanitizeUser = (user) => {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
};

// ======================================================
// SIGNUP
// ======================================================

export const signup = async (
  req,
  res
) => {
  try {
    const {
      username,
      email,
      password,
    } = req.body;

    const cleanUsername =
      String(username || "").trim();

    const normalizedEmail =
      normalizeEmail(email);

    const cleanPassword =
      String(password || "");

    if (
      !cleanUsername ||
      !normalizedEmail ||
      !cleanPassword
    ) {
      return res.status(400).json({
        message:
          "Username, email and password are required",
      });
    }

    if (
      cleanUsername.length < 3
    ) {
      return res.status(400).json({
        message:
          "Username must be at least 3 characters",
      });
    }

    if (
      cleanUsername.length > 50
    ) {
      return res.status(400).json({
        message:
          "Username cannot exceed 50 characters",
      });
    }

    if (
      !isValidEmail(normalizedEmail)
    ) {
      return res.status(400).json({
        message:
          "Please enter a valid email address",
      });
    }

    if (
      cleanPassword.length < 6
    ) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters",
      });
    }

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {
      return res.status(409).json({
        message:
          "Email already registered",
      });
    }

    const hashedPassword =
      await hashPassword(
        cleanPassword
      );

    const user = await User.create({
      username: cleanUsername,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token =
      generateToken(user._id);

    return res.status(201).json({
      message:
        "Signup successful",

      token,

      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error(
      "Signup error:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        message:
          "Email already registered",
      });
    }

    if (
      error.name ===
      "ValidationError"
    ) {
      return res.status(400).json({
        message:
          Object.values(
            error.errors
          )
            .map(
              (item) =>
                item.message
            )
            .join(", "),
      });
    }

    return res.status(500).json({
      message:
        "Failed to create account",
    });
  }
};

// ======================================================
// LOGIN
// ======================================================

export const login = async (
  req,
  res
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const normalizedEmail =
      normalizeEmail(email);

    const cleanPassword =
      String(password || "");

    if (
      !normalizedEmail ||
      !cleanPassword
    ) {
      return res.status(400).json({
        message:
          "Email and password are required",
      });
    }

    if (
      !isValidEmail(
        normalizedEmail
      )
    ) {
      return res.status(400).json({
        message:
          "Please enter a valid email address",
      });
    }

    const user =
      await User.findOne({
        email: normalizedEmail,
      });

    if (!user) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    const passwordMatch =
      await comparePassword(
        cleanPassword,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    const token =
      generateToken(user._id);

    return res.status(200).json({
      message:
        "Login successful",

      token,

      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to login",
    });
  }
};

// ======================================================
// GET ME
// ======================================================

export const getMe = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.user._id
      ).select("-password");

    if (!user) {
      return res.status(404).json({
        message:
          "User not found",
      });
    }

    return res.status(200).json({
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error(
      "Get me error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to get user",
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

    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {
      return res.status(404).json({
        message:
          "User not found",
      });
    }

    // ==================================================
    // USERNAME
    // ==================================================

    if (username !== undefined) {
      if (
        typeof username !==
        "string"
      ) {
        return res.status(400).json({
          message:
            "Name must be a valid text value",
        });
      }

      const trimmedUsername =
        username.trim();

      if (!trimmedUsername) {
        return res.status(400).json({
          message:
            "Name is required",
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

      user.username =
        trimmedUsername;
    }

    // ==================================================
    // EMAIL
    // ==================================================

    if (email !== undefined) {
      if (
        typeof email !== "string"
      ) {
        return res.status(400).json({
          message:
            "Email must be a valid text value",
        });
      }

      const normalizedEmail =
        normalizeEmail(email);

      if (!normalizedEmail) {
        return res.status(400).json({
          message:
            "Email is required",
        });
      }

      if (
        !isValidEmail(
          normalizedEmail
        )
      ) {
        return res.status(400).json({
          message:
            "Please enter a valid email address",
        });
      }

      const existingUser =
        await User.findOne({
          email:
            normalizedEmail,

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

      user.email =
        normalizedEmail;
    }

    await user.save();

    return res.status(200).json({
      message:
        "Profile updated successfully",

      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error(
      "Update profile error:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        message:
          "Email already registered",
      });
    }

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

    const current =
      String(
        currentPassword || ""
      );

    const nextPassword =
      String(
        newPassword || ""
      );

    if (
      !current ||
      !nextPassword
    ) {
      return res.status(400).json({
        message:
          "Current password and new password are required",
      });
    }

    if (
      nextPassword.length < 6
    ) {
      return res.status(400).json({
        message:
          "New password must be at least 6 characters",
      });
    }

    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {
      return res.status(404).json({
        message:
          "User not found",
      });
    }

    const passwordMatch =
      await comparePassword(
        current,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        message:
          "Current password is incorrect",
      });
    }

    const samePassword =
      await comparePassword(
        nextPassword,
        user.password
      );

    if (samePassword) {
      return res.status(400).json({
        message:
          "New password must be different from current password",
      });
    }

    const hashedPassword =
      await hashPassword(
        nextPassword
      );

    user.password =
      hashedPassword;

    user.resetPasswordToken =
      null;

    user.resetPasswordExpires =
      null;

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
    const { email } =
      req.body;

    const normalizedEmail =
      normalizeEmail(email);

    if (!normalizedEmail) {
      return res.status(400).json({
        message:
          "Email is required",
      });
    }

    if (
      !isValidEmail(
        normalizedEmail
      )
    ) {
      return res.status(400).json({
        message:
          "Please enter a valid email address",
      });
    }

    const genericMessage =
      "If an account exists with this email, a reset link has been sent";

    const user =
      await User.findOne({
        email:
          normalizedEmail,
      });

    if (!user) {
      return res.status(200).json({
        message:
          genericMessage,
      });
    }

    const resetToken =
      crypto
        .randomBytes(32)
        .toString("hex");

    const hashedResetToken =
      crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    user.resetPasswordToken =
      hashedResetToken;

    user.resetPasswordExpires =
      new Date(
        Date.now() +
          15 * 60 * 1000
      );

    await user.save();

    const clientUrl =
      String(
        process.env.CLIENT_URL ||
          ""
      ).replace(
        /\/$/,
        ""
      );

    if (!clientUrl) {
      console.error(
        "CLIENT_URL is not configured"
      );

      user.resetPasswordToken =
        null;

      user.resetPasswordExpires =
        null;

      await user.save();

      return res.status(500).json({
        message:
          "Password reset service is not configured",
      });
    }

    const resetUrl =
      `${clientUrl}/reset-password/${resetToken}`;

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

    try {
      await sendEmail({
        to: user.email,
        subject:
          "Trestep Password Reset",
        html: emailHtml,
      });
    } catch (emailError) {
      console.error(
        "Password reset email error:",
        emailError
      );

      user.resetPasswordToken =
        null;

      user.resetPasswordExpires =
        null;

      await user.save();

      return res.status(500).json({
        message:
          "Failed to send password reset email",
      });
    }

    return res.status(200).json({
      message:
        genericMessage,
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
    const { token } =
      req.params;

    const {
      password,
    } = req.body;

    const cleanPassword =
      String(password || "");

    if (!token) {
      return res.status(400).json({
        message:
          "Reset token is required",
      });
    }

    if (!cleanPassword) {
      return res.status(400).json({
        message:
          "Password is required",
      });
    }

    if (
      cleanPassword.length < 6
    ) {
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

    const user =
      await User.findOne({
        resetPasswordToken:
          hashedToken,

        resetPasswordExpires: {
          $gt: new Date(),
        },
      });

    if (!user) {
      return res.status(400).json({
        message:
          "Invalid or expired reset token",
      });
    }

    const hashedPassword =
      await hashPassword(
        cleanPassword
      );

    user.password =
      hashedPassword;

    user.resetPasswordToken =
      null;

    user.resetPasswordExpires =
      null;

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