export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const seoStatus = searchParams.get('seo_status') || ''; // 'custom' or 'none'

    const offset = (page - 1) * limit;

    // 1. Fetch distinct categories for filter dropdown
    const { data: catRows } = await supabase
      .from('listings')
      .select('category')
      .not('category', 'is', null);

    const categoriesSet = new Set<string>();
    if (catRows) {
      catRows.forEach((r: any) => {
        if (r.category) categoriesSet.add(r.category);
      });
    }
    const categories = Array.from(categoriesSet).sort();

    // 2. Fetch listing_seo records
    const { data: seoRows } = await supabase
      .from('listing_seo')
      .select('*');

    const seoMap = new Map<number, any>();
    if (seoRows) {
      seoRows.forEach((row: any) => {
        seoMap.set(row.listing_id, row);
      });
    }

    // 3. Query listings
    let query = supabase
      .from('listings')
      .select('*', { count: 'exact' })
      .order('id', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`);
    }

    const { data: rawListings, count, error } = await query;
    if (error) throw error;

    // Merge SEO data
    let merged = (rawListings || []).map((l: any) => {
      const seoData = seoMap.get(l.id) || {};
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

    // Apply status filter if present
    if (seoStatus === 'custom') {
      merged = merged.filter((item: any) => item.has_custom_seo);
    } else if (seoStatus === 'none') {
      merged = merged.filter((item: any) => !item.has_custom_seo);
    }

    const total = merged.length;
    const paginated = merged.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginated,
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
