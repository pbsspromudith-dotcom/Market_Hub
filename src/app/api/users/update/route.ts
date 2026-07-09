import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(req: Request) {
  try {
    const data = await req.json();

    if (!data.id) {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }

    const { id, join_date, ...updateData } = data;

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select('id, name, email, role, avatar, join_date, phone')
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ success: false, message: error.message || 'Failed to update user' }, { status: 500 });
    }

    return NextResponse.json({ success: true, user: updatedUser, message: 'User updated successfully' });
  } catch (error: any) {
    console.error('Users update error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Server error' }, { status: 500 });
  }
}
