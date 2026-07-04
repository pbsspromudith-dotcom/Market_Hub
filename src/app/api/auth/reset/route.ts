import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json({ success: false, message: 'Token and new password required.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, message: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    // Find user with valid, non-expired token
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('reset_token', token.trim())
      .gt('reset_token_expiry', new Date().toISOString())
      .maybeSingle();

    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid or expired password reset token.' }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update password and clear token
    const { error: updateError } = await supabase
      .from('users')
      .update({
        password: hashedPassword,
        reset_token: null,
        reset_token_expiry: null,
      })
      .eq('id', user.id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}
