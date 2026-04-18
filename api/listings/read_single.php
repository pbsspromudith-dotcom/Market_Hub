<?php
// api/listings/read_single.php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(["error" => "ID is required"]);
    exit();
}

$id = $_GET['id'];

try {
    $stmt = $conn->prepare("
        SELECT l.*, u.name as seller_name, u.avatar as seller_avatar, u.join_date as seller_join_date, u.email as seller_email, u.phone as seller_phone
        FROM listings l 
        LEFT JOIN users u ON l.user_id = u.id 
        WHERE l.id = :id
    ");
    $stmt->bindParam(':id', $id);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // Fix image paths: only add /api prefix if not already present
        function fixImagePath($path) {
            if (!$path) return $path;
            if (strpos($path, '/api/uploads/') === 0) {
                return $path; // Already correct
            }
            if (strpos($path, '/uploads/') === 0) {
                return '/api' . $path;
            }
            return $path;
        }

        // Process image fields
        $image = $row['image'];
        $allImages = $row['image'] ? [$row['image']] : [];

        if (!empty($row['image']) && strpos($row['image'], '[') === 0) {
            $parsed = json_decode($row['image']);
            if (is_array($parsed)) {
                if (count($parsed) > 0) {
                    $image = $parsed[0];
                    $allImages = $parsed;
                } else {
                    $image = null;
                    $allImages = [];
                }
            }
        }
        $row['image'] = fixImagePath($image);
        $row['allImages'] = array_map('fixImagePath', $allImages);

        // Null out placeholder default phone/email so they don't show as real contact info
        $PLACEHOLDER_PHONE = '+1 (555) 123-4567';
        if (!empty($row['seller_phone']) && trim($row['seller_phone']) === $PLACEHOLDER_PHONE) {
            $row['seller_phone'] = null;
        }
        // Also null out listing-level contact fields if they equal the placeholder
        if (!empty($row['contact_phone']) && trim($row['contact_phone']) === $PLACEHOLDER_PHONE) {
            $row['contact_phone'] = null;
        }

        http_response_code(200);
        echo json_encode($row);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Not found"]);
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error"]);
}
?>
