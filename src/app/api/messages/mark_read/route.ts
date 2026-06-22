import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.listing_id || !data.sender_id || !data.receiver_id) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const listing_id = parseInt(data.listing_id, 10);
    const sender_id = parseInt(data.sender_id, 10);
    const receiver_id = parseInt(data.receiver_id, 10);

    // Update all unread messages in this thread directed to this receiver
    await prisma.messages.updateMany({
      where: {
        listing_id,
        sender_id,
        receiver_id,
        is_read: false
      },
      data: {
        is_read: true
      }
    });

    return NextResponse.json({ success: true, message: 'Messages marked as read' });

  } catch (error: any) {
    console.error('Mark read error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
