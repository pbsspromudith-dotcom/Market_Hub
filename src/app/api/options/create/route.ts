export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { option_type, option_value, parent_id } = body;

    if (!option_type || !option_value || !option_value.trim()) {
      return NextResponse.json(
        { success: false, error: 'option_type and option_value are required' },
        { status: 400 }
      );
    }

    const payload: any = {
      option_type: option_type.trim(),
      option_value: option_value.trim(),
    };

    if (parent_id !== undefined && parent_id !== null && parent_id !== '') {
      payload.parent_id = parseInt(String(parent_id), 10);
    } else {
      payload.parent_id = null;
    }

    const { data, error } = await supabase
      .from('options')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Option created successfully.',
      data
    });
  } catch (error: any) {
    console.error('Error creating option:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create option' },
      { status: 500 }
    );
  }
}
