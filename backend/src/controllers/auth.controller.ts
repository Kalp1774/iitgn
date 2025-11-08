// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { prisma } from "../utils/prisma.js";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email and password are required" });
    }

    // Validate role if provided
    const validRoles = ["ADMIN", "HR", "EMPLOYEE"];
    if (role && !validRoles.includes(role.toUpperCase())) {
      return res.status(400).json({ error: "Invalid role. Must be ADMIN, HR, or EMPLOYEE" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: role ? (role.toUpperCase() as "ADMIN" | "HR" | "EMPLOYEE") : undefined
      },
      select: { id: true, name: true, email: true, role: true, created_at: true }
    });

    return res.status(201).json({ user });
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email and password required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await comparePassword(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function profile(req: Request, res: Response) {
  // auth middleware attaches req.userId
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, created_at: true }
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json({ user });
  } catch (err) {
    console.error("profile error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

