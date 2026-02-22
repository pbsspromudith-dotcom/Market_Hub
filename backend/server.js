import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
