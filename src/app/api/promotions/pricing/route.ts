import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const pricingOptions: any[] = await (prisma as any).$queryRawUnsafe(
      `SELECT id, promotion_type, duration_days, price, is_active, created_at 
       FROM promotion_pricing 
       WHERE is_active = 1 
       ORDER BY promotion_type ASC, duration_days ASC`
    );

    // Convert BigInt/Decimal values to plain numbers for JSON serialization
    const data = pricingOptions.map((row: any) => ({
      id: Number(row.id),
      promotion_type: row.promotion_type,
      duration_days: Number(row.duration_days),
      price: Number(row.price),
      is_active: Boolean(row.is_active),
      created_at: row.created_at,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error fetching promotion pricing:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch promotion pricing', error: error.message },
      { status: 500 }
    );
  }
}
