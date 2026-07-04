import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const { data: rows, error } = await supabase.from('seo_settings').select('*');
    if (error) throw error;
    
    const settings: Record<string, string> = {};
    for (const row of rows) {
      settings[row.setting_key] = row.setting_value;
    }

    return NextResponse.json({
      success: true,
      settings
    });
  } catch (error: any) {
    console.error('Error reading seo settings:', error);
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}
