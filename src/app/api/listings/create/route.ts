import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
      for (const loc of data.locations) {
        locations.push({
          location: loc.location || 'Unknown',
          postal_code: loc.postal_code || null,
          latitude: null,
          longitude: null,
        });
      }
    } else {
      locations.push({
        location: data.location || 'Unknown',
        postal_code: data.postal_code || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
      });
    }

    const allIds: number[] = [];
    
    // Insert Parent (first location)
    const firstLoc = locations[0];
    const parentPayload = {
      title: data.title,
      price: parseFloat(data.price) || 0,
      category: data.category || null,
      location: firstLoc.location,
      description: data.description || null,
      image: imageToSave,
      user_id: parseInt(data.user_id, 10),
      time: time,
      contact_email: data.contact_email || null,
      contact_phone: data.contact_phone || null,
      postal_code: firstLoc.postal_code,
      youtube_link: data.youtube_link || null,
      facebook_link: data.facebook_link || null,
      price_type: data.price_type || 'amount',
      parent_id: null,
      latitude: firstLoc.latitude,
      longitude: firstLoc.longitude,
    };

    const { data: parentListing, error: parentError } = await supabase
      .from('listings')
      .insert(parentPayload)
      .select()
      .single();

    if (parentError || !parentListing) {
      throw parentError || new Error('Failed to create parent listing');
    }
    
    allIds.push(parentListing.id);
    const parentId = parentListing.id;

    // Insert Children (if multi-city)
    if (locations.length > 1) {
      const childrenPayloads = locations.slice(1).map(loc => ({
        ...parentPayload,
        location: loc.location,
        postal_code: loc.postal_code,
        latitude: loc.latitude,
        longitude: loc.longitude,
        parent_id: parentId
      }));

      const { data: childrenListings, error: childrenError } = await supabase
        .from('listings')
        .insert(childrenPayloads)
        .select('id');

      if (childrenError) {
        throw childrenError;
      }
      
      if (childrenListings) {
        allIds.push(...childrenListings.map(c => c.id));
      }
    }

    return NextResponse.json({
      success: true,
      id: allIds[0],
      all_ids: allIds,
      cities_count: allIds.length
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create listing error:', error);
    return NextResponse.json({ success: false, error: 'Database error: ' + error.message }, { status: 500 });
  }
}
