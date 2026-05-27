<?php
// api/sitemap_categories.php — Dynamic Categories Sitemap
header("Content-Type: application/xml; charset=utf-8");
require_once 'config.php';

$base = "https://hitads.ca";

echo '<?xml version="1.0" encoding="UTF-8"?>';
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

try {
    $stmt = $conn->query("SELECT DISTINCT category FROM listings ORDER BY category ASC");
    while ($row = $stmt->fetch()) {
        $cat = htmlspecialchars($row['category']);
        $encoded = urlencode($row['category']);
        echo '<url>';
        echo '<loc>' . $base . '/search?cat=' . $encoded . '</loc>';
        echo '<lastmod>' . date('c') . '</lastmod>';
        echo '<changefreq>daily</changefreq>';
        echo '<priority>0.7</priority>';
        echo '</url>';
    }
} catch (Exception $e) {
    // Silently handle errors
}

echo '</urlset>';
?>
