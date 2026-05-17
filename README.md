<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# HitAds.ca - Canada's Free Business Classifieds

HitAds.ca is a comprehensive, Canada-wide classifieds and marketplace platform designed to connect local buyers and sellers. Built from the ground up to ensure high performance, security, and a seamless user experience, it incorporates modern UI/UX principles and robust features for a premium marketplace feel.

## 🚀 Features

* **Modern Frontend Architecture:** Highly responsive, dynamic Single Page Application (SPA) ensuring fast load times and an optimized rendering pipeline.
* **Sleek UI/UX Design:** Modern, accessible interface featuring custom styling, micro-animations, glassmorphism, and responsive layouts.
* **Location-Based Search Engine:** Intelligent, auto-completing geolocation search allowing users to filter thousands of listings by city and province.
* **Robust Backend Integration:** Secure user authentication, role-based access control (Admin vs. User), and CRUD operations for listings.
* **Admin Dashboard & Analytics:** Secure administrative portal featuring interactive data visualizations and analytics.
* **Interactive Features:** Comprehensive ecosystem including a custom chat-bot interface, localized prompts, and user profile management.

## 🛠️ Tech Stack

* **Frontend:** React 19, TypeScript, Vite, React Router v7
* **Styling:** Tailwind CSS
* **APIs & Data:** Nominatim OpenStreetMap API (Geolocation), Recharts (Data Visualization)
* **Backend:** PHP API

## 💻 Run Locally

**Prerequisites:** Node.js, PHP (e.g., XAMPP/WAMP for the backend)

1. **Install frontend dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key.

3. **Start the backend API:**
   Run the backend PHP server (this runs `C:\xampp\php\php.exe -S localhost:8000 -t api`):
   ```bash
   npm run backend
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

*View your original AI Studio template here: https://ai.studio/apps/drive/1ZkQSxX3SV88e4hkOIRABNJQJWAjOD7Oy*
