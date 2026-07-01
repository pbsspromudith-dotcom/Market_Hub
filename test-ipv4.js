const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const mariadb = require('mariadb');
require('dotenv').config({ path: '.env' });

const rawUrl = process.env.DATABASE_URL.replace(/^["']|["']$/g, '');
const dbUrl = new URL(rawUrl);

console.log('Hostname:', dbUrl.hostname);
console.log('Port:', dbUrl.port || 3306);

// Resolve DNS to see what IP we get
dns.lookup(dbUrl.hostname, { all: true }, (err, addresses) => {
  console.log('DNS resolves to:', err ? err.message : addresses);
});

async function test() {
  const pool = mariadb.createPool({
    host: dbUrl.hostname,
    port: Number(dbUrl.port) || 3306,
    user: dbUrl.username,
    password: decodeURIComponent(dbUrl.password),
    database: dbUrl.pathname.slice(1),
    connectionLimit: 2,
    connectTimeout: 10000,
    acquireTimeout: 10000,
  });

  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT COUNT(*) as cnt FROM category');
    console.log('✅ SUCCESS — categories count:', rows[0].cnt);
    conn.release();
  } catch (err) {
    console.error('❌ FAILED:', err.message);
    if (err.cause) console.error('   cause:', err.cause);
  } finally {
    await pool.end();
  }
}
test();
