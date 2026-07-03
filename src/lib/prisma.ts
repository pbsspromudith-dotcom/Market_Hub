import { PrismaClient } from '../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as mariadb from 'mariadb';
import * as dns from 'dns';

// Fix Node.js >= 17 IPv6 resolution timeouts on Hostinger
dns.setDefaultResultOrder('ipv4first');

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
    connectionLimit: 20, // Increased limit from 5 to 20
    connectTimeout: 10000,
    acquireTimeout: 10000,
    idleTimeout: 30000,
    minimumIdle: 0,
    minDelayValidation: 500,
  };
}

// Pool for direct SQL queries (used by some API routes)
if (!globalForPrisma.pool) {
  globalForPrisma.pool = mariadb.createPool(globalForPrisma.poolConfig!);
}

// Prisma client with MariaDB adapter (creates its own internal pool if not shared properly)
if (!globalForPrisma.prisma) {
  const isBuild = process.env.npm_lifecycle_event === 'build' || process.argv.some(arg => arg.includes('next/dist/bin/next') && arg.includes('build'));
  
    globalForPrisma.prisma = new PrismaClient({
      adapter: new PrismaMariaDb(globalForPrisma.pool as any), // Use the shared pool, NOT poolConfig
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
}

export const pool = globalForPrisma.pool;
export const prisma = globalForPrisma.prisma;
