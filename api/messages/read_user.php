<?php
// api/messages/read_user.php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

$user_id = $_GET['user_id'] ?? null;

if (!$user_id) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "User ID is required"]);
    exit();
}

try {
    // Get messages where the user is the receiver OR sender
    $stmt = $conn->prepare("
        SELECT m.*, 
               l.title as listing_title, l.image as listing_image,
               u1.name as sender_name_db, u1.email as sender_email,
               u2.name as receiver_name_db, u2.email as receiver_email
        FROM messages m
        JOIN listings l ON m.listing_id = l.id
        LEFT JOIN users u1 ON m.sender_id = u1.id
        LEFT JOIN users u2 ON m.receiver_id = u2.id
        WHERE m.receiver_id = :user_id OR m.sender_id = :user_id
        ORDER BY m.created_at ASC
    ");
    $stmt->bindParam(':user_id', $user_id);
    $stmt->execute();
    
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($messages);

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
