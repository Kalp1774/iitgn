// src/controllers/leave.controller.ts
import { Request, Response } from "express";
import { prisma } from "../utils/prisma.js";

export const applyLeave = async (req: Request, res: Response) => {
  try {
    const { employeeId, startDate, endDate, type, reason } = req.body;

    if (!employeeId || !startDate || !endDate || !type) {
      return res.status(400).json({ error: "Missing required fields: employeeId, startDate, endDate, type" });
    }

    // Validate employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: Number(employeeId) },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    if (start > end) {
      return res.status(400).json({ error: "Start date must be before or equal to end date" });
    }

    // Check for overlapping leaves (optional but recommended)
    const overlappingLeaves = await prisma.leave.findMany({
      where: {
        employeeId: Number(employeeId),
        status: { in: ["PENDING", "APPROVED"] },
        OR: [
          {
            startDate: { lte: end },
            endDate: { gte: start },
          },
        ],
      },
    });

    if (overlappingLeaves.length > 0) {
      return res.status(400).json({
        error: "Overlapping leave request exists",
        conflictingLeaves: overlappingLeaves.map((l) => ({
          id: l.id,
          startDate: l.startDate,
          endDate: l.endDate,
          status: l.status,
        })),
      });
    }

    const leave = await prisma.leave.create({
      data: {
        employeeId: Number(employeeId),
        startDate: start,
        endDate: end,
        type: String(type).toUpperCase(),
        reason: reason || null,
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            department: true,
            designation: true,
          },
        },
      },
    });

    return res.status(201).json(leave);
  } catch (err) {
    console.error("applyLeave error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllLeaves = async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string | undefined;
    const type = req.query.type as string | undefined;

    const where: any = {};

    if (status) {
      where.status = status.toUpperCase();
    }

    if (type) {
      where.type = type.toUpperCase();
    }

    const leaves = await prisma.leave.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            department: true,
            designation: true,
          },
        },
      },
      orderBy: { appliedAt: "desc" },
    });

    return res.json(leaves);
  } catch (err) {
    console.error("getAllLeaves error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getLeavesByEmployee = async (req: Request, res: Response) => {
  try {
    const employeeId = Number(req.params.employeeId);

    if (isNaN(employeeId)) {
      return res.status(400).json({ error: "Invalid employee ID" });
    }

    // Verify employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const status = req.query.status as string | undefined;

    const where: any = { employeeId };

    if (status) {
      where.status = status.toUpperCase();
    }

    const leaves = await prisma.leave.findMany({
      where,
      orderBy: { startDate: "desc" },
    });

    return res.json(leaves);
  } catch (err) {
    console.error("getLeavesByEmployee error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const reviewLeave = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid leave ID" });
    }

    const { status, reviewedBy } = req.body;

    if (!status || !["APPROVED", "REJECTED"].includes(status.toUpperCase())) {
      return res.status(400).json({ error: "Invalid status. Must be APPROVED or REJECTED" });
    }

    // Check if leave exists
    const existingLeave = await prisma.leave.findUnique({
      where: { id },
    });

    if (!existingLeave) {
      return res.status(404).json({ error: "Leave request not found" });
    }

    if (existingLeave.status !== "PENDING") {
      return res.status(400).json({ error: `Leave request is already ${existingLeave.status}` });
    }

    const leave = await prisma.leave.update({
      where: { id },
      data: {
        status: status.toUpperCase(),
        reviewedAt: new Date(),
        reviewedBy: reviewedBy ? Number(reviewedBy) : null,
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            department: true,
            designation: true,
          },
        },
      },
    });

    return res.json(leave);
  } catch (err) {
    console.error("reviewLeave error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getLeaveById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid leave ID" });
    }

    const leave = await prisma.leave.findUnique({
      where: { id },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            department: true,
            designation: true,
          },
        },
      },
    });

    if (!leave) {
      return res.status(404).json({ error: "Leave request not found" });
    }

    return res.json(leave);
  } catch (err) {
    console.error("getLeaveById error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

