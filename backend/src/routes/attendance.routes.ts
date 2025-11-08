// src/routes/attendance.routes.ts
import { Router } from "express";
import {
  checkIn,
  checkOut,
  getAttendanceByEmployee,
  getAttendanceByDate,
} from "../controllers/attendance.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// Protect all routes with JWT authentication
router.use(authMiddleware);

// Check-in / Check-out
router.post("/checkin", checkIn);
router.post("/checkout", checkOut);

// Queries
router.get("/employee/:employeeId", getAttendanceByEmployee);
router.get("/date", getAttendanceByDate); // query param: ?date=2025-11-08

export default router;

