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

// Routes
app.use("/users", userRoutes);

// Start Serveraca
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  } catch (error) {
    console.error("❌ Error starting server:", error);
  }
});


