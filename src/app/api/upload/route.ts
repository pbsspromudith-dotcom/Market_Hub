import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const images = formData.getAll('images[]');

    if (!images || images.length === 0) {
      return NextResponse.json({ success: false, message: 'No images uploaded' }, { status: 400 });
    }

    const imageUrls: string[] = [];
    const BUCKET_NAME = 'uploads';

    for (const file of images) {
      if (file && typeof file === 'object' && 'arrayBuffer' in file && 'name' in file && 'type' in file) {
        const buffer = Buffer.from(await file.arrayBuffer());
        
        // Generate unique filename
        const ext = file.name.split('.').pop() || 'png';
        const filename = `${Date.now()}-${Math.floor(Math.random() * 100000000)}.${ext}`;
        
        // Upload to Supabase Storage
        const { error } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filename, buffer, {
            contentType: file.type || 'image/png',
            cacheControl: '31536000', // 1 year cache for CDN and Browser
            upsert: false
          });

        if (error) {
          console.error('Supabase upload error for file:', file.name, error);
          throw error;
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(filename);
          
        imageUrls.push(publicUrlData.publicUrl);
      }
    }

    return NextResponse.json({ success: true, imageUrls });
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json({ success: false, message: 'File upload failed' }, { status: 500 });
  }
}
