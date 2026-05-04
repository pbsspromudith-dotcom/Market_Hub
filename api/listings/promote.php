<?php
// api/listings/promote.php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->id) || !isset($data->user_id)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit();
}

try {
    // Ensure columns exist (Auto-migration for promotions)
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
    }

    // Verify ownership
    $checkOwner = "SELECT id FROM listings WHERE id = ? AND user_id = ?";
    $ownerStmt = $conn->prepare($checkOwner);
    $ownerStmt->execute([$data->id, $data->user_id]);
    
    if ($ownerStmt->rowCount() === 0) {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "Unauthorized or listing not found"]);
        exit();
    }

    $is_top_ad = isset($data->is_top_ad) && $data->is_top_ad ? 1 : 0;
    $is_highlighted = isset($data->is_highlighted) && $data->is_highlighted ? 1 : 0;
    $is_urgent = isset($data->is_urgent) && $data->is_urgent ? 1 : 0;
    $is_home_gallery = isset($data->is_home_gallery) && $data->is_home_gallery ? 1 : 0;

    $query = "UPDATE listings 
              SET is_top_ad = :top_ad, 
                  is_highlighted = :highlighted, 
                  is_urgent = :urgent, 
                  is_home_gallery = :home_gallery
              WHERE id = :id AND user_id = :user_id";

    $stmt = $conn->prepare($query);
    $stmt->bindParam(':top_ad', $is_top_ad);
    $stmt->bindParam(':highlighted', $is_highlighted);
    $stmt->bindParam(':urgent', $is_urgent);
    $stmt->bindParam(':home_gallery', $is_home_gallery);
    $stmt->bindParam(':id', $data->id);
    $stmt->bindParam(':user_id', $data->user_id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Ad promotions updated successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Failed to update promotions"]);
    }

} catch(PDOException $exception) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error: " . $exception->getMessage()]);
}
?>
