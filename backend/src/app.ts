import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRoute from "./routes/health.route.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/health", healthRoute);
app.use("/api/auth", authRoutes);

export default app;

