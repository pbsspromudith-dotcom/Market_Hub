import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET active promotion pricing options
export async function GET() {
  try {
    const { data: pricingOptions, error } = await supabase
      .from('promotion_pricing')
      .select('*')
      .eq('is_active', true)
      .order('promotion_type', { ascending: true })
      .order('duration_days', { ascending: true });

    if (error) throw error;

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
