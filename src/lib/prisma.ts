import { PrismaClient } from '../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Force clear the cached client in development to apply the new configuration
if (globalForPrisma.prisma) {
  try {
    globalForPrisma.prisma.$disconnect();
  } catch (e) {}
  globalForPrisma.prisma = undefined;
}

const rawUrl = process.env.DATABASE_URL;
if (!rawUrl) {
  throw new Error("DATABASE_URL is not defined in the environment");
}
const envUrl = rawUrl.replace(/^["']|["']$/g, '');
const connectionUrl = envUrl;

// Parse the connection URL to create adapter options explicitly
const dbUrl = new URL(connectionUrl);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaMariaDb({
      host: dbUrl.hostname,
      ...(dbUrl.hostname !== 'localhost' && { port: Number(dbUrl.port) || 3306 }),
      user: dbUrl.username,
      password: decodeURIComponent(dbUrl.password),
      database: dbUrl.pathname.slice(1),
      connectionLimit: 1, // Explicit limit as per Prisma docs
    }),
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
