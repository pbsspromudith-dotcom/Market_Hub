<?php
// api/listings/seo_update.php
// Upsert per-listing SEO metadata (manual overrides)
require_once '../config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['listing_id'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "listing_id is required"]);
    exit();
}

$listing_id = intval($data['listing_id']);

// Verify listing exists
try {
    $check = $conn->prepare("SELECT id FROM listings WHERE id = ?");
    $check->execute([$listing_id]);
    if ($check->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Listing not found"]);
        exit();
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error"]);
    exit();
}

// Determine if this is a reset (clear all overrides)
$is_reset = isset($data['reset']) && $data['reset'] === true;

try {
    if ($is_reset) {
        // Delete the SEO override row entirely
        $stmt = $conn->prepare("DELETE FROM listing_seo WHERE listing_id = ?");
        $stmt->execute([$listing_id]);
        echo json_encode(["success" => true, "message" => "SEO overrides reset to auto-generation"]);
    } else {
        // Upsert SEO data
        $meta_title = isset($data['meta_title']) && $data['meta_title'] !== '' ? $data['meta_title'] : null;
        $meta_desc = isset($data['meta_desc']) && $data['meta_desc'] !== '' ? $data['meta_desc'] : null;
        $keywords = isset($data['keywords']) && $data['keywords'] !== '' ? $data['keywords'] : null;
        $focus_keyword = isset($data['focus_keyword']) && $data['focus_keyword'] !== '' ? $data['focus_keyword'] : null;
        $image_alt_text = isset($data['image_alt_text']) && $data['image_alt_text'] !== '' ? $data['image_alt_text'] : null;

        $stmt = $conn->prepare("
            INSERT INTO listing_seo (listing_id, meta_title, meta_desc, keywords, focus_keyword, image_alt_text)
            VALUES (:listing_id, :meta_title, :meta_desc, :keywords, :focus_keyword, :image_alt_text)
            ON DUPLICATE KEY UPDATE
                meta_title = VALUES(meta_title),
                meta_desc = VALUES(meta_desc),
                keywords = VALUES(keywords),
                focus_keyword = VALUES(focus_keyword),
                image_alt_text = VALUES(image_alt_text),
                updated_at = CURRENT_TIMESTAMP
        ");

        $stmt->execute([
            ':listing_id' => $listing_id,
            ':meta_title' => $meta_title,
            ':meta_desc' => $meta_desc,
            ':keywords' => $keywords,
            ':focus_keyword' => $focus_keyword,
            ':image_alt_text' => $image_alt_text,
        ]);

        echo json_encode(["success" => true, "message" => "SEO data saved successfully"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
