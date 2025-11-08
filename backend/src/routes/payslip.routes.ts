// src/routes/payslip.routes.ts
import { Router } from "express";
import { getPayslipPDF } from "../controllers/payslip.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// Protect all routes with JWT authentication
router.use(authMiddleware);

router.get("/:id/pdf", getPayslipPDF);

export default router;

