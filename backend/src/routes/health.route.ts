import { Router } from "express";

const router = Router();

router.get("/", (_, res) => {
  res.status(200).json({ status: "OK", message: "HRMS Backend running" });
});

export default router;

