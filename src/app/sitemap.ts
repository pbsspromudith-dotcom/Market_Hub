import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hitads.ca';

  // 1. Core static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/post-ad`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/help`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    }
  ];

  // 2. Fetch Categories dynamically
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const categories = await prisma.category.findMany({
      where: { IsActive: true },
      select: { Slug: true, CategoryName: true }
    });
    
    categoryRoutes = categories.map((cat) => ({
      url: `${baseUrl}/search?category=${encodeURIComponent(cat.Slug || cat.CategoryName)}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    }));
  } catch (error) {
    console.error("Sitemap category fetch error:", error);
  }

  // 3. Fetch Listings dynamically
  let listingRoutes: MetadataRoute.Sitemap = [];
  try {
    // Only grab active/published listings (in this schema, all existing are active unless deleted)
    const listings = await prisma.listings.findMany({
      select: { id: true, created_at: true },
      orderBy: { created_at: 'desc' },
      take: 20000 // Limit to prevent memory issues for massive dbs, or paginate if needed. Next.js limit is 50k
    });

    listingRoutes = listings.map((listing) => ({
      url: `${baseUrl}/item/${listing.id}`,
      lastModified: listing.created_at ? new Date(listing.created_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Sitemap listings fetch error:", error);
  }

  // Combine and return all routes (Must be under 50,000 URLs per Next.js spec)
  return [...staticRoutes, ...categoryRoutes, ...listingRoutes];
}
