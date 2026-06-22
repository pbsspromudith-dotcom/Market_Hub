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
      orderBy: {
        created_at: 'asc'
      }
    });

    // Manually fetch related data since Prisma relations are missing
    const listingIds = [...new Set(messages.map(m => m.listing_id))];
    const userIds = [...new Set([
      ...messages.map(m => m.sender_id).filter(id => id > 0),
      ...messages.map(m => m.receiver_id).filter(id => id > 0)
    ])];

    const [listings, users] = await Promise.all([
      prisma.listings.findMany({
        where: { id: { in: listingIds } },
        select: { id: true, title: true, image: true }
      }),
      prisma.users.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true, email: true }
      })
    ]);

    const listingsMap = listings.reduce((acc, l) => {
      acc[l.id] = l;
      return acc;
    }, {} as any);

    const usersMap = users.reduce((acc, u) => {
      acc[u.id] = u;
      return acc;
    }, {} as any);

    const formattedMessages = messages.map(m => {
      const listing = listingsMap[m.listing_id];
      const sender = usersMap[m.sender_id];
      const receiver = usersMap[m.receiver_id];

      return {
        ...m,
        listing_title: listing?.title,
        listing_image: listing?.image,
        sender_name_db: sender?.name,
        sender_email: sender?.email,
        receiver_name_db: receiver?.name,
        receiver_email: receiver?.email
      };
    });

    return NextResponse.json(formattedMessages, { status: 200 });

  } catch (error) {
    console.error('Read user messages error:', error);
    return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}
