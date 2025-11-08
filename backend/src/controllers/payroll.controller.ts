// src/controllers/payroll.controller.ts
import { Request, Response } from "express";
import { prisma } from "../utils/prisma.js";

/**
 * Get start of month (first day at 00:00:00)
 */
function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Get end of month (last day at 23:59:59.999)
 */
function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

/**
 * Helper: count weekdays (Mon-Fri) between two dates inclusive
 */
function countWeekdays(start: Date, end: Date): number {
  let count = 0;
  const d = new Date(start);
  const endDate = new Date(end);

  // Reset to start of day for comparison
  d.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  while (d <= endDate) {
    const day = d.getDay();
    // 0 = Sunday, 6 = Saturday
    if (day !== 0 && day !== 6) {
      count++;
    }
    d.setDate(d.getDate() + 1);
  }

  return count;
}

/**
 * Generate payroll for a single employee for a given month (YYYY-MM)
 */
export const generatePayroll = async (req: Request, res: Response) => {
  try {
    const { employeeId, month } = req.body;

    if (!employeeId || !month) {
      return res.status(400).json({ error: "employeeId and month (YYYY-MM) are required" });
    }

    // Validate month format
    const monthRegex = /^\d{4}-\d{2}$/;
    if (!monthRegex.test(month)) {
      return res.status(400).json({ error: "Invalid month format. Expected YYYY-MM" });
    }

    const emp = await prisma.employee.findUnique({ where: { id: Number(employeeId) } });

    if (!emp) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const [yearStr, monthStr] = month.split("-");
    const year = Number(yearStr);
    const m = Number(monthStr) - 1; // JS months are 0-indexed

    if (isNaN(year) || isNaN(m) || m < 0 || m > 11) {
      return res.status(400).json({ error: "Invalid month or year" });
    }

    const from = startOfMonth(new Date(year, m, 1));
    const to = endOfMonth(from);

    // Working days (weekdays in the month)
    const workingDays = countWeekdays(from, to);

    // Attendance present days: count records with totalHours > 0 in range
    const attendance = await prisma.attendance.findMany({
      where: {
        employeeId: Number(employeeId),
        date: { gte: from, lte: to },
        totalHours: { not: null, gt: 0 },
      },
    });

    const presentDays = attendance.length;

    // Approved leaves in range (leaves that overlap with the month)
    const leaves = await prisma.leave.findMany({
      where: {
        employeeId: Number(employeeId),
        status: "APPROVED",
        OR: [
          // Leave starts in month
          { startDate: { gte: from, lte: to } },
          // Leave ends in month
          { endDate: { gte: from, lte: to } },
          // Leave spans the entire month
          { AND: [{ startDate: { lte: from } }, { endDate: { gte: to } }] },
        ],
      },
    });

    let paidLeaves = 0;
    let unpaidLeaves = 0;

    // Count weekdays in leave periods that fall within the month
    for (const l of leaves) {
      const leaveStart = new Date(l.startDate);
      const leaveEnd = new Date(l.endDate);

      // Get the overlapping period within the month
      const overlapStart = leaveStart < from ? from : leaveStart;
      const overlapEnd = leaveEnd > to ? to : leaveEnd;

      // Count weekdays in this overlap
      const days = countWeekdays(overlapStart, overlapEnd);

      if (l.type && l.type.toUpperCase() === "PAID") {
        paidLeaves += days;
      } else {
        unpaidLeaves += days;
      }
    }

    // Treat paid leaves as present for payroll calculation
    const effectivePresent = presentDays + paidLeaves;

    // Unpaid days = workingDays - effectivePresent (min 0)
    const unpaidDays = Math.max(0, workingDays - effectivePresent);

    const basic = Number(emp.salary || 0);

    if (basic <= 0) {
      return res.status(400).json({ error: "Employee salary must be greater than 0" });
    }

    const perDayDeduction = workingDays > 0 ? basic / workingDays : 0;
    const unpaidDeduction = unpaidDays * perDayDeduction;

    // Simple fixed PF and tax for demo
    const pf = Number((basic * 0.12).toFixed(2));
    const tax = Number((basic * 0.1).toFixed(2));
    const netSalary = Number((basic - unpaidDeduction - pf - tax).toFixed(2));

    // Upsert payroll record
    const payroll = await prisma.payroll.upsert({
      where: { employeeId_month: { employeeId: Number(employeeId), month } },
      update: {
        basic,
        workingDays,
        presentDays,
        paidLeaves,
        unpaidLeaves: unpaidDays,
        perDayDeduction,
        unpaidDeduction,
        pf,
        tax,
        netSalary,
        generatedAt: new Date(),
      },
      create: {
        employeeId: Number(employeeId),
        month,
        basic,
        workingDays,
        presentDays,
        paidLeaves,
        unpaidLeaves: unpaidDays,
        perDayDeduction,
        unpaidDeduction,
        pf,
        tax,
        netSalary,
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

    return res.json({ payroll });
  } catch (err) {
    console.error("generatePayroll error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get payroll(s)
 */
export const getPayrolls = async (req: Request, res: Response) => {
  try {
    const { employeeId, month } = req.query;

    const where: any = {};

    if (employeeId) {
      const empId = Number(employeeId);
      if (isNaN(empId)) {
        return res.status(400).json({ error: "Invalid employeeId" });
      }
      where.employeeId = empId;
    }

    if (month) {
      where.month = String(month);
    }

    const rows = await prisma.payroll.findMany({
      where,
      orderBy: { generatedAt: "desc" },
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

    return res.json(rows);
  } catch (err) {
    console.error("getPayrolls error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get single payslip
 */
export const getPayslip = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid payroll ID" });
    }

    const rec = await prisma.payroll.findUnique({
      where: { id },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            department: true,
            designation: true,
            email: true,
          },
        },
      },
    });

    if (!rec) {
      return res.status(404).json({ error: "Payroll not found" });
    }

    return res.json(rec);
  } catch (err) {
    console.error("getPayslip error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

