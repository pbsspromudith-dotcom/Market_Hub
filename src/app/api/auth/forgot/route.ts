import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !email.trim()) {
      return NextResponse.json({ success: false, message: 'Email address is required.' }, { status: 400 });
    }

    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.trim())
      .maybeSingle();

    if (!user) {
      return NextResponse.json({ success: false, message: 'No account found with that email address.' }, { status: 404 });
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');

    // Update user with token and expiry (1 hour from now)
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    const { error: updateError } = await supabase
      .from('users')
      .update({
        reset_token: token,
        reset_token_expiry: expiry.toISOString(),
      })
      .eq('id', user.id);

    if (updateError) throw updateError;

    // NOTE: Email sending is not implemented in the Next.js version.
    // The token is stored in the DB; in production, integrate with nodemailer or similar.
    
    // Extract the base URL dynamically from the incoming request
    const originUrl = new URL(req.url);
    const baseUrl = `${originUrl.protocol}//${originUrl.host}`;
    const resetLink = `${baseUrl}/login?mode=reset&token=${token}`;
    
    console.log('\n\n=========================================');
    console.log('PASSWORD RESET REQUESTED');
    console.log(`Email: ${user.email}`);
    console.log(`Reset Link: ${resetLink}`);
    console.log('=========================================\n\n');

    // For now, return success so the UI flow works.
    return NextResponse.json({
      success: true,
      message: 'Password reset link sent! (Check your terminal for the link)',
      resetLink: process.env.NODE_ENV === 'development' ? resetLink : undefined
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}
