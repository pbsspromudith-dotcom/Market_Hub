export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let query = supabase.from('options').select('*');
    if (type) {
      query = query.eq('option_type', type);
    }
    
    const { data: optionsList, error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, data: optionsList });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
