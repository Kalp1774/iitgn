// src/controllers/attendance.controller.ts
import { Request, Response } from "express";
import { prisma } from "../utils/prisma.js";

/**
 * Convert a Date to date-only (removes time component)
 */
function toDateOnly(dt: Date): Date {
  return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
}

export const checkIn = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({ error: "employeeId required" });
    }

    // Verify employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: Number(employeeId) },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const now = new Date();
    const dateOnly = toDateOnly(now);

    // Upsert ensures one record per day
    const attendance = await prisma.attendance.upsert({
      where: {
        employeeId_date: { employeeId: Number(employeeId), date: dateOnly },
      },
      update: {
        checkIn: now,
        status: "PRESENT",
      },
      create: {
        employeeId: Number(employeeId),
        date: dateOnly,
        checkIn: now,
        status: "PRESENT",
      },
    });

    return res.status(200).json(attendance);
  } catch (err) {
    console.error("attendance checkIn error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const checkOut = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({ error: "employeeId required" });
    }

    const now = new Date();
    const dateOnly = toDateOnly(now);

    const record = await prisma.attendance.findUnique({
      where: {
        employeeId_date: { employeeId: Number(employeeId), date: dateOnly },
      },
    });

    if (!record || !record.checkIn) {
      return res.status(400).json({ error: "No check-in found for today" });
    }

    if (record.checkOut) {
      return res.status(400).json({ error: "Already checked out for today" });
    }

    // Compute total hours: difference between checkIn and now in minutes -> hours
    const checkInTime = new Date(record.checkIn).getTime();
    const checkOutTime = now.getTime();
    const minutes = (checkOutTime - checkInTime) / (1000 * 60);
    const totalHours = Math.round((minutes / 60) * 100) / 100; // two-decimal hours

    const updated = await prisma.attendance.update({
      where: { id: record.id },
      data: {
        checkOut: now,
        totalHours,
      },
    });

    return res.json(updated);
  } catch (err) {
    console.error("attendance checkOut error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getAttendanceByEmployee = async (req: Request, res: Response) => {
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

    const from = req.query.from ? new Date(String(req.query.from)) : undefined;
    const to = req.query.to ? new Date(String(req.query.to)) : undefined;

    const where: any = { employeeId };

    if (from || to) {
      where.date = {};
      if (from) {
        where.date.gte = toDateOnly(from);
      }
      if (to) {
        // Set to end of day
        const endOfDay = new Date(to);
        endOfDay.setHours(23, 59, 59, 999);
        where.date.lte = endOfDay;
      }
    }

    const rows = await prisma.attendance.findMany({
      where,
      orderBy: { date: "desc" },
    });

    return res.json(rows);
  } catch (err) {
    console.error("getAttendanceByEmployee error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getAttendanceByDate = async (req: Request, res: Response) => {
  try {
    const date = req.query.date ? new Date(String(req.query.date)) : new Date();
    const dateOnly = toDateOnly(date);

    const rows = await prisma.attendance.findMany({
      where: { date: dateOnly },
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
      orderBy: { checkIn: "asc" },
    });

    return res.json(rows);
  } catch (err) {
    console.error("getAttendanceByDate error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

