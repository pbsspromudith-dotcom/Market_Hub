import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "markethub",
});

const [users] = await pool.query("SELECT id, name, email, password FROM users");

for (const user of users) {
  // Only hash if not already a bcrypt hash (bcrypt hashes start with $2)
  if (!user.password.startsWith("$2")) {
    const hashed = await bcrypt.hash(user.password, 12);
    await pool.query("UPDATE users SET password = ? WHERE id = ?", [
      hashed,
      user.id,
    ]);
    console.log(
      `✅ Hashed password for: ${user.email} (was: "${user.password}")`,
    );
  } else {
    console.log(`⏭  Already hashed, skipping: ${user.email}`);
  }
}

console.log("\n🔒 All passwords are now securely hashed!");
await pool.end();
