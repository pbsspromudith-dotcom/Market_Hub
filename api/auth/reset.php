<?php
// api/auth/reset.php
require_once '../config.php';

// Ensure it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

// Get raw POST data
$data = json_decode(file_get_contents("php://input"));

// Validate input
if (!isset($data->token) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Token and new password required."]);
    exit();
}

$token = trim($data->token);
$password = $data->password;

if (empty($token) || empty($password)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Token and new password required."]);
    exit();
}

if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Password must be at least 6 characters."]);
    exit();
}

try {
    // Check if token exists and is not expired
    $stmt = $conn->prepare("SELECT id FROM users WHERE reset_token = :token AND reset_token_expiry > NOW()");
    $stmt->bindParam(':token', $token);
    $stmt->execute();
    
    if ($stmt->rowCount() === 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid or expired password reset token."]);
        exit();
    }

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Hash the new password using bcrypt, matching the registration settings
    $hashed_password = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

    // Update the password and clear token/expiry
    $updateStmt = $conn->prepare("UPDATE users SET password = :password, reset_token = NULL, reset_token_expiry = NULL WHERE id = :id");
    $updateStmt->bindParam(':password', $hashed_password);
    $updateStmt->bindParam(':id', $user['id']);
    
    if ($updateStmt->execute()) {
        http_response_code(200);
        echo json_encode(["success" => true, "message" => "Password updated successfully."]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Failed to update password."]);
    }

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
