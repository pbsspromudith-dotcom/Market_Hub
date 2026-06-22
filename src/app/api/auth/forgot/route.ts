import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !email.trim()) {
      return NextResponse.json({ success: false, message: 'Email address is required.' }, { status: 400 });
    }

    const user = await prisma.users.findUnique({
      where: { email: email.trim() },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'No account found with that email address.' }, { status: 404 });
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');

    // Update user with token and expiry (1 hour from now)
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.users.update({
      where: { id: user.id },
      data: {
        reset_token: token,
        reset_token_expiry: expiry,
      },
    });

    // NOTE: Email sending is not implemented in the Next.js version.
    // The token is stored in the DB; in production, integrate with nodemailer or similar.
    
    // For local development, log the reset link to the terminal so we can test it!
    const resetLink = `http://localhost:3000/login?mode=reset&token=${token}`;
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
