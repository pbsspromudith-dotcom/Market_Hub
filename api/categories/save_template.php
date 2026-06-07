<?php
// api/categories/save_template.php
require_once dirname(__DIR__) . '/config.php';

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->category_id)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "category_id is required"]);
    exit();
}

$categoryId = intval($data->category_id);
// template_config can be null (to reset/clear) or a JSON string
$templateConfig = isset($data->template_config) ? json_encode($data->template_config) : null;

try {
    // Verify category exists
    $checkStmt = $conn->prepare("SELECT CategoryID FROM Category WHERE CategoryID = :id");
    $checkStmt->execute([':id' => $categoryId]);
    if ($checkStmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Category not found"]);
        exit();
    }

    $stmt = $conn->prepare("UPDATE Category SET template_config = :config WHERE CategoryID = :id");
    $stmt->execute([
        ':config' => $templateConfig,
        ':id' => $categoryId
    ]);

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Template configuration saved successfully"
    ]);

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Database error: " . $e->getMessage()
    ]);
}
?>
