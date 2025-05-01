const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    // Remove deprecated options and add connection options
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "to-do",
    })

    console.log(`MongoDB connected: ${conn.connection.host} ✅`)
  } catch (err) {
    console.error(`MongoDB connection error ❌: ${err.message}`)
    // Log more details about the error
    if (err.name === "MongoParseError") {
      console.error("Invalid MongoDB connection string. Please check your MONGO_URI environment variable.")
    } else if (err.name === "MongoServerSelectionError") {
      console.error("Could not connect to any MongoDB server. Please check if MongoDB is running.")
    }

    // Exit with failure
    process.exit(1)
  }
}

module.exports = connectDB
