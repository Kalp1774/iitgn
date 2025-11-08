// src/routes/employee.routes.ts
import { Router } from "express";
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employee.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// All routes are protected with JWT authentication
router.use(authMiddleware);

router.get("/", getEmployees);
router.get("/:id", getEmployeeById);
router.post("/", createEmployee);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;

