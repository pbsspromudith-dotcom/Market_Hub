<?php
// api/listings/update.php
require_once '../config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->id) || !isset($data->title) || !isset($data->price) || !isset($data->user_id)) {
    http_response_code(400);
    echo json_encode(["error" => "Required fields missing"]);
    exit();
}

$imageToSave = null;
if (isset($data->image) && is_array($data->image)) {
    $imageToSave = json_encode($data->image);
}

try {
    // 1. Fetch current listing to verify owner/auth
    $check_stmt = $conn->prepare("SELECT user_id FROM listings WHERE id = :id");
    $check_stmt->execute([':id' => $data->id]);
    $listing = $check_stmt->fetch(PDO::FETCH_ASSOC);

    if (!$listing) {
        http_response_code(404);
        echo json_encode(["error" => "Listing not found"]);
        exit();
    }

    // Verify owner or admin status
    if (intval($listing['user_id']) !== intval($data->user_id)) {
        $user_stmt = $conn->prepare("SELECT role FROM users WHERE id = :uid");
        $user_stmt->execute([':uid' => $data->user_id]);
        $user = $user_stmt->fetch(PDO::FETCH_ASSOC);
        $userRole = isset($user['role']) ? trim(strtolower($user['role'])) : '';
        
        if ($userRole !== 'admin') {
            http_response_code(403);
            echo json_encode(["error" => "Unauthorized to edit this listing"]);
            exit();
        }
    }

    // 2. Perform UPDATE
    $query = "UPDATE listings SET 
                title = :title, 
                price = :price, 
                category = :category, 
                location = :location, 
                description = :description, 
                image = :image, 
                contact_email = :contact_email, 
                contact_phone = :contact_phone, 
                postal_code = :postal_code,
                youtube_link = :youtube_link,
                facebook_link = :facebook_link,
                price_type = :price_type,
                latitude = :latitude,
                longitude = :longitude
              WHERE id = :id";
    
    $stmt = $conn->prepare($query);
    
    // Bind parameters
    $stmt->bindParam(':title', $data->title);
    $stmt->bindParam(':price', $data->price);
    $stmt->bindValue(':category', $data->category ?? null);
    $stmt->bindValue(':location', $data->location ?? null);
    $stmt->bindValue(':description', $data->description ?? null);
    $stmt->bindParam(':image', $imageToSave);
    $stmt->bindValue(':contact_email', $data->contact_email ?? null);
    $stmt->bindValue(':contact_phone', $data->contact_phone ?? null);
    $stmt->bindValue(':postal_code', $data->postal_code ?? null);
    $stmt->bindValue(':youtube_link', $data->youtube_link ?? null);
    $stmt->bindValue(':facebook_link', $data->facebook_link ?? null);
    $stmt->bindValue(':price_type', $data->price_type ?? 'amount');
    $stmt->bindValue(':latitude', $data->latitude ?? null);
    $stmt->bindValue(':longitude', $data->longitude ?? null);
    $stmt->bindParam(':id', $data->id);

    if ($stmt->execute()) {
        // Sync edits to child/sibling listings (multi-city copies)
        // Find the actual parent id first:
        $pId = null;
        $parentCheck = $conn->prepare("SELECT parent_id FROM listings WHERE id = ?");
        $parentCheck->execute([$data->id]);
        $row = $parentCheck->fetch(PDO::FETCH_ASSOC);
        if ($row && !empty($row['parent_id'])) {
            $pId = intval($row['parent_id']);
        } else {
            $pId = intval($data->id); // Current one is the parent
        }

        // Only sync shared fields — location and postal_code stay unique per city
        $syncQuery = "UPDATE listings SET 
                        title = :title, 
                        price = :price, 
                        category = :category, 
                        description = :description, 
                        image = :image, 
                        contact_email = :contact_email, 
                        contact_phone = :contact_phone, 
                        youtube_link = :youtube_link, 
                        facebook_link = :facebook_link, 
                        price_type = :price_type
                      WHERE (id = :parent_id OR parent_id = :parent_id) AND id != :current_id";
        $syncStmt = $conn->prepare($syncQuery);
        $syncStmt->bindParam(':title', $data->title);
        $syncStmt->bindParam(':price', $data->price);
        $syncStmt->bindValue(':category', $data->category ?? null);
        $syncStmt->bindValue(':description', $data->description ?? null);
        $syncStmt->bindParam(':image', $imageToSave);
        $syncStmt->bindValue(':contact_email', $data->contact_email ?? null);
        $syncStmt->bindValue(':contact_phone', $data->contact_phone ?? null);
        $syncStmt->bindValue(':youtube_link', $data->youtube_link ?? null);
        $syncStmt->bindValue(':facebook_link', $data->facebook_link ?? null);
        $syncStmt->bindValue(':price_type', $data->price_type ?? 'amount');
        $syncStmt->bindParam(':parent_id', $pId);
        $syncStmt->bindParam(':current_id', $data->id);
        $syncStmt->execute();

        http_response_code(200);
        echo json_encode(["success" => true, "message" => "Listing updated successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to update listing"]);
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
