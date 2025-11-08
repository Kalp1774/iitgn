// Node.js script to seed test users with bcrypt-hashed passwords
// Run from backend directory: node scripts/seed-users.js
// Or with tsx: npx tsx scripts/seed-users.js

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const testUsers = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'ADMIN',
  },
  {
    name: 'HR Manager',
    email: 'hr@example.com',
    password: 'hr123',
    role: 'HR',
  },
  {
    name: 'Employee User',
    email: 'employee@example.com',
    password: 'emp123',
    role: 'EMPLOYEE',
  },
];

async function seedUsers() {
  console.log('🔐 Seeding test users...\n');

  try {
    for (const userData of testUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {
          name: userData.name,
          password: hashedPassword,
          role: userData.role,
        },
        create: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          role: userData.role,
        },
      });

      console.log(`✅ ${userData.role}: ${user.email} (${user.name})`);
    }

    console.log('\n📊 Verifying users...\n');
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
      },
      orderBy: { id: 'asc' },
    });

    console.table(allUsers);

    console.log('\n✅ Test users setup complete!');
    console.log('\n📝 Login credentials:');
    console.log('  Admin:    admin@example.com / admin123');
    console.log('  HR:       hr@example.com / hr123');
    console.log('  Employee: employee@example.com / emp123');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedUsers();

