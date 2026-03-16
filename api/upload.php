<?php
// api/upload.php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

$uploadDir = __DIR__ . '/uploads/';

// Create directory if it doesn't exist
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

if (!isset($_FILES['images'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "No files uploaded"]);
    exit();
}

// Normalize single file upload to array format
if (!is_array($_FILES['images']['name'])) {
    $_FILES['images']['name'] = [$_FILES['images']['name']];
    $_FILES['images']['tmp_name'] = [$_FILES['images']['tmp_name']];
    $_FILES['images']['error'] = [$_FILES['images']['error']];
    $_FILES['images']['size'] = [$_FILES['images']['size']];
    $_FILES['images']['type'] = [$_FILES['images']['type']];
}

if (count($_FILES['images']['name']) === 0 || $_FILES['images']['error'][0] === UPLOAD_ERR_NO_FILE) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "No files uploaded"]);
    exit();
}

$imageUrls = [];
$totalFiles = count($_FILES['images']['name']);

// Limit to 5 files like the Node.js version
$limit = min($totalFiles, 5);

for ($i = 0; $i < $limit; $i++) {
    $error = $_FILES['images']['error'][$i];
    
    if ($error === UPLOAD_ERR_OK) {
        $tmpName = $_FILES['images']['tmp_name'][$i];
        $originalName = $_FILES['images']['name'][$i];
        
        $extension = pathinfo($originalName, PATHINFO_EXTENSION);
        $uniqueSuffix = round(microtime(true) * 1000) . "-" . mt_rand(100000000, 999999999);
        $fileName = $uniqueSuffix . '.' . $extension;
        
        $destination = $uploadDir . $fileName;
        
        if (move_uploaded_file($tmpName, $destination)) {
            // Include api/ so the frontend can reference it correctly if needed, or stick to just /uploads if it maps properly
            $imageUrls[] = "/api/uploads/" . $fileName; 
        }
    }
}

if (count($imageUrls) > 0) {
    echo json_encode(["success" => true, "imageUrls" => $imageUrls]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to upload files"]);
}
?>
