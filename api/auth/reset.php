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
if (!isset($data->email) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Email and new password required"]);
    exit();
}

$email = trim($data->email);
$password = $data->password;

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Email and new password required"]);
    exit();
}

try {
    // Check if user exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    
    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "No account found with that email address."]);
        exit();
    }

    // Hash the new password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Update the password
    $updateStmt = $conn->prepare("UPDATE users SET password = :password WHERE email = :email");
    $updateStmt->bindParam(':password', $hashed_password);
    $updateStmt->bindParam(':email', $email);
    
    if ($updateStmt->execute()) {
        http_response_code(200);
        echo json_encode(["success" => true, "message" => "Password updated successfully."]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Failed to update password."]);
    }

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error"]);
}
?>
