const mariadb = require('mariadb');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const envUrl = process.env.DATABASE_URL.replace(/^["']|["']$/g, '');
const dbUrl = new URL(envUrl);

async function test() {
  const pool = mariadb.createPool({
    host: dbUrl.hostname,
    port: Number(dbUrl.port) || 3306,
    user: dbUrl.username,
    password: decodeURIComponent(dbUrl.password),
    database: dbUrl.pathname.slice(1),
    connectionLimit: 5,
    connectTimeout: 10000,
    acquireTimeout: 10000,
    idleTimeout: 10,
    minimumIdle: 0,
    minDelayValidation: 200,
  });

  try {
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push((async () => {
        console.log(`Starting query ${i}`);
        const conn = await pool.getConnection();
        const rows = await conn.query('SELECT 1 as test');
        console.log(`Query ${i} SUCCESS`);
        conn.release();
      })());
    }
    await Promise.all(promises);
  } catch (err) {
    console.error('FAILED:', err.message);
  } finally {
    await pool.end();
  }
}
test();
