import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const sqlConfig: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER as string,
  database: process.env.DB_NAME as string,
  port: parseInt(process.env.DB_PORT || "1433"),
  options: {
    encrypt: false, // Set to true if using Azure
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERT === "true",
  },
};

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

