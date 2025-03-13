import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

console.log("🔍 ENV VARIABLES:", {
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD ? "HIDDEN" : "NOT SET",
  DB_SERVER: process.env.DB_SERVER,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
  DB_ENCRYPT: process.env.DB_ENCRYPT,
  DB_TRUST_SERVER_CERT: process.env.DB_TRUST_SERVER_CERT,
});

export const connectDB = async () => {
  try {
    console.log("🔌 Attempting to connect to the database...");

    const config = {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      server: process.env.DB_SERVER,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || "1433", 10),
      options: {
        encrypt: process.env.DB_ENCRYPT === "true",
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERT === "true",
      },
    };

    console.log("🔄 Connecting with config:", config);

    await sql.connect(config);
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Database Connection Failed:", error);
  }
};