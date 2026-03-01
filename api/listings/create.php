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
$imageToSave = $data->image ?? null;

if (isset($data->image) && is_array($data->image) && count($data->image) > 0) {
    $imageToSave = json_encode($data->image);
} elseif (isset($data->image) && is_array($data->image) && count($data->image) === 0) {
    $imageToSave = "https://picsum.photos/seed/new/800/600";
}

if (!$imageToSave) {
    $imageToSave = "https://picsum.photos/seed/new/800/600";
}

try {
    $query = "INSERT INTO listings (title, price, category, location, description, image, user_id, time, contact_email, contact_phone, postal_code) 
              VALUES (:title, :price, :category, :location, :description, :image, :user_id, :time, :contact_email, :contact_phone, :postal_code)";
    
    $stmt = $conn->prepare($query);
    
    // Bind parameters
    $stmt->bindParam(':title', $data->title);
    $stmt->bindParam(':price', $data->price);
    $stmt->bindValue(':category', $data->category ?? null);
    $stmt->bindValue(':location', $data->location ?? null);
    $stmt->bindValue(':description', $data->description ?? null);
    $stmt->bindParam(':image', $imageToSave);
    $stmt->bindParam(':user_id', $data->user_id);
    $stmt->bindParam(':time', $time);
    $stmt->bindValue(':contact_email', $data->contact_email ?? null);
    $stmt->bindValue(':contact_phone', $data->contact_phone ?? null);
    $stmt->bindValue(':postal_code', $data->postal_code ?? null);

    if ($stmt->execute()) {
        $insertId = $conn->lastInsertId();
        http_response_code(201);
        echo json_encode(["success" => true, "id" => $insertId]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to create listing"]);
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
