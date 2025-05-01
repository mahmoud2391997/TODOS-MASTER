const express = require("express")
const { register, login, getCurrentUser } = require("../controllers/authController")
const { authenticateToken } = require("../middleware/authMiddleware")

const router = express.Router()

// Public routes
router.post("/register", register)
router.post("/login", login)

// Protected routes
router.get("/me", authenticateToken, getCurrentUser)

// Add a test route to verify the router is working
router.get("/test", (req, res) => {
  res.status(200).json({ message: "Auth routes working" })
})

module.exports = router
