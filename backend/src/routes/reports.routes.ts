// src/routes/reports.routes.ts
import { Router } from "express";
import { attendanceSummary, payrollSummary } from "../controllers/reports.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// Protect all routes with JWT authentication
router.use(authMiddleware);

router.get("/attendance-summary", attendanceSummary);
router.get("/payroll-summary", payrollSummary);

export default router;

