// userController.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import generateToken from "../utils/generateToken"; // Adjust path as needed
import { User } from "../models/userModel"; // Adjust path as needed
import { connectDB, sql } from "../config/db"; // ✅ Keep only this import

dotenv.config(); // Load environment variables

export const getUsers = async (req, res) => {
  try {
    const pool = await connectDB();
    if (!pool) {
      return res.status(500).json({ error: "Database connection failed" });
    }

    const result = await pool.request().query("SELECT * FROM Users");
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get user by ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const pool = await connectDB();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT id, name, email FROM Users WHERE id = @id");

    if (result.recordset.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Register a user
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const pool = await connectDB();

    // 🔹 Check if the email already exists
    const existingUser = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .query("SELECT id FROM Users WHERE email = @email");

    if (existingUser.recordset.length > 0) {
      res.status(400).json({ message: "Email already exists!" });
      return;
    }

    // 🔹 Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    await pool
      .request()
      .input("name", sql.NVarChar, name)
      .input("email", sql.NVarChar, email)
      .input("password", sql.NVarChar, hashedPassword)
      .query("INSERT INTO Users (name, email, password) VALUES (@name, @email, @password)");

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// ✅ Login User
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const pool = await connectDB();

    // Include password in the query so you can compare it
    const result = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .query("SELECT id, email, name, password FROM Users WHERE email = @email");

    if (result.recordset.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Type the result as a User
    const user: User = result.recordset[0];

    // 🔹 Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // 🔹 Remove password from user object before sending it in the response
    const { password: _, ...userWithoutPassword } = user;

    // 🔹 Generate JWT token using the imported function
    const token = generateToken(user.id, user.email);

    res.json({ message: "Login successful", token, user: userWithoutPassword });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// ✅ Update user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    const pool = await connectDB();

    let hashedPassword = undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("name", sql.NVarChar, name)
      .input("email", sql.NVarChar, email)
      .input("password", sql.NVarChar, hashedPassword)
      .query(
        "UPDATE Users SET name = @name, email = @email" +
          (password ? ", password = @password" : "") +
          " WHERE id = @id"
      );

    if (result.rowsAffected[0] === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Delete user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const pool = await connectDB();

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Users WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
