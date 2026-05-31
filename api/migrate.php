<?php
require_once 'config.php';

try {
    // Add is_verified column
    $conn->exec("ALTER TABLE users ADD COLUMN is_verified TINYINT(1) DEFAULT 0");
    echo "Added is_verified.<br/>";
} catch(PDOException $e) {
    echo "is_verified: " . $e->getMessage() . "<br/>";
}

try {
    // Add verification_token column
    $conn->exec("ALTER TABLE users ADD COLUMN verification_token VARCHAR(255) NULL");
    echo "Added verification_token.<br/>";
} catch(PDOException $e) {
    echo "verification_token: " . $e->getMessage() . "<br/>";
}

try {
    // Add reset_token column
    $conn->exec("ALTER TABLE users ADD COLUMN reset_token VARCHAR(255) NULL");
    echo "Added reset_token.<br/>";
} catch(PDOException $e) {
    echo "reset_token: " . $e->getMessage() . "<br/>";
}

try {
    // Add reset_token_expiry column
    $conn->exec("ALTER TABLE users ADD COLUMN reset_token_expiry DATETIME NULL");
    echo "Added reset_token_expiry.<br/>";
} catch(PDOException $e) {
    echo "reset_token_expiry: " . $e->getMessage() . "<br/>";
}

try {
    // Create transactions table
    $conn->exec("CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        listing_id INT NOT NULL,
        ticket VARCHAR(255) NOT NULL,
        receipt_id VARCHAR(255) DEFAULT NULL,
        amount DECIMAL(10,2) NOT NULL,
        response_code VARCHAR(50) DEFAULT NULL,
        payment_type VARCHAR(50) DEFAULT NULL,
        promotions VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;");
    echo "Created transactions table.<br/>";
} catch(PDOException $e) {
    echo "transactions: " . $e->getMessage() . "<br/>";
}

try {
    $checkQuery = "SHOW COLUMNS FROM listings LIKE 'is_top_ad'";
    $stmt = $conn->prepare($checkQuery);
    $stmt->execute();
    if ($stmt->rowCount() == 0) {
        $alterQuery = "ALTER TABLE listings 
            ADD COLUMN is_top_ad TINYINT(1) DEFAULT 0,
            ADD COLUMN is_highlighted TINYINT(1) DEFAULT 0,
            ADD COLUMN is_urgent TINYINT(1) DEFAULT 0,
            ADD COLUMN is_home_gallery TINYINT(1) DEFAULT 0";
        $conn->exec($alterQuery);
        echo "Added promotion columns to listings table.<br/>";
    } else {
        echo "Promotion columns already exist on listings.<br/>";
    }
} catch(PDOException $e) {
    echo "listings promotion columns: " . $e->getMessage() . "<br/>";
}

try {
    // Create seo_settings table
    $conn->exec("CREATE TABLE IF NOT EXISTS seo_settings (
        setting_key VARCHAR(100) NOT NULL UNIQUE PRIMARY KEY,
        setting_value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;");
    echo "Created seo_settings table.<br/>";

    // Insert Default Values (Only if table is empty)
    $check_seo = $conn->query("SELECT COUNT(*) FROM seo_settings")->fetchColumn();
    if ($check_seo == 0) {
        $defaults = [
            'gtm_id' => 'GTM-XXXXXXX',
            'ga4_id' => 'G-XXXXXXXXXX',
            'meta_pixel_id' => 'XXXXXXXXXXXXXXXX',
            'google_ads_id' => 'AW-XXXXXXXXXX',
            'google_site_verification' => '',
            'robots_txt' => "User-agent: *\nAllow: /\n\nSitemap: https://hitads.ca/sitemap.xml",
            'homepage_schema_markup' => '
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "HitAds.ca",
  "url": "https://hitads.ca",
  "logo": "https://hitads.ca/assets/logo.png",
  "sameAs": [
    "https://www.facebook.com/hitads.ca",
    "https://www.instagram.com/hitads.ca",
    "https://www.linkedin.com/company/hitads"
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "HitAds.ca",
  "image": "https://hitads.ca/assets/logo.png",
  "url": "https://hitads.ca",
  "telephone": "+1-800-555-0199",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Toronto",
    "addressRegion": "ON",
    "addressCountry": "CA"
  }
}
</script>',
            'page_title_home' => 'HitAds.ca – Toronto Classified Ads & Local Marketplace Canada',
            'meta_desc_home' => "HitAds.ca is Canada's modern classified ads platform connecting local communities, businesses, services, jobs, real estate, and marketplace listings across Toronto and beyond.",
            'page_title_search' => 'Search Classified Ads | HitAds.ca',
            'meta_desc_search' => 'Search thousands of classified ads across Canada. Find vehicles, real estate, jobs, services, and more on HitAds.ca.',
            'page_title_toronto-classifieds' => 'Toronto Classifieds & Local Marketplace - Buy & Sell | HitAds.ca',
            'meta_desc_toronto-classifieds' => 'Search local classifieds listings in Toronto, ON. Post free advertisements for jobs, cars, real estate, and items for sale on HitAds.ca.',
            'page_title_buy-and-sell-toronto' => 'Buy and Sell in Toronto - Free Classifieds | HitAds.ca',
            'meta_desc_buy-and-sell-toronto' => 'Buy and sell items in Toronto. Find electronics, furniture, vehicles, and more. Post your free ad today on HitAds.ca.',
            'page_title_local-services-toronto' => 'Local Services in Toronto - Movers, Plumbers, Contractors | HitAds.ca',
            'meta_desc_local-services-toronto' => 'Find trusted local services in Toronto including movers, plumbing, electrical, renovation, cleaning, and more on HitAds.ca.',
            'page_title_jobs-toronto' => 'Jobs in Toronto - Find Employment & Career Opportunities | HitAds.ca',
            'meta_desc_jobs-toronto' => 'Search job listings in Toronto. Find full-time, part-time, and contract jobs across all industries on HitAds.ca.',
            'page_title_real-estate-toronto' => 'Real Estate Toronto - Houses, Condos, Rentals | HitAds.ca',
            'meta_desc_real-estate-toronto' => 'Browse real estate listings in Toronto. Find houses for sale, condos, apartments for rent, and commercial property on HitAds.ca.',
            'page_title_sri-lankan-marketplace-canada' => 'Sri Lankan Marketplace Canada - Community Classifieds | HitAds.ca',
            'meta_desc_sri-lankan-marketplace-canada' => "Canada's Sri Lankan community marketplace. Buy, sell, and connect with the Sri Lankan diaspora across Toronto and Canada on HitAds.ca.",
            'page_title_contact' => 'Contact Us | HitAds.ca',
            'meta_desc_contact' => "Get in touch with the HitAds.ca team. We're here to help with questions about listings, advertising, and partnerships.",
            'page_title_help' => 'Help Center | HitAds.ca',
            'meta_desc_help' => 'Find answers to frequently asked questions about posting ads, managing your account, and using HitAds.ca.',
            'page_title_terms' => 'Terms & Conditions | HitAds.ca',
            'meta_desc_terms' => 'Read the HitAds.ca terms of service, privacy policy, and posting guidelines.',
            'page_title_buying-guides' => 'Buying Guides - Smart Shopping Tips | HitAds.ca',
            'meta_desc_buying-guides' => 'Expert buying guides to help you make smart purchasing decisions on HitAds.ca classifieds.',
            'page_title_safety-tips' => 'Safety Tips for Buyers & Sellers | HitAds.ca',
            'meta_desc_safety-tips' => 'Stay safe while buying and selling on HitAds.ca. Essential safety guidelines for online classifieds.',
            'page_title_selling-advice' => 'Selling Advice - Get the Best Price | HitAds.ca',
            'meta_desc_selling-advice' => 'Expert tips to sell faster and get the best price for your items on HitAds.ca classifieds.',
            'page_title_market-trends' => 'Market Trends & Insights | HitAds.ca',
            'meta_desc_market-trends' => 'Explore market trends, pricing insights, and popular categories on HitAds.ca Canadian classifieds.'
        ];

        $stmt = $conn->prepare("INSERT INTO seo_settings (setting_key, setting_value) VALUES (:key, :value)");
        foreach ($defaults as $key => $val) {
            $stmt->execute([':key' => $key, ':value' => $val]);
        }
        echo "Seeded default SEO settings.<br/>";
    }

    // Ensure new tracking fields and social links exist even if table was already seeded
    $conn->exec("INSERT IGNORE INTO seo_settings (setting_key, setting_value) VALUES 
        ('google_ads_id', 'AW-XXXXXXXXXX'),
        ('google_site_verification', ''),
        ('social_facebook', 'https://www.facebook.com/hitads.ca'),
        ('social_x', 'https://x.com'),
        ('social_instagram', 'https://www.instagram.com/hitads.ca'),
        ('footer_copyright_text', '© 2026 HitAds.ca — Post free ads, sell fast, buy local, and connect with buyers and sellers across Canada.'),
        ('homepage_hero_title_1', 'Find what you need,'),
        ('homepage_hero_title_2', 'right in your community.'),
        ('homepage_hero_tag_1', 'Free Ads.'),
        ('homepage_hero_tag_2', 'Sell Fast.'),
        ('homepage_hero_tag_3', 'Buy Local.'),
        ('homepage_hero_tag_4', 'Canada-Wide.')");
} catch(PDOException $e) {
    echo "seo_settings error: " . $e->getMessage() . "<br/>";
}

try {
    // Create listing_seo table for per-listing SEO overrides & keyword tracking
    $conn->exec("CREATE TABLE IF NOT EXISTS listing_seo (
        id              INT AUTO_INCREMENT PRIMARY KEY,
        listing_id      INT NOT NULL UNIQUE,
        meta_title      VARCHAR(255) DEFAULT NULL,
        meta_desc       TEXT DEFAULT NULL,
        keywords        TEXT DEFAULT NULL,
        image_alt_text  TEXT DEFAULT NULL,
        focus_keyword   VARCHAR(255) DEFAULT NULL,
        seo_score       TINYINT DEFAULT NULL,
        updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;");
    echo "Created listing_seo table.<br/>";
} catch(PDOException $e) {
    echo "listing_seo: " . $e->getMessage() . "<br/>";
}

try {
    // Create messages table
    $conn->exec("CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        listing_id INT NOT NULL,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        message TEXT NOT NULL,
        sender_name VARCHAR(255) DEFAULT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_read TINYINT(1) DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;");
    echo "Created messages table.<br/>";
} catch(PDOException $e) {
    echo "messages: " . $e->getMessage() . "<br/>";
}
?>

