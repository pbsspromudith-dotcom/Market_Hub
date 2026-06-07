<?php
// api/categories/delete_attribute.php
require_once dirname(__DIR__) . '/config.php';

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->attribute_id)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "attribute_id is required"]);
    exit();
}

$attributeId = intval($data->attribute_id);

try {
    // Verify attribute exists
    $checkStmt = $conn->prepare("SELECT AttributeID FROM CategoryAttribute WHERE AttributeID = :id");
    $checkStmt->execute([':id' => $attributeId]);
    if ($checkStmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Attribute not found"]);
        exit();
    }

    // Delete attribute (cascade will remove options too)
    $stmt = $conn->prepare("DELETE FROM CategoryAttribute WHERE AttributeID = :id");
    $stmt->execute([':id' => $attributeId]);

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Attribute deleted successfully"
    ]);

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Database error: " . $e->getMessage()
    ]);
}
?>
