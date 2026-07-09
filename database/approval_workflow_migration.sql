-- Ad Approval Workflow Migration
-- Run this against the Supabase/PostgreSQL database

-- 1. Add status & rejection_reason columns to listings
ALTER TABLE listings ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Set all existing listings to 'active'
UPDATE listings SET status = 'active' WHERE status IS NULL;

-- 2. Create approval_stages table
CREATE TABLE IF NOT EXISTS approval_stages (
  id SERIAL PRIMARY KEY,
  stage_name VARCHAR(255) NOT NULL,
  description TEXT,
  stage_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Create approval_templates table
CREATE TABLE IF NOT EXISTS approval_templates (
  id SERIAL PRIMARY KEY,
  template_name VARCHAR(255) NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  category_id INT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Create approval_template_stages junction table
CREATE TABLE IF NOT EXISTS approval_template_stages (
  id SERIAL PRIMARY KEY,
  template_id INT NOT NULL REFERENCES approval_templates(id) ON DELETE CASCADE,
  stage_id INT NOT NULL REFERENCES approval_stages(id) ON DELETE CASCADE,
  stage_order INT DEFAULT 0,
  is_required BOOLEAN DEFAULT TRUE
);

-- 5. Create listing_approvals table
CREATE TABLE IF NOT EXISTS listing_approvals (
  id SERIAL PRIMARY KEY,
  listing_id INT NOT NULL,
  template_id INT NOT NULL,
  stage_id INT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  reviewed_by INT,
  review_note TEXT,
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_listing_approvals_listing_id ON listing_approvals(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_approvals_status ON listing_approvals(status);
CREATE INDEX IF NOT EXISTS idx_approval_template_stages_template_id ON approval_template_stages(template_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
