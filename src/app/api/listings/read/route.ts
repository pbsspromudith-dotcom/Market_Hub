export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: listingsList, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

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

    const mappedListings = listingsList.map(row => {
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
      
      if (promotion_expires_at && new Date(promotion_expires_at) < now) {
        is_top_ad = false;
        is_highlighted = false;
        is_urgent = false;
        is_home_gallery = false;
      }

      return {
        ...row,
        is_top_ad,
        is_highlighted,
        is_urgent,
        is_home_gallery,
        image: fixImagePath(image),
        allImages: allImages.map(fixImagePath)
      };
    });

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
