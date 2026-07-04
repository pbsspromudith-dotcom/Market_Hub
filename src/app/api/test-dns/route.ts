import { NextResponse } from 'next/server';
import dns from 'dns';
import { promisify } from 'util';

const lookup = promisify(dns.lookup);

export async function GET() {
  try {
    const res = await lookup('srv456.hstgr.io', { all: true });
    return NextResponse.json({ success: true, res });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message });
  }
}
