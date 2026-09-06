export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { extractCityName, getExpandedLocationKeywords, isLocationMatch } from '@/utils';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const showAll = url.searchParams.get('show_all') === 'true'; // Admin flag
    const userId = url.searchParams.get('user_id'); // For user's own listings
    const locationParam = url.searchParams.get('location') || url.searchParams.get('loc') || url.searchParams.get('city');

    let query = supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });

    // Public reads: only show active listings
    // Admin reads (show_all=true): show everything
    // User's own listings: show all statuses for that user
    if (userId) {
      query = query.eq('user_id', parseInt(userId, 10));
    } else if (!showAll) {
      query = query.or('status.eq.active,status.is.null');
    }

    // Filter by location / city (including expanded sub-cities) if provided
    if (!showAll && !userId && locationParam) {
      const cleanLoc = locationParam.trim();
      if (
        cleanLoc && 
        cleanLoc.toLowerCase() !== 'all' && 
        cleanLoc.toLowerCase() !== 'canada' && 
        cleanLoc.toLowerCase() !== 'nationwide' && 
        cleanLoc.toLowerCase() !== 'canada wide'
      ) {
        const keywords = getExpandedLocationKeywords(cleanLoc);
        if (keywords.length === 1) {
          query = query.ilike('location', `%${keywords[0]}%`);
        } else if (keywords.length > 1) {
          const conditions = keywords.map(kw => `location.ilike.%${kw}%`).join(',');
          query = query.or(conditions);
        }
      }
    }

    const { data: listingsList, error } = await query;

    if (error) throw error;

    // Strict in-memory verification filter to ensure precise location matching
    let validListings = listingsList || [];
    if (!showAll && !userId && locationParam) {
      const cleanLoc = locationParam.trim();
      if (
        cleanLoc && 
        cleanLoc.toLowerCase() !== 'all' && 
        cleanLoc.toLowerCase() !== 'canada' && 
        cleanLoc.toLowerCase() !== 'nationwide' && 
        cleanLoc.toLowerCase() !== 'canada wide'
      ) {
        validListings = validListings.filter(row => isLocationMatch(row.location, cleanLoc));
      }
    }

    let userMap = new Map();
    if (showAll && validListings.length > 0) {
      const uIds = [...new Set(validListings.filter(l => l.user_id).map(l => l.user_id))];
      if (uIds.length > 0) {
        const { data: usersData } = await supabase
          .from('users')
          .select('id, name, email, phone')
          .in('id', uIds);
        userMap = new Map((usersData || []).map(u => [u.id, u]));
      }
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

    const mappedListings = validListings.map(row => {
      let image = row.image;
      let allImages: string[] = row.image ? [row.image] : [];

      if (row.image && row.image.startsWith('[')) {
        try {
          const parsed = JSON.parse(row.image);
          if (Array.isArray(parsed)) {
            if (parsed.length > 0) {
              image = parsed[0];
              allImages = parsed;
            } else {
              image = null;
              allImages = [];
            }
          }
        } catch (e) {
          // ignore parse error
        }
      }

      // Check if promotions are expired
      const now = new Date();
      let { is_top_ad, is_highlighted, is_urgent, is_home_gallery } = row;
      const promotion_expires_at = (row as any).promotion_expires_at;
      
      const had_promotion = !!(row.is_top_ad || row.is_highlighted || row.is_urgent || row.is_home_gallery || promotion_expires_at);
      let is_promo_expired = false;

      if (promotion_expires_at && new Date(promotion_expires_at) < now) {
        is_top_ad = false;
        is_highlighted = false;
        is_urgent = false;
        is_home_gallery = false;
        is_promo_expired = true;
      }

      const createdDate = row.created_at ? new Date(row.created_at) : new Date();
      const expiresAt = (row as any).expires_at || new Date(createdDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
      const poster = row.user_id ? userMap.get(row.user_id) : null;
      const targetEmail = row.contact_email || poster?.email || '';

      return {
        ...row,
        expires_at: expiresAt,
        poster_name: poster?.name || null,
        poster_email: poster?.email || null,
        target_email: targetEmail,
        had_promotion,
        is_promo_expired,
        is_top_ad,
        is_highlighted,
        is_urgent,
        is_home_gallery,
        image: fixImagePath(image),
        allImages: allImages.map(fixImagePath).filter((x): x is string => typeof x === 'string' && x.length > 0)
      };
    });

    // Auto-update expired records in database asynchronously
    const expiredIds = listingsList
      .filter(row => row.promotion_expires_at && new Date(row.promotion_expires_at) < new Date() && (row.is_top_ad || row.is_highlighted || row.is_urgent || row.is_home_gallery))
      .map(row => row.id);

    if (expiredIds.length > 0) {
      supabase
        .from('listings')
        .update({
          is_top_ad: false,
          is_highlighted: false,
          is_urgent: false,
          is_home_gallery: false,
        })
        .in('id', expiredIds)
        .then(({ error }) => {
          if (error) console.error('Error auto-clearing expired promotions in DB:', error);
        });
    }

    // Sort: Top ads first, then by newest
    mappedListings.sort((a, b) => {
      if (a.is_top_ad && !b.is_top_ad) return -1;
      if (!a.is_top_ad && b.is_top_ad) return 1;
      
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });

    return NextResponse.json(mappedListings);
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
