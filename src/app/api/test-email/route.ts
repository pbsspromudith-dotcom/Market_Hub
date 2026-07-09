import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const to = searchParams.get('to') || 'test@example.com';
    const info = await sendEmail(to, 'Test Email from Market Hub API', '<p>This is a test email sent from Next.js API route.</p>');
    return NextResponse.json({ success: true, message: 'Email sent successfully', info });
  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json({ success: false, message: error.message, stack: error.stack }, { status: 500 });
  }
}
