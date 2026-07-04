import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hitads.ca';

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
    const { data: categories, error } = await supabase
      .from('category')
      .select('Slug, CategoryName')
      .eq('IsActive', true);
      
    if (error) throw error;
    
    categoryRoutes = (categories || []).map((cat) => ({
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
    // Only grab active/published listings
    const { data: listings, error } = await supabase
      .from('listings')
      .select('id, created_at')
      .order('created_at', { ascending: false })
      .limit(20000);

    if (error) throw error;

    listingRoutes = (listings || []).map((listing) => ({
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
