export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - List all listings pending approval with their stage statuses
export async function GET() {
  try {
    // Get all listings with pending_approval status
    const { data: pendingListings, error: listingsError } = await supabase
      .from('listings')
      .select('*')
      .eq('status', 'pending_approval')
      .order('created_at', { ascending: false });

    if (listingsError) throw listingsError;

    if (!pendingListings || pendingListings.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const listingIds = pendingListings.map(l => l.id);

    // Get approval records for these listings
    const { data: approvals, error: appError } = await supabase
      .from('listing_approvals')
      .select('*')
      .in('listing_id', listingIds)
      .order('created_at', { ascending: true });

    if (appError) throw appError;

    // Get stage details
    const stageIds = [...new Set((approvals || []).map(a => a.stage_id))];
    let stageMap = new Map();
    if (stageIds.length > 0) {
      const { data: stages } = await supabase
        .from('approval_stages')
        .select('*')
        .in('id', stageIds);
      stageMap = new Map((stages || []).map(s => [s.id, s]));
    }

    // Get user info for reviewers
    const reviewerIds = [...new Set((approvals || []).filter(a => a.reviewed_by).map(a => a.reviewed_by))];
    let reviewerMap = new Map();
    if (reviewerIds.length > 0) {
      const { data: reviewers } = await supabase
        .from('users')
        .select('id, name')
        .in('id', reviewerIds);
      reviewerMap = new Map((reviewers || []).map(r => [r.id, r]));
    }

    // Get user info for the listing poster
    const posterIds = [...new Set(pendingListings.filter(l => l.user_id).map(l => l.user_id))];
    let posterMap = new Map();
    if (posterIds.length > 0) {
      const { data: posters } = await supabase
        .from('users')
        .select('id, name, email')
        .in('id', posterIds);
      posterMap = new Map((posters || []).map(p => [p.id, p]));
    }

    const fixImagePath = (path: string | null) => {
      if (!path) return path;
      if (path.startsWith('/api/uploads/')) {
        return path;
      }
      if (path.startsWith('/uploads/')) {
        return '/api' + path;
      }
      return path;
    };

    // Assemble result
    const result = pendingListings.map(listing => {
      let image = listing.image;
      if (listing.image && listing.image.startsWith('[')) {
        try {
          const parsed = JSON.parse(listing.image);
          if (Array.isArray(parsed) && parsed.length > 0) {
            image = parsed[0];
          } else {
            image = null;
          }
        } catch (e) {
          // ignore
        }
      }

      return {
        ...listing,
        image: fixImagePath(image),
        poster: posterMap.get(listing.user_id) || null,
        approval_stages: (approvals || [])
          .filter(a => a.listing_id === listing.id)
          .map(a => ({
            ...a,
            stage: stageMap.get(a.stage_id) || null,
            reviewer: a.reviewed_by ? reviewerMap.get(a.reviewed_by) || null : null,
          })),
      };
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Read pending approvals error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
