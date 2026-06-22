import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.id || !data.title || data.price === undefined || !data.user_id) {
      return NextResponse.json({ success: false, error: 'Required fields missing' }, { status: 400 });
    }

    let imageToSave: string | null = null;
    if (data.image && Array.isArray(data.image) && data.image.length > 0) {
      imageToSave = JSON.stringify(data.image);
    }

    // 1. Fetch current listing to verify owner/auth
    const listing = await prisma.listings.findUnique({
      where: { id: parseInt(data.id, 10) },
      select: { user_id: true, parent_id: true }
    });

    if (!listing) {
      return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 });
    }

    // Verify owner or admin status
    if (listing.user_id !== parseInt(data.user_id, 10)) {
      const user = await prisma.users.findUnique({
        where: { id: parseInt(data.user_id, 10) },
        select: { role: true }
      });
      
      const userRole = user?.role?.trim().toLowerCase() || '';
      
      if (userRole !== 'admin') {
        return NextResponse.json({ success: false, error: 'Unauthorized to edit this listing' }, { status: 403 });
      }
    }

    await prisma.$transaction(async (tx) => {
      // 2. Perform UPDATE
      await tx.listings.update({
        where: { id: parseInt(data.id, 10) },
        data: {
          title: data.title,
          price: parseFloat(data.price) || 0,
          category: data.category || null,
          location: data.location || null,
          description: data.description || null,
          image: imageToSave,
          contact_email: data.contact_email || null,
          contact_phone: data.contact_phone || null,
          postal_code: data.postal_code || null,
          youtube_link: data.youtube_link || null,
          facebook_link: data.facebook_link || null,
          price_type: data.price_type || 'amount',
          latitude: data.latitude ? data.latitude.toString() : null,
          longitude: data.longitude ? data.longitude.toString() : null,
        }
      });

      // Sync edits to child/sibling listings (multi-city copies)
      const pId = listing.parent_id || parseInt(data.id, 10);

      await tx.listings.updateMany({
        where: {
          OR: [
            { id: pId },
            { parent_id: pId }
          ],
          NOT: {
            id: parseInt(data.id, 10)
          }
        },
        data: {
          title: data.title,
          price: parseFloat(data.price) || 0,
          category: data.category || null,
          description: data.description || null,
          image: imageToSave,
          contact_email: data.contact_email || null,
          contact_phone: data.contact_phone || null,
          youtube_link: data.youtube_link || null,
          facebook_link: data.facebook_link || null,
          price_type: data.price_type || 'amount',
        }
      });
    });

    return NextResponse.json({ success: true, message: 'Listing updated successfully' }, { status: 200 });

  } catch (error: any) {
    console.error('Update listing error:', error);
    return NextResponse.json({ success: false, error: 'Database error: ' + error.message }, { status: 500 });
  }
}
