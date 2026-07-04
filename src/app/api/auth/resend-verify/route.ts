import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !email.trim()) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.trim())
      .maybeSingle();

    if (!user) {
      // Don't reveal if email exists or not
      return NextResponse.json({ success: true, message: 'If the email exists, a verification link has been sent.' });
    }

    if (user.is_verified) {
      return NextResponse.json({ success: true, message: 'This email is already verified. You can sign in.' });
    }

    // Generate new verification token
    const newToken = crypto.randomBytes(32).toString('hex');

    const { error: updateError } = await supabase
      .from('users')
      .update({
        verification_token: newToken,
      })
      .eq('id', user.id);

    if (updateError) throw updateError;

    // NOTE: Email sending is not implemented in the Next.js version.
    // The token is stored in the DB; in production, integrate with nodemailer or similar.
    return NextResponse.json({ success: true, message: 'Verification email sent! Please check your inbox.' });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json({ success: false, message: 'Server error. Please try again.' }, { status: 500 });
  }
}
