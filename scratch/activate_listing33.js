const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env manually
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const val = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      process.env[key.trim()] = val;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function activatePromotionListing33() {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 90);

  // Update listing 33
  const { data: updatedListing, error: lErr } = await supabase
    .from('listings')
    .update({
      is_home_gallery: true,
      is_featured: true,
      promotion_expires_at: expiresAt.toISOString(),
      status: 'active'
    })
    .eq('id', 33)
    .select()
    .single();

  if (lErr) {
    console.error('Error updating listing 33:', lErr);
  } else {
    console.log('Successfully activated promotion for Listing 33:', updatedListing);
  }

  // Also update transaction 27
  const { data: updatedTx, error: txErr } = await supabase
    .from('transactions')
    .update({
      status: 'completed',
      payment_type: 'admin_activated'
    })
    .eq('id', 27)
    .select()
    .single();

  if (txErr) {
    console.error('Error updating transaction 27:', txErr);
  } else {
    console.log('Successfully updated transaction 27:', updatedTx);
  }
}

activatePromotionListing33();
