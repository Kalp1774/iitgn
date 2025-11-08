// src/controllers/employee.controller.ts
import { Request, Response } from "express";
import { prisma } from "../utils/prisma.js";

export const getEmployees = async (_: Request, res: Response) => {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { created_at: "desc" },
    });
    return res.json(employees);
  } catch (err) {
    console.error("getEmployees error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid employee ID" });
    }

    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    return res.json(employee);
  } catch (err) {
    console.error("getEmployeeById error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { name, department, designation, salary, status, userId } = req.body;

    // Validate required fields
    if (!name || !department || !designation || salary === undefined) {
      return res.status(400).json({
        error: "name, department, designation, and salary are required",
      });
    }

    // Validate salary is a number
    if (typeof salary !== "number" || salary < 0) {
      return res.status(400).json({ error: "salary must be a positive number" });
    }

    const employee = await prisma.employee.create({
      data: {
        name,
        department,
        designation,
        salary: Number(salary),
        status: status || "ACTIVE",
        userId: userId ? Number(userId) : null,
      },
    });

    return res.status(201).json(employee);
  } catch (err) {
    console.error("createEmployee error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid employee ID" });
    }

    const { name, department, designation, salary, status } = req.body;

    // Check if employee exists
    const existing = await prisma.employee.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Validate salary if provided
    if (salary !== undefined && (typeof salary !== "number" || salary < 0)) {
      return res.status(400).json({ error: "salary must be a positive number" });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (department !== undefined) updateData.department = department;
    if (designation !== undefined) updateData.designation = designation;
    if (salary !== undefined) updateData.salary = Number(salary);
    if (status !== undefined) updateData.status = status;

    const employee = await prisma.employee.update({
      where: { id },
      data: updateData,
    });

    return res.json(employee);
  } catch (err) {
    console.error("updateEmployee error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid employee ID" });
    }

    // Check if employee exists
    const existing = await prisma.employee.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Employee not found" });
    }

    await prisma.employee.delete({ where: { id } });

    return res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    console.error("deleteEmployee error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

