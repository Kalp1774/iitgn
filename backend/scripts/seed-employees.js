// Node.js script to seed test employees
// Run from backend directory: npm run seed:employees
// Or with tsx: npx tsx scripts/seed-employees.js

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const testEmployees = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    department: 'Engineering',
    designation: 'Senior Software Engineer',
    salary: 75000,
    status: 'ACTIVE',
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    department: 'Marketing',
    designation: 'Marketing Manager',
    salary: 65000,
    status: 'ACTIVE',
  },
  {
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    department: 'Sales',
    designation: 'Sales Executive',
    salary: 55000,
    status: 'ACTIVE',
  },
  {
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    department: 'HR',
    designation: 'HR Specialist',
    salary: 60000,
    status: 'ACTIVE',
  },
  {
    name: 'David Brown',
    email: 'david.brown@example.com',
    department: 'Engineering',
    designation: 'Software Engineer',
    salary: 70000,
    status: 'ACTIVE',
  },
  {
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    department: 'Finance',
    designation: 'Financial Analyst',
    salary: 58000,
    status: 'ACTIVE',
  },
];

async function seedEmployees() {
  console.log('👥 Seeding test employees...\n');

  try {
    for (const empData of testEmployees) {
      const employee = await prisma.employee.upsert({
        where: { email: empData.email },
        update: {
          name: empData.name,
          department: empData.department,
          designation: empData.designation,
          salary: empData.salary,
          status: empData.status,
        },
        create: empData,
      });

      console.log(`✅ ${employee.department}: ${employee.name} (${employee.designation})`);
    }

    console.log('\n📊 Verifying employees...\n');
    const allEmployees = await prisma.employee.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        designation: true,
        salary: true,
        status: true,
      },
      orderBy: { id: 'asc' },
    });

    console.table(allEmployees);
    console.log(`\n✅ ${allEmployees.length} employees created/updated!`);
  } catch (error) {
    console.error('❌ Error seeding employees:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedEmployees();

