import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST - Delete an approval stage
export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: 'Stage ID is required' }, { status: 400 });
    }

    // Check if the stage is used in any templates
    const { data: usages } = await supabase
      .from('approval_template_stages')
      .select('id')
      .eq('stage_id', id)
      .limit(1);

    if (usages && usages.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'This stage is assigned to one or more templates. Remove it from all templates before deleting.'
      }, { status: 400 });
    }

    const { error } = await supabase
      .from('approval_stages')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Stage deleted' });
  } catch (error: any) {
    console.error('Delete approval stage error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
