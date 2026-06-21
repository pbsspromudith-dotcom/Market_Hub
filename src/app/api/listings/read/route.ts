import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const listingsList = await prisma.listings.findMany({
      orderBy: {
        created_at: 'desc'
      }
    });

    const fixImagePath = (path: string | null) => {
      if (!path) return path;
      if (path.startsWith('/api/uploads/')) {
        return path;
      }
      if (path.startsWith('/uploads/')) {
        return '/api' + path;
      }
      return path;
    };

    const mappedListings = listingsList.map(row => {
      let image = row.image;
      let allImages: string[] = row.image ? [row.image] : [];

      if (row.image && row.image.startsWith('[')) {
        try {
          const parsed = JSON.parse(row.image);
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
          // ignore parse error
        }
      }

      return {
        ...row,
        image: fixImagePath(image),
        allImages: allImages.map(fixImagePath)
      };
    });

    return NextResponse.json(mappedListings);
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
