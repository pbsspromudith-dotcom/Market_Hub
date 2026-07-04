import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, role, avatar, join_date, phone')
      .order('join_date', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    console.error('Users read error:', error);
    return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}
