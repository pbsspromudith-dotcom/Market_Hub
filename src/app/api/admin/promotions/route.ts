import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data: rows, error } = await supabase
      .from('promotion_pricing')
      .select('*')
      .order('promotion_type', { ascending: true })
      .order('duration_days', { ascending: true });

    if (error) throw error;

    const data = (rows || []).map((row) => ({
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
      { success: false, message: 'Failed to fetch promotion pricing', error: error.message, cause: error.cause },
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
      const { error: updateError } = await supabase
        .from('promotion_pricing')
        .update({
          promotion_type,
          duration_days: parseInt(duration_days, 10),
          price: parseFloat(price),
          is_active: is_active ? true : false,
        })
        .eq('id', parseInt(id, 10));

      if (updateError) throw updateError;
      return NextResponse.json({ success: true, message: 'Updated successfully' });
    } else {
      // Create new
      const { error: createError } = await supabase
        .from('promotion_pricing')
        .insert({
          promotion_type,
          duration_days: parseInt(duration_days, 10),
          price: parseFloat(price),
          is_active: (is_active ?? true) ? true : false,
        });

      if (createError) throw createError;
      return NextResponse.json({ success: true, message: 'Created successfully' });
    }
  } catch (error: any) {
    console.error('Failed to save promotion pricing:', error);
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

    const { error: deleteError } = await supabase
      .from('promotion_pricing')
      .delete()
      .eq('id', parseInt(id, 10));

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete promotion pricing', error: error.message },
      { status: 500 }
    );
  }
}
