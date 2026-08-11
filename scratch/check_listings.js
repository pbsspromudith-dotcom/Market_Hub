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

async function check() {
  const { data: listing33, error: lError } = await supabase.from('listings').select('*').eq('id', 33).maybeSingle();
  console.log("Listing 33:", listing33);

  const { data: allListings, error: aError } = await supabase.from('listings').select('*');
  console.log("\nAll listings count:", allListings ? allListings.length : 0);
  if (allListings) {
    allListings.forEach(l => console.log(`ID: ${l.id} | Title: "${l.title}" | Status: ${l.status} | Location: "${l.location}" | HomeGallery: ${l.is_home_gallery} | TopAd: ${l.is_top_ad} | Featured: ${l.is_featured} | Expires: ${l.promotion_expires_at}`));
  }
}

check();
