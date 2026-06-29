import Home from '@/old_pages/Home';
import { prisma } from '@/lib/prisma';

// Revalidate occasionally, or keep it dynamic
export const revalidate = 60; // Cache for 60 seconds to improve Speed Index

export default async function Page() {
  let initialCategories: any[] = [];
  let initialSeoSettings: Record<string, string> = {};

  try {
    // 1. Fetch Top-Level Categories
    const categories = await prisma.category.findMany({
      where: { IsActive: true, ParentCategoryID: null },
      orderBy: { SortOrder: 'asc' }
    });
    
    initialCategories = categories.map((cat: any) => ({
      name: cat.CategoryName,
      icon: cat.Icon || 'category'
    }));

    // 2. Fetch SEO/Homepage Settings
    const seoRows = await prisma.seo_settings.findMany();
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
