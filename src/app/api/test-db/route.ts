import { NextResponse } from 'next/server';
import * as mariadb from 'mariadb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rawUrl = process.env.DATABASE_URL;
    if (!rawUrl) {
      throw new Error("DATABASE_URL is not defined in the environment");
    }
    const envUrl = rawUrl.replace(/^["']|["']$/g, '');
    const dbUrl = new URL(envUrl);

    const pool = mariadb.createPool({
      host: dbUrl.hostname,
      port: Number(dbUrl.port) || 3306,
      user: dbUrl.username,
      password: decodeURIComponent(dbUrl.password),
      database: dbUrl.pathname.slice(1),
      connectionLimit: 1,
      connectTimeout: 5000,
    });

    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT 1 as test');
    conn.release();
    await pool.end();

    return NextResponse.json({ success: true, rows });
  } catch (error: any) {
    console.error('Test DB Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
