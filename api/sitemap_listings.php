<?php
// api/sitemap_listings.php — Dynamic Listings Sitemap
header("Content-Type: application/xml; charset=utf-8");
require_once 'config.php';

$base = "https://hitads.ca";

echo '<?xml version="1.0" encoding="UTF-8"?>';
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

try {
    // Only fetch listings from the last 60 days to prevent expired listings from showing up
    $stmt = $conn->query("SELECT id, created_at FROM listings WHERE created_at >= DATE_SUB(NOW(), INTERVAL 60 DAY) ORDER BY created_at DESC LIMIT 10000");
    while ($row = $stmt->fetch()) {
        $lastmod = date('c', strtotime($row['created_at']));
        echo '<url>';
        echo '<loc>' . $base . '/item/' . $row['id'] . '</loc>';
        echo '<lastmod>' . $lastmod . '</lastmod>';
        echo '<changefreq>weekly</changefreq>';
        echo '<priority>0.8</priority>';
        echo '</url>';
    }
} catch (Exception $e) {
    // Silently handle errors
}

echo '</urlset>';
?>
