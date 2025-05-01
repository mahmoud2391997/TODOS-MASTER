const jwt = require("jsonwebtoken")
const { AppError } = require("../utils/errorHandler")
require("dotenv").config()
const authenticateToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers["authorization"]
    const token = authHeader?.split(" ")[1] // Format: Bearer <token>

    if (!token) {
      return next(new AppError("Access token missing", 401))
    }

    // Log for debugging (remove in production)
    console.log("Authenticating with token:", token.substring(0, 10) + "...")

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      
      if (err) {
        console.error("Token verification error:", err.name, err.message)

        if (err.name === "TokenExpiredError") {
          return next(new AppError("Token expired", 401))
        }
        return next(new AppError("Invalid token", 403))
      }

      // Set user info in request
      req.user = decoded
      console.log("Authentication successful for user:", decoded.userId)
      next()
    })
  } catch (error) {
    console.error("Authentication error:", error)
    next(new AppError("Authentication error", 500))
  }
}

module.exports = { authenticateToken }
