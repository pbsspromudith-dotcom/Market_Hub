export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, option_type, option_value, parent_id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Option ID is required' },
        { status: 400 }
      );
    }

    const payload: any = {};
    if (option_type) payload.option_type = option_type.trim();
    if (option_value !== undefined) payload.option_value = option_value.trim();
    if (parent_id !== undefined) {
      payload.parent_id = (parent_id === '' || parent_id === null) ? null : parseInt(String(parent_id), 10);
    }

    const { data, error } = await supabase
      .from('options')
      .update(payload)
      .eq('id', parseInt(String(id), 10))
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Option updated successfully.',
      data
    });
  } catch (error: any) {
    console.error('Error updating option:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update option' },
      { status: 500 }
    );
  }
}
