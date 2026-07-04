import Home from '@/old_pages/Home';
import { supabase } from '@/lib/supabase';

// Make page fully dynamic so it doesn't attempt to connect to the DB during build
export const dynamic = 'force-dynamic';

export default async function Page() {
  let initialCategories: any[] = [];
  let initialSeoSettings: Record<string, string> = {};

  try {
    // 1. Fetch Top-Level Categories
    const { data: categories, error: catError } = await supabase
      .from('category')
      .select('*')
      .eq('IsActive', true)
      .is('ParentCategoryID', null)
      .order('SortOrder', { ascending: true });
      
    if (catError) throw catError;
    
    initialCategories = (categories || []).map((cat: any) => ({
      name: cat.CategoryName,
      icon: cat.Icon || 'category'
    }));

    // 2. Fetch SEO/Homepage Settings
    const { data: seoRows, error: seoError } = await supabase.from('seo_settings').select('*');
    if (seoError) throw seoError;
    
    for (const row of seoRows || []) {
      initialSeoSettings[row.setting_key] = row.setting_value;
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
