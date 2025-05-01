const bcrypt = require("bcryptjs")
const { UserModel } = require("../models/dataModels")
const { AppError } = require("../utils/errorHandler")

// Get user profile
exports.getUserProfile = async (req, res, next) => {
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

// Update user profile
exports.updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user?.userId
    const { name, phone, avatar, bio } = req.body

    const user = await UserModel.findById(userId)
    if (!user) {
      throw new AppError("User not found", 404)
    }

    // Update fields if provided
    if (name) user.name = name
    if (phone !== undefined) user.phone = phone

    await user.save()

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
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

// Change password
exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.user?.userId
    const { currentPassword, newPassword } = req.body

    // Validate input
    if (!currentPassword || !newPassword) {
      throw new AppError("Current password and new password are required", 400)
    }

    if (newPassword.length < 6) {
      throw new AppError("Password must be at least 6 characters", 400)
    }

    // Find user with password
    const user = await UserModel.findById(userId).select("+password")
    if (!user) {
      throw new AppError("User not found", 404)
    }

    // Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      throw new AppError("Current password is incorrect", 401)
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)

    await user.save()

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    })
  } catch (error) {
    next(error)
  }
}

// Delete user account
exports.deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user?.userId
    const { password } = req.body

    // Validate input
    if (!password) {
      throw new AppError("Password is required to delete account", 400)
    }

    // Find user with password
    const user = await UserModel.findById(userId).select("+password")
    if (!user) {
      throw new AppError("User not found", 404)
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      throw new AppError("Password is incorrect", 401)
    }

    // Delete user
    await UserModel.findByIdAndDelete(userId)

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}

// Get user statistics
exports.getUserStats = async (req, res, next) => {
  try {
    const userId = req.user?.userId

    const user = await UserModel.findById(userId)
    if (!user) {
      throw new AppError("User not found", 404)
    }

    const totalTodos = user.todoList.length
    const completedTodos = user.todoList.filter((todo) => todo.status === "completed").length
    const pendingTodos = totalTodos - completedTodos

    // Get todos due today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const dueTodayCount = user.todoList.filter((todo) => {
      if (!todo.dueDate) return false
      const dueDate = new Date(todo.dueDate)
      return dueDate >= today && dueDate < tomorrow && todo.status !== "completed"
    }).length

    // Get overdue todos
    const overdueCount = user.todoList.filter((todo) => {
      if (!todo.dueDate) return false
      const dueDate = new Date(todo.dueDate)
      return dueDate < today && todo.status !== "completed"
    }).length

    res.status(200).json({
      success: true,
      data: {
        totalTodos,
        completedTodos,
        pendingTodos,
        completionRate: totalTodos ? Math.round((completedTodos / totalTodos) * 100) : 0,
        dueTodayCount,
        overdueCount,
      },
    })
  } catch (error) {
    next(error)
  }
}
