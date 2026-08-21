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

async function testCategoriesRead() {
  const { data: categories, error } = await supabase
    .from('category')
    .select('*')
    .eq('IsActive', true)
    .order('SortOrder', { ascending: true });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Total categories fetched:', categories.length);
  let errorCount = 0;
  for (const c of categories) {
    if (c.template_config) {
      try {
        const parsed = typeof c.template_config === 'string' ? JSON.parse(c.template_config) : c.template_config;
        if (!parsed || typeof parsed !== 'object') {
          console.warn('Non-object config for Category', c.CategoryID, c.CategoryName, c.template_config);
          errorCount++;
        }
      } catch (err) {
        console.error('Error parsing config for Category', c.CategoryID, c.CategoryName, err.message);
        errorCount++;
      }
    }
  }
  console.log('Category template_config audit complete. Errors found:', errorCount);
}

testCategoriesRead().catch(console.error);
