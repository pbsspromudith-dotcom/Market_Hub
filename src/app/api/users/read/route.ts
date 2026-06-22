import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        join_date: true,
        phone: true
      },
      orderBy: {
        join_date: 'desc'
      }
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    console.error('Users read error:', error);
    return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}
