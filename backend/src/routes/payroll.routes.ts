// src/routes/payroll.routes.ts
import { Router } from "express";
import { generatePayroll, getPayrolls, getPayslip } from "../controllers/payroll.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// Protect all routes with JWT authentication
router.use(authMiddleware);

// Generate payroll for an employee for a month
router.post("/generate", generatePayroll); // body: { employeeId, month: "YYYY-MM" }

// Get payrolls with optional filters
router.get("/", getPayrolls); // optional query: ?employeeId=1&month=2025-11

// Get single payslip by ID
router.get("/:id", getPayslip);

export default router;

