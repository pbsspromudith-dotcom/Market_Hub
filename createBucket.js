const {Client} = require('pg'); 
const client = new Client({connectionString: 'postgresql://postgres:HitAds%40123456789%23@db.dbuntfyjplmnusllvjoa.supabase.co:5432/postgres'}); 
client.connect()
  .then(()=>client.query("INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true) ON CONFLICT (id) DO NOTHING;"))
  .then(()=>console.log('Bucket created'))
  .catch(console.error)
  .finally(()=>client.end());
