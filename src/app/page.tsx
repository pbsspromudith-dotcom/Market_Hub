import Home from '@/old_pages/Home';
import { pool } from '@/lib/prisma';

// Revalidate occasionally, or keep it dynamic
export const revalidate = 60; // Cache for 60 seconds to improve Speed Index

export default async function Page() {
  let initialCategories: any[] = [];
  let initialSeoSettings: Record<string, string> = {};

  try {
    const conn = await pool.getConnection();

    // 1. Fetch Top-Level Categories
    const categories = await conn.query('SELECT * FROM category WHERE IsActive = 1 AND ParentCategoryID IS NULL ORDER BY SortOrder ASC');
    
    initialCategories = categories.map((cat: any) => ({
      name: cat.CategoryName,
      icon: cat.Icon || 'category'
    }));

    // 2. Fetch SEO/Homepage Settings
    const seoRows = await conn.query('SELECT * FROM seo_settings');
    for (const row of seoRows) {
      initialSeoSettings[row.setting_key] = row.setting_value;
    }

    conn.release();
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
