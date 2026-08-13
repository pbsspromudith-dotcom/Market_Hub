export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { listing_id, meta_title, meta_desc, keywords, focus_keyword, image_alt_text, reset } = body;

    if (!listing_id) {
      return NextResponse.json({ success: false, message: 'listing_id is required' }, { status: 400 });
    }

    const id = parseInt(String(listing_id), 10);

    if (reset) {
      // Delete custom SEO record
      const { error } = await supabase
        .from('listing_seo')
        .delete()
        .eq('listing_id', id);

      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: 'Listing SEO reset to auto-generation.',
      });
    }

    // Upsert SEO record
    const payload = {
      listing_id: id,
      meta_title: meta_title?.trim() || null,
      meta_desc: meta_desc?.trim() || null,
      keywords: keywords?.trim() || null,
      focus_keyword: focus_keyword?.trim() || null,
      image_alt_text: image_alt_text?.trim() || null,
      updated_at: new Date().toISOString(),
    };

    const { data: existing } = await supabase
      .from('listing_seo')
      .select('id')
      .eq('listing_id', id)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('listing_seo')
        .update(payload)
        .eq('listing_id', id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('listing_seo')
        .insert(payload);
      if (error) throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Listing SEO updated successfully.',
    });
  } catch (error: any) {
    console.error('Error updating listing SEO:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
