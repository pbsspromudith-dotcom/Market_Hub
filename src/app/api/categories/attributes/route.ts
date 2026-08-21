export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let categoryId = searchParams.get('category_id') ? parseInt(searchParams.get('category_id')!) : null;
    let categoryName = searchParams.get('category_name') || null;
    const directOnly = searchParams.get('direct') === '1' || searchParams.get('direct') === 'true';

    // If no ID but have a name, resolve the name to an ID
    if (!categoryId && categoryName) {
      if (categoryName.includes(' > ')) {
        const parts = categoryName.split(' > ');
        categoryName = parts[parts.length - 1];
      }

      const { data: cat } = await supabase
        .from('category')
        .select('CategoryID')
        .eq('CategoryName', categoryName)
        .maybeSingle();
        
      categoryId = cat?.CategoryID ?? null;
    }

    if (!categoryId) {
      return NextResponse.json({ success: true, data: [] });
    }

    let categoryIdsToQuery = [categoryId];

    // Unless explicitly directOnly, resolve full ancestor hierarchy so attributes inherit cleanly
    if (!directOnly) {
      try {
        let currentId: number | null = categoryId;
        const seen = new Set<number>([categoryId]);
        while (currentId) {
          const res: any = await supabase
            .from('category')
            .select('ParentCategoryID')
            .eq('CategoryID', currentId)
            .maybeSingle();
          const parentCatId = res?.data?.ParentCategoryID;
          if (parentCatId && !seen.has(parentCatId)) {
            seen.add(parentCatId);
            categoryIdsToQuery.push(parentCatId);
            currentId = parentCatId;
          } else {
            break;
          }
        }
      } catch (err) {
        console.warn('Error resolving ancestor category IDs:', err);
      }
    }

    // Query attributes for these category IDs
    const { data: rawAttributes, error: attrError } = await supabase
      .from('categoryattribute')
      .select('*')
      .in('CategoryID', categoryIdsToQuery)
      .order('AttributeID', { ascending: true });

    if (attrError) throw attrError;

    // Query all options for these attributes
    const attributeIds = (rawAttributes || []).map((a: any) => a.AttributeID);
    
    let rawOptions: any[] = [];
    if (attributeIds.length > 0) {
      const { data: opts, error: optsError } = await supabase
        .from('categoryattributeoption')
        .select('*')
        .in('AttributeID', attributeIds);
        
      if (optsError) throw optsError;
      rawOptions = opts || [];
    }

    // Group options by AttributeID
    const optionsByAttr: Record<number, string[]> = {};
    for (const opt of rawOptions) {
      if (!optionsByAttr[opt.AttributeID]) {
        optionsByAttr[opt.AttributeID] = [];
      }
      optionsByAttr[opt.AttributeID].push(opt.OptionValue);
    }

    const attributes = (rawAttributes || []).map(attr => ({
      AttributeID: attr.AttributeID,
      CategoryID: attr.CategoryID,
      AttributeName: attr.AttributeName,
      AttributeType: attr.AttributeType,
      IsRequired: attr.IsRequired ? 1 : 0,
      options: optionsByAttr[attr.AttributeID] || [],
    }));

    return NextResponse.json({ success: true, data: attributes });

  } catch (error: any) {
    console.error('Error fetching attributes:', error);
    return NextResponse.json(
      { success: false, error: 'Database read error: ' + error.message },
      { status: 500 }
    );
  }
}
