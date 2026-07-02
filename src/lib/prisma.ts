import { PrismaClient } from '../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as mariadb from 'mariadb';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: mariadb.Pool | undefined;
  poolConfig: mariadb.PoolConfig | undefined;
};

if (!globalForPrisma.poolConfig) {
  const rawUrl = process.env.DATABASE_URL || '';
  const envUrl = rawUrl.replace(/^["']|["']$/g, '');
  const dbUrl = new URL(envUrl);

  globalForPrisma.poolConfig = {
    host: dbUrl.hostname,
    port: Number(dbUrl.port) || 3306,
    user: dbUrl.username,
    password: decodeURIComponent(dbUrl.password),
    database: dbUrl.pathname.slice(1),
    connectionLimit: 5,
    connectTimeout: 20000,
    acquireTimeout: 20000,
    idleTimeout: 0,
    minimumIdle: 1,
    minDelayValidation: 500,
  };
}

// Pool for direct SQL queries (used by some API routes)
if (!globalForPrisma.pool) {
  globalForPrisma.pool = mariadb.createPool(globalForPrisma.poolConfig!);
}

// Prisma client with MariaDB adapter (creates its own internal pool)
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient({
    adapter: new PrismaMariaDb(globalForPrisma.poolConfig as any),
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

export const pool = globalForPrisma.pool;
export const prisma = globalForPrisma.prisma;
