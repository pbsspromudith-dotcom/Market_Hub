<?php
// api/options/delete.php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->id)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Option ID required"]);
    exit();
}

try {
    $query = "DELETE FROM options WHERE id = :id";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':id', $data->id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["success" => true, "message" => "Option deleted successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Failed to delete option"]);
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database error"]);
}
?>
