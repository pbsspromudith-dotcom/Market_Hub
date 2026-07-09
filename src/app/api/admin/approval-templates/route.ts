import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - List all approval templates with their linked stages
export async function GET() {
  try {
    // Fetch templates
    const { data: templates, error: tplError } = await supabase
      .from('approval_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (tplError) throw tplError;

    // Fetch all template-stage links
    const { data: links, error: linkError } = await supabase
      .from('approval_template_stages')
      .select('*')
      .order('stage_order', { ascending: true });

    if (linkError) throw linkError;

    // Fetch all stages for name resolution
    const { data: stages } = await supabase
      .from('approval_stages')
      .select('*')
      .order('stage_order', { ascending: true });

    const stageMap = new Map((stages || []).map(s => [s.id, s]));

    // Attach stages to their templates
    const result = (templates || []).map(tpl => ({
      ...tpl,
      stages: (links || [])
        .filter(l => l.template_id === tpl.id)
        .map(l => ({
          ...l,
          stage: stageMap.get(l.stage_id) || null,
        }))
    }));

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Read approval templates error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Create or update an approval template (including stage assignments)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, template_name, description, is_default, category_id, is_active, stages } = body;

    if (!template_name || !template_name.trim()) {
      return NextResponse.json({ success: false, error: 'Template name is required' }, { status: 400 });
    }

    // If is_default is true, unset other defaults first
    if (is_default) {
      await supabase
        .from('approval_templates')
        .update({ is_default: false })
        .eq('is_default', true);
    }

    let templateId = id;

    if (id) {
      // Update existing template
      const { error } = await supabase
        .from('approval_templates')
        .update({
          template_name: template_name.trim(),
          description: description || null,
          is_default: is_default ?? false,
          category_id: category_id || null,
          is_active: is_active ?? true,
        })
        .eq('id', id);

      if (error) throw error;
    } else {
      // Create new template
      const { data, error } = await supabase
        .from('approval_templates')
        .insert({
          template_name: template_name.trim(),
          description: description || null,
          is_default: is_default ?? false,
          category_id: category_id || null,
          is_active: is_active ?? true,
        })
        .select()
        .single();

      if (error) throw error;
      templateId = data.id;
    }

    // Upsert stage assignments if provided
    if (stages && Array.isArray(stages)) {
      // Delete existing stage links for this template
      await supabase
        .from('approval_template_stages')
        .delete()
        .eq('template_id', templateId);

      // Insert new stage links
      if (stages.length > 0) {
        const stageLinks = stages.map((s: any, idx: number) => ({
          template_id: templateId,
          stage_id: s.stage_id,
          stage_order: s.stage_order ?? idx,
          is_required: s.is_required ?? true,
        }));

        const { error: linkError } = await supabase
          .from('approval_template_stages')
          .insert(stageLinks);

        if (linkError) throw linkError;
      }
    }

    return NextResponse.json({
      success: true,
      id: templateId,
      message: id ? 'Template updated' : 'Template created'
    }, { status: id ? 200 : 201 });
  } catch (error: any) {
    console.error('Create/update approval template error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
