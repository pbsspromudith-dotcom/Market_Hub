import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';
import { sendEmail, getThemedEmailHtml } from '@/lib/email';
import { verifyRecaptcha } from '@/lib/recaptcha';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, captchaToken } = body;

    if (!email || !email.trim()) {
      return NextResponse.json({ success: false, message: 'Email address is required.' }, { status: 400 });
    }

    if (captchaToken) {
      const captchaRes = await verifyRecaptcha(captchaToken);
      if (!captchaRes.success) {
        return NextResponse.json({ success: false, message: captchaRes.message }, { status: 400 });
      }
    }

    const { data: user } = await supabase
      .from('users')
      .select('*')
      .ilike('email', email.trim())
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

    const originUrl = new URL(req.url);
    const forwardedHost = req.headers.get('x-forwarded-host');
    const forwardedProto = req.headers.get('x-forwarded-proto') || 'https';
    let baseUrl = forwardedHost ? `${forwardedProto}://${forwardedHost}` : `${originUrl.protocol}//${originUrl.host}`;
    
    if (baseUrl.includes('0.0.0.0') || baseUrl.includes('127.0.0.1') || baseUrl.includes('localhost:3000')) {
      if (process.env.NODE_ENV === 'production' || !baseUrl.includes('localhost')) {
        baseUrl = 'https://hitads.ca';
      }
    }

    const resetLink = `${baseUrl}/login?mode=reset&token=${token}`;
    
    // Send Email
    const emailHtml = getThemedEmailHtml(
      'Password Reset Request',
      `
        <h1 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 800; color: #111111; text-align: center; font-family: system-ui, sans-serif;">Reset Password</h1>
        <p style="margin: 0 0 15px 0; font-size: 15px; line-height: 1.6; color: #5B616A; text-align: center;">
          We received a request to reset the password for your HitAds.ca account.
        </p>
        <p style="margin: 0 0 30px 0; font-size: 15px; line-height: 1.6; color: #5B616A; text-align: center;">
          Please click the button below to set a new password. This link will expire in 1 hour:
        </p>
        <div style="text-align: center; margin-bottom: 30px;">
          <a href="${resetLink}" style="display: inline-block; padding: 14px 32px; background-color: #1774F5; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 15px; box-shadow: 0 4px 12px rgba(23, 116, 245, 0.25);">Reset Password</a>
        </div>
        <div style="border-top: 1px solid #F1F1F1; padding-top: 20px; margin-top: 30px;">
          <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #5B616A; text-align: center; font-style: italic;">
            If you did not request a password reset, please ignore this email.
          </p>
        </div>
      `
    );
    
    try {
      await sendEmail(user.email, 'HitAds.ca - Password Reset', emailHtml);
    } catch (err: any) {
      console.error('Failed to send reset email:', err);
      // Even if email fails, we shouldn't necessarily crash, but we should inform the user
      return NextResponse.json({ success: false, message: 'Failed to send reset email. Check SMTP settings.' }, { status: 500 });
    }
    return NextResponse.json({
      success: true,
      message: 'Password reset link sent! Please check your inbox.',
      resetLink: process.env.NODE_ENV === 'development' ? resetLink : undefined
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}
