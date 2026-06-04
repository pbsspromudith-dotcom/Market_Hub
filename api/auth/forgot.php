<?php
// api/auth/forgot.php
require_once '../config.php';
require_once '../mailer.php';

// Ensure it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->email) || empty(trim($data->email))) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Email address is required."]);
    exit();
}

$email = trim($data->email);

try {
    // Check if user exists
    $stmt = $conn->prepare("SELECT id, name FROM users WHERE email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "No account found with that email address."]);
        exit();
    }

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Generate secure token
    $token = bin2hex(random_bytes(32));

    // Update user in DB with token and expiry (1 hour from now)
    $updateStmt = $conn->prepare("UPDATE users SET reset_token = :token, reset_token_expiry = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE id = :id");
    if ($updateStmt->execute([':token' => $token, ':id' => $user['id']])) {
        // Send email
        if (sendPasswordResetEmail($email, $user['name'], $token)) {
            http_response_code(200);
            echo json_encode(["success" => true, "message" => "Password reset link sent! Please check your email."]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Failed to send password reset email."]);
        }
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Failed to generate reset token."]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>