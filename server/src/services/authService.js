import User from "../models/User.js";
import {
  hashPassword,
  comparePassword,
} from "../utils/hashPassword.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async ({
  username,
  email,
  password,
}) => {
  const normalizedUsername = username?.trim();
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedUsername || !normalizedEmail || !password) {
    throw new Error(
      "Username, email and password are required"
    );
  }

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    username: normalizedUsername,
    email: normalizedEmail,
    password: hashedPassword,
  });

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

export const loginUser = async ({
  email,
  password,
}) => {
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({
    email: normalizedEmail,
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordCorrect = await comparePassword(
    password,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    token,
  };
};