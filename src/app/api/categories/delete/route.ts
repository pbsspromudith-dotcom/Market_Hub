import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function DELETE(request: Request) {
  try {
    const { CategoryID } = await request.json();

    if (!CategoryID) {
      return NextResponse.json(
        { success: false, message: 'CategoryID is required.' },
        { status: 400 }
      );
    }

    // Delete subcategories first (recursively or children)
    await supabase.from('category').delete().eq('ParentCategoryID', CategoryID);

    // Delete the category itself
    const { error } = await supabase
      .from('category')
      .delete()
      .eq('CategoryID', CategoryID);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully.',
    });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete category.' },
      { status: 500 }
    );
  }
}
