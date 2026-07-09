import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function DELETE(req: Request) {
  try {
    const data = await req.json();

    if (!data.id) {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', data.id);

    if (error) {
      console.error('Supabase delete error:', error);
      return NextResponse.json({ success: false, message: error.message || 'Failed to delete user' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Users delete error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Server error' }, { status: 500 });
  }
}
