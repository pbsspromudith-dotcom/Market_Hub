export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('user_id');

  if (!userId) {
    return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
  }

  const userIdInt = parseInt(userId, 10);

  try {
    const { data: messages, error: msgError } = await supabase
      .from('messages')
      .select('*')
      .or(`receiver_id.eq.${userIdInt},sender_id.eq.${userIdInt}`)
      .order('created_at', { ascending: true });

    if (msgError) throw msgError;
    if (!messages) return NextResponse.json([], { status: 200 });

    // Manually fetch related data since Prisma relations are missing
    const listingIds = [...new Set(messages.map(m => m.listing_id))];
    const userIds = [...new Set([
      ...messages.map(m => m.sender_id).filter(id => id > 0),
      ...messages.map(m => m.receiver_id).filter(id => id > 0)
    ])];

    let listings: any[] = [];
    if (listingIds.length > 0) {
      const { data } = await supabase.from('listings').select('id, title, image').in('id', listingIds);
      listings = data || [];
    }

    let users: any[] = [];
    if (userIds.length > 0) {
      const { data } = await supabase.from('users').select('id, name, email').in('id', userIds);
      users = data || [];
    }

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
