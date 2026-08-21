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
  const { data: makes, error: makeErr } = await supabase.from('car_makes').select('*');
  console.log('car_makes:', makes?.length, makeErr);
  const { data: models, error: modErr } = await supabase.from('car_models').select('*');
  console.log('car_models:', models?.length, modErr);
  const { data: cartypes, error: typeErr } = await supabase.from('car_types').select('*');
  console.log('car_types:', cartypes?.length, typeErr);
  const { data: fuels, error: fuelErr } = await supabase.from('fuel_types').select('*');
  console.log('fuel_types:', fuels?.length, fuelErr);
  const { data: drivetrains, error: driveErr } = await supabase.from('drivetrains').select('*');
  console.log('drivetrains:', drivetrains?.length, driveErr);
  const { data: priceOpts, error: priceErr } = await supabase.from('price_options').select('*');
  console.log('price_options:', priceOpts?.length, priceErr);
}

test().catch(console.error);
