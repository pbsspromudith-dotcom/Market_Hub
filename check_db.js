const mariadb = require('mariadb');

async function testConnection() {
  const url = new URL("mysql://u153686131_HitAds:J9%40%26SykcD%21s@srv456.hstgr.io:3306/u153686131_HitAds");
  const pool = mariadb.createPool({
    host: url.hostname, 
    user: url.username, 
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
    port: url.port || 3306,
    connectionLimit: 1,
    connectTimeout: 10000
  });
  
  let conn;
  try {
    console.log("Connecting to " + url.hostname + "...");
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT 1 as val");
    console.log("Connection successful! Result: ", rows);
  } catch (err) {
    console.error("Connection failed: ", err);
  } finally {
    if (conn) await conn.end();
    await pool.end();
  }
}

testConnection();
