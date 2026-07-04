import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.listing_id || !data.message) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const listing_id = parseInt(data.listing_id, 10);
    const message = data.message;
    const sender_id = data.sender_id ? parseInt(data.sender_id, 10) : 0;
    const sender_name = data.sender_name || 'A Guest';
    const explicit_receiver_id = data.receiver_id ? parseInt(data.receiver_id, 10) : null;

    let receiver_id: number;
    let receiver_email: string;
    let receiver_name: string;
    let listing_title: string;

    if (explicit_receiver_id) {
      // Reply mode: we know who the receiver is
      const { data: receiverUser } = await supabase
        .from('users')
        .select('email, name')
        .eq('id', explicit_receiver_id)
        .maybeSingle();

      if (!receiverUser) {
        return NextResponse.json({ success: false, message: 'Receiver not found' }, { status: 404 });
      }

      receiver_id = explicit_receiver_id;
      receiver_email = receiverUser.email;
      receiver_name = receiverUser.name;

      // Get listing title
      const { data: listingRow } = await supabase
        .from('listings')
        .select('title')
        .eq('id', listing_id)
        .maybeSingle();
      
      listing_title = listingRow ? `Re: ${listingRow.title}` : 'Reply to your inquiry';
    } else {
      // Original mode: fetch from listing
      const { data: listing } = await supabase
        .from('listings')
        .select('title, contact_email, user_id')
        .eq('id', listing_id)
        .maybeSingle();

      if (!listing || !listing.user_id) {
        return NextResponse.json({ success: false, message: 'Listing or owner not found' }, { status: 404 });
      }

      const { data: listingOwner } = await supabase
        .from('users')
        .select('email, name')
        .eq('id', listing.user_id)
        .maybeSingle();

      if (!listingOwner) {
        return NextResponse.json({ success: false, message: 'Listing owner not found' }, { status: 404 });
      }

      receiver_id = listing.user_id;
      receiver_email = listing.contact_email || listingOwner.email;
      receiver_name = listingOwner.name;
      listing_title = listing.title;
    }

    // Save to database
    const { error: insertError } = await supabase
      .from('messages')
      .insert({
        listing_id,
        sender_id,
        receiver_id,
        message,
        sender_name
      });

    if (insertError) throw insertError;

    // We'll skip sending the real email here in local dev mode,
    // just as we disabled emails for password reset previously.
    const mailSent = false;

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      email_sent: mailSent
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create message error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
