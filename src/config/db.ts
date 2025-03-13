import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

console.log("🔍 ENV VARIABLES:", {
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD ? "HIDDEN" : "NOT SET", // Hide password for security
  DB_SERVER: process.env.DB_SERVER,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
  DB_ENCRYPT: process.env.DB_ENCRYPT,
  DB_TRUST_SERVER_CERT: process.env.DB_TRUST_SERVER_CERT,
});

// Pause actual connection for debugging
export const connectDB = async () => {
  console.log("🔌 Attempting to connect to the database...");
  try {
    throw new Error("Manual test error"); // Force an error to check logs
  } catch (error) {
    console.error("❌ Database Connection Failed:", error);
    throw error; // Ensure it appears in logs
  }
};

export { sql }; // ✅ Exporting sql in case it's needed elsewhere