<?php
// api/listings/seo_read.php
// Read SEO data for a single listing or all listings (admin keyword overview)
require_once '../config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

try {
    // Mode 1: Single listing SEO data
    if (isset($_GET['listing_id'])) {
        $listing_id = intval($_GET['listing_id']);

        $stmt = $conn->prepare("
            SELECT l.id, l.title, l.category, l.location, l.price, l.description, l.image, l.created_at,
                   s.meta_title, s.meta_desc, s.keywords, s.image_alt_text, s.focus_keyword, s.seo_score, s.updated_at as seo_updated_at
            FROM listings l
            LEFT JOIN listing_seo s ON l.id = s.listing_id
            WHERE l.id = :id
        ");
        $stmt->execute([':id' => $listing_id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            echo json_encode(["success" => true, "data" => $row]);
        } else {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Listing not found"]);
        }
        exit();
    }

    // Mode 2: All listings with SEO data (admin panel)
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';
    $category = isset($_GET['category']) ? trim($_GET['category']) : '';
    $seo_status = isset($_GET['seo_status']) ? trim($_GET['seo_status']) : '';
    $page = max(1, intval($_GET['page'] ?? 1));
    $limit = max(1, min(100, intval($_GET['limit'] ?? 50)));
    $offset = ($page - 1) * $limit;

    $where = [];
    $params = [];

    if ($search) {
        $where[] = "(l.title LIKE :search OR s.keywords LIKE :search2 OR s.focus_keyword LIKE :search3)";
        $params[':search'] = "%{$search}%";
        $params[':search2'] = "%{$search}%";
        $params[':search3'] = "%{$search}%";
    }

    if ($category) {
        $where[] = "l.category LIKE :category";
        $params[':category'] = "%{$category}%";
    }

    if ($seo_status === 'custom') {
        $where[] = "s.meta_title IS NOT NULL";
    } elseif ($seo_status === 'none') {
        $where[] = "s.listing_id IS NULL";
    }

    $where_sql = count($where) > 0 ? 'WHERE ' . implode(' AND ', $where) : '';

    // Count total
    $count_sql = "SELECT COUNT(*) FROM listings l LEFT JOIN listing_seo s ON l.id = s.listing_id {$where_sql}";
    $count_stmt = $conn->prepare($count_sql);
    $count_stmt->execute($params);
    $total = (int)$count_stmt->fetchColumn();

    // Fetch rows
    $sql = "
        SELECT l.id, l.title, l.category, l.location, l.price, l.image, l.created_at,
               s.meta_title, s.meta_desc, s.keywords, s.image_alt_text, s.focus_keyword, s.seo_score, s.updated_at as seo_updated_at
        FROM listings l
        LEFT JOIN listing_seo s ON l.id = s.listing_id
        {$where_sql}
        ORDER BY l.created_at DESC
        LIMIT {$limit} OFFSET {$offset}
    ";
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get distinct categories for filter dropdown
    $cat_stmt = $conn->query("SELECT DISTINCT category FROM listings WHERE category IS NOT NULL ORDER BY category");
    $categories = $cat_stmt->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode([
        "success" => true,
        "data" => $rows,
        "total" => $total,
        "page" => $page,
        "limit" => $limit,
        "categories" => $categories
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
