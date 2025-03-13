const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const Joi = require("joi");
const connectDB = require("./config/db"); // Ensure this points to the correct file
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

// Load environment variables
dotenv.config();

// Validate required environment variables
const envSchema = Joi.object({
  PORT: Joi.number().default(5000),
  MONGO_URI: Joi.string().required().description("MongoDB connection string"),
  NODE_ENV: Joi.string().valid("development", "production", "test").default("development"),
}).unknown(); // Allow extra env variables

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  console.error("❌ Invalid environment variables:", error.message);
  process.exit(1); // Exit if validation fails
}

// Connect to the database
const connectToDB = async () => {
  try {
    await connectDB(); // Assuming connectDB is async
    console.log("🚀 Successfully connected to the database");
  } catch (err) {
    console.error("❌ Failed to connect to the database:", err.message);
    process.exit(1); // Exit if DB connection fails
  }
};

connectToDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: process.env.NODE_ENV === "production", // Enable CSP only in production
    crossOriginEmbedderPolicy: true,
  })
);
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Default route for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// Start server
const PORT = envVars.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection:", reason);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err.message);
  process.exit(1); // Exit to prevent undefined state
});
