<?php
// api/auth/verify.php
require_once '../config.php';

if (!isset($_GET['token']) || empty($_GET['token'])) {
    http_response_code(400);
    die("Invalid or missing verification token.");
}

$token = $_GET['token'];

try {
    // Check if token exists
    $stmt = $conn->prepare("SELECT id, is_verified FROM users WHERE verification_token = :token");
    $stmt->bindParam(':token', $token);
    $stmt->execute();

    if ($stmt->rowCount() === 0) {
        http_response_code(400);
        die("Invalid verification token.");
    }

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user['is_verified'] == 1) {
        // Already verified, just redirect
        header("Location: https://hitads.ca/#/login?verified=already");
        exit();
    }

    // Update user to verified
    $updateStmt = $conn->prepare("UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = :id");
    $updateStmt->bindParam(':id', $user['id']);

    if ($updateStmt->execute()) {
        header("Location: https://hitads.ca/#/login?verified=true");
        exit();
    } else {
        http_response_code(500);
        die("Failed to verify account. Please try again.");
    }

} catch (PDOException $e) {
    http_response_code(500);
    die("Database error: " . $e->getMessage());
}
?>