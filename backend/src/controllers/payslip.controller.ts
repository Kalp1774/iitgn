// src/controllers/payslip.controller.ts
import { Request, Response } from "express";
import PDFDocument from "pdfkit";
import { prisma } from "../utils/prisma.js";

/**
 * Returns PDF stream for payslip
 */
export const getPayslipPDF = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid payroll id" });
    }

    const payroll = await prisma.payroll.findUnique({
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

    if (!payroll) {
      return res.status(404).json({ error: "Payroll not found" });
    }

    const doc = new PDFDocument({ size: "A4", margin: 50 });

    // Headers for PDF response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="payslip-${payroll.employeeId}-${payroll.month}.pdf"`
    );

    // Pipe to response
    doc.pipe(res);

    // Company header
    doc.fontSize(20).text("HRMS Company", { align: "center" });
    doc.moveDown(0.3);
    doc.fontSize(12).text("Employee Payslip", { align: "center" });
    doc.moveDown(1);

    // Month and date
    doc.fontSize(14).text(`Month: ${payroll.month}`, { align: "center" });
    doc.text(`Generated: ${new Date(payroll.generatedAt).toLocaleDateString()}`, {
      align: "center",
    });
    doc.moveDown(1);

    // Employee details
    doc.fontSize(12).text("Employee Details", { underline: true });
    doc.moveDown(0.3);
    doc.text(`Name: ${payroll.employee?.name || "N/A"}`);
    doc.text(`Employee ID: ${payroll.employeeId}`);
    doc.text(`Designation: ${payroll.employee?.designation || "N/A"}`);
    doc.text(`Department: ${payroll.employee?.department || "N/A"}`);
    if (payroll.employee?.email) {
      doc.text(`Email: ${payroll.employee.email}`);
    }
    doc.moveDown(1);

    // Salary breakdown
    doc.fontSize(12).text("Salary Breakdown", { underline: true });
    doc.moveDown(0.3);
    doc.text(`Basic Salary: ₹ ${payroll.basic.toFixed(2)}`);
    doc.moveDown(0.5);

    // Attendance details
    doc.fontSize(12).text("Attendance Details", { underline: true });
    doc.moveDown(0.3);
    doc.text(`Working Days: ${payroll.workingDays}`);
    doc.text(`Present Days: ${payroll.presentDays}`);
    doc.text(`Paid Leaves: ${payroll.paidLeaves}`);
    doc.text(`Unpaid Leaves: ${payroll.unpaidLeaves}`);
    doc.moveDown(0.5);

    // Deductions
    doc.fontSize(12).text("Deductions", { underline: true });
    doc.moveDown(0.3);
    doc.text(`Per Day Deduction: ₹ ${payroll.perDayDeduction.toFixed(2)}`);
    doc.text(`Unpaid Deduction: ₹ ${payroll.unpaidDeduction.toFixed(2)}`);
    doc.text(`Provident Fund (12%): ₹ ${payroll.pf.toFixed(2)}`);
    doc.text(`Tax (10%): ₹ ${payroll.tax.toFixed(2)}`);
    doc.moveDown(1);

    // Net salary (highlighted)
    doc.fontSize(16).text(`Net Salary: ₹ ${payroll.netSalary.toFixed(2)}`, {
      underline: true,
      align: "center",
    });

    doc.moveDown(2);
    doc.fontSize(10).text("This is a computer generated payslip.", { align: "center" });
    doc.text("No signature required.", { align: "center" });

    doc.end();
  } catch (err) {
    console.error("getPayslipPDF error:", err);
    if (!res.headersSent) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};

