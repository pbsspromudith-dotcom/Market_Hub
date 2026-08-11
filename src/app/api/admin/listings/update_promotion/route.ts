import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { listing_id, is_home_gallery, is_top_ad, is_featured, is_highlighted, is_urgent, duration_days } = body;

    if (!listing_id) {
      return NextResponse.json({ success: false, message: 'listing_id is required' }, { status: 400 });
    }

    const updates: any = {};
    if (typeof is_home_gallery === 'boolean') updates.is_home_gallery = is_home_gallery;
    if (typeof is_top_ad === 'boolean') updates.is_top_ad = is_top_ad;
    if (typeof is_featured === 'boolean') updates.is_featured = is_featured;
    if (typeof is_highlighted === 'boolean') updates.is_highlighted = is_highlighted;
    if (typeof is_urgent === 'boolean') updates.is_urgent = is_urgent;

    // If enabling any promotion, calculate expiration date
    const hasAnyActivePromo = 
      (updates.is_home_gallery ?? is_home_gallery) ||
      (updates.is_top_ad ?? is_top_ad) ||
      (updates.is_highlighted ?? is_highlighted) ||
      (updates.is_urgent ?? is_urgent);

    if (hasAnyActivePromo) {
      const days = parseInt(duration_days || '30', 10);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + days);
      updates.promotion_expires_at = expiresAt.toISOString();
    } else if (
      updates.is_home_gallery === false &&
      updates.is_top_ad === false &&
      updates.is_highlighted === false &&
      updates.is_urgent === false
    ) {
      updates.promotion_expires_at = null;
    }

    const { data: updatedListing, error } = await supabase
      .from('listings')
      .update(updates)
      .eq('id', parseInt(listing_id, 10))
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Listing promotions updated successfully',
      listing: updatedListing,
    });
  } catch (error: any) {
    console.error('Error updating listing promotions:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update listing promotions: ' + error.message },
      { status: 500 }
    );
  }
}
