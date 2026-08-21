export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Option ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('options')
      .delete()
      .eq('id', parseInt(String(id), 10));

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Option deleted successfully.'
    });
  } catch (error: any) {
    console.error('Error deleting option:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete option' },
      { status: 500 }
    );
  }
}
