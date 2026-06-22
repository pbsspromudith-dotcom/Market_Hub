import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('user_id');

  if (!userId) {
    return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
  }

  const userIdInt = parseInt(userId, 10);

  try {
    const messages = await prisma.messages.findMany({
      where: {
        OR: [
          { receiver_id: userIdInt },
          { sender_id: userIdInt }
        ]
      },
      include: {
        listings: {
          select: {
            title: true,
            image: true
          }
        },
        users_messages_sender_idTousers: {
          select: {
            name: true,
            email: true
          }
        },
        users_messages_receiver_idTousers: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        created_at: 'asc'
      }
    });

    const formattedMessages = messages.map(m => ({
      ...m,
      listing_title: m.listings?.title,
      listing_image: m.listings?.image,
      sender_name_db: m.users_messages_sender_idTousers?.name,
      sender_email: m.users_messages_sender_idTousers?.email,
      receiver_name_db: m.users_messages_receiver_idTousers?.name,
      receiver_email: m.users_messages_receiver_idTousers?.email
    }));

    return NextResponse.json(formattedMessages, { status: 200 });

  } catch (error) {
    console.error('Read user messages error:', error);
    return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}
