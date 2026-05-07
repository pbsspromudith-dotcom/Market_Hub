<?php
// api/auth/register.php
require_once '../config.php';
require_once '../mailer.php';

// Ensure it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

// Get raw POST data
$data = json_decode(file_get_contents("php://input"));

// Validate input
if (!isset($data->name) || !isset($data->email) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "All fields required"]);
    exit();
}

$name = trim($data->name);
$email = trim($data->email);
$password = $data->password;

if (empty($name) || empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "All fields required"]);
    exit();
}

if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Password must be at least 6 characters"]);
    exit();
}

try {
    // Check if email exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Email already exists"]);
        exit();
    }

    // Hash the password securely (compatible with bcrypt)
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    
    // Default avatar if needed
    $avatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=" . urlencode($name);

    // Generate verification token
    $verificationToken = bin2hex(random_bytes(32));

    // Insert user
    $query = "INSERT INTO users (name, email, password, avatar, verification_token, is_verified) VALUES (:name, :email, :password, :avatar, :token, 0)";
    $insertStmt = $conn->prepare($query);
    $insertStmt->bindParam(':name', $name);
    $insertStmt->bindParam(':email', $email);
    $insertStmt->bindParam(':password', $hashedPassword);
    $insertStmt->bindParam(':avatar', $avatar);
    $insertStmt->bindParam(':token', $verificationToken);

    if ($insertStmt->execute()) {
        $userId = $conn->lastInsertId();

        // Send verification email
        sendVerificationEmail($email, $name, $verificationToken);

        http_response_code(201);
        echo json_encode([
            "success" => true,
            "message" => "Registered successfully",
            "userId" => $userId
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Failed to register user"]);
    }

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
