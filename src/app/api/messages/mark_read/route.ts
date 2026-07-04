import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
    const { error: updateError } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('listing_id', listing_id)
      .eq('sender_id', sender_id)
      .eq('receiver_id', receiver_id)
      .eq('is_read', false);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, message: 'Messages marked as read' });

  } catch (error: any) {
    console.error('Mark read error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
