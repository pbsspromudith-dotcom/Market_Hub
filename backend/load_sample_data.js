import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

async function loadSampleData() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "127.0.0.1",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "markethub",
    });

    console.log("Connected to MySQL server.");

    // Insert 10 more sample users
    const [userRows] = await connection.query(
      "SELECT COUNT(*) as count FROM users",
    );
    if (userRows[0].count <= 2) {
      await connection.query(`
        INSERT INTO users (name, email, password, role, join_date) VALUES 
        ('Michael Smith', 'michael.s@example.com', 'pass123', 'user', NOW() - INTERVAL 10 DAY),
        ('Sarah Connor', 'sarah.c@example.com', 'pass123', 'user', NOW() - INTERVAL 45 DAY),
        ('David Lee', 'david.l@example.com', 'pass123', 'user', NOW() - INTERVAL 12 DAY),
        ('Emily Chen', 'emily.c@example.com', 'pass123', 'user', NOW() - INTERVAL 5 DAY),
        ('James Wilson', 'james.w@example.com', 'pass123', 'user', NOW() - INTERVAL 60 DAY),
        ('Olivia Brown', 'olivia.b@example.com', 'pass123', 'user', NOW() - INTERVAL 30 DAY),
        ('William Taylor', 'william.t@example.com', 'pass123', 'user', NOW() - INTERVAL 1 DAY),
        ('Sophia Anderson', 'sophia.a@example.com', 'pass123', 'user', NOW() - INTERVAL 80 DAY),
        ('Daniel Martinez', 'daniel.m@example.com', 'pass123', 'user', NOW() - INTERVAL 20 DAY),
        ('Ava Thomas', 'ava.t@example.com', 'pass123', 'user', NOW() - INTERVAL 50 DAY)
      `);
      console.log("10 Sample users inserted.");
    }

    // Insert 15 more sample listings across different categories
    const [listingRows] = await connection.query(
      "SELECT COUNT(*) as count FROM listings",
    );
    if (listingRows[0].count <= 3) {
      await connection.query(`
        INSERT INTO listings (title, price, category, location, time, image, is_featured, description, views, saves, inquiries, user_id) VALUES 
        ('Sony PlayStation 5 User - Like New', 450, 'Electronics', 'Vancouver, BC', '3 hours ago', 'https://picsum.photos/seed/ps5/800/600', true, 'Barely used PS5 console. Comes with 2 controllers and all cables.', 304, 45, 8, 3),
        ('Modern Leather Sofa', 890, 'Furniture', 'Calgary, AB', '1 day ago', 'https://picsum.photos/seed/sofa/800/600', false, 'Genuine leather sofa in excellent condition. Perfect for a modern living room.', 120, 15, 2, 4),
        ('2019 Toyota Rav4 XLE', 25500, 'Vehicles', 'Montreal, QC', '2 days ago', 'https://picsum.photos/seed/rav4/800/600', true, 'Reliable SUV, well maintained. Only 60,000 km. Clean title.', 890, 110, 24, 5),
        ('Downtown 2BR Condo with View', 2800, 'Real Estate', 'Toronto, ON', '4 hours ago', 'https://picsum.photos/seed/condo2/800/600', true, 'Spacious 2 bedroom condo right in the heart of the city. Gym and pool included.', 1245, 230, 45, 6),
        ('Apple Watch Series 7', 250, 'Electronics', 'Ottawa, ON', '5 hours ago', 'https://picsum.photos/seed/watch/800/600', false, 'Small scratch on the screen but works perfectly. Battery health 95%.', 85, 12, 4, 7),
        ('Vintage Oak Dining Table', 450, 'Furniture', 'Halifax, NS', '1 week ago', 'https://picsum.photos/seed/table/800/600', false, 'Beautiful solid oak dining table. Seats 6 comfortably.', 210, 34, 5, 8),
        ('2015 Honda Civic EX', 12500, 'Vehicles', 'Winnipeg, MB', '3 days ago', 'https://picsum.photos/seed/civic/800/600', false, 'Great commuter car. Extremely fuel efficient and reliable.', 450, 67, 12, 9),
        ('Professional DSLR Camera Kit', 1200, 'Electronics', 'Edmonton, AB', 'Just now', 'https://picsum.photos/seed/camera/800/600', true, 'Canon EOS 5D Mark IV with 2 lenses and camera bag.', 56, 8, 1, 10),
        ('Cozy 1BR Apartment for Rent', 1600, 'Real Estate', 'Quebec City, QC', '2 weeks ago', 'https://picsum.photos/seed/apt/800/600', false, 'Quiet neighborhood, close to public transit. Utilities included.', 670, 89, 15, 3),
        ('Mountain Bike Handlebars', 45, 'Sports', 'Victoria, BC', '6 hours ago', 'https://picsum.photos/seed/bike_part/800/600', false, 'Carbon fiber handlebars, 780mm width. Excellent upgrade.', 42, 5, 0, 4),
        ('Designer Sunglasses', 180, 'Fashion', 'Toronto, ON', '1 day ago', 'https://picsum.photos/seed/sunglasses/800/600', false, 'Worn twice. Comes with original case and cleaning cloth.', 134, 22, 3, 5),
        ('Acoustic Guitar - Yamaha', 200, 'Musical Instruments', 'Regina, SK', '4 days ago', 'https://picsum.photos/seed/guitar/800/600', true, 'Perfect for beginners. Recently re-strung. Includes gig bag.', 320, 45, 9, 6),
        ('Golf Clubs Set', 350, 'Sports', 'Kelowna, BC', '12 hours ago', 'https://picsum.photos/seed/golf/800/600', false, 'Full set of Callaway irons and woods. Includes bag.', 198, 30, 6, 7),
        ('MacBook Air M1 2020', 700, 'Electronics', 'London, ON', '2 hours ago', 'https://picsum.photos/seed/macbook/800/600', true, 'Space gray, 8GB RAM, 256GB SSD. Flawless condition.', 540, 78, 18, 8),
        ('Leather Office Chair', 150, 'Furniture', 'Saskatoon, SK', '5 days ago', 'https://picsum.photos/seed/chair/800/600', false, 'Ergonomic leather chair. Very comfortable for long hours.', 88, 14, 2, 9)
      `);
      console.log("15 Sample listings inserted.");
    }

    await connection.end();
    console.log("Connection closed. Sample data loaded successfully!");
  } catch (err) {
    console.error("Error creating database tables:", err);
  }
}

loadSampleData();
