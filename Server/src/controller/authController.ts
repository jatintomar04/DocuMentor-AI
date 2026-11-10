
import type { Request, Response } from "express";
import User from "../model/authModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Generate JWT token
const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing from environment variables");
  }

  return jwt.sign(
    { id },
    secret,
    { expiresIn: "30d" }
  );
};

// Register user
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, phone, password } = req.body;

    // 1. Validate fields
    if (!name || !email || !phone || !password) {
      res.status(400).json({
        message: "Please fill all details",
      });
      return;
    }

    // 2. Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(409).json({
        message: "User already registered",
      });
      return;
    }

    // 3. Hash password asynchronously
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user
    const userCreated = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    // 5. Generate token for newly created user
    const token = generateToken(userCreated._id.toString());

    // 6. Send response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: userCreated._id,
        name: userCreated.name,
        email: userCreated.email,
        phone: userCreated.phone,
      },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);

    // MongoDB duplicate-key error
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      res.status(409).json({
        message: "Email or phone already registered",
      });
      return;
    }

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Login user
export const loginUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 1. Validate fields
    if (!email || !password) {
      res.status(400).json({
        message: "Please fill all details",
      });
      return;
    }

    // 2. Find user
    const findUser = await User.findOne({ email });

    if (!findUser) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    // 3. Compare entered password with stored hash
    const checkPassword = await bcrypt.compare(
      password,
      findUser.password
    );

    if (!checkPassword) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    // 4. Generate token for logged-in user
    const token = generateToken(findUser._id.toString());

    // 5. Send response
    res.status(200).json({
      message: "Login successful",
      user: {
        id: findUser._id,
        name: findUser.name,
        email: findUser.email,
        phone: findUser.phone,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};


export default {registerUser, loginUser}