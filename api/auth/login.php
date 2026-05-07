<?php
// api/auth/login.php
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
    echo json_encode(["success" => false, "message" => "Email and password required"]);
    exit();
}

$email = trim($data->email);
$password = $data->password;

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Email and password required"]);
    exit();
}

try {
    // Check if user exists
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    
    if ($stmt->rowCount() === 0) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Invalid credentials"]);
        exit();
    }

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verify password against stored hash
    if (password_verify($password, $user['password'])) {
        // Check if email is verified
        if (isset($user['is_verified']) && $user['is_verified'] == 0) {
            http_response_code(403);
            echo json_encode([
                "success" => false,
                "message" => "Please verify your email before logging in. Check your inbox for the verification link.",
                "needsVerification" => true,
                "email" => $user['email']
            ]);
            exit();
        }

        // Remove sensitive fields from the response
        unset($user['password']);
        unset($user['verification_token']);
        unset($user['reset_token']);
        unset($user['reset_token_expiry']);
        
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "user" => $user
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Invalid credentials"]);
    }

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error"]);
}
?>
