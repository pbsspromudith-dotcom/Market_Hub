export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const listingId = searchParams.get('listing_id');

    if (!listingId) {
      return NextResponse.json({ success: false, message: 'listing_id required' }, { status: 400 });
    }

    const { data: listing, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', parseInt(listingId, 10))
      .maybeSingle();

    if (error || !listing) {
      return NextResponse.json({ success: false, message: 'Listing not found' }, { status: 404 });
    }

    const title = listing.title || 'Item';
    const location = listing.location || 'Canada';
    const category = listing.category || 'Classifieds';
    const priceFormatted = Number(listing.price) > 0 ? `$${Number(listing.price).toFixed(2)}` : 'Best Price';

    const meta_title = `${title} for Sale in ${location} | ${priceFormatted} | HitAds.ca`.slice(0, 60);
    const meta_desc = `Buy ${title} in ${location} for ${priceFormatted}. Browse photos, details, seller contacts & more on HitAds.ca — Canada's free ads marketplace.`.slice(0, 160);
    
    const words = title.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3);
    const focus_keyword = words.slice(0, 3).join(' ') + ` ${location.split(',')[0].toLowerCase()}`;
    const keywords = Array.from(new Set([...words, category.toLowerCase(), location.toLowerCase(), 'buy and sell canada', 'free ads'])).join(', ');
    const image_alt_text = `${title} for sale in ${location} on HitAds.ca`;

    return NextResponse.json({
      success: true,
      generated: {
        meta_title,
        meta_desc,
        keywords,
        focus_keyword,
        image_alt_text,
      }
    });
  } catch (error: any) {
    console.error('Error generating listing SEO:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
