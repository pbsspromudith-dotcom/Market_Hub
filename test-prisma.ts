import { PrismaClient } from './src/generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import "dotenv/config";

async function test() {
  try {
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string);
    const prisma = new PrismaClient({
      adapter,
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
