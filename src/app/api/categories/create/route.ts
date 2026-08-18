import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { ParentCategoryID, CategoryName, Icon } = await request.json();

    if (!CategoryName || !CategoryName.trim()) {
      return NextResponse.json(
        { success: false, message: 'Category name is required.' },
        { status: 400 }
      );
    }

    const slug = CategoryName.toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const { data, error } = await supabase
      .from('category')
      .insert({
        ParentCategoryID: ParentCategoryID || null,
        CategoryName: CategoryName.trim(),
        Slug: slug,
        Icon: Icon || null,
        IsActive: true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Category created successfully.',
      data,
    });
  } catch (error: any) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create category.' },
      { status: 500 }
    );
  }
}
