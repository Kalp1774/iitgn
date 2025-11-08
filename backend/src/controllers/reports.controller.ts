// src/controllers/reports.controller.ts
import { Request, Response } from "express";
import { prisma } from "../utils/prisma.js";

/**
 * Get start of day (00:00:00.000)
 */
function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get end of day (23:59:59.999)
 */
function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Attendance summary between from..to
 * returns array: [{ employeeId, name, department, presentDays, totalHours }]
 */
export const attendanceSummary = async (req: Request, res: Response) => {
  try {
    const fromQ = req.query.from ? new Date(String(req.query.from)) : undefined;
    const toQ = req.query.to ? new Date(String(req.query.to)) : undefined;

    if (fromQ && isNaN(fromQ.getTime())) {
      return res.status(400).json({ error: "Invalid from date" });
    }

    if (toQ && isNaN(toQ.getTime())) {
      return res.status(400).json({ error: "Invalid to date" });
    }

    const from = fromQ ? startOfDay(fromQ) : undefined;
    const to = toQ ? endOfDay(toQ) : undefined;

    // Build where clause
    const whereAny: any = {};
    if (from || to) {
      whereAny.date = {};
      if (from) whereAny.date.gte = from;
      if (to) whereAny.date.lte = to;
    }

    // Find all employees and aggregate attendance per employee
    const employees = await prisma.employee.findMany({
      select: { id: true, name: true, department: true },
    });

    const results = await Promise.all(
      employees.map(async (e) => {
        const attendances = await prisma.attendance.findMany({
          where: {
            employeeId: e.id,
            ...(whereAny.date ? { date: whereAny.date } : {}),
          },
        });

        const presentDays = attendances.filter((a) => a.totalHours && a.totalHours > 0).length;
        const totalHours = attendances.reduce((s, a) => s + (a.totalHours || 0), 0);
        const absentDays = attendances.filter((a) => !a.totalHours || a.totalHours === 0).length;

        return {
          employeeId: e.id,
          name: e.name,
          department: e.department,
          presentDays,
          absentDays,
          totalHours: Math.round(totalHours * 100) / 100,
        };
      })
    );

    return res.json({
      summary: {
        from: from?.toISOString(),
        to: to?.toISOString(),
        totalEmployees: results.length,
      },
      data: results,
    });
  } catch (err) {
    console.error("attendanceSummary error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Payroll summary for a month (YYYY-MM)
 */
export const payrollSummary = async (req: Request, res: Response) => {
  try {
    const month = String(req.query.month || "");

    if (!month) {
      return res.status(400).json({ error: "month required (YYYY-MM)" });
    }

    // Validate month format
    const monthRegex = /^\d{4}-\d{2}$/;
    if (!monthRegex.test(month)) {
      return res.status(400).json({ error: "Invalid month format. Expected YYYY-MM" });
    }

    const rows = await prisma.payroll.findMany({
      where: { month },
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
      orderBy: { netSalary: "desc" },
    });

    const totalGross = rows.reduce((s, r) => s + (r.basic || 0), 0);
    const totalDeductions = rows.reduce(
      (s, r) => s + ((r.pf || 0) + (r.tax || 0) + (r.unpaidDeduction || 0)),
      0
    );
    const totalNet = rows.reduce((s, r) => s + (r.netSalary || 0), 0);
    const totalPF = rows.reduce((s, r) => s + (r.pf || 0), 0);
    const totalTax = rows.reduce((s, r) => s + (r.tax || 0), 0);
    const totalUnpaidDeduction = rows.reduce((s, r) => s + (r.unpaidDeduction || 0), 0);

    return res.json({
      month,
      summary: {
        count: rows.length,
        totalGross: Number(totalGross.toFixed(2)),
        totalDeductions: Number(totalDeductions.toFixed(2)),
        totalPF: Number(totalPF.toFixed(2)),
        totalTax: Number(totalTax.toFixed(2)),
        totalUnpaidDeduction: Number(totalUnpaidDeduction.toFixed(2)),
        totalNet: Number(totalNet.toFixed(2)),
      },
      data: rows,
    });
  } catch (err) {
    console.error("payrollSummary error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

