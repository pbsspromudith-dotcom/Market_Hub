import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendEmail, getThemedEmailHtml } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.title || data.price === undefined || !data.user_id) {
      return NextResponse.json({ success: false, error: 'Required fields missing' }, { status: 400 });
    }

    const time = "Just now"; // Simplified
    let imageToSave: string | null = null;

    if (data.image && Array.isArray(data.image) && data.image.length > 0) {
      imageToSave = JSON.stringify(data.image);
    }

    // Determine if multi-city or single-city posting
    const locations: any[] = [];
    if (data.locations && Array.isArray(data.locations) && data.locations.length >= 1) {
      if (data.locations.length > 5) {
        return NextResponse.json({ success: false, error: 'Maximum 5 cities allowed for Multi-City posting' }, { status: 400 });
      }
      for (const loc of data.locations) {
        locations.push({
          location: loc.location || 'Unknown',
          postal_code: loc.postal_code || null,
          latitude: null,
          longitude: null,
        });
      }
    } else {
      locations.push({
        location: data.location || 'Unknown',
        postal_code: data.postal_code || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
      });
    }

    // ── Determine approval template ──
    // 1. Check category-specific template
    // 2. Fall back to default template
    let approvalTemplate: any = null;
    let templateStages: any[] = [];

    const category = data.category || null;

    if (category) {
      // Try to find a category-specific template (match by category name via category table)
      const { data: catRow } = await supabase
        .from('category')
        .select('CategoryID')
        .eq('CategoryName', category)
        .eq('IsActive', true)
        .maybeSingle();

      if (catRow) {
        const { data: catTemplate } = await supabase
          .from('approval_templates')
          .select('*')
          .eq('category_id', catRow.CategoryID)
          .eq('is_active', true)
          .maybeSingle();

        if (catTemplate) {
          approvalTemplate = catTemplate;
        }
      }
    }

    // Fall back to default template
    if (!approvalTemplate) {
      const { data: defaultTpl } = await supabase
        .from('approval_templates')
        .select('*')
        .eq('is_default', true)
        .eq('is_active', true)
        .maybeSingle();

      if (defaultTpl) {
        approvalTemplate = defaultTpl;
      }
    }

    // Load template stages if we found a template
    if (approvalTemplate) {
      const { data: tplStages } = await supabase
        .from('approval_template_stages')
        .select('*')
        .eq('template_id', approvalTemplate.id)
        .order('stage_order', { ascending: true });

      templateStages = tplStages || [];
    }

    const needsApproval = approvalTemplate && templateStages.length > 0;
    const listingStatus = needsApproval ? 'pending_approval' : 'active';

    const allIds: number[] = [];
    
    // Insert Parent (first location)
    const firstLoc = locations[0];
    const parentPayload = {
      title: data.title,
      price: parseFloat(data.price) || 0,
      category: data.category || null,
      location: firstLoc.location,
      description: data.description || null,
      image: imageToSave,
      user_id: parseInt(data.user_id, 10),
      time: time,
      contact_email: data.contact_email || null,
      contact_phone: data.contact_phone || null,
      postal_code: firstLoc.postal_code,
      youtube_link: data.youtube_link || null,
      facebook_link: data.facebook_link || null,
      price_type: data.price_type || 'amount',
      parent_id: null,
      latitude: firstLoc.latitude,
      longitude: firstLoc.longitude,
      status: listingStatus,
    };

    const { data: parentListing, error: parentError } = await supabase
      .from('listings')
      .insert(parentPayload)
      .select()
      .single();

    if (parentError || !parentListing) {
      throw parentError || new Error('Failed to create parent listing');
    }
    
    allIds.push(parentListing.id);
    const parentId = parentListing.id;

    // Insert Children (if multi-city)
    if (locations.length > 1) {
      const childrenPayloads = locations.slice(1).map(loc => ({
        ...parentPayload,
        location: loc.location,
        postal_code: loc.postal_code,
        latitude: loc.latitude,
        longitude: loc.longitude,
        parent_id: parentId
      }));

      const { data: childrenListings, error: childrenError } = await supabase
        .from('listings')
        .insert(childrenPayloads)
        .select('id');

      if (childrenError) {
        throw childrenError;
      }
      
      if (childrenListings) {
        allIds.push(...childrenListings.map(c => c.id));
      }
    }

    // ── Create approval records if needed ──
    if (needsApproval) {
      const approvalRecords = [];
      for (const listingId of allIds) {
        for (const ts of templateStages) {
          approvalRecords.push({
            listing_id: listingId,
            template_id: approvalTemplate.id,
            stage_id: ts.stage_id,
            status: 'pending',
          });
        }
      }

      if (approvalRecords.length > 0) {
        const { error: approvalError } = await supabase
          .from('listing_approvals')
          .insert(approvalRecords);

        if (approvalError) {
          console.error('Failed to create approval records:', approvalError);
          // Don't throw — the listing is created, just no approval tracking
        }
      }
    }

    // ── Send Notification Email to Admins ──
    try {
      const { data: admins } = await supabase
        .from('users')
        .select('email')
        .eq('role', 'admin');

      const adminEmails = (admins || []).map(a => a.email).filter(Boolean);

      if (adminEmails.length > 0) {
        const originUrl = new URL(req.url);
        const baseUrl = `${originUrl.protocol}//${originUrl.host}`;

        const emailHtml = getThemedEmailHtml(
          'New Ad Submission',
          `
            <h1 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 800; color: #111111; text-align: center; font-family: system-ui, sans-serif;">New Ad Submission</h1>
            <p style="margin: 0 0 25px 0; font-size: 15px; line-height: 1.6; color: #5B616A; text-align: center;">
              A new ad has been posted on HitAds.ca.
            </p>
            
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; margin: 25px 0; padding: 20px; font-family: system-ui, sans-serif;">
              <tr>
                <td style="padding-bottom: 12px; font-size: 14px; font-weight: bold; color: #5B616A; width: 120px;">Title:</td>
                <td style="padding-bottom: 12px; font-size: 14px; color: #111111; font-weight: bold;">${data.title}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 12px; font-size: 14px; font-weight: bold; color: #5B616A;">Category:</td>
                <td style="padding-bottom: 12px; font-size: 14px; color: #111111;">${data.category || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 12px; font-size: 14px; font-weight: bold; color: #5B616A;">Price:</td>
                <td style="padding-bottom: 12px; font-size: 14px; color: #111111;">$${data.price} (${data.price_type || 'amount'})</td>
              </tr>
              <tr>
                <td style="padding-bottom: 12px; font-size: 14px; font-weight: bold; color: #5B616A;">Location:</td>
                <td style="padding-bottom: 12px; font-size: 14px; color: #111111;">${data.location || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding-bottom: 12px; font-size: 14px; font-weight: bold; color: #5B616A;">Status:</td>
                <td style="padding-bottom: 12px; font-size: 14px;">
                  ${needsApproval 
                    ? '<span style="color: #F2994A; font-weight: bold;">Pending Approval</span>' 
                    : '<span style="color: #27AE60; font-weight: bold;">Live Immediately</span>'}
                </td>
              </tr>
              <tr>
                <td style="vertical-align: top; font-size: 14px; font-weight: bold; color: #5B616A; padding-top: 4px;">Description:</td>
                <td style="font-size: 14px; line-height: 1.6; color: #111111; padding-top: 4px;">${data.description || 'No description provided.'}</td>
              </tr>
            </table>

            <div style="text-align: center; margin-bottom: 25px; margin-top: 25px;">
              <a href="${baseUrl}/dashboard" style="display: inline-block; padding: 13px 28px; background-color: #1774F5; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(23, 116, 245, 0.2);">Open Admin Dashboard</a>
            </div>
          `
        );

        for (const email of adminEmails) {
          try {
            await sendEmail(email, `HitAds.ca - New Ad Posted: ${data.title}`, emailHtml);
          } catch (sendErr) {
            console.error(`Failed to send admin notification to ${email}:`, sendErr);
          }
        }
      }
    } catch (adminErr) {
      console.error('Failed to query admins or trigger notification emails:', adminErr);
    }

    return NextResponse.json({
      success: true,
      id: allIds[0],
      all_ids: allIds,
      cities_count: allIds.length,
      status: listingStatus,
      needs_approval: needsApproval,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create listing error:', error);
    return NextResponse.json({ success: false, error: 'Database error: ' + error.message }, { status: 500 });
  }
}
