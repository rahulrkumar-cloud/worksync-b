import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { connectDB } from "./config/db";
import { router as userRoutes } from "./routes/userRoutes";
import dotenv from "dotenv";

const app = express();

dotenv.config();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Add a root route for "/"
app.get("/", (req, res) => {
  res.send("🚀 Express API is running on Vercel!");
});

// Routes
app.use("/users", userRoutes);

// Connect to DB when function runs
connectDB().catch((err) => console.error("❌ Database connection failed:", err));

// Export app for Vercel (No app.listen())
export default app;