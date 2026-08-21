import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let val = match[2] || '';
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    env[match[1]] = val;
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

async function test() {
  console.log('Testing category template saving & attributes in Supabase...');

  // 1. Get first category
  const { data: cats, error: catErr } = await supabase.from('category').select('*').limit(1);
  if (catErr || !cats || cats.length === 0) {
    console.error('Error fetching category:', catErr);
    return;
  }
  const testCat = cats[0];
  console.log('Testing on category:', testCat.CategoryID, testCat.CategoryName);

  // 2. Test saving template_config
  const sampleConfig = JSON.stringify({ hideTitle: false, hideDescription: false, priceLabel: 'Asking Price' });
  const { data: updCat, error: updErr } = await supabase
    .from('category')
    .update({ template_config: sampleConfig })
    .eq('CategoryID', testCat.CategoryID)
    .select();
  console.log('Update template_config result:', updCat, 'error:', updErr);

  // 3. Test insert categoryattribute
  const { data: attr, error: attrErr } = await supabase
    .from('categoryattribute')
    .insert({
      CategoryID: testCat.CategoryID,
      AttributeName: 'Test Attribute',
      AttributeType: 'Text',
      IsRequired: false
    })
    .select();
  console.log('Insert attribute result:', attr, 'error:', attrErr);

  if (attr && attr.length > 0) {
    const attrId = attr[0].AttributeID;
    // 4. Test delete categoryattribute
    const { error: delErr } = await supabase
      .from('categoryattribute')
      .delete()
      .eq('AttributeID', attrId);
    console.log('Delete attribute error:', delErr);
  }
}

test().catch(console.error);
