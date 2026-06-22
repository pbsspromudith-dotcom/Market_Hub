import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const images = formData.getAll('images[]');

    if (!images || images.length === 0) {
      return NextResponse.json({ success: false, message: 'No images uploaded' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'api', 'uploads');
    
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const imageUrls: string[] = [];

    for (const file of images) {
      if (file && typeof file === 'object' && 'arrayBuffer' in file) {
        const buffer = Buffer.from(await file.arrayBuffer());
        // Generate unique filename
        const ext = file.name.split('.').pop() || 'png';
        const filename = `${Date.now()}-${Math.floor(Math.random() * 100000000)}.${ext}`;
        const filePath = path.join(uploadDir, filename);
        
        fs.writeFileSync(filePath, buffer);
        imageUrls.push(`/api/uploads/${filename}`);
      }
    }

    return NextResponse.json({ success: true, imageUrls });
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json({ success: false, message: 'File upload failed' }, { status: 500 });
  }
}
