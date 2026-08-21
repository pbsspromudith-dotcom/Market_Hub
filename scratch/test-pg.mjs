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

const client = new pg.Client({
  connectionString: env.DATABASE_URL
});

async function run() {
  try {
    await client.connect();
    console.log('Connected to Postgres directly!');
    
    // Check columns of options
    const cols = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'options';
    `);
    console.log('options columns:', cols.rows);

    // Add parent_id column if not exists
    const hasParentId = cols.rows.some(r => r.column_name === 'parent_id');
    if (!hasParentId) {
      console.log('Adding parent_id column to options table...');
      await client.query(`ALTER TABLE options ADD COLUMN IF NOT EXISTS parent_id INTEGER;`);
      console.log('parent_id column added!');
    }

    // Check category columns
    const catCols = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'category';
    `);
    console.log('category columns:', catCols.rows.map(r => r.column_name));

    // Check categoryattribute columns
    const attrCols = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'categoryattribute';
    `);
    console.log('categoryattribute columns:', attrCols.rows.map(r => r.column_name));

    // Check categoryattributeoption columns
    const attrOptCols = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'categoryattributeoption';
    `);
    console.log('categoryattributeoption columns:', attrOptCols.rows.map(r => r.column_name));

    await client.end();
  } catch (err) {
    console.error('Postgres error:', err);
    try { await client.end(); } catch {}
  }
}

run();
