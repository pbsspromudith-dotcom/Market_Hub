import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows: any[] = await (prisma as any).$queryRawUnsafe(
      `SELECT id, promotion_type, duration_days, price, is_active, created_at 
       FROM promotion_pricing 
       ORDER BY promotion_type ASC, duration_days ASC`
    );

    const data = rows.map((row: any) => ({
      id: Number(row.id),
      promotion_type: row.promotion_type,
      duration_days: Number(row.duration_days),
      price: Number(row.price),
      is_active: Boolean(row.is_active),
      created_at: row.created_at,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch promotion pricing', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, promotion_type, duration_days, price, is_active } = body;

    if (!promotion_type || !duration_days || price === undefined) {
      return NextResponse.json(
        { success: false, message: 'promotion_type, duration_days, and price are required' },
        { status: 400 }
      );
    }

    if (id) {
      // Update existing
      await (prisma as any).$executeRawUnsafe(
        `UPDATE promotion_pricing SET promotion_type = ?, duration_days = ?, price = ?, is_active = ? WHERE id = ?`,
        promotion_type,
        parseInt(duration_days, 10),
        parseFloat(price),
        is_active ? 1 : 0,
        parseInt(id, 10)
      );
      return NextResponse.json({ success: true, message: 'Updated successfully' });
    } else {
      // Create new
      await (prisma as any).$executeRawUnsafe(
        `INSERT INTO promotion_pricing (promotion_type, duration_days, price, is_active) VALUES (?, ?, ?, ?)`,
        promotion_type,
        parseInt(duration_days, 10),
        parseFloat(price),
        (is_active ?? true) ? 1 : 0
      );
      return NextResponse.json({ success: true, message: 'Created successfully' });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to save promotion pricing', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    await (prisma as any).$executeRawUnsafe(
      `DELETE FROM promotion_pricing WHERE id = ?`,
      parseInt(id, 10)
    );

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete promotion pricing', error: error.message },
      { status: 500 }
    );
  }
}
