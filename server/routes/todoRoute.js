const express = require("express")
const todosController = require("../controllers/todosController")
const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router()

// Middleware to protect all todo routes
router.use(authMiddleware.authenticateToken)

// Todo routes
router.route("/").get(todosController.getTodos).post(todosController.createTodo)

router.route("/bulk").patch(todosController.bulkUpdateTodos)

router.route("/:todoId").get(todosController.getTodo).put(todosController.updateTodo).delete(todosController.deleteTodo)

module.exports = router
