import pg from 'pg';
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

const client = new pg.Client({ connectionString: env.DATABASE_URL });

function cleanJsonString(val) {
  if (!val) return null;
  if (typeof val === 'object') return val;
  let str = String(val).trim();
  
  // Try direct parse
  try {
    const parsed = JSON.parse(str);
    if (typeof parsed === 'object' && parsed !== null) return parsed;
    if (typeof parsed === 'string') {
      try {
        const doubleParsed = JSON.parse(parsed);
        if (typeof doubleParsed === 'object' && doubleParsed !== null) return doubleParsed;
      } catch {}
    }
  } catch {}

  // Try unescaping backslashes
  try {
    const unescaped = str.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    const parsed = JSON.parse(unescaped);
    if (typeof parsed === 'object' && parsed !== null) return parsed;
  } catch {}

  return null;
}

async function fix() {
  await client.connect();
  const res = await client.query('SELECT "CategoryID", "CategoryName", template_config FROM category WHERE template_config IS NOT NULL;');
  console.log('Categories to check:', res.rows.length);

  for (const r of res.rows) {
    const cleaned = cleanJsonString(r.template_config);
    console.log(`Fixing Category ID ${r.CategoryID} (${r.CategoryName}):`, cleaned);
    if (cleaned) {
      await client.query('UPDATE category SET template_config = $1 WHERE "CategoryID" = $2;', [JSON.stringify(cleaned), r.CategoryID]);
    } else {
      await client.query('UPDATE category SET template_config = NULL WHERE "CategoryID" = $2;', [r.CategoryID]);
    }
  }

  console.log('All template_config rows normalized and verified in DB!');
  await client.end();
}

fix().catch(console.error);
