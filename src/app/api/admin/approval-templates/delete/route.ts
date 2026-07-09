import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST - Delete an approval template
export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: 'Template ID is required' }, { status: 400 });
    }

    // Check if template is in use by any pending listings
    const { data: usages } = await supabase
      .from('listing_approvals')
      .select('id')
      .eq('template_id', id)
      .eq('status', 'pending')
      .limit(1);

    if (usages && usages.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'This template is in use by pending listings. Resolve those approvals first.'
      }, { status: 400 });
    }

    // Delete template (cascade will remove template_stages)
    const { error } = await supabase
      .from('approval_templates')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Template deleted' });
  } catch (error: any) {
    console.error('Delete approval template error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
