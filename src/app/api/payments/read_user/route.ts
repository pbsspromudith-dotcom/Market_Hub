import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get('user_id');

    if (!user_id) {
      return NextResponse.json(
        { success: false, message: 'user_id is required' },
        { status: 400 }
      );
    }

    // Fetch transactions for the given user, ordered by newest first
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', parseInt(user_id, 10))
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: transactions || [],
    });
  } catch (error: any) {
    console.error('Error fetching user transactions:', error);
    return NextResponse.json(
      { success: false, message: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}
