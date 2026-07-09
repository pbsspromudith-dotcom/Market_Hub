export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const idStr = searchParams.get('id');

  if (!idStr) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const id = parseInt(idStr, 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const { data: listing, error: findError } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (findError || !listing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Check approval status
    const status = listing.status || 'active';
    if (status !== 'active') {
      const viewerIdStr = searchParams.get('viewer_id');
      const viewerRole = searchParams.get('viewer_role');

      const isOwner = viewerIdStr && listing.user_id === parseInt(viewerIdStr, 10);
      const isAdmin = viewerRole === 'admin';

      if (!isOwner && !isAdmin) {
        return NextResponse.json({ error: 'This listing is pending approval or is not active.' }, { status: 403 });
      }
    }

    let seller = null;
    if (listing.user_id) {
      const { data: sellerData } = await supabase
        .from('users')
        .select('name, avatar, join_date, email, phone')
        .eq('id', listing.user_id)
        .maybeSingle();
      
      seller = sellerData;
    }

    // Increment views
    const currentViews = listing.views || 0;
    await supabase
      .from('listings')
      .update({ views: currentViews + 1 })
      .eq('id', id);
    
    // Update local variable
    listing.views = currentViews + 1;

    // Fix image paths
    const fixImagePath = (path: string | null) => {
      if (!path) return path;
      if (path.startsWith('/api/uploads/')) return path;
      if (path.startsWith('/uploads/')) return `/api${path}`;
      return path;
    };

    let image = listing.image;
    let allImages: string[] = listing.image ? [listing.image] : [];

    if (listing.image && listing.image.startsWith('[')) {
      try {
        const parsed = JSON.parse(listing.image);
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
        // Not valid JSON, keep as is
      }
    }

    const PLACEHOLDER_PHONE = '+1 (555) 123-4567';
    
    const formattedListing: any = {
      ...listing,
      image: fixImagePath(image),
      allImages: allImages.map(fixImagePath),
      seller_name: seller?.name,
      seller_avatar: seller?.avatar,
      seller_join_date: seller?.join_date,
      seller_email: seller?.email,
      seller_phone: seller?.phone
    };

    // Null out placeholder default phone/email
    if (formattedListing.seller_phone && formattedListing.seller_phone.trim() === PLACEHOLDER_PHONE) {
      formattedListing.seller_phone = null;
    }
    if (formattedListing.contact_phone && formattedListing.contact_phone.trim() === PLACEHOLDER_PHONE) {
      formattedListing.contact_phone = null;
    }

    return NextResponse.json(formattedListing, { status: 200 });

  } catch (error) {
    console.error('Read single listing error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
