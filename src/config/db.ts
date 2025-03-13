import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ["DB_USER", "DB_PASSWORD", "DB_SERVER", "DB_NAME"];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`❌ Missing environment variable: ${varName}`);
    process.exit(1); // Exit process if a required variable is missing
  }
});

// Debugging: Log environment variables to verify they are loaded correctly
console.log("🔍 Connecting to DB with:", {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ? "HIDDEN" : "NOT SET", // Hide password in logs
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || "1433",
  encrypt: true,
  trustServerCertificate: false,
});

// Database connection configuration
const sqlConfig: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER as string,
  database: process.env.DB_NAME as string,
  port: parseInt(process.env.DB_PORT || "1433"),
  options: {
    encrypt: true, // ✅ Required for Azure
    trustServerCertificate: false, // ✅ Must be false for Azure
  },
};

// Database connection function
export const connectDB = async () => {
  try {
    const pool = await sql.connect(sqlConfig);
    console.log("✅ Database Connected Successfully");
    return pool;
  } catch (error) {
    console.error("❌ Database Connection Failed:", error);
    throw error;
  }
};

export { sql };