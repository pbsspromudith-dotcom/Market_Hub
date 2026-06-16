<?php
// api/listings/create.php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->title) || !isset($data->price) || !isset($data->user_id)) {
    http_response_code(400);
    echo json_encode(["error" => "Required fields missing"]);
    exit();
}

$time = "Just now"; // Simplified
$imageToSave = null;

if (isset($data->image) && is_array($data->image) && count($data->image) > 0) {
    $imageToSave = json_encode($data->image);
}

// Determine if multi-city or single-city posting
$locations = [];
if (isset($data->locations) && is_array($data->locations) && count($data->locations) >= 1) {
    // Multi-city mode
    foreach ($data->locations as $loc) {
        $locations[] = [
            'location' => $loc->location ?? 'Unknown',
            'postal_code' => $loc->postal_code ?? null,
        ];
    }
} else {
    // Single-city (legacy) mode
    $locations[] = [
        'location' => $data->location ?? 'Unknown',
        'postal_code' => $data->postal_code ?? null,
        'latitude' => $data->latitude ?? null,
        'longitude' => $data->longitude ?? null,
    ];
}

try {
    $conn->beginTransaction();

    $parentId = null;
    $allIds = [];

    foreach ($locations as $index => $loc) {
        $query = "INSERT INTO listings (title, price, category, location, description, image, user_id, time, contact_email, contact_phone, postal_code, youtube_link, facebook_link, price_type, parent_id, latitude, longitude) 
                  VALUES (:title, :price, :category, :location, :description, :image, :user_id, :time, :contact_email, :contact_phone, :postal_code, :youtube_link, :facebook_link, :price_type, :parent_id, :latitude, :longitude)";
        
        $stmt = $conn->prepare($query);
        
        $stmt->bindParam(':title', $data->title);
        $stmt->bindParam(':price', $data->price);
        $stmt->bindValue(':category', $data->category ?? null);
        $stmt->bindValue(':location', $loc['location']);
        $stmt->bindValue(':description', $data->description ?? null);
        $stmt->bindParam(':image', $imageToSave);
        $stmt->bindParam(':user_id', $data->user_id);
        $stmt->bindParam(':time', $time);
        $stmt->bindValue(':contact_email', $data->contact_email ?? null);
        $stmt->bindValue(':contact_phone', $data->contact_phone ?? null);
        $stmt->bindValue(':postal_code', $loc['postal_code']);
        $stmt->bindValue(':youtube_link', $data->youtube_link ?? null);
        $stmt->bindValue(':facebook_link', $data->facebook_link ?? null);
        $stmt->bindValue(':price_type', $data->price_type ?? 'amount');
        $stmt->bindValue(':parent_id', $parentId); // null for first (parent), set for children
        $stmt->bindValue(':latitude', $loc['latitude'] ?? null);
        $stmt->bindValue(':longitude', $loc['longitude'] ?? null);

        $stmt->execute();
        $insertId = $conn->lastInsertId();
        $allIds[] = $insertId;

        // First listing becomes the parent
        if ($index === 0) {
            $parentId = $insertId;
        }
    }

    $conn->commit();

    http_response_code(201);
    echo json_encode([
        "success" => true,
        "id" => $allIds[0], // Parent ID for redirect / promotions
        "all_ids" => $allIds,
        "cities_count" => count($allIds)
    ]);

} catch(PDOException $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
