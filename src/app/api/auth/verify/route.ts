import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    const originUrl = new URL(req.url);
    const forwardedHost = req.headers.get('x-forwarded-host');
    const forwardedProto = req.headers.get('x-forwarded-proto') || 'https';
    let baseUrl = forwardedHost ? `${forwardedProto}://${forwardedHost}` : `${originUrl.protocol}//${originUrl.host}`;
    
    if (baseUrl.includes('0.0.0.0') || baseUrl.includes('127.0.0.1') || baseUrl.includes('localhost:3000')) {
      if (process.env.NODE_ENV === 'production' || !baseUrl.includes('localhost')) {
        baseUrl = 'https://hitads.ca';
      }
    }

    if (!token) {
      return NextResponse.redirect(`${baseUrl}/login?error=Invalid verification link`);
    }

    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('verification_token', token)
      .maybeSingle();

    if (!user) {
      return NextResponse.redirect(`${baseUrl}/login?error=Invalid or expired verification link`);
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({
        is_verified: true,
        verification_token: null
      })
      .eq('id', user.id);

    if (updateError) throw updateError;

    return NextResponse.redirect(`${baseUrl}/login?verified=true`);
  } catch (error) {
    console.error('Verification error:', error);
    const originUrl = new URL(req.url);
    const baseUrl = `${originUrl.protocol}//${originUrl.host}`;
    return NextResponse.redirect(`${baseUrl}/login?error=Server error during verification`);
  }
}
