<?php
// api/users/upload-avatar.php
require_once '../config.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

// Check required fields
if (!isset($_POST['user_id']) || !isset($_FILES['avatar'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "User ID and avatar file are required"]);
    exit();
}

$userId = intval($_POST['user_id']);
$file = $_FILES['avatar'];

// Validate file
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
if (!in_array($file['type'], $allowedTypes)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Only JPG, PNG, GIF, and WebP images are allowed"]);
    exit();
}

// Max 5MB
if ($file['size'] > 5 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Image must be under 5MB"]);
    exit();
}

// Create avatars directory if it doesn't exist
$uploadDir = __DIR__ . '/../uploads/avatars/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Generate unique filename
$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = 'avatar_' . $userId . '_' . time() . '.' . $ext;
$targetPath = $uploadDir . $filename;

if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    // URL path relative to the backend server root (api folder is the document root)
    $avatarUrl = '/uploads/avatars/' . $filename;

    try {
        // Delete old avatar file if it exists
        $oldStmt = $conn->prepare("SELECT avatar FROM users WHERE id = :id");
        $oldStmt->execute([':id' => $userId]);
        $oldUser = $oldStmt->fetch(PDO::FETCH_ASSOC);
        
        if ($oldUser && $oldUser['avatar'] && strpos($oldUser['avatar'], '/uploads/avatars/') !== false) {
            $oldFile = __DIR__ . '/..' . $oldUser['avatar'];
            if (file_exists($oldFile)) {
                unlink($oldFile);
            }
        }

        // Update avatar in database
        $stmt = $conn->prepare("UPDATE users SET avatar = :avatar WHERE id = :id");
        $stmt->execute([':avatar' => $avatarUrl, ':id' => $userId]);

        // Fetch updated user
        $selStmt = $conn->prepare("SELECT id, name, email, role, avatar, join_date, phone FROM users WHERE id = :id");
        $selStmt->execute([':id' => $userId]);
        $updatedUser = $selStmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true,
            "message" => "Avatar updated successfully",
            "user" => $updatedUser,
            "avatarUrl" => $avatarUrl
        ]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
    }
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to upload file"]);
}
?>
