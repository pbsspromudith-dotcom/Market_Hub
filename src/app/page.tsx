import Home from '@/old_pages/Home';
import { supabase } from '@/lib/supabase';

// Make page fully dynamic so it doesn't attempt to connect to the DB during build
export const dynamic = 'force-dynamic';

export default async function Page() {
  let initialCategories: any[] = [];
  let initialSeoSettings: Record<string, string> = {};

  try {
    // Fetch Top-Level Categories and SEO/Homepage Settings in parallel to cut TTFB latency
    const [catResult, seoResult] = await Promise.all([
      supabase
        .from('category')
        .select('*')
        .eq('IsActive', true)
        .is('ParentCategoryID', null)
        .order('SortOrder', { ascending: true }),
      supabase
        .from('seo_settings')
        .select('*')
    ]);

    if (!catResult.error && catResult.data) {
      initialCategories = catResult.data.map((cat: any) => ({
        name: cat.CategoryName,
        icon: cat.Icon || 'category'
      }));
    }

    if (!seoResult.error && seoResult.data) {
      for (const row of seoResult.data) {
        initialSeoSettings[row.setting_key] = row.setting_value;
      }
    }
  } catch (error) {
    console.error("Error fetching initial data in Page:", error);
  }

  return (
    <Home 
      isLoggedIn={false} 
      initialCategories={initialCategories} 
      initialSeoSettings={initialSeoSettings} 
    />
  );
}
