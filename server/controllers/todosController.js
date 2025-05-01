const { Types } = require("mongoose")
const { UserModel } = require("../models/dataModels")
const { AppError } = require("../utils/errorHandler")

// Create a new ToDo item
exports.createTodo = async (req, res, next) => {
  try {
    const { title, description, dueDate, status, tags } = req.body
    const userId = req.user?.userId

    if (!title) throw new AppError("Title is required", 400)
    if (!userId || !Types.ObjectId.isValid(userId)) throw new AppError("Invalid user ID", 400)

    const user = await UserModel.findById(userId)
    if (!user) throw new AppError("User not found", 404)

    const newTodo = {
      title,
      description: description || "",
      dueDate: dueDate ? new Date(dueDate) : undefined,
      status: status || "pending",
      tags: tags || [],
    }

    user.todoList.push(newTodo)
    await user.save()

    res.status(201).json({
      success: true,
      message: "ToDo created successfully",
      data: newTodo,
    })
  } catch (error) {
    next(error)
  }
}

// Get all ToDos for a user with pagination and filtering
exports.getTodos = async (req, res, next) => {
  try {
    const userId = req.user?.userId
    const { status, search, tags, page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = req.query

    const user = await UserModel.findById(userId).select("todoList")
    if (!user) {
      throw new AppError("User not found", 404)
    }

    let todos = [...user.todoList]

    if (status && (status === "completed" || status === "pending")) {
      todos = todos.filter((todo) => todo.status === status)
    }

    if (search && typeof search === "string") {
      const searchTerm = search.toLowerCase()
      todos = todos.filter(
        (todo) =>
          todo.title.toLowerCase().includes(searchTerm) ||
          (todo.description && todo.description.toLowerCase().includes(searchTerm)),
      )
    }

    if (tags && typeof tags === "string") {
      const tagArray = tags.split(",")
      todos = todos.filter((todo) => todo.tags && todo.tags.some((tag) => tagArray.includes(tag)))
    }

    const sortField = typeof sortBy === "string" ? sortBy : "createdAt"
    const order = sortOrder === "asc" ? 1 : -1

    todos.sort((a, b) => {
      if (sortField === "dueDate") {
        if (!a.dueDate) return order === 1 ? 1 : -1
        if (!b.dueDate) return order === 1 ? -1 : 1
        return order * (a.dueDate.getTime() - b.dueDate.getTime())
      }

      if (sortField === "title") {
        return order * a.title.localeCompare(b.title)
      }

      return order * (a.createdAt.getTime() - b.createdAt.getTime())
    })

    const pageNum = Number.parseInt(page, 10) || 1
    const limitNum = Number.parseInt(limit, 10) || 10
    const startIndex = (pageNum - 1) * limitNum
    const endIndex = pageNum * limitNum
    const total = todos.length

    const paginatedTodos = todos.slice(startIndex, endIndex)

    const pagination = {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      hasNextPage: endIndex < total,
      hasPrevPage: startIndex > 0,
    }

    res.status(200).json({
      success: true,
      count: paginatedTodos.length,
      pagination,
      data: paginatedTodos,
    })
  } catch (error) {
    next(error)
  }
}

// Get a specific ToDo
exports.getTodo = async (req, res, next) => {
  try {
    const userId = req.user?.userId
    const { todoId } = req.params

    const user = await UserModel.findById(userId)
    if (!user) {
      throw new AppError("User not found", 404)
    }

    const todo = user.todoList.find((todo) => todo._id.toString() === todoId)
    if (!todo) {
      throw new AppError("ToDo not found", 404)
    }

    res.status(200).json({
      success: true,
      data: todo,
    })
  } catch (error) {
    next(error)
  }
}

// Update a specific ToDo
exports.updateTodo = async (req, res, next) => {
  try {
    const userId = req.user?.userId
    const { todoId } = req.params
    const updates = req.body

    if (!todoId || !Types.ObjectId.isValid(todoId)) {
      throw new AppError("Invalid todo ID", 400)
    }

    const user = await UserModel.findById(userId)
    if (!user) {
      throw new AppError("User not found", 404)
    }

    const todo = user.todoList.find((todo) => todo._id.toString() === todoId)
    if (!todo) {
      throw new AppError("ToDo not found", 404)
    }

    Object.assign(todo, updates)

    if (updates.status === "completed" && !todo.completedAt) {
      todo.completedAt = new Date()
    }

    await user.save()

    res.status(200).json({
      success: true,
      message: "ToDo updated successfully",
      data: todo,
    })
  } catch (error) {
    next(error)
  }
}

// Delete a ToDo
exports.deleteTodo = async (req, res, next) => {
  try {
    const userId = req.user?.userId
    const { todoId } = req.params

    if (!Types.ObjectId.isValid(todoId)) {
      throw new AppError("Invalid todo ID", 400)
    }

    const user = await UserModel.findById(userId)
    if (!user) {
      throw new AppError("User not found", 404)
    }

    const todo = user.todoList.find((todo) => todo._id.toString() === todoId)
    if (!todo) {
      throw new AppError("ToDo not found", 404)
    }

    todo.deleteOne()
    await user.save()

    res.status(200).json({
      success: true,
      message: "ToDo deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}

// Bulk update todos (e.g., mark multiple as completed)
exports.bulkUpdateTodos = async (req, res, next) => {
  try {
    const userId = req.user?.userId
    const { todoIds, updates } = req.body

    if (!todoIds || !Array.isArray(todoIds) || todoIds.length === 0) {
      throw new AppError("Todo IDs array is required", 400)
    }

    if (!updates || Object.keys(updates).length === 0) {
      throw new AppError("Updates object is required", 400)
    }

    const user = await UserModel.findById(userId)
    if (!user) {
      throw new AppError("User not found", 404)
    }

    let updatedCount = 0

    todoIds.forEach((todoId) => {
      const todo = user.todoList.find((todo) => todo._id.toString() === todoId)
      if (todo) {
        Object.assign(todo, updates)

        if (updates.status === "completed" && !todo.completedAt) {
          todo.completedAt = new Date()
        }

        updatedCount++
      }
    })

    if (updatedCount === 0) {
      throw new AppError("No matching todos found", 404)
    }

    await user.save()

    res.status(200).json({
      success: true,
      message: `${updatedCount} todos updated successfully`,
    })
  } catch (error) {
    next(error)
  }
}
