const mongoose = require("mongoose")
const { Schema, Types } = mongoose

// Add this above your existing interfaces
// ITodoInput interface is not needed in JavaScript

// Keep your existing IToDoItem interface
// IToDoItem interface is not needed in JavaScript

const ToDoItemSchema = new Schema({
  title: { type: String, required: [true, "Title is required"], trim: true },
  description: { type: String, trim: true, default: "" },
  status: { type: String, enum: ["completed", "pending"], default: "pending" },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  tags: { type: [String], default: [] },
})

// IUser interface is not needed in JavaScript

const UserSchema = new Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    phone: { type: String, trim: true, default: "" },
    todoList: [ToDoItemSchema],
  },
  { timestamps: true },
)

const UserModel = mongoose.model("User", UserSchema)

// Extend Express Request type
// TypeScript-specific declaration is not needed in JavaScript

module.exports = { UserModel }
