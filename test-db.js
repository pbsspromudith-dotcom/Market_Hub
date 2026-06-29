// Quick diagnostic: test raw mariadb connection WITHOUT Prisma
const mariadb = require('mariadb');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const rawUrl = process.env.DATABASE_URL;
if (!rawUrl) {
  console.error('DATABASE_URL is not set!');
  process.exit(1);
}

const envUrl = rawUrl.replace(/^["']|["']$/g, '');
console.log('DATABASE_URL (masked):', envUrl.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));

let dbUrl;
try {
  dbUrl = new URL(envUrl);
} catch (e) {
  console.error('Failed to parse DATABASE_URL as URL:', e.message);
  process.exit(1);
}

const config = {
  host: dbUrl.hostname,
  port: Number(dbUrl.port) || 3306,
  user: dbUrl.username,
  password: decodeURIComponent(dbUrl.password),
  database: dbUrl.pathname.slice(1),
  connectTimeout: 10000,
};

console.log('\nConnection config:');
console.log('  host:', config.host);
console.log('  port:', config.port);
console.log('  user:', config.user);
console.log('  database:', config.database);
console.log('  password:', config.password ? '(set, ' + config.password.length + ' chars)' : '(EMPTY!)');

async function test() {
  console.log('\n--- Test 1: Direct connection (no pool) ---');
  try {
    const conn = await mariadb.createConnection(config);
    const rows = await conn.query('SELECT 1 as test, NOW() as server_time');
    console.log('SUCCESS! DB responded:', rows[0]);
    
    const waitTimeout = await conn.query("SHOW VARIABLES LIKE 'wait_timeout'");
    console.log('wait_timeout:', waitTimeout[0]?.Value);
    
    const maxConn = await conn.query("SHOW VARIABLES LIKE 'max_connections'");
    console.log('max_connections:', maxConn[0]?.Value);
    
    await conn.end();
    console.log('Connection closed cleanly.');
  } catch (err) {
    console.error('FAILED:', err.message);
    console.error('Error code:', err.code || err.errno);
  }

  console.log('\n--- Test 2: Pool connection ---');
  let pool;
  try {
    pool = mariadb.createPool({ ...config, connectionLimit: 2 });
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT 1 as test');
    console.log('SUCCESS! Pool connection works:', rows[0]);
    conn.release();
  } catch (err) {
    console.error('FAILED:', err.message);
    console.error('Error code:', err.code || err.errno);
  } finally {
    if (pool) await pool.end();
  }
}

test().catch(console.error);
