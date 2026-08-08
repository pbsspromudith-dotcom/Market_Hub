import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hitads.ca';

  // 1. Core public static routes (Exclude protected / private pages like /login, /post-ad, /profile)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/jobs-toronto`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/real-estate-ontario`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/vehicles-canada`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/safety-tips`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/help`,
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
  ];

  // 2. Fetch Active Categories dynamically
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: categories, error } = await supabase
      .from('category')
      .select('Slug, CategoryName')
      .eq('IsActive', true);

    if (!error && categories) {
      categoryRoutes = categories.map((cat) => ({
        url: `${baseUrl}/search?category=${encodeURIComponent(cat.Slug || cat.CategoryName)}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.85,
      }));
    }
  } catch (error) {
    console.error('Sitemap category fetch error:', error);
  }

  // 3. Fetch Active & Published Listings dynamically (Exclude deleted/expired)
  let listingRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: listings, error } = await supabase
      .from('listings')
      .select('id, created_at, status')
      .not('status', 'eq', 'deleted')
      .not('status', 'eq', 'expired')
      .order('created_at', { ascending: false })
      .limit(10000);

    if (!error && listings) {
      listingRoutes = listings.map((listing) => ({
        url: `${baseUrl}/item/${listing.id}`,
        lastModified: listing.created_at ? new Date(listing.created_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('Sitemap listings fetch error:', error);
  }

  return [...staticRoutes, ...categoryRoutes, ...listingRoutes];
}
