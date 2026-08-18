import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { category_id, template_config } = await request.json();

    if (!category_id) {
      return NextResponse.json(
        { success: false, message: 'category_id is required.' },
        { status: 400 }
      );
    }

    const configStr = template_config ? (typeof template_config === 'string' ? template_config : JSON.stringify(template_config)) : null;

    const { error } = await supabase
      .from('category')
      .update({ template_config: configStr })
      .eq('CategoryID', category_id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Template configuration saved successfully.',
    });
  } catch (error: any) {
    console.error('Error saving template config:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to save template config.' },
      { status: 500 }
    );
  }
}
