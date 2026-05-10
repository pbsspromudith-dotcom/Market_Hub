<?php
// api/options/update.php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->id) || !isset($data->option_type)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "ID and Option Type are required"]);
    exit();
}

try {
    // Only updating parent_id for car_models
    if ($data->option_type !== 'car_model') {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Can only update parent for car models currently"]);
        exit();
    }

    $parentId = isset($data->parent_id) && $data->parent_id !== "" ? $data->parent_id : null;
    
    $query = "UPDATE car_models SET make_id = :parent_id WHERE id = :id";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':parent_id', $parentId);
    $stmt->bindParam(':id', $data->id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["success" => true, "message" => "Option updated successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Failed to update option"]);
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database error"]);
}
?>
