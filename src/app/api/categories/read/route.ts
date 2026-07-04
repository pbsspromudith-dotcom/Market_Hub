export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: categories, error } = await supabase
      .from('category')
      .select('*')
      .eq('IsActive', true)
      .order('SortOrder', { ascending: true });

    if (error) throw error;

    const buildCategoryTree = (elements: any[], parentId: number | null = null): any[] => {
      const branch: any[] = [];
      for (const element of elements) {
        if (element.ParentCategoryID === parentId) {
          const children = buildCategoryTree(elements, element.CategoryID);
          element.children = children;
          branch.push(element);
        }
      }
      return branch;
    };

    const tree = buildCategoryTree(categories, null);

    return NextResponse.json({
      success: true,
      data: tree
    });

  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({
      success: false,
      error: "Database read error: " + error.message
    }, { status: 500 });
  }
}
