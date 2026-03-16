<?php
// api/listings/read.php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

try {
    $stmt = $conn->query("SELECT * FROM listings ORDER BY created_at DESC");
    $listings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Process image fields similarly to Node.js
    // Fix /uploads/ paths to /api/uploads/ for production
    function fixImagePath($path) {
        if ($path && strpos($path, '/uploads/') === 0) {
            return '/api' . $path;
        }
        return $path;
    }

    foreach ($listings as &$row) {
        $image = $row['image'];
        $allImages = $row['image'] ? [$row['image']] : [];

        if (!empty($row['image']) && strpos($row['image'], '[') === 0) {
            $parsed = json_decode($row['image']);
            if (is_array($parsed) && count($parsed) > 0) {
                $image = $parsed[0];
                $allImages = $parsed;
            }
        }
        $row['image'] = fixImagePath($image);
        $row['allImages'] = array_map('fixImagePath', $allImages);
    }

    http_response_code(200);
    echo json_encode($listings);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error"]);
}
?>
