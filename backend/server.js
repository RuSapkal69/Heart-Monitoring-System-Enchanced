import express, { json } from "express";
import { connect } from "mongoose";
import cors from "cors";
import { config } from "dotenv";
import authRoutes from "./routes/auth.js"; // Updated to include .js extension
import readingRoutes from "./routes/readings.js"; // Updated to include .js extension

// Load environment variables
config();

// Create Express app
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Vite default port
    credentials: true,
  }),
);
app.use(json());

// Connect to MongoDB
connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/readings", readingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT; // Updated to use the correct port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
