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

    // Find user with reset token
    console.log('[DEBUG Reset] Submitted token:', token);
    const { data: user, error: queryError } = await supabase
      .from('users')
      .select('*')
      .eq('reset_token', token.trim())
      .maybeSingle();

    if (queryError) {
      console.error('[DEBUG Reset] Supabase query error:', queryError);
    }

    console.log('[DEBUG Reset] Found user:', user ? user.email : 'NONE');

    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid or expired password reset token.' }, { status: 400 });
    }

    // Verify token expiry timezone-safely in JS
    let expiryTime: number;
    const rawExpiry = user.reset_token_expiry;

    if (!rawExpiry) {
      return NextResponse.json({ success: false, message: 'Invalid or expired password reset token.' }, { status: 400 });
    }

    if (rawExpiry instanceof Date) {
      expiryTime = rawExpiry.getTime();
    } else {
      const expiryStr = String(rawExpiry).trim();
      if (!expiryStr || expiryStr === 'null' || expiryStr === 'undefined') {
        return NextResponse.json({ success: false, message: 'Invalid or expired password reset token.' }, { status: 400 });
      }
      const normalizedIso = expiryStr.includes('T') ? expiryStr : expiryStr.replace(' ', 'T');
      const expiryIso = normalizedIso.endsWith('Z') ? normalizedIso : `${normalizedIso}Z`;
      expiryTime = new Date(expiryIso).getTime();
    }

    const currentTime = Date.now();

    console.log('[DEBUG Reset] Current time:', currentTime, 'Expiry time:', expiryTime);
    console.log('[DEBUG Reset] Is expired?', expiryTime < currentTime);

    if (isNaN(expiryTime) || expiryTime < currentTime) {
      return NextResponse.json({ success: false, message: 'Invalid or expired password reset token.' }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update password, mark as verified, and clear token
    const { error: updateError } = await supabase
      .from('users')
      .update({
        password: hashedPassword,
        is_verified: true,
        verification_token: null,
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
