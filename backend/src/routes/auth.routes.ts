// src/routes/auth.routes.ts
import { Router } from "express";
import { register, login, profile } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, profile);

export default router;

