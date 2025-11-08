import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (_: Request, res: Response) => {
  res.status(200).json({ status: "OK", message: "HRMS Backend running" });
});

export default router;

