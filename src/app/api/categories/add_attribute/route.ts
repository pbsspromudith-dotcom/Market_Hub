import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { category_id, attribute_name, attribute_type, is_required, options } = await request.json();

    if (!category_id || !attribute_name) {
      return NextResponse.json(
        { success: false, message: 'category_id and attribute_name are required.' },
        { status: 400 }
      );
    }

    const { data: attr, error: attrError } = await supabase
      .from('categoryattribute')
      .insert({
        CategoryID: category_id,
        AttributeName: attribute_name,
        AttributeType: attribute_type || 'Text',
        IsRequired: Boolean(is_required),
      })
      .select()
      .single();

    if (attrError) throw attrError;

    if (Array.isArray(options) && options.length > 0 && attr?.AttributeID) {
      const optionRows = options.map((opt: string) => ({
        AttributeID: attr.AttributeID,
        OptionValue: opt.trim(),
      }));

      const { error: optError } = await supabase
        .from('categoryattributeoption')
        .insert(optionRows);

      if (optError) throw optError;
    }

    return NextResponse.json({
      success: true,
      message: 'Attribute added successfully.',
      data: attr,
    });
  } catch (error: any) {
    console.error('Error adding attribute:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to add attribute.' },
      { status: 500 }
    );
  }
}
