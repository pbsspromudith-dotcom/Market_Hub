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

async function seed() {
  await client.connect();
  console.log('Connected to DB for seeding Sub Masters options...');

  // Check if options already has rows
  const existing = await client.query('SELECT count(*) FROM options;');
  console.log('Current options count:', existing.rows[0].count);

  if (Number(existing.rows[0].count) <= 1) {
    await client.query('TRUNCATE TABLE options RESTART IDENTITY;');

    // 1. Categories
    const categories = ['Vehicles', 'Real Estate', 'Jobs', 'Local Services', 'Buy & Sell', 'Home & Garden', 'Electronics & Computers', 'Pets', 'Community'];
    for (const c of categories) {
      await client.query('INSERT INTO options (option_type, option_value) VALUES ($1, $2);', ['category', c]);
    }

    // 2. Car Makes
    const makes = [
      'Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes-Benz', 
      'Audi', 'Hyundai', 'Nissan', 'Volkswagen', 'Tesla', 'Subaru', 
      'Mazda', 'Kia', 'Jeep', 'Dodge', 'Lexus', 'Acura', 'GMC', 'RAM'
    ];
    const makeMap = {};
    for (const m of makes) {
      const res = await client.query('INSERT INTO options (option_type, option_value) VALUES ($1, $2) RETURNING id;', ['car_make', m]);
      makeMap[m] = res.rows[0].id;
    }

    // 3. Car Models with parent_id linkage to Make
    const modelsByMake = {
      'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma', 'Tundra', 'Prius', 'Sienna', '4Runner', 'Venza'],
      'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'HR-V', 'Passport', 'Odyssey', 'Ridgeline'],
      'Ford': ['F-150', 'Escape', 'Explorer', 'Mustang', 'Edge', 'Ranger', 'Bronco', 'Expedition'],
      'Chevrolet': ['Silverado 1500', 'Equinox', 'Malibu', 'Tahoe', 'Suburban', 'Traverse', 'Camaro', 'Colorado'],
      'BMW': ['3 Series', '5 Series', 'X3', 'X5', 'X1', 'X7', 'M3', 'M4', 'M5', 'i4'],
      'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE', 'CLA', 'A-Class', 'S-Class', 'GLS'],
      'Audi': ['A4', 'A6', 'Q5', 'Q7', 'Q3', 'A3', 'e-tron', 'Q8'],
      'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Kona', 'Palisade', 'Ioniq 5', 'Venue'],
      'Nissan': ['Rogue', 'Altima', 'Sentra', 'Pathfinder', 'Murano', 'Frontier', 'Kicks', 'Leaf'],
      'Volkswagen': ['Jetta', 'Golf', 'Tiguan', 'Atlas', 'Taos', 'ID.4', 'Passat'],
      'Tesla': ['Model 3', 'Model Y', 'Model S', 'Model X', 'Cybertruck'],
      'Subaru': ['Outback', 'Forester', 'Crosstrek', 'Impreza', 'Ascent', 'WRX', 'Legacy'],
      'Mazda': ['Mazda3', 'Mazda6', 'CX-5', 'CX-30', 'CX-50', 'CX-90', 'MX-5 Miata'],
      'Kia': ['Forte', 'Optima / K5', 'Sportage', 'Sorento', 'Telluride', 'Soul', 'EV6', 'Carnival'],
      'Jeep': ['Wrangler', 'Grand Cherokee', 'Cherokee', 'Compass', 'Gladiator', 'Renegade'],
      'Dodge': ['Charger', 'Challenger', 'Durango', 'Grand Caravan'],
      'Lexus': ['RX 350', 'NX 300', 'IS 300', 'ES 350', 'GX 460', 'UX 250h'],
      'Acura': ['MDX', 'RDX', 'TLX', 'Integra', 'ILX'],
      'GMC': ['Sierra 1500', 'Terrain', 'Acadia', 'Yukon', 'Canyon'],
      'RAM': ['1500', '2500', '3500', 'ProMaster']
    };

    for (const [makeName, models] of Object.entries(modelsByMake)) {
      const parentId = makeMap[makeName];
      for (const modelName of models) {
        await client.query('INSERT INTO options (option_type, option_value, parent_id) VALUES ($1, $2, $3);', ['car_model', modelName, parentId]);
      }
    }

    // 4. Car Types (Body styles)
    const carTypes = ['Sedan', 'SUV / Crossover', 'Truck / Pickup', 'Coupe', 'Hatchback', 'Convertible', 'Minivan / Van', 'Wagon'];
    for (const t of carTypes) {
      await client.query('INSERT INTO options (option_type, option_value) VALUES ($1, $2);', ['car_type', t]);
    }

    // 5. Vehicle Types
    const vehicleTypes = ['Cars & Trucks', 'SUVs', 'Pickup Trucks', 'Commercial Vehicles', 'Motorcycles', 'Classic Cars', 'RVs & Campers', 'Boats & Watercraft', 'ATVs & Snowmobiles', 'Heavy Equipment', 'Trailers'];
    for (const vt of vehicleTypes) {
      await client.query('INSERT INTO options (option_type, option_value) VALUES ($1, $2);', ['vehicle_type', vt]);
    }

    // 6. Fuel Types
    const fuelTypes = ['Gasoline', 'Hybrid', 'Electric (EV)', 'Plug-in Hybrid (PHEV)', 'Diesel'];
    for (const f of fuelTypes) {
      await client.query('INSERT INTO options (option_type, option_value) VALUES ($1, $2);', ['fuel_type', f]);
    }

    // 7. Drivetrains
    const drivetrains = ['All-Wheel Drive (AWD)', 'Four-Wheel Drive (4WD)', 'Front-Wheel Drive (FWD)', 'Rear-Wheel Drive (RWD)'];
    for (const d of drivetrains) {
      await client.query('INSERT INTO options (option_type, option_value) VALUES ($1, $2);', ['drivetrain', d]);
    }

    // 8. Price Options
    const priceOptions = ['Fixed Amount ($)', 'Free', 'Please Contact', 'Swap / Trade'];
    for (const p of priceOptions) {
      await client.query('INSERT INTO options (option_type, option_value) VALUES ($1, $2);', ['price_option', p]);
    }

    console.log('Seeding complete! All Sub Masters options and linkages have been established.');
  }

  const finalCount = await client.query('SELECT count(*) FROM options;');
  console.log('Final options count:', finalCount.rows[0].count);

  await client.end();
}

seed().catch(console.error);
