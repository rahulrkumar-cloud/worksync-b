import express from "express";
import { getUsers, getUserById, createUser, loginUser, updateUser, deleteUser } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, getUsers);  // 🔒 Protected Route
router.get("/:id", authMiddleware, getUserById); // 🔒 Protected Route
router.post("/register", createUser);
router.post("/login", loginUser);
router.put("/:id", authMiddleware, updateUser); // 🔒 Protected Route
router.delete("/:id", authMiddleware, deleteUser); // 🔒 Protected Route

export { router };
