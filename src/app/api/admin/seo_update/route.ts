import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { success: false, message: 'Invalid payload provided' },
        { status: 400 }
      );
    }

    const updates = Object.entries(data).map(([setting_key, val]) => ({
      setting_key,
      setting_value: val !== null && val !== undefined ? String(val) : '',
      updated_at: new Date().toISOString(),
    }));

    if (updates.length > 0) {
      const { error } = await supabase
        .from('seo_settings')
        .upsert(updates, { onConflict: 'setting_key' });

      if (error) {
        console.error('Supabase SEO update error:', error);
        throw error;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'SEO settings saved successfully',
    });
  } catch (error: any) {
    console.error('Error updating SEO settings:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to update SEO settings',
      },
      { status: 500 }
    );
  }
}
