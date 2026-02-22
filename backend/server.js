import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import xss from "xss-clean";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const port = process.env.PORT || 5000;

// Security Middleware
app.use(helmet()); // Set security HTTP headers
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // Allow images to load from cross origin

// Custom CORS Configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Only allow the frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

// Body parser with size limits
app.use(express.json({ limit: "10kb" }));

// Data Sanitization against XSS (cross-site scripting)
app.use(xss());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use("/api", limiter);

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: "Too many login attempts, please try again later",
});
app.use("/api/auth/login", authLimiter);

// Set up static folder for uploads
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use("/uploads", express.static(uploadDir));

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "markethub",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.get("/api/status", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ message: "Backend is running and deeply connected!" });
  } catch (error) {
    res.status(500).json({
      message: "Backend is running, but DB is down.",
      error: error.message,
    });
  }
});

// Auth Routes
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password],
    );
    if (rows.length > 0) {
      const user = rows[0];
      // Exclude password
      delete user.password;
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const [existing] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (existing.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password],
    );
    res.json({
      success: true,
      message: "Registered successfully",
      userId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Upload Route
app.post("/api/upload", upload.array("images", 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No files uploaded" });
  }
  // Return the paths starting with /uploads
  const imageUrls = req.files.map((file) => `/uploads/${file.filename}`);
  res.json({ success: true, imageUrls });
});

const processListing = (row) => {
  let image = row.image;
  let allImages = row.image ? [row.image] : [];

  if (row.image && row.image.startsWith("[")) {
    try {
      const parsed = JSON.parse(row.image);
      if (Array.isArray(parsed) && parsed.length > 0) {
        image = parsed[0];
        allImages = parsed;
      }
    } catch (e) {
      console.log("Error parsing row image", e);
    }
  }
  return { ...row, image, allImages };
};

// Listings Routes
app.get("/api/listings", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM listings ORDER BY created_at DESC",
    );
    res.json(rows.map(processListing));
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/listings/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT l.*, u.name as seller_name, u.avatar as seller_avatar, u.join_date as seller_join_date, u.email as seller_email, u.phone as seller_phone
      FROM listings l 
      LEFT JOIN users u ON l.user_id = u.id 
      WHERE l.id = ?`,
      [req.params.id],
    );
    if (rows.length > 0) {
      res.json(processListing(rows[0]));
    } else {
      res.status(404).json({ error: "Not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/listings", async (req, res) => {
  const {
    title,
    price,
    category,
    location,
    description,
    image,
    user_id,
    contact_email,
    contact_phone,
    postal_code,
  } = req.body;
  try {
    const time = "Just now"; // Simplified
    let imageToSave = image;
    if (Array.isArray(image) && image.length > 0) {
      imageToSave = JSON.stringify(image);
    } else if (Array.isArray(image) && image.length === 0) {
      imageToSave = "https://picsum.photos/seed/new/800/600";
    }

    const [result] = await pool.query(
      `
      INSERT INTO listings (title, price, category, location, description, image, user_id, time, contact_email, contact_phone, postal_code)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        title,
        price,
        category,
        location,
        description,
        imageToSave || "https://picsum.photos/seed/new/800/600",
        user_id,
        time,
        contact_email || null,
        contact_phone || null,
        postal_code || null,
      ],
    );
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.json({ text: "How can I help you today?" });

  try {
    const m = message.toLowerCase();

    // Help Context
    if (
      m.includes("post") &&
      (m.includes("how") || m.includes("help") || m.includes("ad"))
    ) {
      return res.json({
        text: "To post an ad, simply click the 'Post Ad' button in the top navigation bar. You will be guided through a simple 3-step process to add your photos, title, price, and location!",
      });
    }
    if (
      (m.includes("search") || m.includes("filter") || m.includes("find")) &&
      m.includes("how")
    ) {
      return res.json({
        text: "You can find items by using the search bar on the home page, or by clicking 'Explore' to visit the Search page where you can filter by price, category, condition, and distance.",
      });
    }
    if (m === "hello" || m === "hi" || m === "hey") {
      return res.json({
        text: "Hi there! I am your MarketHub AI assistant. I can search our live database for items, or guide you on how to use the site. What do you need help with?",
      });
    }

    // DB Context Search
    const [rows] = await pool.query(
      `SELECT title, price, category, location, id FROM listings ORDER BY id DESC LIMIT 100`,
    );

    // Simple keyword extraction (ignore common words)
    const ignoreWords = [
      "how",
      "can",
      "find",
      "search",
      "give",
      "me",
      "want",
      "buy",
      "do",
      "you",
      "have",
      "any",
      "the",
      "for",
      "a",
      "an",
      "is",
      "there",
      "please",
      "need",
    ];
    const keywords = m
      .split(" ")
      .filter((w) => w.length > 2 && !ignoreWords.includes(w));

    if (keywords.length > 0) {
      const matches = rows.filter((r) =>
        keywords.some(
          (k) =>
            r.title.toLowerCase().includes(k) ||
            r.category.toLowerCase().includes(k) ||
            r.location.toLowerCase().includes(k),
        ),
      );

      if (matches.length > 0) {
        const top3 = matches.slice(0, 3);
        const listText = top3
          .map(
            (r) =>
              `• ${r.title} - $${Number(r.price).toLocaleString()} (${r.location})`,
          )
          .join("\n");
        return res.json({
          text: `I searched our live database and found ${matches.length} item(s) that might match what you're looking for:\n\n${listText}\n\nYou can find these by heading over to the main Search page!`,
        });
      } else {
        return res.json({
          text: `I searched our database for "${keywords.join(" ")}" but couldn't find any active listings matching that right now. Try adjusting your keywords or checking different categories!`,
        });
      }
    }

    res.json({
      text: "I'm your friendly MarketHub Assistant! Try asking me how to post an ad, how to search, or ask me to check if we have a specific item like 'laptop' or 'car' in our database.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      text: "Oops, my database connection is a bit fuzzy right now. Try again in a moment!",
    });
  }
});

app.get("/api/admin/stats", async (req, res) => {
  try {
    const [listingsResult] = await pool.query(
      "SELECT COUNT(*) as total FROM listings",
    );
    const [usersResult] = await pool.query(
      "SELECT COUNT(*) as total FROM users",
    );
    const [recentUsersResult] = await pool.query(
      "SELECT COUNT(*) as total FROM users WHERE join_date >= NOW() - INTERVAL 1 DAY",
    );

    // Revenue calculated simply from number of users * 15 (dummy metric) or total listings
    const [revenueResult] = await pool.query(
      "SELECT SUM(price) as total FROM listings",
    );

    // Recent activity
    const [recentListings] = await pool.query(
      "SELECT title, created_at FROM listings ORDER BY created_at DESC LIMIT 5",
    );

    res.json({
      success: true,
      stats: {
        totalListings: listingsResult[0].total,
        totalUsers: usersResult[0].total,
        newUsersToday: recentUsersResult?.[0]?.total || 0,
        revenue: revenueResult[0].total || 0,
        recentActivity: recentListings,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch admin stats" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
