import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRoute from "./routes/health.route.js";
import authRoutes from "./routes/auth.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/health", healthRoute);
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);

export default app;

