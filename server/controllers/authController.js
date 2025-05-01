const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { UserModel } = require("../models/dataModels")
const { AppError } = require("../utils/errorHandler")
  require("dotenv").config()
const JWT_SECRET = process.env.JWT_SECRET;

// Register Controller
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validate input
    if (!name || !email || !password) {
      throw new AppError("Please provide name, email and password", 400);
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new AppError("User already exists with this email", 409);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      phone: phone || "",
      todoList: [],
    });
    console.log(newUser);

    // Generate token
    const token = jwt.sign({ userId: newUser._id, email: newUser.email }, JWT_SECRET, {
      expiresIn: "1d",
    });
console.log(token);

    // Send response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login Controller
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      throw new AppError("Please provide email and password", 400)
    }

    // Find user and include password
    const user = await UserModel.findOne({ email }).select("+password")
    if (!user) {
      throw new AppError("Invalid credentials", 401)
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      throw new AppError("Invalid credentials", 401)
    }
console.log("User found:", user._id, user.email)
    // Remove password from user object
    // Generate token
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
      expiresIn:  "1d",
    })

    // Send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Get current user
exports.getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user?.userId

    const user = await UserModel.findById(userId).select("-password")
    if (!user) {
      throw new AppError("User not found", 404)
    }

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    next(error)
  }
}
