import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendEmail, getThemedEmailHtml } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { listing_id, recipient_email, outreach_type, subject, message_body } = body;

    if (!listing_id) {
      return NextResponse.json({ success: false, message: 'listing_id is required' }, { status: 400 });
    }

    if (!recipient_email || !recipient_email.includes('@')) {
      return NextResponse.json({ success: false, message: 'A valid recipient email address is required' }, { status: 400 });
    }

    // Fetch listing to verify and get details
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('id, title, price, category, location, image, user_id, contact_email')
      .eq('id', parseInt(listing_id, 10))
      .maybeSingle();

    if (listingError || !listing) {
      return NextResponse.json({ success: false, message: 'Listing not found' }, { status: 404 });
    }

    const listingTitle = listing.title || 'Your advertisement';
    const listingUrl = `https://hitads.ca/item/${listing.id}`;

    let emailSubject = subject?.trim();
    let emailHtml = '';

    if (outreach_type === 'custom_message') {
      if (!emailSubject) {
        emailSubject = `Message from HitAds.ca regarding "${listingTitle}"`;
      }
      const formattedBody = (message_body || '')
        .replace(/\n/g, '<br/>');

      const contentHtml = `
        <h2 style="font-size: 20px; font-weight: 800; color: #0F172A; margin: 0 0 16px 0;">Notice Regarding Your Advertisement</h2>
        <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
          <p style="margin: 0; font-size: 14px; color: #475569;"><strong>Ad Title:</strong> ${listingTitle}</p>
          <p style="margin: 6px 0 0 0; font-size: 12px; color: #64748B;"><strong>Category:</strong> ${listing.category || 'General'} | <strong>Location:</strong> ${listing.location || 'Canada'}</p>
        </div>
        <div style="font-size: 14px; line-height: 1.7; color: #334155; margin-bottom: 28px;">
          ${formattedBody}
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${listingUrl}" style="background-color: #FD3D28; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 9999px; font-weight: 700; font-size: 14px; display: inline-block;">
            View Your Listing on HitAds
          </a>
        </div>
        <p style="font-size: 12px; color: #94A3B8; text-align: center; margin-top: 24px;">
          If you have questions, please reply directly to this email or visit our Help Center.
        </p>
      `;

      emailHtml = getThemedEmailHtml(emailSubject, contentHtml);

    } else {
      // Standard Promotional Offer Email
      if (!emailSubject) {
        emailSubject = `Boost your sales: Promote "${listingTitle}" on HitAds.ca!`;
      }

      const customNote = message_body?.trim() 
        ? `<div style="background-color: #FFF7ED; border-left: 4px solid #F97316; padding: 14px; border-radius: 8px; margin-bottom: 24px; font-size: 14px; color: #9A3412;">${message_body.replace(/\n/g, '<br/>')}</div>`
        : '';

      const contentHtml = `
        <h2 style="font-size: 22px; font-weight: 900; color: #0F172A; margin: 0 0 12px 0;">Get 10x More Views & Sell Faster!</h2>
        <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 20px 0;">
          Hi there! Your listing <strong>"${listingTitle}"</strong> is live on HitAds.ca. Give it the spotlight it deserves to connect with serious local buyers in record time.
        </p>

        ${customNote}

        <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
          <h3 style="font-size: 15px; font-weight: 800; color: #1E293B; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 0.05em;">
            Choose Your Promotion Package:
          </h3>

          <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #E2E8F0;">
            <div style="display: flex; align-items: baseline; justify-content: space-between;">
              <span style="font-size: 15px; font-weight: 700; color: #0F172A;">⭐ Top Ad Placement</span>
              <span style="font-size: 12px; font-weight: 800; color: #F59E0B; background-color: #FEF3C7; padding: 2px 8px; border-radius: 9999px;">Most Popular</span>
            </div>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #64748B;">Pin your ad to the top of its category and search results for maximum exposure.</p>
          </div>

          <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #E2E8F0;">
            <div style="display: flex; align-items: baseline; justify-content: space-between;">
              <span style="font-size: 15px; font-weight: 700; color: #0F172A;">🏠 Homepage Gallery</span>
              <span style="font-size: 12px; font-weight: 800; color: #2563EB; background-color: #DBEAFE; padding: 2px 8px; border-radius: 9999px;">Premium</span>
            </div>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #64748B;">Showcase your ad prominently on the HitAds.ca homepage seen by thousands daily.</p>
          </div>

          <div>
            <div style="display: flex; align-items: baseline; justify-content: space-between;">
              <span style="font-size: 15px; font-weight: 700; color: #0F172A;">✨ Featured Badge & Highlight</span>
              <span style="font-size: 12px; font-weight: 800; color: #9333EA; background-color: #F3E8FF; padding: 2px 8px; border-radius: 9999px;">Stand Out</span>
            </div>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #64748B;">Catch eyes with a high-contrast highlighted border and distinctive badge.</p>
          </div>
        </div>

        <div style="text-align: center; margin: 32px 0 20px 0;">
          <a href="${listingUrl}" style="background-color: #FD3D28; color: #ffffff; padding: 14px 36px; text-decoration: none; border-radius: 9999px; font-weight: 800; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(253, 61, 40, 0.25);">
            Promote Your Ad Now
          </a>
        </div>

        <p style="font-size: 12px; color: #94A3B8; text-align: center; margin: 0;">
          Questions? Contact our team anytime at support@hitads.ca.
        </p>
      `;

      emailHtml = getThemedEmailHtml(emailSubject, contentHtml);
    }

    // Send email using system SMTP configuration
    await sendEmail(recipient_email, emailSubject, emailHtml);

    return NextResponse.json({
      success: true,
      message: `Email sent successfully to ${recipient_email}`,
    });

  } catch (error: any) {
    console.error('Send promotion email error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to send promotion email',
    }, { status: 500 });
  }
}
