import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendEmail, getThemedEmailHtml } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: 'Name, email and password required' }, { status: 400 });
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json({ success: false, message: 'Email already in use' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user. In the original PHP, new users have 'user' role.
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        name,
        email,
        password: hashedPassword,
        role: 'user',
        is_verified: 0,
        verification_token: crypto.randomBytes(32).toString('hex'),
      })
      .select()
      .single();
      
    if (createError) {
      throw createError;
    }

    // We don't send the password back
    const { password: _, ...userWithoutPassword } = newUser;

    const originUrl = new URL(req.url);
    const baseUrl = `${originUrl.protocol}//${originUrl.host}`;
    const verifyLink = `${baseUrl}/api/auth/verify?token=${newUser.verification_token}`;
    
    const emailHtml = getThemedEmailHtml(
      'Verify Your Email',
      `
        <h1 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 800; color: #111111; text-align: center; font-family: system-ui, sans-serif;">Verify Your Email</h1>
        <p style="margin: 0 0 15px 0; font-size: 15px; line-height: 1.6; color: #5B616A; text-align: center;">
          Thank you for registering on HitAds.ca!
        </p>
        <p style="margin: 0 0 30px 0; font-size: 15px; line-height: 1.6; color: #5B616A; text-align: center;">
          Please click the button below to verify your email address and activate your account:
        </p>
        <div style="text-align: center; margin-bottom: 30px;">
          <a href="${verifyLink}" style="display: inline-block; padding: 14px 32px; background-color: #2F80ED; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 15px; box-shadow: 0 4px 12px rgba(47, 128, 237, 0.25);">Verify Email</a>
        </div>
        <div style="border-top: 1px solid #F1F1F1; padding-top: 20px; margin-top: 30px;">
          <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #5B616A; text-align: center; font-style: italic;">
            If you did not register for this account, please ignore this email.
          </p>
        </div>
      `
    );
    
    try {
      await sendEmail(userWithoutPassword.email, 'Market Hub - Verify Your Email', emailHtml);
    } catch (err: any) {
      console.error('Failed to send verification email:', err);
    }
    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}
