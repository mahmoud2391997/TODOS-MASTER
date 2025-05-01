const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connectDB = require("./config/mongodb")
const authRoutes = require("./routes/authRoute")
const todoRoutes = require("./routes/todoRoute")
const userRoutes = require("./routes/userRoute")
const morgan = require("morgan") // Added for HTTP request logging
const { AppError } = require("./utils/errorHandler")

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Logging middleware
app.use(morgan("dev")) // 'dev' format gives concise output

// Body parsers
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Replace the current CORS configuration with this more permissive one for development
// CORS configuration
app.use(
  cors({
    origin: "*", // Allow all origins during development
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

// Connect to MongoDB
connectDB()

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/todos", todoRoutes)
app.use("/api/user", userRoutes)

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" })
})

// 404 handler - for routes that don't exist
app.use((req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404))
})

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err)

  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Server Error"

  res.status(statusCode).json({
    success: false,
    status: err.status || "error",
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  })
})

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err)
  // Close server & exit process
  server.close(() => {
    process.exit(1)
  })
})

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err)
  // Close server & exit process
  server.close(() => {
    process.exit(1)
  })
})

module.exports = app // Export for testing
