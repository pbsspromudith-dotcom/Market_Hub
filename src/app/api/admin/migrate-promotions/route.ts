import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// One-time migration endpoint to create the promotion_pricing table
// DELETE THIS FILE after the table is created successfully
export async function GET() {
  return NextResponse.json(
    { success: false, message: 'Raw SQL migrations are not supported by the Supabase REST Client. Please run the SQL migration directly in the Supabase Dashboard SQL Editor.' },
    { status: 400 }
  );
}
