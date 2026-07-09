import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - List all approval stages
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('approval_stages')
      .select('*')
      .order('stage_order', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Read approval stages error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Create or update an approval stage
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, stage_name, description, stage_order, is_active } = body;

    if (!stage_name || !stage_name.trim()) {
      return NextResponse.json({ success: false, error: 'Stage name is required' }, { status: 400 });
    }

    if (id) {
      // Update existing
      const { error } = await supabase
        .from('approval_stages')
        .update({
          stage_name: stage_name.trim(),
          description: description || null,
          stage_order: stage_order ?? 0,
          is_active: is_active ?? true,
        })
        .eq('id', id);

      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Stage updated' });
    } else {
      // Create new
      const { data, error } = await supabase
        .from('approval_stages')
        .insert({
          stage_name: stage_name.trim(),
          description: description || null,
          stage_order: stage_order ?? 0,
          is_active: is_active ?? true,
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, data, message: 'Stage created' }, { status: 201 });
    }
  } catch (error: any) {
    console.error('Create/update approval stage error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
