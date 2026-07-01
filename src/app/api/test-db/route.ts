import { NextResponse } from 'next/server';
import { pool } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = await pool.query('SELECT 1 as test');
    return NextResponse.json({ success: true, rows });
  } catch (error: any) {
    console.error('Test DB Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
