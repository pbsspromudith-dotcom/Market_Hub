<?php
// api/listings/seo_generate.php
// Auto-generate SEO metadata preview from listing fields (does NOT save)
require_once '../config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

if (!isset($_GET['listing_id'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "listing_id is required"]);
    exit();
}

$listing_id = intval($_GET['listing_id']);

try {
    $stmt = $conn->prepare("
        SELECT l.*, u.name as seller_name
        FROM listings l
        LEFT JOIN users u ON l.user_id = u.id
        WHERE l.id = :id
    ");
    $stmt->execute([':id' => $listing_id]);
    $listing = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$listing) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Listing not found"]);
        exit();
    }

    // --- Parse structured attributes from description ---
    $attrs = extractListingAttributes($listing['description'] ?? '');
    $condition = $attrs['Condition'] ?? '';
    $make = $attrs['Make'] ?? '';
    $model = $attrs['Model'] ?? '';
    $year = $attrs['Year'] ?? '';
    $fuel_type = $attrs['Fuel Type'] ?? '';
    $body_type = $attrs['Body Type'] ?? '';

    $title = $listing['title'] ?? '';
    $location = $listing['location'] ?? '';
    $category = $listing['category'] ?? '';
    $price = $listing['price'] ?? 0;

    // Count images
    $image_count = 0;
    if (!empty($listing['image'])) {
        $parsed = json_decode($listing['image'], true);
        $image_count = is_array($parsed) ? count($parsed) : 1;
    }

    // --- Build Smart Meta Title ---
    $title_parts = [];
    if ($condition && stripos($title, $condition) === false) {
        $title_parts[] = $condition;
    }
    $title_parts[] = $title;
    if ($location) {
        $title_parts[] = "in {$location}";
    }
    $meta_title = implode(' ', $title_parts) . " | Buy on HitAds.ca";
    // Trim to 60 chars if needed
    if (strlen($meta_title) > 60) {
        $meta_title = implode(' ', $title_parts) . " | HitAds.ca";
    }
    if (strlen($meta_title) > 60) {
        $meta_title = substr($meta_title, 0, 57) . "...";
    }

    // --- Build Smart Meta Description ---
    $desc_parts = [];
    if ($condition) {
        $desc_parts[] = "Find {$condition}";
    } else {
        $desc_parts[] = "Find";
    }
    $desc_parts[] = $title;
    if ($price > 0) {
        $desc_parts[] = "for $" . number_format($price, 0);
    }
    if ($location) {
        $desc_parts[] = "in {$location}.";
    } else {
        $desc_parts[] = ".";
    }

    $category_short = explode(' > ', $category)[0] ?? $category;
    $desc_parts[] = "{$category_short} listing";
    if ($image_count > 0) {
        $desc_parts[] = "with {$image_count} photo" . ($image_count > 1 ? 's' : '');
    }
    $desc_parts[] = "on HitAds.ca. Contact seller directly.";

    $meta_desc = implode(' ', $desc_parts);
    if (strlen($meta_desc) > 160) {
        $meta_desc = substr($meta_desc, 0, 157) . '...';
    }

    // --- Build Keywords ---
    $kw = [];
    $kw[] = $title;
    if ($category_short) $kw[] = $category_short;
    if ($location) $kw[] = $location;
    if ($condition) $kw[] = $condition;
    if ($make) $kw[] = $make;
    if ($model) $kw[] = $model;
    if ($location && $category_short) $kw[] = "{$category_short} {$location}";
    if ($title && $location) $kw[] = "{$title} {$location}";
    $kw[] = "buy " . strtolower($category_short) . " " . strtolower($location);
    $kw[] = strtolower($title) . " for sale";
    // Deduplicate and clean
    $kw = array_unique(array_filter(array_map('trim', $kw)));
    $keywords = implode(', ', $kw);

    // --- Build Focus Keyword ---
    $focus_parts = [];
    if ($condition) $focus_parts[] = strtolower($condition);
    $focus_parts[] = strtolower($title);
    if ($location) $focus_parts[] = strtolower($location);
    $focus_keyword = implode(' ', $focus_parts);

    // --- Build Image Alt Text ---
    $alt_parts = [];
    if ($condition) $alt_parts[] = $condition;
    $alt_parts[] = $title;
    $alt_parts[] = "—";
    if ($category_short) $alt_parts[] = $category_short;
    $alt_parts[] = "for sale";
    if ($location) $alt_parts[] = "in {$location}";
    $image_alt_text = implode(' ', $alt_parts);

    echo json_encode([
        "success" => true,
        "generated" => [
            "meta_title" => $meta_title,
            "meta_desc" => $meta_desc,
            "keywords" => $keywords,
            "focus_keyword" => $focus_keyword,
            "image_alt_text" => $image_alt_text,
        ],
        "extracted_attributes" => $attrs,
        "image_count" => $image_count,
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}

/**
 * Extracts key-value attributes from a listing description.
 * Parses lines like "Make: Toyota", "Condition: Used", etc.
 */
function extractListingAttributes($description) {
    $attrs = [];
    if (empty($description)) return $attrs;

    $lines = preg_split('/[\r\n]+/', $description);
    foreach ($lines as $line) {
        $line = trim($line);
        if (preg_match('/^([A-Za-z\s]+):\s*(.+)$/', $line, $m)) {
            $key = trim($m[1]);
            $val = trim($m[2]);
            if (strlen($key) <= 30 && strlen($val) <= 200) {
                $attrs[$key] = $val;
            }
        }
    }
    return $attrs;
}
?>
