import { PrismaClient } from '../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as mariadb from 'mariadb';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: mariadb.Pool | undefined;
};

if (!globalForPrisma.pool) {
  const rawUrl = process.env.DATABASE_URL || '';
  const envUrl = rawUrl.replace(/^["']|["']$/g, '');
  const dbUrl = new URL(envUrl);
  
  const ipHost = "194.59.164.94";
  dbUrl.hostname = ipHost;
  
  globalForPrisma.pool = mariadb.createPool({
    host: ipHost,
    port: Number(dbUrl.port) || 3306,
    user: dbUrl.username,
    password: decodeURIComponent(dbUrl.password),
    database: dbUrl.pathname.slice(1),
    connectionLimit: 5,
    connectTimeout: 20000,
    acquireTimeout: 20000,
    idleTimeout: 0,            // keep idle connections alive forever (don't destroy & recreate)
    minimumIdle: 1,            // always keep at least 1 connection warm
    minDelayValidation: 500,   // skip validation pings within 500ms
  });
}

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient({
    adapter: new PrismaMariaDb(globalForPrisma.pool),
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

export const pool = globalForPrisma.pool;
export const prisma = globalForPrisma.prisma;
