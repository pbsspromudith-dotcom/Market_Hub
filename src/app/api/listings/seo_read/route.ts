export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const seoStatus = searchParams.get('seo_status') || ''; // 'custom' or 'none'

    const offset = (page - 1) * limit;

    // 1. Fetch categories using lightweight query
    const { data: catRows } = await supabase
      .from('listings')
      .select('category')
      .not('category', 'is', null)
      .limit(500);

    const categoriesSet = new Set<string>();
    if (catRows) {
      catRows.forEach((r: any) => {
        if (r.category) categoriesSet.add(r.category);
      });
    }
    const categories = Array.from(categoriesSet).sort();

    // 2. Handle status filter pre-query if needed
    let customListingIds: number[] = [];
    if (seoStatus === 'custom' || seoStatus === 'none') {
      const { data: seoRows } = await supabase
        .from('listing_seo')
        .select('listing_id');
      
      customListingIds = (seoRows || []).map((r: any) => r.listing_id);
    }

    // 3. Build optimized listings query with DB-level pagination (.range)
    let query = supabase
      .from('listings')
      .select('id, title, price, price_type, category, location, status, created_at', { count: 'exact' })
      .order('id', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`);
    }

    if (seoStatus === 'custom') {
      if (customListingIds.length > 0) {
        query = query.in('id', customListingIds);
      } else {
        // No custom SEO entries exist
        return NextResponse.json({ success: true, data: [], total: 0, page, limit, categories });
      }
    } else if (seoStatus === 'none' && customListingIds.length > 0) {
      // Exclude custom SEO IDs
      query = query.not('id', 'in', `(${customListingIds.join(',')})`);
    }

    // Execute paginated range query on PostgreSQL database
    const { data: pageListings, count, error } = await query.range(offset, offset + limit - 1);
    if (error) throw error;

    const listings = pageListings || [];
    const total = count || 0;

    // 4. Batch-fetch SEO metadata ONLY for the current page IDs (max 50-100 items)
    let pageSeoMap = new Map<number, any>();
    if (listings.length > 0) {
      const pageIds = listings.map((l: any) => l.id);
      const { data: pageSeoRows } = await supabase
        .from('listing_seo')
        .select('*')
        .in('listing_id', pageIds);

      if (pageSeoRows) {
        pageSeoRows.forEach((row: any) => {
          pageSeoMap.set(row.listing_id, row);
        });
      }
    }

    // 5. Merge listing data with batched SEO data
    const data = listings.map((l: any) => {
      const seoData = pageSeoMap.get(l.id) || {};
      return {
        ...l,
        meta_title: seoData.meta_title || '',
        meta_desc: seoData.meta_desc || '',
        keywords: seoData.keywords || '',
        focus_keyword: seoData.focus_keyword || '',
        image_alt_text: seoData.image_alt_text || '',
        seo_score: seoData.seo_score || null,
        has_custom_seo: !!(seoData.meta_title || seoData.meta_desc || seoData.keywords || seoData.focus_keyword),
      };
    });

    return NextResponse.json({
      success: true,
      data,
      total,
      page,
      limit,
      categories,
    });
  } catch (error: any) {
    console.error('Error fetching listing SEO:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
