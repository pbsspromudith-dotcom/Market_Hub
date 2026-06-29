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
const dbUrl = new URL(envUrl);

if (!globalForPrisma.prisma) {
  console.log('🚀 INITIALIZING NEW PRISMA POOL INSTANCE IN WORKER');
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaMariaDb({
      host: dbUrl.hostname,
      port: Number(dbUrl.port) || 3306,
      user: dbUrl.username,
      password: decodeURIComponent(dbUrl.password),
      database: dbUrl.pathname.slice(1),
      // Next.js uses 11+ Worker Threads during build/dev, which DO NOT share globalThis.
      // If each worker opens 5 connections, it spikes to 55+ concurrent connections,
      // crashing the Hostinger DB limits. Limit to 1 per worker.
      connectionLimit: 1,
      connectTimeout: 20000,          // 20s to establish a new connection
      acquireTimeout: 20000,          // 20s to acquire from pool
      idleTimeout: 10,                // MUST be < server wait_timeout (20s)
      minimumIdle: 0,
      minDelayValidation: 200,
    }),
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

globalForPrisma.prisma = prisma;
