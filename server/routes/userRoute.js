const express = require("express")
const {
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteAccount,
  getUserStats,
} = require("../controllers/usersController")
const { authenticateToken } = require("../middleware/authMiddleware")

const router = express.Router()

// Protect all user routes
router.use(authenticateToken)

// User routes
router.get("/profile", getUserProfile)
router.put("/profile", updateUserProfile)
router.put("/change-password", changePassword)
router.delete("/", deleteAccount)
router.get("/stats", getUserStats)

module.exports = router
