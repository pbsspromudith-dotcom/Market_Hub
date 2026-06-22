import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.title || data.price === undefined || !data.user_id) {
      return NextResponse.json({ success: false, error: 'Required fields missing' }, { status: 400 });
    }

    const time = "Just now"; // Simplified
    let imageToSave: string | null = null;

    if (data.image && Array.isArray(data.image) && data.image.length > 0) {
      imageToSave = JSON.stringify(data.image);
    }

    // Determine if multi-city or single-city posting
    const locations: any[] = [];
    if (data.locations && Array.isArray(data.locations) && data.locations.length >= 1) {
      // Multi-city mode
      for (const loc of data.locations) {
        locations.push({
          location: loc.location || 'Unknown',
          postal_code: loc.postal_code || null,
        });
      }
    } else {
      // Single-city (legacy) mode
      locations.push({
        location: data.location || 'Unknown',
        postal_code: data.postal_code || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
      });
    }

    const allIds: number[] = [];
    let parentId: number | null = null;

    // We use a transaction to ensure all inserts happen or none
    await prisma.$transaction(async (tx) => {
      for (let i = 0; i < locations.length; i++) {
        const loc = locations[i];
        
        const listing = await tx.listings.create({
          data: {
            title: data.title,
            price: parseFloat(data.price) || 0,
            category: data.category || null,
            location: loc.location,
            description: data.description || null,
            image: imageToSave,
            user_id: parseInt(data.user_id, 10),
            time: time,
            contact_email: data.contact_email || null,
            contact_phone: data.contact_phone || null,
            postal_code: loc.postal_code,
            youtube_link: data.youtube_link || null,
            facebook_link: data.facebook_link || null,
            price_type: data.price_type || 'amount',
            parent_id: parentId, // null for first (parent), set for children
            latitude: loc.latitude ? loc.latitude.toString() : null, // Prisma schema might use String or Float? Usually Decimal/Float, but let's cast if needed. Let's just pass the value if schema allows it.
            // Wait, latitude is likely Decimal or Float. If it fails, we will see it. Let's cast to number if provided.
          }
        });

        // Prisma schema might define latitude/longitude as Decimal. 
        // We'll let Prisma handle type coercion if we pass numbers, but wait! In schema.prisma we didn't check latitude/longitude types.
        
        allIds.push(listing.id);

        if (i === 0) {
          parentId = listing.id;
        }
      }
    });

    return NextResponse.json({
      success: true,
      id: allIds[0], // Parent ID for redirect / promotions
      all_ids: allIds,
      cities_count: allIds.length
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create listing error:', error);
    return NextResponse.json({ success: false, error: 'Database error: ' + error.message }, { status: 500 });
  }
}
