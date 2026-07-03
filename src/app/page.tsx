import Home from '@/old_pages/Home';
import { pool } from '@/lib/prisma';

// Make page fully dynamic so it doesn't attempt to connect to the DB during build
export const dynamic = 'force-dynamic';

export default async function Page() {
  let initialCategories: any[] = [];
  let initialSeoSettings: Record<string, string> = {};

  try {
    // 1. Fetch Top-Level Categories
    const categories = await pool.query('SELECT * FROM category WHERE IsActive = 1 AND ParentCategoryID IS NULL ORDER BY SortOrder ASC');
    
    initialCategories = categories.map((cat: any) => ({
      name: cat.CategoryName,
      icon: cat.Icon || 'category'
    }));

    // 2. Fetch SEO/Homepage Settings
    const seoRows = await pool.query('SELECT * FROM seo_settings');
    for (const row of seoRows) {
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
