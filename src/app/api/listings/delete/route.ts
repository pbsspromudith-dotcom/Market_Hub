import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function DELETE(req: Request) {
  try {
    const data = await req.json();

    if (!data.id) {
      return NextResponse.json({ success: false, error: 'Listing ID required' }, { status: 400 });
    }

    const deleteAll = data.delete_all === true;
    let targetId = parseInt(data.id, 10);

    if (deleteAll) {
      const { data: parentCheck } = await supabase
        .from('listings')
        .select('parent_id')
        .eq('id', targetId)
        .maybeSingle();
        
      if (parentCheck && parentCheck.parent_id) {
        targetId = parentCheck.parent_id;
      }
      
      const { error: deleteError } = await supabase
        .from('listings')
        .delete()
        .or(`id.eq.${targetId},parent_id.eq.${targetId}`);
        
      if (deleteError) throw deleteError;
    } else {
      const { error: deleteError } = await supabase
        .from('listings')
        .delete()
        .eq('id', targetId);
        
      if (deleteError) throw deleteError;
    }

    return NextResponse.json({ success: true, message: 'Listing deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Delete listing error:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}
