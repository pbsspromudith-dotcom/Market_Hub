<?php
// api/auth/resend-verify.php
require_once '../config.php';
require_once '../mailer.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->email) || empty(trim($data->email))) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Email is required"]);
    exit();
}

$email = trim($data->email);

try {
    $stmt = $conn->prepare("SELECT id, name, is_verified FROM users WHERE email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    if ($stmt->rowCount() === 0) {
        // Don't reveal if email exists or not
        echo json_encode(["success" => true, "message" => "If the email exists, a verification link has been sent."]);
        exit();
    }

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user['is_verified'] == 1) {
        echo json_encode(["success" => true, "message" => "This email is already verified. You can sign in."]);
        exit();
    }

    // Generate new token
    $newToken = bin2hex(random_bytes(32));
    $updateStmt = $conn->prepare("UPDATE users SET verification_token = :token WHERE id = :id");
    $updateStmt->execute([':token' => $newToken, ':id' => $user['id']]);

    // Send verification email
    sendVerificationEmail($email, $user['name'], $newToken);

    echo json_encode(["success" => true, "message" => "Verification email sent! Please check your inbox."]);

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error. Please try again."]);
}
?>
