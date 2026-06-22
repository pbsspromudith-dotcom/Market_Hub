import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let optionsList;
    if (type) {
      optionsList = await prisma.options.findMany({
        where: { option_type: type },
      });
    } else {
      optionsList = await prisma.options.findMany();
    }

    return NextResponse.json({ success: true, data: optionsList });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
