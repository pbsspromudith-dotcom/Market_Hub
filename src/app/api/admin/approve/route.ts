import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendEmail, getThemedEmailHtml } from '@/lib/email';

// POST - Approve or reject a listing at a specific stage
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { approval_id, listing_id, action, review_note, reviewed_by } = body;

    if (!listing_id || !action) {
      return NextResponse.json({ success: false, error: 'listing_id and action are required' }, { status: 400 });
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ success: false, error: 'Action must be "approve" or "reject"' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const originUrl = new URL(req.url);
    const baseUrl = `${originUrl.protocol}//${originUrl.host}`;

    // Fetch listing & owner details for email notifications
    const { data: listing } = await supabase
      .from('listings')
      .select('title, user_id, contact_email')
      .eq('id', listing_id)
      .maybeSingle();

    let userEmail = listing?.contact_email || '';
    let userName = 'User';

    if (listing?.user_id) {
      const { data: user } = await supabase
        .from('users')
        .select('name, email')
        .eq('id', listing.user_id)
        .maybeSingle();
      if (user) {
        userEmail = user.email || userEmail;
        userName = user.name || userName;
      }
    }

    if (action === 'reject') {
      // Reject: update the specific approval record and set listing status to rejected
      if (approval_id) {
        await supabase
          .from('listing_approvals')
          .update({
            status: 'rejected',
            reviewed_by: reviewed_by || null,
            review_note: review_note || null,
            reviewed_at: now,
          })
          .eq('id', approval_id);
      }

      // Update listing status to rejected
      const { error } = await supabase
        .from('listings')
        .update({
          status: 'rejected',
          rejection_reason: review_note || 'Rejected by admin',
        })
        .eq('id', listing_id);

      if (error) throw error;

      // Send rejection notification email
      if (userEmail && listing) {
        try {
          const emailHtml = getThemedEmailHtml(
            'Ad Rejected',
            `
              <h1 style="margin: 0 0 20px 0; font-size: 22px; font-weight: 800; color: #FD3D28; text-align: center; font-family: system-ui, sans-serif;">Ad Rejection Notice</h1>
              <p style="margin: 0 0 15px 0; font-size: 15px; line-height: 1.6; color: #111111;">Hello ${userName},</p>
              <p style="margin: 0 0 15px 0; font-size: 15px; line-height: 1.6; color: #5B616A;">
                We regret to inform you that your ad submission <strong>"${listing.title}"</strong> did not pass our review stage and could not be published.
              </p>
              <div style="background-color: #FFF5F5; border: 1px solid #FED7D7; border-radius: 12px; padding: 20px; margin-bottom: 25px; margin-top: 20px;">
                <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 800; color: #C53030; text-transform: uppercase; tracking-wider;">Reason for rejection:</p>
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #9B2C2C; font-weight: 500;">${review_note || 'Did not meet our publishing guidelines.'}</p>
              </div>
              <p style="margin: 0 0 30px 0; font-size: 14px; line-height: 1.6; color: #5B616A; text-align: center;">
                You can review, edit, and resubmit your ad anytime through your user profile dashboard.
              </p>
              <div style="text-align: center; margin-bottom: 25px;">
                <a href="${baseUrl}/profile" style="display: inline-block; padding: 13px 28px; background-color: #1774F5; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(23, 116, 245, 0.2);">Manage My Ads</a>
              </div>
            `
          );
          await sendEmail(userEmail, `HitAds.ca - Ad Rejection: ${listing.title}`, emailHtml);
        } catch (emailErr) {
          console.error('Failed to send rejection email:', emailErr);
        }
      }

      return NextResponse.json({ success: true, message: 'Listing rejected' });
    }

    // action === 'approve'
    if (approval_id) {
      // Approve this specific stage
      const { error: stageError } = await supabase
        .from('listing_approvals')
        .update({
          status: 'approved',
          reviewed_by: reviewed_by || null,
          review_note: review_note || null,
          reviewed_at: now,
        })
        .eq('id', approval_id);

      if (stageError) throw stageError;
    } else {
      // No specific approval_id: approve all pending stages for this listing
      const { error: bulkError } = await supabase
        .from('listing_approvals')
        .update({
          status: 'approved',
          reviewed_by: reviewed_by || null,
          review_note: review_note || null,
          reviewed_at: now,
        })
        .eq('listing_id', listing_id)
        .eq('status', 'pending');

      if (bulkError) throw bulkError;
    }

    // Check if all stages for this listing are now approved
    const { data: remaining } = await supabase
      .from('listing_approvals')
      .select('id')
      .eq('listing_id', listing_id)
      .eq('status', 'pending');

    if (!remaining || remaining.length === 0) {
      // All stages approved — make listing active
      const { error: activateError } = await supabase
        .from('listings')
        .update({
          status: 'active',
          rejection_reason: null,
        })
        .eq('id', listing_id);

      if (activateError) throw activateError;

      // Send approval notification email
      if (userEmail && listing) {
        try {
          const emailHtml = getThemedEmailHtml(
            'Ad Approved',
            `
              <h1 style="margin: 0 0 20px 0; font-size: 22px; font-weight: 800; color: #27AE60; text-align: center; font-family: system-ui, sans-serif;">Ad Approved & Live!</h1>
              <p style="margin: 0 0 15px 0; font-size: 15px; line-height: 1.6; color: #111111;">Hello ${userName},</p>
              <p style="margin: 0 0 25px 0; font-size: 15px; line-height: 1.6; color: #5B616A;">
                Great news! Your ad submission <strong>"${listing.title}"</strong> has been fully reviewed and approved by our moderation team. It is now live on the site.
              </p>
              <div style="text-align: center; margin-bottom: 30px; margin-top: 25px;">
                <a href="${baseUrl}/item/${listing_id}" style="display: inline-block; padding: 13px 28px; background-color: #1774F5; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(23, 116, 245, 0.2);">View Live Ad</a>
              </div>
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #5B616A; text-align: center;">
                Thank you for posting on HitAds.ca!
              </p>
            `
          );
          await sendEmail(userEmail, `HitAds.ca - Ad Published: ${listing.title}`, emailHtml);
        } catch (emailErr) {
          console.error('Failed to send approval email:', emailErr);
        }
      }

      return NextResponse.json({ success: true, message: 'All stages approved. Listing is now active.', fully_approved: true });
    }

    return NextResponse.json({ success: true, message: 'Stage approved. More stages pending.', fully_approved: false });
  } catch (error: any) {
    console.error('Approve/reject error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
