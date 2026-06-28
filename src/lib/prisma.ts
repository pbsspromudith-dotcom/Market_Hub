import { PrismaClient } from '../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

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
      port: Number(dbUrl.port) || 3306,
      user: dbUrl.username,
      password: decodeURIComponent(dbUrl.password),
      database: dbUrl.pathname.slice(1),
      connectionLimit: 5,
      connectTimeout: 10000, // 10s timeout — fail fast if DB is unreachable
    }),
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// Cache the client globally in ALL environments (prevents creating
// multiple PrismaClient instances on every server action / API route)
globalForPrisma.prisma = prisma;
