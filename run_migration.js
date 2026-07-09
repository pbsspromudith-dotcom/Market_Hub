const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres:HitAds%40123456789%23@db.dbuntfyjplmnusllvjoa.supabase.co:5432/postgres";

async function runMigration() {
  const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });
  
  try {
    await client.connect();
    console.log('Connected to database.\n');

    const queries = [
      {
        label: 'Add status column to listings',
        sql: `ALTER TABLE listings ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active'`
      },
      {
        label: 'Add rejection_reason column to listings',
        sql: `ALTER TABLE listings ADD COLUMN IF NOT EXISTS rejection_reason TEXT`
      },
      {
        label: 'Set existing listings to active',
        sql: `UPDATE listings SET status = 'active' WHERE status IS NULL`
      },
      {
        label: 'Create approval_stages table',
        sql: `CREATE TABLE IF NOT EXISTS approval_stages (
          id SERIAL PRIMARY KEY,
          stage_name VARCHAR(255) NOT NULL,
          description TEXT,
          stage_order INT DEFAULT 0,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT NOW()
        )`
      },
      {
        label: 'Create approval_templates table',
        sql: `CREATE TABLE IF NOT EXISTS approval_templates (
          id SERIAL PRIMARY KEY,
          template_name VARCHAR(255) NOT NULL,
          description TEXT,
          is_default BOOLEAN DEFAULT FALSE,
          category_id INT,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT NOW()
        )`
      },
      {
        label: 'Create approval_template_stages table',
        sql: `CREATE TABLE IF NOT EXISTS approval_template_stages (
          id SERIAL PRIMARY KEY,
          template_id INT NOT NULL REFERENCES approval_templates(id) ON DELETE CASCADE,
          stage_id INT NOT NULL REFERENCES approval_stages(id) ON DELETE CASCADE,
          stage_order INT DEFAULT 0,
          is_required BOOLEAN DEFAULT TRUE
        )`
      },
      {
        label: 'Create listing_approvals table',
        sql: `CREATE TABLE IF NOT EXISTS listing_approvals (
          id SERIAL PRIMARY KEY,
          listing_id INT NOT NULL,
          template_id INT NOT NULL,
          stage_id INT NOT NULL,
          status VARCHAR(20) DEFAULT 'pending',
          reviewed_by INT,
          review_note TEXT,
          reviewed_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW()
        )`
      },
      {
        label: 'Index: listing_approvals.listing_id',
        sql: `CREATE INDEX IF NOT EXISTS idx_listing_approvals_listing_id ON listing_approvals(listing_id)`
      },
      {
        label: 'Index: listing_approvals.status',
        sql: `CREATE INDEX IF NOT EXISTS idx_listing_approvals_status ON listing_approvals(status)`
      },
      {
        label: 'Index: approval_template_stages.template_id',
        sql: `CREATE INDEX IF NOT EXISTS idx_approval_template_stages_template_id ON approval_template_stages(template_id)`
      },
      {
        label: 'Index: listings.status',
        sql: `CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status)`
      },
    ];

    for (let i = 0; i < queries.length; i++) {
      const q = queries[i];
      process.stdout.write(`[${i + 1}/${queries.length}] ${q.label}... `);
      try {
        const result = await client.query(q.sql);
        console.log(`OK ${result.rowCount !== null ? `(${result.rowCount} rows)` : ''}`);
      } catch (err) {
        console.log(`ERROR: ${err.message}`);
      }
    }

    console.log('\n All migration queries completed!');
  } catch (err) {
    console.error('Connection error:', err.message);
  } finally {
    await client.end();
  }
}

runMigration();
