// src/routes/leave.routes.ts
import { Router } from "express";
import {
  applyLeave,
  getAllLeaves,
  getLeavesByEmployee,
  reviewLeave,
  getLeaveById,
} from "../controllers/leave.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// Protect all routes with JWT authentication
router.use(authMiddleware);

// Apply for leave
router.post("/", applyLeave);

// Get all leaves (with optional filters: ?status=PENDING&type=SICK)
router.get("/", getAllLeaves);

// Get leave by ID
router.get("/:id", getLeaveById);

// Get leaves by employee (with optional filter: ?status=PENDING)
router.get("/employee/:employeeId", getLeavesByEmployee);

// Review leave (approve/reject) - HR/Admin only
router.put("/:id/review", reviewLeave);

export default router;

