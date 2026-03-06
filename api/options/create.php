<?php
// api/options/create.php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->option_type) || !isset($data->option_value)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Both option_type and option_value are required"]);
    exit();
}

try {
    $query = "INSERT INTO options (option_type, option_value) VALUES (:type, :val)";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':type', $data->option_type);
    $stmt->bindParam(':val', $data->option_value);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(["success" => true, "message" => "Option created successfully", "id" => $conn->lastInsertId()]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Failed to create option"]);
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database error"]);
}
?>
