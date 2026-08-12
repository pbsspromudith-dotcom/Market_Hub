import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendEmail, getThemedEmailHtml } from '@/lib/email';

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

    // Send email notification to receiver
    let mailSent = false;
    if (receiver_email) {
      try {
        const subject = `New Message regarding: ${listing_title}`;
        const emailContent = `
          <h2 style="margin-top: 0; color: #111111;">New Inquiry on Your Listing</h2>
          <p>Hi <strong>${receiver_name || 'Seller'}</strong>,</p>
          <p>You received a new message from <strong>${sender_name}</strong> for <strong>${listing_title}</strong>:</p>
          <blockquote style="background: #f8fafc; border-left: 4px solid #FD3D28; padding: 12px 16px; margin: 16px 0; border-radius: 8px; color: #334155; font-style: italic;">
            "${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}"
          </blockquote>
          <p style="margin-top: 20px;">Log in to your account dashboard on HitAds.ca to view and reply to this message.</p>
        `;
        const emailHtml = getThemedEmailHtml(subject, emailContent);
        await sendEmail(receiver_email, subject, emailHtml);
        mailSent = true;
      } catch (emailErr) {
        console.error('Failed to send message email notification:', emailErr);
      }
    }

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
