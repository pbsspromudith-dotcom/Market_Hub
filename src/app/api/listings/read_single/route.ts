import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    const listing = await prisma.listings.findUnique({
      where: { id }
    });

    if (!listing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    let seller = null;
    if (listing.user_id) {
      seller = await prisma.users.findUnique({
        where: { id: listing.user_id },
        select: {
          name: true,
          avatar: true,
          join_date: true,
          email: true,
          phone: true
        }
      });
    }

    // Increment views
    const currentViews = listing.views || 0;
    await prisma.listings.update({
      where: { id },
      data: { views: currentViews + 1 }
    });
    
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
