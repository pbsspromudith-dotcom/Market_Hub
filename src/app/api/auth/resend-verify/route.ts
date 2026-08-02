import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';
import { sendEmail, getThemedEmailHtml } from '@/lib/email';

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

    const originUrl = new URL(req.url);
    const forwardedHost = req.headers.get('x-forwarded-host');
    const forwardedProto = req.headers.get('x-forwarded-proto') || 'https';
    let baseUrl = forwardedHost ? `${forwardedProto}://${forwardedHost}` : `${originUrl.protocol}//${originUrl.host}`;
    
    if (baseUrl.includes('0.0.0.0') || baseUrl.includes('127.0.0.1') || baseUrl.includes('localhost:3000')) {
      if (process.env.NODE_ENV === 'production' || !baseUrl.includes('localhost')) {
        baseUrl = 'https://hitads.ca';
      }
    }

    const verifyLink = `${baseUrl}/api/auth/verify?token=${newToken}`;
    
    const emailHtml = getThemedEmailHtml(
      'Verify Your Email',
      `
        <h1 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 800; color: #111111; text-align: center; font-family: system-ui, sans-serif;">Verify Your Email</h1>
        <p style="margin: 0 0 15px 0; font-size: 15px; line-height: 1.6; color: #5B616A; text-align: center;">
          You requested a new verification link for HitAds.ca.
        </p>
        <p style="margin: 0 0 30px 0; font-size: 15px; line-height: 1.6; color: #5B616A; text-align: center;">
          Please click the button below to verify your email address and activate your account:
        </p>
        <div style="text-align: center; margin-bottom: 30px;">
          <a href="${verifyLink}" style="display: inline-block; padding: 14px 32px; background-color: #1774F5; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 15px; box-shadow: 0 4px 12px rgba(23, 116, 245, 0.25);">Verify Email</a>
        </div>
        <div style="border-top: 1px solid #F1F1F1; padding-top: 20px; margin-top: 30px;">
          <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #5B616A; text-align: center; font-style: italic;">
            If you did not request this, please ignore this email.
          </p>
        </div>
      `
    );
    
    try {
      await sendEmail(user.email, 'Market Hub - Verify Your Email', emailHtml);
    } catch (err: any) {
      console.error('Failed to send verification email:', err);
      return NextResponse.json({ success: false, message: 'Failed to send email. Check SMTP settings.' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, message: 'Verification email sent! Please check your inbox.' });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json({ success: false, message: 'Server error. Please try again.' }, { status: 500 });
  }
}
