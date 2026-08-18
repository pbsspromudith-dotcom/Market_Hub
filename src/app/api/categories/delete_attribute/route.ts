import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { attribute_id } = await request.json();

    if (!attribute_id) {
      return NextResponse.json(
        { success: false, message: 'attribute_id is required.' },
        { status: 400 }
      );
    }

    // Delete child options first
    await supabase.from('categoryattributeoption').delete().eq('AttributeID', attribute_id);

    // Delete attribute
    const { error } = await supabase
      .from('categoryattribute')
      .delete()
      .eq('AttributeID', attribute_id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Attribute deleted successfully.',
    });
  } catch (error: any) {
    console.error('Error deleting attribute:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete attribute.' },
      { status: 500 }
    );
  }
}
