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

async function check() {
  await client.connect();
  const res = await client.query('SELECT "CategoryID", "CategoryName", template_config FROM category WHERE template_config IS NOT NULL;');
  console.log('Categories with template_config count:', res.rows.length);
  for (const r of res.rows) {
    console.log(`ID: ${r.CategoryID}, Name: ${r.CategoryName}`);
    console.log(`Raw template_config:`, JSON.stringify(r.template_config));
    try {
      if (typeof r.template_config === 'string') {
        JSON.parse(r.template_config);
        console.log('  -> Valid JSON');
      } else {
        console.log('  -> Already object:', r.template_config);
      }
    } catch (e) {
      console.error('  -> INVALID JSON ERROR:', e.message);
    }
  }
  await client.end();
}

check().catch(console.error);
