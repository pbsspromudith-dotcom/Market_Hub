import { PrismaClient } from './src/generated/prisma/client';

async function test() {
  try {
    const prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    });
    console.log("Prisma initialized successfully");
    const count = await prisma.category.count();
    console.log("Category count:", count);
  } catch (e: any) {
    console.error("Prisma Error:", e);
  }
}

test();
