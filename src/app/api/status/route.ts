export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'online',
    message: 'Backend is running smoothly',
    timestamp: Math.floor(Date.now() / 1000)
  });
}
