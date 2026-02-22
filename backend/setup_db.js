import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

async function setup() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "127.0.0.1",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
    });

    console.log("Connected to MySQL server.");

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || "markethub"}\`;`,
    );
    console.log(
      `Database "${process.env.DB_NAME || "markethub"}" created or already exists.`,
    );

    await connection.query(`USE \`${process.env.DB_NAME || "markethub"}\`;`);

    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        avatar VARCHAR(255),
        join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Users table created.");

    // Create listings table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS listings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        location VARCHAR(255) NOT NULL,
        time VARCHAR(100),
        image VARCHAR(500),
        is_featured BOOLEAN DEFAULT FALSE,
        description TEXT,
        views INT DEFAULT 0,
        saves INT DEFAULT 0,
        inquiries INT DEFAULT 0,
        user_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log("Listings table created.");

    // Insert dummy data if tables are empty
    const [userRows] = await connection.query(
      "SELECT COUNT(*) as count FROM users",
    );
    if (userRows[0].count === 0) {
      await connection.query(`
        INSERT INTO users (name, email, password, role, join_date) VALUES 
        ('Alex Johnson', 'alex.j@example.com', 'password123', 'admin', NOW()),
        ('Test User', 'test@example.com', 'testpass', 'user', NOW())
      `);
      console.log("Dummy users inserted.");
    }

    const [listingRows] = await connection.query(
      "SELECT COUNT(*) as count FROM listings",
    );
    if (listingRows[0].count === 0) {
      await connection.query(`
        INSERT INTO listings (title, price, category, location, time, image, is_featured, description, views, saves, inquiries, user_id) VALUES 
        ('iPhone 13 Pro - 256GB - Unlocked - Mint Condition', 850, 'Electronics', 'Toronto, ON', '2 hours ago', 'https://picsum.photos/seed/iphone/800/600', true, 'Pristine condition iPhone 13 Pro. Fully unlocked and ready for a new owner.', 142, 12, 5, 1),
        ('2021 BMW M4 Competition - Low Mileage', 78500, 'Vehicles', 'Etobicoke, ON', '45 mins ago', 'https://picsum.photos/seed/car1/800/600', true, 'Low mileage, immaculate condition.', 248, 34, 12, 1),
        ('Brand New Running Shoes - Size 10', 120, 'Buy & Sell', 'North York, ON', '5 hours ago', 'https://picsum.photos/seed/shoes/800/600', false, 'Never worn. Box included.', 89, 4, 2, 2)
      `);
      console.log("Dummy listings inserted.");
    }

    await connection.end();
    console.log("Connection closed. Database setup is complete!");
  } catch (err) {
    console.error("Error creating database tables:", err);
  }
}

setup();
